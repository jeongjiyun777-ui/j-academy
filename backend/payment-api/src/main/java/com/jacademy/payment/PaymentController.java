package com.jacademy.payment;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.jdbc.core.JdbcTemplate;
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

    public PaymentController(@Value("${academy.auth.base-url}") String authBaseUrl,
            JdbcTemplate jdbcTemplate) {
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

        var orders = jdbcTemplate.query("""
                INSERT INTO public.orders (student_id, course_id, amount_krw)
                SELECT student.id, course.id, course.price_krw
                FROM public.students AS student
                CROSS JOIN public.courses AS course
                WHERE student.id = ? AND course.id = ?
                FOR KEY SHARE OF student, course
                RETURNING id, course_id, amount_krw, status
                """,
                (row, index) -> new PendingOrder(
                        row.getLong("id"),
                        row.getLong("course_id"),
                        row.getInt("amount_krw"),
                        row.getString("status")
                ),
                student.id(), request.courseId());

        if (orders.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student or course not found");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .cacheControl(CacheControl.noStore())
                .body(orders.getFirst());
    }

    public record OrderRequest(Long courseId) {}

    public record PendingOrder(long orderId, long courseId, int amountKrw, String status) {}

    public record Course(long id, String subject, String level, int priceKrw) {}
}
