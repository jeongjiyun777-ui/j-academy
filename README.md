# J Online Academy | 외국어 학원 업무 관리

[한국어](README.md) · [English](README.en.md) · [日本語](README.ja.md)

[서비스 보기](https://j-academy-two.vercel.app/) · [시연 영상](https://www.youtube.com/watch?v=_D9eecQplGM)

학생의 가입과 수강신청을 받아 관리자의 승인, 명단 정리, 이메일 알림까지 연결한 웹 서비스입니다. 정지윤이 기획부터 화면·서버·DB 개발과 배포까지 진행한 개인 포트폴리오입니다.

## 시스템이 대신 하는 일

학생이 과목과 반을 신청하면 신청서가 DB에 저장되고 관리자 화면에 나타납니다. 관리자에게 이메일 알림도 보냅니다. 관리자가 승인하면 학생의 수강 정보에 반영됩니다. 직원이 신청서를 다시 옮겨 적거나 명단을 따로 만들 필요를 줄이는 구조입니다. 승인 판단은 관리자가 합니다.

`학생 신청 → DB 저장 → 관리자 알림·목록 → 승인 → 학생 화면 반영`

## 주요 기능

- 회원가입, 아이디 중복 확인, 아이디 찾기와 비밀번호 변경
- 비밀번호 해시, 학생·관리자 권한 검사, JWT 로그인과 리프레시 토큰
- 과목·반 신청, 중복 신청 제한, 신청 상태 조회와 관리자 일괄 승인
- 학생 검색, 학생·신청 목록 페이지네이션, 학생·문의 목록 Excel 다운로드
- 회원가입·수강신청·문의 접수 시 관리자 이메일 알림
- 모바일 메뉴·표 스크롤, 학원·교사 소개, 승인된 수강 정보에 따른 상담 안내

## 문제를 해결한 방법

| 문제 | 수정한 내용 |
| --- | --- |
| 신청한 여러 과목 중 하나만 표시 | 여러 행을 조회하고 화면도 목록으로 표시하도록 연결 |
| 페이지 버튼을 눌러도 같은 목록 | 서버의 전체 건수·LIMIT·OFFSET과 화면의 페이지 요청을 연결 |
| 로그인 시간이 지나면 사용이 끊김 | DB에 해시로 저장한 리프레시 토큰과 HttpOnly 쿠키로 갱신·로그아웃 구현 |
| 배포 후 메일 발송 실패 | SMTP 방식에서 Brevo HTTPS API로 전환하고 발신자·관리자 수신 주소 분리 |
| 어두운 기기 설정에서 입력·선택 글자가 안 보임 | 흰 화면에 맞춰 색상 모드를 고정하고 입력 가독성 보완 |
| 로컬에서는 작동하지만 외부 요청 실패 | API 주소·CORS·실제 응답을 확인하고 Vercel과 Render 연결 설정 정리 |
| 개인정보가 디버그 로그에 남음 | 프론트 디버그 로그 제거, 민감한 응답의 캐시 제한 |

## 구성과 실행

Next.js 16 · React 19 · TypeScript · Tailwind CSS / Python · FastAPI · Pydantic / PostgreSQL · SQLAlchemy / JWT · pwdlib / pandas · openpyxl · BackgroundTasks · Brevo

- **Vercel**: 사용자가 보는 화면. `NEXT_PUBLIC_API_BASE_URL`로 Render API 연결.
- **Render**: 인증·수강신청·관리 업무 처리. Brevo API로 이메일 요청.
- **Neon**: 회원·신청·문의·토큰 데이터 저장.

`frontend/`: 화면 · `backend/main.py`: API·권한·DB 처리 · `backend/발송시스템.py`: 이메일 · `db/`: 스키마

로컬 실행은 `db/schema.sql`, `db/refresh_tokens.sql` 적용 후 `backend/config/.env`에 DB·인증 설정을 넣습니다. 배포용 메일 코드는 `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `ADMIN_NOTIFICATION_EMAIL`을 사용합니다. 실제 비밀값은 Render에 설정하고 저장소에 올리지 않습니다.

```bash
# backend 폴더
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
# frontend 폴더 (.env.local: NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000)
npm install
npm run dev
```

## 범위와 남은 개선

학습·포트폴리오 서비스입니다. 실제 개인정보 대신 테스트 데이터를 사용해 주세요. 상담 화면은 외부 AI를 호출하지 않고 준비된 안내를 제공합니다. 가입 정보 대조는 휴대폰 본인인증이 아니며, 비밀번호 재설정에는 일회성 인증 수단이 추가로 필요합니다. Render 무료 서비스는 첫 접속이 늦을 수 있고, 이메일 접수 응답은 받은 편지함 도착을 보장하지 않습니다. 실제 운영 전에는 계정 복구·요청 제한·실기기 검증을 보강해야 합니다.
