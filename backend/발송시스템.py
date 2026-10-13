from pathlib import Path
import os
from dotenv import load_dotenv
from html import escape

import json
import requests

BACKEND_PATH = Path(__file__).resolve().parent
ENV_FILE = BACKEND_PATH / "config" / ".env"

load_dotenv(dotenv_path=ENV_FILE)



def send_brevo_email(subject: str, html_body: str) -> bool:
    api_key = os.getenv("BREVO_API_KEY", "").strip()
    sender_email = os.getenv("BREVO_SENDER_EMAIL", "").strip()
    sender_name = os.getenv("BREVO_SENDER_NAME", "제이온라인 학원").strip() or "제이온라인 학원"
    # Preserve the existing administrator recipient independently of the sender.
    recipient = os.getenv("ADMIN_NOTIFICATION_EMAIL", "").strip() or os.getenv("SMTP_USER", "").strip()
    if not all((api_key, sender_email, recipient)):
        print("[ERROR] 이메일 발송 설정 누락")
        return False
    try:
        response = requests.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={"api-key": api_key, "Accept": "application/json"},
            json={
                "sender": {"name": sender_name, "email": sender_email},
                "to": [{"email": recipient}],
                "subject": subject,
                "htmlContent": html_body,
            },
            timeout=(5, 15),
            allow_redirects=False,
        )
        if response.status_code != 201:
            print(f"[ERROR] Brevo 이메일 요청 실패: HTTP {response.status_code}")
            return False
        print("[INFO] Brevo 이메일 발송 요청 접수")
        return True
    except requests.RequestException as error:
        print(f"[ERROR] 이메일 연결 실패: {type(error).__name__}")
        return False


def send_notification_email(name: str, phone: str) -> bool:

    try:
        subject_line = f"신규회원: {name}님의 신규 가입 건"

        raw_phone = str(phone)  

        if len(raw_phone) == 11:
            formatted_phone = f"{raw_phone[:3]}-{raw_phone[3:7]}-{raw_phone[7:]}"
        else:
            formatted_phone = raw_phone

        html_body = f"""
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 30px 15px; background-color: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 460px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dbeafe; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.05);">
            
            <!-- 헤더 -->
            <tr>
              <td style="background-color: #1e40af; padding: 24px 28px;">
                <span style="color: #93c5fd; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">ACADEMY NOTIFICATION</span>
                <h2 style="margin: 8px 0 0 0; color: #ffffff; font-size: 19px; font-weight: 700; letter-spacing: -0.5px;">신규 상담 신청 안내</h2>
              </td>
            </tr>

            <!-- 본문 정보 -->
            <tr>
              <td style="padding: 28px 24px;">
                <p style="margin: 0 0 20px 0; font-size: 16px; color: #1e293b; line-height: 1.5;">
                  <strong style="color: #1e40af;">{name}</strong>님이 신규회원 가입했습니다.
                </p>

                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 0;">
                  <tr>
                    <td style="padding: 14px 16px; font-size: 14px; color: #64748b; font-weight: 600; width: 60px;">이름</td>
                    <td style="padding: 14px 16px 14px 0; font-size: 15px; color: #0f172a; font-weight: 700;">{name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 16px 14px 16px; font-size: 14px; color: #64748b; font-weight: 600;">연락처</td>
                    <td style="padding: 0 16px 14px 0; font-size: 15px; color: #2563eb; font-weight: 700;">{formatted_phone}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 푸터 -->
            <tr>
              <td style="padding: 14px 24px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
                j online academy
              </td>
            </tr>

          </table>
        </body>
        </html>
        """
        return send_brevo_email(subject_line, html_body)

    except Exception as e:
        print(f"[ERROR] 이메일 발송 실패: {type(e).__name__}")
        return False




def send_subject_notification_email(name: str, subject: str, class_name: str,) -> bool:

    try:
        subject_line = f"과목신청: {name}님의 {subject}신청 건"

        html_body = f"""
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 30px 15px; background-color: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 460px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dbeafe; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.05);">
            
            <!-- 헤더 -->
            <tr>
              <td style="background-color: #1e40af; padding: 24px 28px;">
                <span style="color: #93c5fd; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">ACADEMY NOTIFICATION</span>
                <h2 style="margin: 8px 0 0 0; color: #ffffff; font-size: 19px; font-weight: 700; letter-spacing: -0.5px;">신규 상담 신청 안내</h2>
              </td>
            </tr>

            <!-- 본문 정보 -->
            <tr>
              <td style="padding: 28px 24px;">
                <p style="margin: 0 0 20px 0; font-size: 16px; color: #1e293b; line-height: 1.5;">
                  <strong style="color: #1e40af;">{name}</strong>님이 {subject} 수강 신청 했습니다.
                </p>

                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 0;">
                  <tr>
                    <td style="padding: 14px 16px; font-size: 14px; color: #64748b; font-weight: 600; width: 60px;">이름</td>
                    <td style="padding: 14px 16px 14px 0; font-size: 15px; color: #0f172a; font-weight: 700;">{name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 16px 14px 16px; font-size: 14px; color: #64748b; font-weight: 600;">과목</td>
                    <td style="padding: 0 16px 14px 0; font-size: 15px; color: #2563eb; font-weight: 700;">{subject}</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 16px 14px 16px; font-size: 14px; color: #64748b; font-weight: 600;">클래스</td>
                    <td style="padding: 0 16px 14px 0; font-size: 15px; color: #2563eb; font-weight: 700;">{class_name}</td>
                  </tr>
                  
                </table>
              </td>
            </tr>

            <!-- 푸터 -->
            <tr>
              <td style="padding: 14px 24px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
                j online academy
              </td>
            </tr>

          </table>
        </body>
        </html>
        """
        return send_brevo_email(subject_line, html_body)

    except Exception as e:
        print(f"[ERROR] 이메일 발송 실패: {type(e).__name__}")
        return False




def send_inquiries_email(
    inquiry_type: str,
    name: str,
    phone: str,
    title: str,
    content: str,
) -> bool:

    inquiry_type_label = {
        "consulting": "수강 및 학습 상담",
        "payment": "결제 및 환불 문의",
        "system": "사이트 이용 및 오류",
        "etc": "기타 문의",
    }.get(inquiry_type, inquiry_type)

    safe_name = escape(name.strip())
    safe_phone = escape(phone.strip())
    safe_title = escape(title.strip())
    safe_inquiry_type = escape(inquiry_type_label)
    safe_content = escape(content.strip()).replace("\n", "<br>")

    try:
        subject_line = f"문의 접수: {safe_name}님의 {safe_title}"

        html_body = f"""
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 30px 15px; background-color: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 460px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dbeafe; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.05);">

            <tr>
              <td style="background-color: #1e40af; padding: 24px 28px;">
                <span style="color: #93c5fd; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">ACADEMY NOTIFICATION</span>
                <h2 style="margin: 8px 0 0 0; color: #ffffff; font-size: 19px; font-weight: 700; letter-spacing: -0.5px;">신규 문의 접수 안내</h2>
              </td>
            </tr>

            <tr>
              <td style="padding: 28px 24px;">
                <p style="margin: 0 0 20px 0; font-size: 16px; color: #1e293b; line-height: 1.5;">
                  <strong style="color: #1e40af;">{safe_name}</strong>님의 문의가 접수되었습니다.
                </p>

                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 0;">
                  <tr>
                    <td style="padding: 14px 16px; font-size: 14px; color: #64748b; font-weight: 600; width: 80px;">문의 유형</td>
                    <td style="padding: 14px 16px 14px 0; font-size: 15px; color: #0f172a; font-weight: 700;">{safe_inquiry_type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 16px 14px 16px; font-size: 14px; color: #64748b; font-weight: 600;">이름</td>
                    <td style="padding: 0 16px 14px 0; font-size: 15px; color: #0f172a; font-weight: 700;">{safe_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 16px 14px 16px; font-size: 14px; color: #64748b; font-weight: 600;">연락처</td>
                    <td style="padding: 0 16px 14px 0; font-size: 15px; color: #2563eb; font-weight: 700;">{safe_phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 16px 14px 16px; font-size: 14px; color: #64748b; font-weight: 600;">제목</td>
                    <td style="padding: 0 16px 14px 0; font-size: 15px; color: #2563eb; font-weight: 700;">{safe_title}</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 16px 14px 16px; font-size: 14px; color: #64748b; font-weight: 600; vertical-align: top;">문의 내용</td>
                    <td style="padding: 0 16px 14px 0; font-size: 15px; color: #0f172a; line-height: 1.6;">{safe_content}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 14px 24px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
                j online academy
              </td>
            </tr>

          </table>
        </body>
        </html>
        """

        return send_brevo_email(subject_line, html_body)

    except Exception as error:
        print(f"[ERROR] 문의 이메일 발송 실패: {type(error).__name__}")
        return False


