# Brand Experience OS - App Handoff Audit

Date: 2026-05-18

## Current State

Brand Experience OS is currently a local web application, not a native Android or iOS app.

Active runtime:

- Frontend: React + Vite in `frontend/`
- Backend: FastAPI in `backend/`
- Data/business system: `BRAND_EXPERIENCE/`
- Knowledge base: `BRAND_EXPERIENCE_OS/`
- Runtime logs: `runtime/logs/`

The application can be started locally with:

```powershell
.\START_BRAND_EXPERIENCE_OS.bat
```

Default URLs:

- Frontend: `http://127.0.0.1:5173`
- Backend health: `http://127.0.0.1:8000/health`

## Verification Results

The full local verification suite passed on 2026-05-18.

Commands verified:

```powershell
.\scripts\maintenance\check-all.ps1
```

Results:

- Backend unit tests: 113 tests passed.
- Backend import: passed.
- Backend health endpoint: HTTP 200.
- Frontend lint: passed.
- Frontend production build: passed.

Production build output:

- HTML: `dist/index.html`
- CSS: about 24.78 kB
- JS: about 218.03 kB
- Main image asset: about 1.57 MB

## What Is Ready

- The app has a working local startup contract.
- Backend endpoints are structured around clients, intake, analysis, deliverables, visual boards, prompt packs, uploads, provider status, and health checks.
- The backend has meaningful test coverage for current core behavior.
- Upload security, path traversal protection, CORS restrictions, and bounded context loading are documented and partially enforced.
- The frontend builds successfully and has a usable dashboard/workbench flow.
- There is a clear folder model separating runtime app, brand system, knowledge base, logs, and legacy files.
- `.gitignore` excludes local secrets, virtual environments, logs, generated builds, node modules, and memory database files.

## Main Gaps Before Handing To An App Developer

1. No Git repository is initialized at the current root.
   A developer should receive this as a clean Git repo with source files committed, generated files excluded, and a short commit history or one baseline commit.

2. No native mobile shell exists.
   There is no Android Gradle project, no `AndroidManifest.xml`, no Capacitor config, and no React Native project. Today this is a web app that could become:
   - a hosted web app/PWA,
   - a Capacitor Android/iOS wrapper,
   - or a rewritten native/mobile app.

3. Backend is local-first.
   The backend assumes local filesystem storage, local client folders, optional local Ollama, and local environment files. For a production app, a developer must decide where user data, uploads, generated deliverables, and AI provider secrets live.

4. Configuration is minimal.
   `.env.example` documents OpenAI and Ollama values, but frontend API configuration, production API URLs, auth, storage, and deployment environments need stronger documentation.

5. No authentication or user accounts.
   The app appears designed as a local/operator tool. If this becomes a client-facing or multi-user app, auth, permissions, tenant separation, and audit trails are required.

6. No API schema/export contract for external developers.
   FastAPI can expose OpenAPI automatically, but the handoff should include endpoint expectations, request/response examples, and data lifecycle notes.

7. No visual QA report.
   The frontend builds, but mobile breakpoints and real browser interaction should be validated before mobile packaging.

8. Generated and business data need a handoff decision.
   `BRAND_EXPERIENCE/`, `BRAND_EXPERIENCE_OS/`, and `memory_db/` have different roles. A developer needs to know what is source, what is private data, what is generated, and what must be migrated.

## Recommended Path To Transport Into An App

### Recommended: Web App First, Then Mobile Wrapper

For the fastest and safest path, keep the current React/FastAPI architecture and make it production-ready before building native apps.

Phase 1: Developer-ready repo

- Initialize Git at the project root.
- Commit source and documentation only.
- Keep `frontend/node_modules/`, `frontend/dist/`, virtual environments, logs, and `memory_db/` out of Git.
- Add a concise `DEVELOPER_HANDOFF.md` with setup, environment, run, test, and architecture notes.
- Add sample data or fixtures that do not expose private client material.

Phase 2: Web production readiness

- Add explicit frontend env example, for example `VITE_API_URL`.
- Add backend settings module instead of scattered `os.getenv` calls.
- Add deployment config for one target platform.
- Add auth if any user other than the local operator will access it.
- Add persistent storage decision: filesystem, S3-compatible storage, Postgres, or another managed option.

Phase 3: Mobile app route

- If the app only needs a mobile shell around the dashboard: use Capacitor.
- If the app must feel fully native and use device features deeply: plan a React Native or native rewrite.
- If the main use case is internal operator work: ship a responsive web app/PWA first and avoid native complexity until product-market needs are clearer.

## Priority Improvements

High priority:

- Create a clean Git repo.
- Write `DEVELOPER_HANDOFF.md`.
- Decide private data vs source data.
- Document API endpoints and data flow.
- Add production environment strategy.
- Add auth/security plan if the app leaves local use.

Medium priority:

- Add browser-based UI smoke tests.
- Add API request/response fixtures.
- Add frontend component tests for critical flows.
- Reduce main image weight or lazy-load it for mobile performance.
- Replace local-only paths with configurable storage roots.

Low priority:

- Add native Android/iOS shells after web architecture is stable.
- Add CI/CD once the repo exists.
- Add design system tokens if frontend growth continues.

## Suggested Handoff Package

A developer should receive:

- Source repo with one clean baseline commit.
- `README.md`
- `docs/STRUCTURE_AUDIT.md`
- `docs/MAINTENANCE_CHECKLIST.md`
- `docs/APP_HANDOFF_AUDIT.md`
- `.env.example`
- Backend endpoint summary from FastAPI OpenAPI.
- Sample non-private client folder.
- Known limitations and product roadmap.

## Current Technical Verdict

The app is in a working local MVP/internal-tool state. It is not yet packaged as a mobile app and is not yet production-ready as a hosted multi-user product.

The strongest next move is not to rewrite it immediately. First, stabilize the handoff: Git repo, clear docs, environment setup, data boundaries, API contract, and browser/mobile QA. After that, a developer can confidently choose whether the product should become a PWA, a Capacitor app, or a native mobile build.
