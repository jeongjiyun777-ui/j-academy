# J Foreign Language Online Academy

[한국어](README.md) · [English](README.en.md) · [日本語](README.ja.md)

> **A full-stack portfolio that connects academy membership, course applications, approvals, inquiries, and Excel reporting in one operational workflow.**

Students register and apply for a subject and class. Administrators manage approval status, student and inquiry lists, and Excel exports. The goal is an operational service with role-based access and real data flow, not a presentation-only website.

## Problems addressed

| Operational problem | Implementation |
| --- | --- |
| Applications spread across channels | Student applications flow into an administrator approval view |
| Manual list maintenance | Search, 20-item pagination, and Excel export |
| Unclear status | Pending and approved states with contextual guidance |
| Unauthorized access | JWT authentication and server-side role checks |
| Missed notifications | Background email notifications |

## Core capabilities

- **Accounts**: validation, duplicate username/phone checks, JWT login, account lookup, password change
- **Applications**: subject and class applications for English, Spanish, Japanese, and Chinese
- **Administration**: student search, 20-item lists, batch status updates, student and inquiry Excel exports
- **Consultation UI**: approved subject and class selection reflected in the consultation flow
- **Mobile UX**: touch menu, horizontally scrollable admin tables, actionable errors

## Architecture

```text
Next.js / React UI
  └─ fetch + Bearer JWT → FastAPI
       ├─ Pydantic validation / role authorization
       ├─ SQLAlchemy Core → PostgreSQL
       ├─ BackgroundTasks → SMTP notification
       └─ pandas + openpyxl → Excel export
```

## Engineering highlights

| Area | Implementation |
| --- | --- |
| Auth | Server-side Bearer token and role checks for protected APIs |
| Integrity | SQL `UNIQUE`, `CHECK`, foreign keys, and API-level 409 handling |
| Lists | `LIMIT 20`, `OFFSET`, total counts, and client pagination work together |
| Failures | 401, 403, 422, and 409 become actionable user messages |
| Operations | Screen row numbers and export sequence numbers are separated by purpose |
| External testing | CORS, ports, and response formats checked from mobile and external networks |

## Technology stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js 16.3, React 19.2, TypeScript 5, Tailwind CSS 4, PostCSS, Framer Motion, Lucide React, ESLint 9 |
| Backend | Python, FastAPI, Uvicorn, Pydantic, SQLAlchemy Core, python-dotenv |
| Data | PostgreSQL, psycopg2-binary, SQL `UNIQUE` / `CHECK` / foreign keys |
| Security | PyJWT, HTTP Bearer, pwdlib, SessionMiddleware / itsdangerous, CORSMiddleware |
| Automation | pandas, openpyxl, FastAPI BackgroundTasks, SMTP SSL, Python email MIME |
| Environment | `.env.example`, `.gitignore`, Linux CLI `free -h` |

The OpenAI Python SDK is prepared for consultation integration; current responses are fixed guidance and do not call an external model. Make Webhooks and ngrok were used for learning and temporary external testing, not as active runtime integrations.

## Verification scenarios

1. Registration validation for duplicate IDs, phone numbers, and invalid input
2. Protected API access for student and administrator roles
3. Application → administrator approval → student information update
4. Search, 20-item pagination, and Excel generation
5. Mobile menu, forms, and administrative table behavior

## Local setup

No secrets are included.

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

## Deployment environment variables

Set these values in the hosting platform instead of committing a file. Never commit real database passwords, SMTP app passwords, or API keys.

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

To enable email notifications, create a Gmail App Password, set `SMTP_PASSWORD`, and change `SMTP_ENABLED=true`. No incoming or outgoing webhook integration is currently implemented, so no `WEBHOOK_URL` is required.

## Next steps

- Single-use, expiring password reset tokens
- Generative AI consultation with failure and cost handling
- Production CORS restricted to the deployed frontend origin
- Automated tests for core authentication and application flows

---

Personal learning and portfolio project · Planned and developed by Jeong Ji-yoon


