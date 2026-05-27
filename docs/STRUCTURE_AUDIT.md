# Brand Experience OS - Structure Audit

Date: 2026-05-16

## Executive Summary

Brand Experience OS has three active layers:

- `frontend/`: React + Vite dashboard.
- `backend/`: FastAPI orchestration API, OpenAI/Ollama provider layer, client memory creation, and agent loading.
- `BRAND_EXPERIENCE/`: business operating system, brand core, client folders, creative library, exports, admin, and project assets.

The system is usable, but the workspace had operational friction: launch commands were manual, scripts were scattered in the root, generated caches were visible, and several knowledge/client structures existed in parallel without a single startup contract.

## Findings

1. Startup was manual.
   Backend, frontend, optional Ollama, environment checks, and browser opening required separate commands.

2. Root scripts were mixed with product folders.
   Resolved: legacy shell scripts now live in `scripts/maintenance/`.

3. Python environments are duplicated.
   There is a root `.venv/` and a backend `.venv/`. The backend launcher now standardizes on `backend/.venv`.

4. Generated/cache files are present.
   `__pycache__/`, `frontend/dist/`, virtualenvs, logs, and local databases should be treated as generated runtime artifacts.

5. Some frontend files looked stale or accidental.
   `frontend/src/App.css` and `frontend/src/components/loyout` were not part of the active Vite entry flow and were moved to `scripts/legacy/frontend/` without deleting them.

6. Agents are duplicated conceptually.
   The active backend agent knowledge lives in `backend/agents/AGENTS/*`. Old Python prompt stubs were moved to `scripts/legacy/agents_py/` so they no longer sit beside active runtime agent knowledge.

7. Client system is now connected.
   The backend can detect prompts like `analyza esta agencia de tours "Isa Tours"`, ensure a client folder exists, load context, and save analysis output into `01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience`.

## Organized Operating Model

Use this mental map:

- Daily app runtime:
  - `START_BRAND_EXPERIENCE_OS.bat`
  - `STOP_BRAND_EXPERIENCE_OS.bat`
  - `scripts/launchers/*`
  - `runtime/logs/*`

- Legacy archive:
  - `scripts/legacy/frontend/*`
  - `scripts/legacy/agents_py/*`

- Backend source:
  - `backend/main.py`
  - `backend/ai_provider.py`
  - `backend/cognitive_orchestrator.py`
  - `backend/client_manager.py`
  - `backend/client_loader.py`
  - `backend/dynamic_agent_loader.py`

- Frontend source:
  - `frontend/src/App.jsx`
  - `frontend/src/components/*`
  - `frontend/src/index.css`

- Brand operating system:
  - `BRAND_EXPERIENCE/00_BRAND_CORE`
  - `BRAND_EXPERIENCE/01_OPERATING_SYSTEM`
  - `BRAND_EXPERIENCE/03_CLIENT_SYSTEM`
  - `BRAND_EXPERIENCE/04_CREATIVE_LIBRARY`
  - `BRAND_EXPERIENCE/07_EXPORTS`

- Knowledge memory:
  - `BRAND_EXPERIENCE_OS/CORE`
  - `BRAND_EXPERIENCE_OS/KNOWLEDGE`
  - `entity_bible/`
  - `visual_ai/`

## Recommended Next Cleanup

Do not delete yet. Review first:

- Decide whether root `.venv/` is still needed. If not, remove it manually after confirming `backend/.venv` works.
- Delete `__pycache__/` and generated `frontend/dist/` only when you want a clean source tree.
- Review the archived legacy frontend files under `scripts/legacy/frontend/` before any future deletion.
- Consolidate future agent authoring into `backend/agents/AGENTS`.

## Technical Sanitation Notes

The valid Python environment for the backend is `backend/.venv/`. The root `.venv/` is stale or broken in this workspace and should be ignored unless it is intentionally rebuilt later.

Generated candidates identified for future cleanup, without deleting them yet:

- `frontend/dist/`
- `__pycache__/`
- root `.venv/`

Moved legacy files:

- `frontend/fas11.py` -> `scripts/legacy/frontend/fas11.py`
- `frontend/src/script3.py` -> `scripts/legacy/frontend/script3.py`
- `frontend/src/App.css` -> `scripts/legacy/frontend/App.css`
- `frontend/src/components/loyout` -> `scripts/legacy/frontend/loyout.empty`
- `backend/agents/branding_agent.py` -> `scripts/legacy/agents_py/branding_agent.py`
- `backend/agents/strategy_agent.py` -> `scripts/legacy/agents_py/strategy_agent.py`
- `backend/agents/psychology_agent.py` -> `scripts/legacy/agents_py/psychology_agent.py`
- `backend/agents/cinematic_agent.py` -> `scripts/legacy/agents_py/cinematic_agent.py`

Future convention: keep old one-off generators and patch scripts in `scripts/legacy/` after confirming they are no longer part of the active runtime.

## Security Baseline Applied

- CORS is restricted to local frontend origins:
  - `http://127.0.0.1:5173`
  - `http://localhost:5173`
- Uploads are capped at `10 MB` per file.
- Upload extensions are allowlisted: `.csv`, `.docx`, `.jpeg`, `.jpg`, `.json`, `.md`, `.pdf`, `.png`, `.txt`, `.webp`.
- Upload filenames are sanitized and resolved paths are checked to block path traversal.
- Client context loading is bounded by file count, per-file size, per-file characters, and total characters.
- Context loading skips `.env`, logs, binaries, builds, virtual environments, `node_modules`, and oversized files.

## Maintenance Rules

- List files before modifying them.
- Run `npm run lint` and `npm run build` after frontend changes.
- Verify backend import or `/health` after backend changes.
- Do not delete `memory_db/` without backup and explicit approval.
- Do not touch `runtime/logs/` while investigating errors.
- Record important structural or operational changes in this audit document.

## Launcher

Double click:

```text
START_BRAND_EXPERIENCE_OS.bat
```

It will:

- check/create `backend/.venv`
- install backend requirements if missing
- install frontend dependencies if missing
- start Ollama if installed and not already running
- start FastAPI on `http://127.0.0.1:8000`
- start Vite on `http://127.0.0.1:5173`
- open the dashboard
- write logs to `runtime/logs`

To stop backend/frontend:

```text
STOP_BRAND_EXPERIENCE_OS.bat
```

By default, the stop script does not stop Ollama. Use the PowerShell script with `-IncludeOllama` if you explicitly want that.
