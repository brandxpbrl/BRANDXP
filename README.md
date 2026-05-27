# Brand Experience OS

Brand Experience OS is an AI-powered creative operating system for analyzing, building, and activating brands as living strategic entities.

It combines a FastAPI backend, a React/Vite dashboard, multi-agent reasoning, client memory, strategic analysis, Visual DNA, Content Intelligence, a Client Portal, and an Advisor Entity that transforms brand context into diagnostics, deliverables, campaigns, narrative systems, and next best actions.

## What It Does

- Creates and manages active client workspaces.
- Saves client context, notes, files, links, transcripts, and strategic inputs.
- Runs a multi-agent Brand Experience framework.
- Generates and stores client analysis results.
- Builds brand deliverables such as identity patches, brand analysis, entity bibles, visual universes, content strategies, prompt packs, strategic campaigns, and evolution timelines.
- Provides a live Advisor Entity that reads the real state of each client and recommends the next best action.
- Includes a Client Portal for client-facing analysis, progress, deliverables, and recommendations.
- Supports Gemini as the main AI provider, with Ollama as optional local fallback.

## Core Modules

- **Creative Command Center**: main dashboard for intake, analysis, and execution.
- **Entity Advisor**: strategic advisor layer that interprets each client state.
- **Client Portal**: premium client-facing view of progress, deliverables, and next steps.
- **Client Operator Chat**: operational chat for executing prompts and next actions.
- **Brand Memory Core**: client memory and strategic context.
- **Visual DNA Engine**: visual direction and perception system.
- **Content Intelligence Engine**: content, funnel, and narrative activation.
- **AI Agent OS**: agent operating layer for client-specific specialist workflows.

## Tech Stack

### Backend

- Python
- FastAPI
- Uvicorn
- Google Gemini API via `google-genai`
- Local file-based client memory and deliverable storage

### Frontend

- React
- Vite
- Tailwind CSS
- Dark premium dashboard UI

## Project Structure

```text
backend/                 FastAPI API, AI provider, orchestration, client services
frontend/                React/Vite dashboard
BRAND_EXPERIENCE/        Client systems, creative library, brand operating files
BRAND_EXPERIENCE_OS/     Knowledge base and Brand Experience operating system
runtime/                 Local runtime logs
docs/                    Project documentation and visual references
render.yaml              Render deployment blueprint
```

## Environment Variables

Create a `.env` file from `.env.example`.

Required for Gemini:

```env
AI_PROVIDER=gemini
AI_TEMPERATURE=0.55
GEMINI_API_KEY=your-google-ai-studio-key
GEMINI_MODEL=gemini-3.5-flash
```

Frontend/backend production variables:

```env
VITE_API_URL=https://your-backend-domain.onrender.com
BACKEND_CORS_ORIGINS=https://your-frontend-domain.onrender.com
```

Optional local fallback:

```env
OLLAMA_MODEL=mistral
OLLAMA_HOST=http://127.0.0.1:11434
```

## Local Development

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Backend health:

```text
http://127.0.0.1:8000/health
```

### Frontend

```powershell
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Frontend:

```text
http://127.0.0.1:5173
```

## Deployment

This project includes a `render.yaml` Blueprint for Render.

It creates:

- `brand-experience-os-api`: FastAPI backend
- `brand-experience-os`: static React/Vite frontend

After connecting the repository to Render, configure:

```env
GEMINI_API_KEY=your-google-ai-studio-key
BACKEND_CORS_ORIGINS=https://your-frontend-domain.onrender.com
VITE_API_URL=https://your-backend-domain.onrender.com
```

## Important Production Note

The current system stores client data, analysis outputs, and deliverables in local files.

That works locally and for early online testing, but production deployments should use persistent storage such as:

- Render persistent disk
- Supabase/Postgres
- S3-compatible object storage
- another managed database/storage layer

Without persistent storage, generated files may be lost when the hosting environment restarts or redeploys.

## Verification

Backend tests:

```powershell
backend\.venv\Scripts\python.exe -m unittest backend.tests.test_entity_reasoning_core backend.tests.test_entity_advisor backend.tests.test_client_chat_engine backend.tests.test_client_activation_engine backend.tests.test_client_portal backend.tests.test_entity_voice backend.tests.test_framework_save_contract
```

Frontend build:

```powershell
cd frontend
npm run build
```

## Status

Brand Experience OS is currently in active development.

The system already supports local multi-agent analysis, client memory, deliverable generation, Entity Advisor reasoning, Client Portal views, voice preview, and production deployment preparation.
