import os

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ai_provider import get_provider_status, reset_provider_state
from client_manager import build_client_analysis_plan, build_framework_prompt, ensure_client, generate_client_deliverables, generate_client_prompt_pack, generate_client_visual_board_specs, generate_master_deliverable, get_client_deliverable_asset_path, get_client_deliverable_content, list_client_deliverables, list_clients, render_client_visual_board_images, save_client_analysis, save_client_intake, save_uploaded_file
from cognitive_orchestrator import AnalysisSaveError, process_request
from dynamic_agent_loader import load_all_agents
from services.ai_agent_os_builder import generate_ai_agent_os
from services.access_control import access_control_enabled, authenticate_access_key, is_client_allowed_path, is_public_path, verify_access_token
from services.client_activation_engine import build_client_activation, create_activation_sprint, generate_client_portal_summary, generate_evolution_timeline, generate_strategic_campaign, mark_deliverables_reviewed
from services.client_chat_engine import build_client_chat_context, run_client_chat
from services.client_portal import build_client_portal
from services.deliverables_review_engine import review_client_deliverables
from services.entity_advisor import build_entity_advisor, get_creative_library_asset_path
from services.entity_voice_profile import get_entity_voice_profile
from services.entity_voice_script_engine import build_entity_voice_script
from services.tts_service import generate_entity_voice

LOCAL_FRONTEND_ORIGINS = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5174",
    "http://localhost:5174",
]


def _cors_origins():
    configured_origins = os.getenv("BACKEND_CORS_ORIGINS", "")
    origins = [
        origin.strip()
        for origin in configured_origins.split(",")
        if origin.strip()
    ]

    return LOCAL_FRONTEND_ORIGINS + origins

# =====================================================
# APP
# =====================================================

app = FastAPI(
    title="Brand Experience OS API",
    version="1.1.0",
)

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# REQUEST MODEL
# =====================================================

class PromptRequest(BaseModel):

    prompt: str

    client_name: str | None = None


class ClientRequest(BaseModel):

    name: str

    notes: str | None = None


class IntakeRequest(BaseModel):

    client_name: str

    instagram: str | None = None

    links: list[str] = []

    transcription: str | None = None

    notes: str | None = None

    intake_already_saved: bool = False


class EntityVoiceScriptRequest(BaseModel):

    client: str | None = None

    advisor_message: str | None = None

    signals: list = Field(default_factory=list)

    risks: list = Field(default_factory=list)

    opportunities: list = Field(default_factory=list)

    next_best_action: dict | str | None = None

    recommendation: dict | None = None

    state: dict | None = None


class EntityVoiceRequest(BaseModel):

    client: str | None = None

    script: str


class ClientChatRequest(BaseModel):

    message: str

    prompt_id: str | None = None


class AccessLoginRequest(BaseModel):

    access_key: str

# =====================================================
# ROUTE
# =====================================================

@app.middleware("http")
async def access_control_middleware(request: Request, call_next):

    if request.method == "OPTIONS" or not access_control_enabled() or is_public_path(request.url.path):
        return await call_next(request)

    token = request.headers.get("X-BEOS-Token") or request.query_params.get("access_token")
    session = verify_access_token(token)

    if not session:
        return JSONResponse(
            status_code=401,
            content={
                "detail": "Access key required.",
                "code": "ACCESS_REQUIRED",
            },
        )

    if session["mode"] == "client" and not is_client_allowed_path(
        request.url.path,
        request.method,
        session.get("client"),
    ):
        return JSONResponse(
            status_code=403,
            content={
                "detail": "This key can only access its assigned client space.",
                "code": "CLIENT_SCOPE_ONLY",
            },
        )

    request.state.access_session = session

    return await call_next(request)


@app.get("/api/access/config")
async def access_config():

    return {
        "access_control": access_control_enabled(),
    }


@app.post("/api/access/login")
async def access_login(request: AccessLoginRequest):

    session = authenticate_access_key(request.access_key)

    if not session:
        raise HTTPException(
            status_code=401,
            detail="Invalid access key.",
        )

    return session


@app.get("/api/access/me")
async def access_me(request: Request):

    if not access_control_enabled():
        return {
            "mode": "developer",
            "client": None,
            "access_control": False,
        }

    token = request.headers.get("X-BEOS-Token")
    session = verify_access_token(token)

    if not session:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token.",
        )

    return {
        **session,
        "access_control": True,
    }

@app.post("/orchestrator")
async def orchestrator(request: PromptRequest):

    if not request.prompt.strip():
        raise HTTPException(
            status_code=400,
            detail="Prompt is required."
        )

    try:
        result = process_request(
            request.prompt,
            request.client_name
        )
    except AnalysisSaveError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        ) from error

    return result


@app.get("/clients")
async def clients(request: Request):
    access_session = getattr(request.state, "access_session", None)
    all_clients = list_clients()

    return {
        "clients": [
            client
            for client in all_clients
            if not access_session
            or access_session.get("mode") != "client"
            or client.get("name", "").casefold() == access_session.get("client", "").casefold()
        ]
    }


@app.get("/entity-advisor/{client_name}")
async def entity_advisor(client_name: str):

    result = build_entity_advisor(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.get("/api/entity/reasoning/{client_name}")
async def entity_reasoning(client_name: str):

    result = build_entity_advisor(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return {
        "client": result["client"],
        "advisor": result["advisor"],
        "state": result["state"],
        "entity_profile": result["entity_profile"],
        "entity_state": result["entity_state"],
        "recommendation": result["recommendation"],
        "reasoning": result["reasoning"],
        "fluid_messages": result["fluid_messages"],
    }


@app.post("/api/entity/voice-script")
async def entity_voice_script(request: EntityVoiceScriptRequest):

    payload = request.model_dump()

    return build_entity_voice_script(payload)


@app.post("/api/entity/voice")
async def entity_voice(request: EntityVoiceRequest):

    return generate_entity_voice(
        request.script,
        get_entity_voice_profile()
    )


@app.get("/creative-library/asset")
async def creative_library_asset(path: str):

    try:
        asset_path = get_creative_library_asset_path(path)
    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        ) from error
    except IsADirectoryError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    return FileResponse(asset_path)


@app.get("/clients/{client_name}/deliverables")
async def client_deliverables(client_name: str):

    result = list_client_deliverables(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/clients/{client_name}/deliverables/review")
async def client_review_deliverables(client_name: str):

    result = list_client_deliverables(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return review_client_deliverables(result)


@app.get("/api/clients/{client_name}/portal")
async def client_portal(client_name: str):

    result = build_client_portal(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.get("/api/clients/{client_name}/activation")
async def client_activation(client_name: str):

    result = build_client_activation(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.get("/api/clients/{client_name}/chat/context")
async def client_chat_context(client_name: str):

    result = build_client_chat_context(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/api/clients/{client_name}/chat")
async def client_chat(client_name: str, request: ClientChatRequest):

    try:
        result = run_client_chat(
            client_name,
            request.message,
            request.prompt_id
        )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error
    except RuntimeError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error)
        ) from error

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/api/clients/{client_name}/activation/sprint")
async def client_activation_sprint(client_name: str):

    result = create_activation_sprint(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/api/clients/{client_name}/portal/summary")
async def client_portal_summary(client_name: str):

    result = generate_client_portal_summary(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/api/clients/{client_name}/campaign/generate")
async def client_generate_campaign(client_name: str):

    result = generate_strategic_campaign(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/api/clients/{client_name}/timeline/generate")
async def client_generate_timeline(client_name: str):

    result = generate_evolution_timeline(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/api/clients/{client_name}/deliverables/mark-reviewed")
async def client_mark_deliverables_reviewed(client_name: str):

    result = mark_deliverables_reviewed(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.get("/clients/{client_name}/deliverables/content")
async def client_deliverable_content(client_name: str, path: str):

    try:
        result = get_client_deliverable_content(client_name, path)
    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        ) from error
    except IsADirectoryError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.get("/clients/{client_name}/deliverables/asset")
async def client_deliverable_asset(client_name: str, path: str):

    try:
        asset_path = get_client_deliverable_asset_path(client_name, path)
    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        ) from error
    except IsADirectoryError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    if asset_path is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return FileResponse(asset_path)


@app.post("/clients/{client_name}/analysis-plan")
async def client_analysis_plan(client_name: str):

    result = build_client_analysis_plan(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/clients/{client_name}/deliverables/generate")
async def client_generate_deliverables(client_name: str):

    try:
        result = generate_client_deliverables(client_name)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/clients/{client_name}/deliverables/generate-master")
async def client_generate_master_deliverable(client_name: str):

    try:
        result = generate_master_deliverable(client_name)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/clients/{client_name}/prompt-pack/generate")
async def client_generate_prompt_pack(client_name: str):

    try:
        result = generate_client_prompt_pack(client_name)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/clients/{client_name}/ai-agent-os/generate")
async def client_generate_ai_agent_os(client_name: str):

    try:
        result = generate_ai_agent_os(client_name)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/clients/{client_name}/visual-boards/generate-specs")
async def client_generate_visual_board_specs(client_name: str):

    try:
        result = generate_client_visual_board_specs(client_name)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/clients/{client_name}/visual-boards/render-images")
async def client_render_visual_board_images(client_name: str):

    try:
        result = render_client_visual_board_images(client_name)
    except FileNotFoundError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/clients")
async def create_client(request: ClientRequest):

    if not request.name.strip():
        raise HTTPException(
            status_code=400,
            detail="Client name is required."
        )

    client = ensure_client(
        request.name,
        request.notes or ""
    )

    return {
        "client": client
    }


@app.post("/clients/intake")
async def client_intake(request: IntakeRequest):

    if not request.client_name.strip():
        raise HTTPException(
            status_code=400,
            detail="Client name is required."
        )

    result = save_client_intake(
        request.client_name,
        {
            "instagram": request.instagram,
            "links": request.links,
            "transcription": request.transcription,
            "notes": request.notes,
        }
    )

    return result


@app.post("/clients/analyze")
async def analyze_client(request: IntakeRequest):

    if not request.client_name.strip():
        raise HTTPException(
            status_code=400,
            detail="Client name is required."
        )

    intake = {
        "instagram": request.instagram,
        "links": request.links,
        "transcription": request.transcription,
        "notes": request.notes,
    }

    if not request.intake_already_saved:
        save_client_intake(request.client_name, intake)

    prompt = build_framework_prompt(request.client_name, intake)
    client = ensure_client(request.client_name, "Framework analysis started.")
    save_client_analysis(
        client,
        prompt,
        "Analisis en progreso. Brand Experience OS ya recibio el contexto del cliente y esta ejecutando el flujo multiagente.",
        provider=get_provider_status(),
        concepts=["Framework running"],
        agents=[],
        structured_analysis={
            "headline": "Analisis en progreso.",
            "overall_score": 0,
            "confidence": 0,
            "diagnosis": {
                "current_state": "El sistema esta procesando el framework multiagente.",
                "main_gap": "Pendiente de sintesis final",
                "strategic_decision": "Esperar la respuesta final del orquestador.",
            },
        },
        status="running",
    )

    try:
        return process_request(
            prompt,
            request.client_name
        )
    except AnalysisSaveError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        ) from error


@app.post("/clients/{client_name}/uploads")
async def upload_client_file(
    client_name: str,
    category: str = Form("Material_Actual"),
    file: UploadFile = File(...),
):

    try:
        result = save_uploaded_file(
            client_name,
            file.file,
            file.filename or "upload.bin",
            category
        )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Upload failed. Check backend logs for details."
        ) from error

    return result


@app.get("/health")
async def health():

    agents = load_all_agents()

    return {
        "status": "ok",
        "agents_loaded": len(agents),
        "agents": [agent["name"] for agent in agents],
        "provider": get_provider_status(),
    }


@app.post("/provider/reset")
async def reset_provider():

    return {
        "status": "reset",
        "provider": reset_provider_state(),
    }
