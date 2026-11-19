package com.jacademy.payment;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class PaymentController {
    private final RestClient authApi;
    private final JdbcTemplate jdbcTemplate;
    private final RestClient tossApi;
    private final String tossSecret;
    private final ApplicationEventPublisher events;

    public PaymentController(@Value("${academy.auth.base-url}") String authBaseUrl,
            JdbcTemplate jdbcTemplate, ApplicationEventPublisher events,
            @Value("${TOSS_SECRET_KEY:}") String tossSecret) {
        this.tossSecret = tossSecret.trim();
        this.events = events;
        this.jdbcTemplate = jdbcTemplate;
        var httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();
        var requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(5));
        authApi = RestClient.builder()
                .baseUrl(authBaseUrl)
                .requestFactory(requestFactory)
                .build();
        var tossFactory = new JdkClientHttpRequestFactory(httpClient);
        tossFactory.setReadTimeout(Duration.ofSeconds(8));
        tossApi = RestClient.builder()
                .baseUrl("https://api.tosspayments.com")
                .requestFactory(tossFactory)
                .build();
    }

    @GetMapping("/checkout/session")
    public ResponseEntity<SessionUser> checkSession(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @CookieValue(value = "access_token", required = false) String token) {
        if (authorization == null && token != null) {
            authorization = "Bearer " + token;
        }
        if (authorization == null || !authorization.matches("(?i)Bearer [^\\s]+")) {
            return unauthorized();
        }

        AuthResponse session;
        try {
            session = authApi.get()
                    .uri("/me")
                    .header(HttpHeaders.AUTHORIZATION, authorization)
                    .retrieve()
                    .body(AuthResponse.class);
        } catch (RestClientResponseException error) {
            int status = error.getStatusCode().value();
            if (status == 401 || status == 403) {
                return unauthorized();
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Session verification failed");
        } catch (RestClientException error) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Authentication service unavailable");
        }

        if (session == null || session.user() == null || session.user().id() <= 0
                || session.user().role() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Invalid authentication response");
        }
        if (!"student".equals(session.user().role())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).cacheControl(CacheControl.noStore()).build();
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(session.user());
    }

    private ResponseEntity<SessionUser> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .header(HttpHeaders.WWW_AUTHENTICATE, "Bearer")
                .cacheControl(CacheControl.noStore())
                .build();
    }

    public record AuthResponse(SessionUser user) {}

    public record SessionUser(long id, String role) {}

    @GetMapping("/checkout/courses")
    public List<Course> getCourses() {
        return jdbcTemplate.query("""
                SELECT id, subject, level, price_krw
                FROM public.courses
                ORDER BY id
                """,
                (row, index) -> new Course(
                        row.getLong("id"),
                        row.getString("subject"),
                        row.getString("level"),
                        row.getInt("price_krw")
                ));
    }

    @PostMapping("/checkout/orders")
    @Transactional
    public ResponseEntity<PendingOrder> createOrder(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @CookieValue(value = "access_token", required = false) String token,
            @RequestHeader(value = HttpHeaders.ORIGIN, required = false) String origin,
            @RequestBody OrderRequest request) {
        if (authorization == null && token != null && origin != null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Use the same-origin API gateway");
        }
        var session = checkSession(authorization, token);
        var student = session.getBody();
        if (student == null) {
            return ResponseEntity.status(session.getStatusCode()).headers(session.getHeaders()).build();
        }
        if (request.courseId() == null || request.courseId() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A positive courseId is required");
        }

        lockStudent(student.id());
        rejectAlreadyPurchased(student.id(), request.courseId());

        var orders = jdbcTemplate.query("""
                INSERT INTO public.orders (student_id, course_id, amount_krw)
                SELECT student.id, course.id, course.price_krw
                FROM public.students AS student
                CROSS JOIN public.courses AS course
                WHERE student.id = ? AND course.id = ?
                FOR KEY SHARE OF student, course
                RETURNING id, course_id, amount_krw, status, toss_order_id
                """,
                (row, index) -> new PendingOrder(
                        row.getLong("id"),
                        row.getLong("course_id"),
                        row.getInt("amount_krw"),
                        row.getString("status"),
                        row.getString("toss_order_id")
                ),
                student.id(), request.courseId());

        if (orders.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student or course not found");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .cacheControl(CacheControl.noStore())
                .body(orders.getFirst());
    }

    @PostMapping("/checkout/confirm")
    @Transactional
    public ResponseEntity<ConfirmedOrder> confirmPayment(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @CookieValue(value = "access_token", required = false) String token,
            @RequestHeader(value = HttpHeaders.ORIGIN, required = false) String origin,
            @RequestBody ConfirmRequest request) {
        if (authorization == null && token != null && origin != null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Use the same-origin API gateway");
        }
        var session = checkSession(authorization, token);
        var student = session.getBody();
        if (student == null) {
            return ResponseEntity.status(session.getStatusCode()).headers(session.getHeaders()).build();
        }
        if (request.orderId() == null || !request.orderId().matches("academy-[a-f0-9]{32}")
                || request.paymentKey() == null || request.paymentKey().isBlank()
                || request.paymentKey().length() > 200 || request.amount() == null || request.amount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid payment details");
        }

        lockStudent(student.id());
        var order = jdbcTemplate.query("""
                SELECT o.id, o.course_id, o.amount_krw, o.status, o.toss_payment_key, c.subject, c.level
                FROM public.orders AS o
                JOIN public.courses AS c ON c.id = o.course_id
                WHERE o.toss_order_id = ? AND o.student_id = ? FOR UPDATE OF o
                """, (row, index) -> new ApprovalOrder(row.getLong("id"), row.getLong("course_id"), row.getInt("amount_krw"),
                        row.getString("status"), row.getString("toss_payment_key"),
                        row.getString("subject"), row.getString("level")),
                request.orderId(), student.id()).stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        if (order.amount() != request.amount()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Order amount does not match");
        }

        if ("결제완료".equals(order.status())) {
            if (!request.paymentKey().equals(order.paymentKey())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Order already paid");
            }
        } else {
            if (!"결제대기".equals(order.status())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Order is not pending");
            }
            rejectAlreadyPurchased(student.id(), order.courseId());
            if (!tossSecret.startsWith("test_sk_")) {
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Toss test key is required");
            }
            String className = switch (order.level()) {
                case "basic" -> "A반";
                case "intermediate" -> "B반";
                case "advanced" -> "C반";
                default -> throw new ResponseStatusException(HttpStatus.CONFLICT, "Unknown course level");
            };
            var payment = approveWithToss(request);
            if (payment == null || !"DONE".equals(payment.status()) || !"KRW".equals(payment.currency())
                    || !request.orderId().equals(payment.orderId())
                    || !request.paymentKey().equals(payment.paymentKey())
                    || !request.amount().equals(payment.totalAmount())) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Unexpected Toss payment response");
            }
            jdbcTemplate.update("""
                    UPDATE public.orders SET status = '결제완료', toss_payment_key = ?, paid_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    """, payment.paymentKey(), order.id());
            jdbcTemplate.update("""
                    INSERT INTO public.applications (student_id, subject, class_name, status)
                    VALUES (?, ?, ?, '승인완료')
                    ON CONFLICT (student_id, subject, class_name) DO UPDATE
                    SET class_name = EXCLUDED.class_name, status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP
                    """, student.id(), order.subject(), className);
            events.publishEvent(new PaymentNotification.Completed(order.id()));
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
                .body(new ConfirmedOrder(order.id(), order.amount(), "결제완료"));
    }

    private void lockStudent(long studentId) {
        var ids = jdbcTemplate.queryForList(
                "SELECT id FROM public.students WHERE id = ? FOR NO KEY UPDATE", Long.class, studentId);
        if (ids.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
        }
    }

    private void rejectAlreadyPurchased(long studentId, long courseId) {
        Boolean alreadyPurchased = jdbcTemplate.queryForObject("""
                SELECT EXISTS (
                    SELECT 1 FROM public.orders
                    WHERE student_id = ? AND course_id = ? AND status = '결제완료'
                ) OR EXISTS (
                    SELECT 1 FROM public.applications AS a
                    JOIN public.courses AS c ON c.subject = a.subject
                    WHERE a.student_id = ? AND c.id = ? AND a.status = '승인완료'
                      AND a.class_name = CASE c.level
                          WHEN 'basic' THEN 'A반'
                          WHEN 'intermediate' THEN 'B반'
                          WHEN 'advanced' THEN 'C반'
                      END
                )
                """, Boolean.class, studentId, courseId, studentId, courseId);
        if (Boolean.TRUE.equals(alreadyPurchased)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Course already purchased");
        }
    }

    private TossPayment approveWithToss(ConfirmRequest request) {
        try {
            return tossApi.post().uri("/v1/payments/confirm")
                    .headers(headers -> headers.setBasicAuth(tossSecret, ""))
                    .header("Idempotency-Key", request.orderId())
                    .body(request).retrieve().body(TossPayment.class);
        } catch (RestClientException approvalError) {
            // Recover an approval that succeeded before a timeout or database rollback.
            try {
                return tossApi.get().uri("/v1/payments/orders/{orderId}", request.orderId())
                        .headers(headers -> headers.setBasicAuth(tossSecret, ""))
                        .retrieve().body(TossPayment.class);
            } catch (RestClientException lookupError) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Toss approval could not be verified");
            }
        }
    }

    public record ConfirmRequest(String paymentKey, String orderId, Integer amount) {}
    public record ConfirmedOrder(long orderId, int amountKrw, String status) {}
    private record ApprovalOrder(long id, long courseId, int amount, String status, String paymentKey, String subject, String level) {}
    public record TossPayment(String paymentKey, String orderId, String status, String currency, Integer totalAmount) {}

    public record OrderRequest(Long courseId) {}

    public record PendingOrder(long orderId, long courseId, int amountKrw, String status, String tossOrderId) {}

    public record Course(long id, String subject, String level, int priceKrw) {}
}
