from 발송시스템 import send_brevo_email


def send_payment_completed_email(order_id: int, amount_krw: int) -> bool:
    subject = f"[제이아카데미] 수강료 결제 완료 · 주문 {order_id}"
    html_body = f"""
    <div lang="ko" style="max-width:480px;margin:auto;padding:24px;color:#0f172a;font-family:sans-serif">
      <p style="color:#2563eb;font-weight:bold">제이아카데미</p>
      <h1 style="font-size:24px">수강료 결제가 완료되었습니다</h1>
      <p>결제가 승인되어 해당 강좌를 이용할 수 있습니다.</p>
      <div style="background:#f1f5f9;border-radius:12px;padding:16px">
        <p style="margin:0 0 8px">주문번호 <strong>{order_id}</strong></p>
        <p style="margin:0">결제 금액 <strong>{amount_krw:,}원</strong></p>
      </div>
    </div>
    """
    return send_brevo_email(subject, html_body)
