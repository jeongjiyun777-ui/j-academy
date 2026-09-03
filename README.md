# 제이 외국어 온라인 학원

Next.js와 FastAPI로 개발한 온라인 외국어 학원 관리 서비스입니다.  
학생과 관리자의 로그인 권한을 구분하고, 수강신청을 완료한 학생에게 과목과 학습 수준에 맞는 AI 학습 상담을 제공합니다.

> 현재 개발 중인 포트폴리오 프로젝트이며, 화면에 표시되는 학원 정보와 연락처는 실제 정보가 아닌 예시입니다.

## 프로젝트 소개

단순한 학원 소개 화면을 넘어 회원 인증, 수강신청, 권한 검사, 데이터베이스 조회, AI 상담까지 하나의 흐름으로 연결하는 것을 목표로 제작했습니다.

AI 상담 기능은 모든 사용자에게 열어 두지 않고 서버에서 다음 조건을 다시 검사합니다.

1. 로그인한 사용자인지 확인
2. 학생 계정인지 확인
3. 수강 과목과 반이 등록되어 있는지 확인
4. DB에서 조회한 과목과 수준을 AI 상담 요청에 반영

## 주요 기능

- 학생 회원가입 및 로그인
- 학생·관리자 역할 구분
- 세션 쿠키 기반 로그인 상태 유지
- 로그아웃 및 현재 사용자 조회
- 이름과 휴대폰 번호를 이용한 아이디 찾기
- 외국어 및 수준별 수강신청
- 수강생 전용 AI 챗봇 접근 제어
- 학생의 수강 과목과 반에 맞춘 AI 답변
- 영어·스페인어·일본어·중국어별 담당 교사 소개 화면
- 챗봇 대화 UI와 서버 오류 안내

## 기술 스택

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Backend: Python, FastAPI, SQLAlchemy, Pydantic, pwdlib, Uvicorn
- Database & AI: PostgreSQL, OpenAI API

## 서비스 흐름

```text
사용자 입력
   ↓
Next.js 화면
   ↓ fetch + session cookie
FastAPI API
   ↓
PostgreSQL에서 사용자·수강 정보 조회
   ↓
권한이 있는 학생만 OpenAI API 호출
   ↓
과목·수준별 답변을 채팅창에 표시
```

## 프로젝트 구조

```text
fast api/
├─ backend/
│  ├─ config/
│  │  └─ .env
│  ├─ main.py
│  └─ 챗봇.py
├─ db/
├─ frontend/
│  ├─ app/
│  │  ├─ application/
│  │  ├─ chatbot/
│  │  ├─ login/
│  │  ├─ register/
│  │  └─ teacher_*/
│  ├─ public/
│  └─ package.json
└─ README.md
```

## API 엔드포인트

| Method | Endpoint | 설명 |
| --- | --- | --- |
| `POST` | `/register` | 학생 회원가입 |
| `POST` | `/setup/manager` | 관리자 계정 설정 |
| `POST` | `/login` | 학생·관리자 로그인 |
| `POST` | `/logout` | 현재 세션 종료 |
| `GET` | `/me` | 현재 로그인 사용자 조회 |
| `GET` | `/find-id` | 가입 정보로 아이디 조회 |
| `POST` | `/applications` | 학생 수강 정보 등록 |
| `GET` | `/chat/access` | AI 상담 이용 권한 확인 |
| `POST` | `/chat` | 과목·수준별 AI 상담 요청 |

## 로컬 실행 방법

### 1. 저장소 복제

```bash
git clone <REPOSITORY_URL>
cd <REPOSITORY_DIRECTORY>
```

### 2. 백엔드 환경변수 설정

`backend/config/.env` 파일을 만들고 아래 값을 설정합니다.

```env
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
DB_NAME=

SESSION_SECRET=
OPENAI_API_KEY=

ADMIN_NAME=
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
ADMIN_AGE=
```

실제 `.env` 파일과 비밀키는 GitHub에 올리지 않습니다.

### 3. 백엔드 패키지 설치 및 실행

```bash
cd backend
python -m pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv openai pwdlib
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. 프론트엔드 설치 및 실행

새 터미널에서 실행합니다.

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)에 접속합니다.

## 환경 설정 시 주의사항

- 프론트엔드와 FastAPI의 주소가 다르면 FastAPI의 CORS 허용 주소를 확인해야 합니다.
- 로그인 세션 전달을 위해 프론트엔드 요청에 `credentials: "include"`가 필요합니다.
- AI 상담에는 별도의 OpenAI API 키와 사용 가능한 API 크레딧이 필요합니다.
- PostgreSQL에 필요한 테이블을 먼저 생성해야 합니다.

## 보안 설계

- 비밀번호 원문을 저장하지 않고 안전한 해시만 저장합니다.
- API 키, DB 비밀번호, 세션 비밀키는 환경변수로 관리합니다.
- 챗봇 화면의 검사만 신뢰하지 않고 `/chat` 요청마다 서버에서 권한을 다시 검사합니다.
- 로그인하지 않은 사용자는 `401`, 권한이 부족한 사용자는 `403` 응답으로 구분합니다.
- 관리자 계정은 학생 전용 수강신청 및 AI 상담에 접근할 수 없도록 구분합니다.

## 트러블슈팅 경험

- DB의 반 이름(`A반`)과 백엔드 변환 값(`a`)이 달라 발생한 오류 수정
- 중복된 Next.js 개발 서버와 포트 충돌 해결
- CORS 및 세션 쿠키 전달 문제 점검
- OpenAI API 크레딧 소진에 따른 `429 credit_balance_exhausted` 오류 확인
- 이미지 파일의 실제 배경과 CSS 배경 문제 구분

## 개발 예정 기능

- 이메일 또는 휴대폰 인증 기반 비밀번호 재설정
- AI 상담 기록을 위한 별도 대화 테이블
- 이전 대화 내용을 반영한 연속 상담
- 관리자용 학생 및 상담 기록 조회
- 입력값 검증과 자동화 테스트 보강
- 실제 배포 환경에 맞춘 HTTPS 및 쿠키 보안 설정

## 프로젝트에서 배운 점

- 프론트엔드, API 서버, 데이터베이스의 역할 분리
- HTTP 요청과 응답 및 상태 코드의 의미
- 세션 기반 인증과 역할별 접근 제어
- DB 값을 활용한 개인화된 AI 프롬프트 구성
- 외부 AI API의 비용과 사용 권한을 고려한 서비스 설계
- 오류 로그를 읽고 데이터 흐름을 따라가며 원인을 찾는 방법

## 라이선스

학습 및 포트폴리오 목적으로 제작한 프로젝트입니다.
