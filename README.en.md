# J Foreign Language Online Academy

[한국어](README.md) | [English](README.en.md)

**A full-stack portfolio project that connects student registration, course applications, administrator approval, and Excel reporting.**

Built independently with Next.js, FastAPI, and PostgreSQL, this project was designed to go beyond a landing page. Students and administrators use the same data through separate roles and workflows.

> This is a personal learning and portfolio project currently being tested with a small group of users. The counseling UI is implemented; its current response is a subject- and level-specific availability message.

## 📺 Project Demo Video

[![J-Academy Walkthrough](https://img.youtube.com/vi/_D9eecQplGM/maxresdefault.jpg)](https://www.youtube.com/watch?v=_D9eecQplGM)

> 👆 **Click the image above to watch the 3-minute core feature walkthrough on YouTube.**



## What it does

Students can browse teachers for English, Spanish, Japanese, and Chinese, apply for a subject and class, and access counseling after approval. Administrators can search students, review and update enrollment status, and export student and inquiry lists to Excel.

## Main features

- Required-field validation and duplicate username/phone checks
- JWT authentication with separate student and administrator roles
- Account lookup and password reset based on registered information
- Subject and class applications with pending and approved statuses
- Student search, 20-item pagination, page row numbering, and batch approval
- Excel exports with sequential numbering and email notifications
- Approved-subject counseling UI with personalized greetings and subject selection
- Responsive mobile UI with touch-controlled menus and horizontally scrollable tables

## Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion
- Backend: Python, FastAPI, Pydantic, Uvicorn
- Database: PostgreSQL and SQLAlchemy
- Authentication: JWT and password hashing
- Reports and notifications: pandas, openpyxl, SMTP, FastAPI BackgroundTasks

## Data flow

```text
User input → React state → fetch request → FastAPI validation
→ PostgreSQL query/update → JSON response → updated UI
```

Protected endpoints receive Bearer tokens, and the server checks roles independently of the buttons displayed in the frontend.

## The bottlenecks I worked through

At the beginning, when a feature failed, I did not know whether to inspect the UI, the request, the server, or the database. This project taught me to start with one question: **where exactly is the data flow blocked?** I then narrowed the problem down with evidence before changing code.

### Multiple approved subjects

A single-result query displayed only one enrolled subject in the chatbot. I changed the query to return every approved application and updated the frontend to render selectable subject and class tags.

### Pagination that did not change records

Navigation buttons alone did not change what the server returned. I connected frontend page requests with backend `LIMIT 20`, `OFFSET`, and total-count queries. This made page buttons, returned data, and row numbering work as one flow.

### User-facing authorization feedback

I did not leave 401, 403, and 422 responses as technical failures. The chatbot and forms now explain whether login, approval, or input correction is required.

### `Failed to fetch` during external testing

I initially suspected tokens and CORS. Comparing actual requests and responses showed that a tunnel warning page was returning HTML instead of the API JSON for some requests. I added the required request header and aligned the backend CORS headers. This taught me not to diagnose a browser CORS error from its label alone.

### Mobile interaction

Hover-only menus were changed to state-driven click/tap controls. Wide administrative tables retain readable information through horizontal scrolling rather than shrinking every column.

## How I learned through this project

I started with a basic form and a single database insert. `value`, `onChange`, JSON, API requests, and database queries were all new at first. I learned by following the complete path from a user input to a saved record and then back to a screen.

AI assisted me with code drafts and explanations, but I tested changes by checking requests, responses, logs, and database records. When a screen broke or a request failed, I kept tracing the cause until I could explain why the change fixed it.

I am still a junior developer with much to learn. My strength is not claiming to know every answer; it is staying with a problem, reproducing it, checking evidence, and connecting the fix across the interface, API, and database. I wanted this service to feel considered at the moment a user clicks, gets blocked, and needs a clear next step.

## Project structure

```text
backend/   API, authentication, enrollment, administration, notifications
db/        PostgreSQL schema
frontend/  Next.js app, account, admin, learning, components, public assets
README.md
README.en.md
```

## Next steps

- Incorporate feedback from real-device and family testing
- Move from temporary tunnel testing to persistent deployment
- Add expiring, single-use verification tokens to password recovery
- Strengthen server-side matching of lessons against approved subjects/classes
- Add automated coverage for authentication, duplicate registration, and pagination

---

Personal learning and portfolio project · Planned and developed by Jeong Jiyun
