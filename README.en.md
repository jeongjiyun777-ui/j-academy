# J Online Academy | Language School Workflow

[한국어](README.md) · [English](README.en.md) · [日本語](README.ja.md)

[Live site](https://j-academy-two.vercel.app/) · [Demo video](https://www.youtube.com/watch?v=_D9eecQplGM)

A web application connecting student registration and course applications with administrator approval, lists, and email notifications. A personal portfolio planned, developed, and deployed by Jiyun Jeong across the frontend, backend, and database.

## Try the live service

No local setup is required. Open the [deployed service](https://j-academy-two.vercel.app/) and use these accounts on the [login page](https://j-academy-two.vercel.app/login).

| Role | Username | Password |
| --- | --- | --- |
| Administrator | `admin1234@naver.com` | `ab#12345678` |
| Student 1 | `rlfehd1234@naver.com` | `ab#12345678` |
| Student 2 | `rlfehd123@naver.com` | `ab#12345678` |

These are shared demo accounts. Do not enter real personal information. Other visitors may change the demo data, and the free backend may take time to wake up.

## What the system handles

A student selects a subject and class. The application is stored in the database, appears in the administrator's list, and triggers an email notification. Administrator approval updates the student's course information. This reduces copying applications and maintaining separate lists; approval decisions remain with the administrator.

`Application → database → administrator notification/list → approval → student view`

## Features

- Registration, duplicate username checks, masked username recovery, and password changes
- Password hashing, student/administrator permissions, JWT login and refresh tokens
- Course applications, duplicate prevention, status tracking, and bulk approval
- Student search, paginated lists, and student/inquiry Excel exports
- Administrator email notifications for registrations, applications, and inquiries
- Mobile navigation and table scrolling, school/teacher pages, and course-based guidance

## Problems and fixes

| Problem | Change |
| --- | --- |
| Only one of several courses appeared | Returned multiple database rows and rendered a course list |
| Page controls showed the same records | Connected total counts, LIMIT/OFFSET, and frontend page requests |
| Sessions stopped after token expiry | Added refresh-token hashes in the database, HttpOnly cookies, rotation, and logout |
| Email failed after deployment | Replaced SMTP with the Brevo HTTPS API and separated sender from administrator recipient |
| Form text disappeared with device dark mode | Fixed the site's light color scheme to match its white form backgrounds |
| Local requests worked but external requests failed | Checked actual responses, API URLs, and CORS; configured Vercel–Render communication |
| Debug logs contained personal data | Removed frontend debug logs and restricted caching of sensitive responses |

## How I worked through problems

I followed course applications beyond the form: from the student's input to database storage, administrator approval, and the updated student view. When something failed, I checked input state, request URLs and JSON, response codes, then SQL and database results. Fixing the single-course display required changes to both query results and frontend data structures. For pagination, I checked whether the returned records changed, rather than stopping at working-looking buttons. After local implementation, I revisited deployment URLs, authentication cookies, email delivery, and mobile inputs.

## Technology and deployment

Next.js 16 · React 19 · TypeScript · Tailwind CSS / Python · FastAPI · Pydantic / PostgreSQL · SQLAlchemy / JWT · pwdlib / pandas · openpyxl · BackgroundTasks · Brevo

- **Vercel** serves the frontend; `NEXT_PUBLIC_API_BASE_URL` points to Render.
- **Render** handles authentication and school workflows, then requests email delivery through Brevo.
- **Neon** stores accounts, applications, inquiries, and tokens.

`frontend/`: UI · `backend/main.py`: API/permissions/database · `backend/발송시스템.py`: email · `db/`: SQL schemas

## Post-deployment validation — in progress

Public-service validation and preparation for Locust load testing started on October 15, 2026. Load-test measurements have not yet been published.

- Start with 10 simulated users, then increase load for individual scenarios such as course browsing, login, and application lists.
- Compare Locust response times, failure rates, and throughput with server-side CPU and RAM usage.
- Use test data and a separate test environment; exclude real notification emails.
- Trace slow requests through logs and SQL, then document measured before/after results when available.

## Scope and next improvements

This is a learning/portfolio service: use test data instead of real personal information. The guidance screen returns prepared responses rather than calling an external AI model. Matching registration details is not phone identity verification; password recovery needs an additional one-time verification mechanism. The free backend may take time to wake up, and accepting an email request does not guarantee inbox delivery. Production use requires stronger account recovery, request limits, and device testing.
