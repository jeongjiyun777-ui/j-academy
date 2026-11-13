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
import org.springframework.web.bind.annotation.GetMapping;
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
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
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

    public record Course(long id, String subject, String level, int priceKrw) {}
}
