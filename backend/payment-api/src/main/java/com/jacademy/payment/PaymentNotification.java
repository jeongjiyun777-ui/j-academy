package com.jacademy.payment;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class PaymentNotification {
    private static final Logger log = LoggerFactory.getLogger(PaymentNotification.class);
    private final RestClient api;
    private final String secret;

    public PaymentNotification(@Value("${academy.auth.base-url}") String fastApiUrl,
            @Value("${PAYMENT_NOTIFICATION_SECRET:}") String secret) {
        this.secret = secret.trim();
        var factory = new JdkClientHttpRequestFactory(
                HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build());
        factory.setReadTimeout(Duration.ofSeconds(10));
        api = RestClient.builder().baseUrl(fastApiUrl).requestFactory(factory).build();
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void notifyFastApi(Completed event) {
        if (secret.isEmpty()) {
            log.warn("Payment notification is not configured for order {}", event.orderId());
            return;
        }
        try {
            api.post().uri("/internal/payments/completed")
                    .header("X-Payment-Event-Secret", secret)
                    .body(Map.of("order_id", event.orderId()))
                    .retrieve().toBodilessEntity();
        } catch (RestClientException error) {
            log.warn("Payment notification failed for order {} ({})",
                    event.orderId(), error.getClass().getSimpleName());
        }
    }

    public record Completed(long orderId) {}
}
