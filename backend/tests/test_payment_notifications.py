from unittest.mock import MagicMock, Mock

import pytest


ENDPOINT = "/internal/payments/completed"
HEADERS = {"X-Payment-Event-Secret": "test-event-secret"}


@pytest.fixture
def payment_notification(api, monkeypatch):
    import payment_email

    engine = MagicMock()
    result = engine.connect.return_value.__enter__.return_value.execute.return_value
    lookup = result.mappings.return_value.one_or_none
    mail = Mock(return_value=True)
    monkeypatch.setattr(api, "engine", engine)
    monkeypatch.setattr(payment_email, "send_brevo_email", mail)
    monkeypatch.setenv("PAYMENT_NOTIFICATION_SECRET", HEADERS["X-Payment-Event-Secret"])
    return engine, lookup, mail


def test_completed_payment_schedules_html_email(client, payment_notification):
    _, lookup, mail = payment_notification
    lookup.return_value = {"id": 12, "amount_krw": 150000}

    response = client.post(ENDPOINT, json={"order_id": 12}, headers=HEADERS)

    assert response.status_code == 202
    assert response.json() == {"queued": True}
    mail.assert_called_once()
    subject, html = mail.call_args.args
    assert "주문 12" in subject
    assert "150,000원" in html


def test_unconfirmed_order_never_sends_email(client, payment_notification):
    _, lookup, mail = payment_notification
    lookup.return_value = None

    assert client.post(ENDPOINT, json={"order_id": 12}, headers=HEADERS).status_code == 404
    mail.assert_not_called()


@pytest.mark.parametrize(("headers", "order_id", "status"), [({}, 12, 403), (HEADERS, 0, 422)])
def test_invalid_event_never_queries_database(client, payment_notification, headers, order_id, status):
    engine, _, mail = payment_notification

    assert client.post(ENDPOINT, json={"order_id": order_id}, headers=headers).status_code == status
    engine.connect.assert_not_called()
    mail.assert_not_called()
