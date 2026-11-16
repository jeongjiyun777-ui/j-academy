package com.jacademy.payment;

import java.sql.ResultSet;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

class PaymentControllerTest {
    private static final String ORDER = "academy-0123456789abcdef0123456789abcdef";
    private static final String KEY = "fixture-payment-key";
    private final JdbcTemplate db = mock(JdbcTemplate.class);
    private final ApplicationEventPublisher events = mock(ApplicationEventPublisher.class);
    private PaymentController controller;
    private MockRestServiceServer toss;

    @BeforeEach
    void setup() {
        when(db.queryForList(contains("FOR NO KEY UPDATE"), eq(Long.class), eq(7L))).thenReturn(List.of(7L));
        controller = new PaymentController("https://auth.test", db, events, "test_sk_fixture");
        var authClient = RestClient.builder().baseUrl("https://auth.test");
        var auth = MockRestServiceServer.bindTo(authClient).build();
        auth.expect(requestTo("https://auth.test/me"))
                .andExpect(header("Authorization", "Bearer fixture-token"))
                .andRespond(withSuccess("""
                        {"user":{"id":7,"role":"student"}}
                        """, MediaType.APPLICATION_JSON));
        ReflectionTestUtils.setField(controller, "authApi", authClient.build());

        var tossClient = RestClient.builder().baseUrl("https://toss.test");
        toss = MockRestServiceServer.bindTo(tossClient).build();
        ReflectionTestUtils.setField(controller, "tossApi", tossClient.build());
    }

    @Test
    void approvedPaymentUpdatesOrderAndEnrollmentAndPublishesEvent() throws Exception {
        stubOrder("결제대기", null);
        expectApproval("DONE");

        var result = confirm(150000);

        assertEquals(new PaymentController.ConfirmedOrder(12, 150000, "결제완료"), result);
        verify(db).update(contains("UPDATE public.orders"), eq(KEY), eq(12L));
        verify(db).update(contains("INSERT INTO public.applications"), eq(7L), eq("영어"), eq("B반"));
        verify(events).publishEvent(new PaymentNotification.Completed(12));
        toss.verify();
    }

    @Test
    void alteredAmountCannotTriggerPaymentOrNotification() throws Exception {
        stubOrder("결제대기", null);

        var error = assertThrows(ResponseStatusException.class, () -> confirm(100));

        assertEquals(HttpStatus.CONFLICT, error.getStatusCode());
        verify(db, never()).update(anyString(), any(Object[].class));
        verifyNoInteractions(events);
        toss.verify();
    }

    @Test
    void repeatConfirmationReturnsExistingResultWithoutNewWrites() throws Exception {
        stubOrder("결제완료", KEY);

        assertEquals("결제완료", confirm(150000).status());

        verify(db, never()).update(anyString(), any(Object[].class));
        verifyNoInteractions(events);
        toss.verify();
    }

    @Test
    void unconfirmedTossResponseCannotGrantEnrollment() throws Exception {
        stubOrder("결제대기", null);
        expectApproval("IN_PROGRESS");

        var error = assertThrows(ResponseStatusException.class, () -> confirm(150000));

        assertEquals(HttpStatus.BAD_GATEWAY, error.getStatusCode());
        verify(db, never()).update(anyString(), any(Object[].class));
        verifyNoInteractions(events);
        toss.verify();
    }

    @Test
    void purchasedCourseCannotCreateAnotherOrder() {
        when(db.queryForObject(contains("a.class_name"), eq(Boolean.class),
                eq(7L), eq(3L), eq(7L), eq(3L))).thenReturn(true);

        var error = assertThrows(ResponseStatusException.class, () ->
                controller.createOrder("Bearer fixture-token", null, null,
                        new PaymentController.OrderRequest(3L)));

        assertEquals(HttpStatus.CONFLICT, error.getStatusCode());
        verifyNoInteractions(events);
        toss.verify();
    }

    @Test
    void oldPendingOrderCannotBeApprovedAfterAnotherOrderWasPaid() throws Exception {
        stubOrder("결제대기", null);
        when(db.queryForObject(contains("a.class_name"), eq(Boolean.class),
                eq(7L), eq(3L), eq(7L), eq(3L))).thenReturn(true);

        assertEquals(HttpStatus.CONFLICT,
                assertThrows(ResponseStatusException.class, () -> confirm(150000)).getStatusCode());
        verify(db, never()).update(anyString(), any(Object[].class));
        verifyNoInteractions(events);
        toss.verify();
    }

    private PaymentController.ConfirmedOrder confirm(int amount) {
        return controller.confirmPayment("Bearer fixture-token", null, null,
                new PaymentController.ConfirmRequest(KEY, ORDER, amount)).getBody();
    }

    private void expectApproval(String status) {
        toss.expect(requestTo("https://toss.test/v1/payments/confirm"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Idempotency-Key", ORDER))
                .andExpect(content().json("""
                        {"paymentKey":"%s","orderId":"%s","amount":150000}
                        """.formatted(KEY, ORDER)))
                .andRespond(withSuccess("""
                        {"paymentKey":"%s","orderId":"%s","status":"%s","currency":"KRW","totalAmount":150000}
                        """.formatted(KEY, ORDER, status), MediaType.APPLICATION_JSON));
    }

    private void stubOrder(String status, String key) throws Exception {
        var row = mock(ResultSet.class);
        when(row.getLong("id")).thenReturn(12L);
        when(row.getLong("course_id")).thenReturn(3L);
        when(row.getInt("amount_krw")).thenReturn(150000);
        when(row.getString("status")).thenReturn(status);
        when(row.getString("toss_payment_key")).thenReturn(key);
        when(row.getString("subject")).thenReturn("영어");
        when(row.getString("level")).thenReturn("intermediate");
        when(db.query(contains("FOR UPDATE OF o"), org.mockito.ArgumentMatchers.<RowMapper<Object>>any(),
                eq(ORDER), eq(7L))).thenAnswer(call -> {
            RowMapper<Object> mapper = call.getArgument(1);
            return List.of(mapper.mapRow(row, 0));
        });
    }
}
