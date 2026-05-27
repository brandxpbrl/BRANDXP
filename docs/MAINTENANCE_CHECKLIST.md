# Brand Experience OS - Maintenance Checklist

Use this checklist before and after technical changes. The goal is to keep the app stable while reducing project noise over time.

## Before Touching Code

- List the exact files that will be modified.
- Confirm whether the change affects frontend, backend, documentation, runtime data, or generated artifacts.
- Do not delete or move files without explicit approval.
- Do not delete `memory_db/` without a backup and explicit approval.
- Do not touch `runtime/logs/` while investigating errors.
- Use `backend/.venv/` for backend Python work.
- Ignore the root `.venv/`; it is stale or broken unless intentionally rebuilt later.

## Local Run Commands

Launcher:

```text
START_BRAND_EXPERIENCE_OS.bat
```

Manual backend:

```powershell
cd backend
.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Manual frontend:

```powershell
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

## Required Verification

Backend unit tests:

```powershell
backend\.venv\Scripts\python.exe -m unittest discover -s backend\tests
```

Frontend:

```powershell
cd frontend
npm run lint
npm run build
```

Backend import:

```powershell
cd backend
.venv\Scripts\python.exe -c "from main import app; print(app.title)"
```

Backend health, with backend running:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri http://127.0.0.1:8000/health
```

If using an alternate backend port, adjust the URL accordingly.

Combined verification:

```powershell
.\scripts\maintenance\check-all.ps1
```

If the backend is running on a different port:

```powershell
.\scripts\maintenance\check-all.ps1 -HealthUrl http://127.0.0.1:8010/health
```

If no backend server is running and you only want import/unit checks:

```powershell
.\scripts\maintenance\check-all.ps1 -SkipHealth
```

## Active Source Folders

- `backend/`
- `frontend/`
- `BRAND_EXPERIENCE/`
- `BRAND_EXPERIENCE_OS/`

## Legacy Folders

- `scripts/legacy/frontend/`
- `scripts/legacy/agents_py/`

Legacy files are preserved for reference. They are not part of the active runtime unless explicitly reintroduced.

## Generated Or Local-Only Folders

Do not version these:

- `frontend/dist/`
- `frontend/node_modules/`
- `backend/.venv/`
- root `.venv/`
- `__pycache__/`
- `runtime/logs/`
- `memory_db/`

## Security Baseline

- CORS is restricted to `http://127.0.0.1:5173` and `http://localhost:5173`.
- Uploads are limited to `10 MB` per file.
- Upload extensions are allowlisted.
- Upload path traversal is blocked.
- Context loading skips secrets, logs, binaries, builds, virtual environments, and oversized files.
- Framework context loading also skips generated deliverables and board outputs such as `05_ENTREGAS/`, `board_specs/`, and `visuals/` so old outputs do not contaminate new analysis runs.
- `GET /clients/{client_name}/deliverables` lists metadata from `05_ENTREGAS` only, returns relative paths, limits depth and item count, and does not read file contents.
- `POST /clients/{client_name}/deliverables/generate` creates final deliverable files from `LATEST_ANALYSIS.json` or `LATEST_ANALYSIS.md`, writes only inside `05_ENTREGAS`, does not call AI providers, and versions existing `.md` deliverables instead of overwriting them.
- `POST /clients/{client_name}/deliverables/generate-master` creates `MASTER_BRAND_EXPERIENCE.md` directly from `LATEST_ANALYSIS.json` or `LATEST_ANALYSIS.md`, optionally summarizes board specs, references PNG visuals as relative paths without embedding binary content, and versions an existing master instead of overwriting it.
- `POST /clients/{client_name}/visual-boards/generate-specs` creates deterministic JSON specs and Markdown for the three visual boards, writes only inside `05_ENTREGAS`, does not create images, and versions existing `.md` or `.json` files instead of overwriting them.
- `POST /clients/{client_name}/visual-boards/render-images` renders deterministic PNG images from `board_specs/*.json` using local Pillow only, writes only inside `05_ENTREGAS/visuals`, does not call AI providers, and versions existing `.png` files instead of overwriting them.
- `POST /clients/{client_name}/analysis-plan` is a dry-run endpoint: it inventories source metadata, returns a recommended pipeline, does not call AI providers, and does not write files.

## Testing Policy

The current verification stack is enough for small safety checks, dependency-free smoke tests, documentation updates, and narrow backend/frontend changes:

- `backend\.venv\Scripts\python.exe -m unittest discover -s backend\tests`
- `npm run lint`
- `npm run build`
- `.\scripts\maintenance\check-all.ps1`

Consider adding `pytest` later when backend logic grows, when tests need reusable fixtures, when flows become more complex, or when better reporting would reduce debugging time.

Consider adding Vitest or Jest later when the frontend is split into more testable components, when UI logic becomes meaningful enough to test directly, or when interaction tests become valuable.

Test safety rules:

- Do not write test data into real `BRAND_EXPERIENCE/` client folders.
- Do not touch `memory_db/` without backup and explicit approval.
- Do not call real AI providers in basic tests.
- Prefer mocks, fakes, and temporary directories for test isolation.

## After Changes

- Run the required verification commands.
- Confirm frontend local access still works.
- Confirm backend `/health` still works.
- Document important structure or operation changes in `docs/STRUCTURE_AUDIT.md`.
- If a change creates new generated files, update `.gitignore` or document why they should remain.
