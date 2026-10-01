# J Foreign Language Online Academy

[한국어](README.md) · [English](README.en.md) · [日本語](README.ja.md)

> **외국어 학원의 회원·수강신청·승인·문의·Excel 업무를 하나의 서비스로 연결한 풀스택 포트폴리오입니다.**

학생은 회원가입 후 과목과 반을 신청하고, 관리자는 신청 상태와 학생·문의 목록을 관리하며 Excel로 내보낼 수 있습니다. 소개 페이지가 아니라 역할별 권한과 실제 데이터 흐름을 가진 운영 화면을 목표로 했습니다.

## 해결하는 업무

| 운영 문제 | 구현 |
| --- | --- |
| 신청 내역이 흩어짐 | 학생 신청을 관리자 승인 화면으로 연결 |
| 명단을 수기로 관리 | 검색, 20개 단위 페이지네이션, Excel 출력 |
| 신청 상태가 불명확 | 승인대기·승인완료 상태와 안내 화면 |
| 무단 접근 | JWT와 서버 측 학생·관리자 역할 검사 |
| 운영 알림 누락 | 백그라운드 이메일 알림 |

## 핵심 기능

- **계정**: 입력 검증, ID·전화번호 중복 제한, JWT 로그인, ID 찾기, 비밀번호 변경
- **수강신청**: 영어·스페인어·일본어·중국어 과목과 반 신청, 승인 상태 조회
- **관리자**: 학생 검색, 20개 단위 목록, 신청 상태 일괄 변경, 학생·문의 Excel 다운로드
- **상담 UI**: 승인된 과목·반 선택을 상담 흐름에 반영
- **모바일 UX**: 터치 메뉴, 넓은 관리 표의 가로 스크롤, 상태별 오류 안내

## 구조

```text
Next.js / React UI
  └─ fetch + Bearer JWT → FastAPI
       ├─ Pydantic 검증 / 역할 인가
       ├─ SQLAlchemy Core → PostgreSQL
       ├─ BackgroundTasks → SMTP 알림
       └─ pandas + openpyxl → Excel 출력
```

## 엔지니어링 포인트

| 주제 | 구현 |
| --- | --- |
| 인증·권한 | 보호 API에서 Bearer 토큰과 역할을 서버가 직접 검사 |
| 데이터 무결성 | SQL `UNIQUE`·`CHECK`·외래 키와 API 409 처리 |
| 목록 처리 | `LIMIT 20`·`OFFSET`·전체 건수와 프론트 페이지 이동 연결 |
| 실패 대응 | 401·403·422·409을 사용자가 이해할 수 있는 안내로 변환 |
| 운영 편의 | 화면 행 번호와 Excel 연속 번호를 목적에 따라 분리 |
| 외부 접속 | 모바일·다른 네트워크에서 CORS, 포트, 응답 형식 점검 |

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | Next.js 16.3, React 19.2, TypeScript 5, Tailwind CSS 4, PostCSS, Framer Motion, Lucide React, ESLint 9 |
| Backend | Python, FastAPI, Uvicorn, Pydantic, SQLAlchemy Core, python-dotenv |
| Data | PostgreSQL, psycopg2-binary, SQL `UNIQUE`·`CHECK`·외래 키 |
| Security | PyJWT, HTTP Bearer, pwdlib, SessionMiddleware / itsdangerous, CORSMiddleware |
| Automation | pandas, openpyxl, FastAPI BackgroundTasks, SMTP SSL, Python email MIME |
| Environment | `.env.example`, `.gitignore`, Linux CLI `free -h` |

OpenAI Python SDK는 상담 AI 연동을 위해 구성했으며 현재는 외부 모델 호출 없이 고정 안내를 반환합니다. Make Webhooks와 ngrok은 데이터 흐름·외부 접속을 학습하고 점검하기 위해 사용했으며, 현재 실행 연동은 아닙니다.

## 검증 시나리오

1. 중복 ID·전화번호와 잘못된 입력의 회원가입 검증
2. 학생·관리자 역할에 따른 보호 API 접근
3. 수강신청 → 관리자 승인 → 학생 정보 반영
4. 검색·20개 단위 페이지 이동·Excel 생성
5. 모바일 메뉴·폼·관리 표 동작

## 로컬 실행

비밀값은 포함하지 않습니다.

```text
backend/config/.env.example  → backend/config/.env
frontend/.env.example        → frontend/.env.local
```

```bash
# backend
py -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# frontend
npm run dev
```

## 배포 환경변수

배포 플랫폼에서는 파일을 올리지 않고 아래 값을 환경변수 화면에 등록합니다. 실제 비밀번호, SMTP 앱 비밀번호, API 키는 저장소에 넣지 않습니다.

```env
# Frontend
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.example.com

# Backend
DB_HOST=
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=
FRONTEND_ORIGINS=https://your-frontend-domain.example.com
SESSION_SECRET=
ADMIN_NAME=정지윤
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
ADMIN_AGE=
SMTP_ENABLED=false
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASSWORD=
OPENAI_API_KEY=
```

메일 알림을 사용하려면 Gmail 2단계 인증 후 생성한 앱 비밀번호를 `SMTP_PASSWORD`에 넣고 `SMTP_ENABLED=true`로 변경합니다. 현재 서비스에는 웹훅 송수신 기능이 구현되어 있지 않으므로 `WEBHOOK_URL`은 넣지 않습니다.

## 다음 개선

- 비밀번호 재설정용 일회성·만료 토큰
- 생성형 AI 상담 연결 및 실패·비용 처리
- 배포 프론트 도메인만 허용하는 CORS 설정
- 인증·신청 주요 흐름 자동화 테스트

---

개인 학습 및 포트폴리오 프로젝트 · 기획·개발: 정지윤


