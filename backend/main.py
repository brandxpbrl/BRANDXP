import os

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ai_provider import get_provider_status, reset_provider_state
from client_manager import build_client_analysis_plan, build_framework_prompt, ensure_client, generate_client_deliverables, generate_client_prompt_pack, generate_client_visual_board_specs, generate_master_deliverable, get_client_deliverable_asset_path, get_client_deliverable_content, list_client_deliverables, list_clients, load_latest_client_intake, render_client_visual_board_images, save_client_analysis, save_client_intake, save_uploaded_file
from cognitive_orchestrator import AnalysisSaveError, process_request
from dynamic_agent_loader import load_all_agents
from services.ai_agent_os_builder import generate_ai_agent_os
from services.access_control import access_control_enabled, access_keys_configured, authenticate_access_key, is_client_allowed_path, is_public_path, verify_access_token
from services.cinematic_campaign_builder import generate_cinematic_campaign, get_recommended_cinematic_brief
from services.client_activation_engine import build_client_activation, create_activation_sprint, generate_client_portal_summary, generate_evolution_timeline, generate_strategic_campaign, mark_deliverables_reviewed
from services.client_chat_engine import build_client_chat_context, run_client_chat
from services.entity_conversation_engine import build_entity_conversation_context, run_entity_conversation
from services.client_portal import build_client_portal
from services.deliverables_review_engine import review_client_deliverables
from services.entity_advisor import build_entity_advisor, chat_with_entity, get_creative_library_asset_path
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


class CinematicCampaignRequest(BaseModel):

    brand: str | None = None

    video_objective: str | None = None

    central_message: str | None = None

    main_emotion: str | None = None

    audience: str | None = None

    visual_aesthetic: str | None = None

    duration: str | int | None = None

    platform: str | None = None

    final_cta: str | None = None


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


class EntityConversationRequest(BaseModel):

    message: str

    mode: str = "internal"


class EntityChatRequest(BaseModel):

    client: str

    message: str

    mode: str = "internal"


class AccessLoginRequest(BaseModel):

    access_key: str


def _split_public_links(raw_links: str | None):
    if not raw_links:
        return []

    return [
        link.strip()
        for link in raw_links.splitlines()
        if link.strip()
    ]


def _public_client_notes(payload: dict):
    sections = []

    for label, value in payload.items():
        if value:
            sections.append(f"{label}: {value}")

    return "\n".join(sections)


def _clean_public_value(value):
    if isinstance(value, str):
        return value.strip()

    return ""

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
        "access_configured": access_keys_configured(),
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


@app.post("/api/public/client-intake")
async def public_client_intake(
    brand_name: str = Form(...),
    instagram: str = Form(...),
    contact_name: str = Form(""),
    contact_email: str = Form(""),
    project_goal: str = Form(""),
    services: str = Form(""),
    audience: str = Form(""),
    origin: str = Form(""),
    vision: str = Form(""),
    purpose: str = Form(""),
    beneficiaries: str = Form(""),
    main_objective: str = Form(""),
    target_audience: str = Form(""),
    market: str = Form(""),
    identity_words: str = Form(""),
    personality: str = Form(""),
    differentiation: str = Form(""),
    impact_phrase: str = Form(""),
    person_description: str = Form(""),
    links: str = Form(""),
    notes: str = Form(""),
    files: list[UploadFile] | None = File(default=None),
):

    clean_brand_name = brand_name.strip()
    clean_instagram = instagram.strip()
    clean_contact_name = _clean_public_value(contact_name)
    clean_contact_email = _clean_public_value(contact_email)
    clean_project_goal = _clean_public_value(project_goal)
    clean_services = _clean_public_value(services)
    clean_audience = _clean_public_value(audience)
    clean_origin = _clean_public_value(origin)
    clean_vision = _clean_public_value(vision)
    clean_purpose = _clean_public_value(purpose)
    clean_beneficiaries = _clean_public_value(beneficiaries)
    clean_main_objective = _clean_public_value(main_objective)
    clean_target_audience = _clean_public_value(target_audience)
    clean_market = _clean_public_value(market)
    clean_identity_words = _clean_public_value(identity_words)
    clean_personality = _clean_public_value(personality)
    clean_differentiation = _clean_public_value(differentiation)
    clean_impact_phrase = _clean_public_value(impact_phrase)
    clean_person_description = _clean_public_value(person_description)
    clean_notes = _clean_public_value(notes)

    if not clean_brand_name:
        raise HTTPException(
            status_code=400,
            detail="Brand name is required."
        )

    if not clean_instagram:
        raise HTTPException(
            status_code=400,
            detail="Instagram is required."
        )

    public_notes = _public_client_notes(
        {
            "Contacto": clean_contact_name,
            "Email": clean_contact_email,
            "Origen": clean_origin,
            "Vision": clean_vision,
            "Proposito": clean_purpose,
            "Beneficiarios": clean_beneficiaries,
            "Objetivo principal": clean_main_objective or clean_project_goal,
            "Publico objetivo": clean_target_audience or clean_audience,
            "Nacionalidad o mercado": clean_market,
            "Identidad en 3 palabras": clean_identity_words,
            "Personalidad": clean_personality,
            "Diferenciacion": clean_differentiation,
            "Frase de impacto": clean_impact_phrase,
            "Reflexion final": clean_person_description,
            "Servicios": clean_services,
            "Notas": clean_notes,
            "Fuente": "Solicitud publica de analisis",
        }
    )
    strategic_questionnaire = {
        "origin": clean_origin,
        "vision": clean_vision,
        "purpose": clean_purpose,
        "beneficiaries": clean_beneficiaries,
        "main_objective": clean_main_objective or clean_project_goal,
        "target_audience": clean_target_audience or clean_audience,
        "market": clean_market,
        "identity_words": clean_identity_words,
        "personality": clean_personality,
        "differentiation": clean_differentiation,
        "impact_phrase": clean_impact_phrase,
        "person_description": clean_person_description,
    }
    intake = {
        "instagram": clean_instagram,
        "links": _split_public_links(links),
        "transcription": "",
        "notes": public_notes,
        "contact_name": clean_contact_name,
        "contact_email": clean_contact_email,
        "project_goal": clean_main_objective or clean_project_goal,
        "services": clean_services,
        "audience": clean_target_audience or clean_audience,
        "strategic_questionnaire": strategic_questionnaire,
        "source": "public_client_intake",
        "framework_ready": bool(
            clean_brand_name
            and clean_instagram
            and any(strategic_questionnaire.values())
        ),
    }

    try:
        intake_result = save_client_intake(clean_brand_name, intake)
        uploaded_files = []

        for file in files or []:
            if not file or not file.filename:
                continue

            upload_result = save_uploaded_file(
                clean_brand_name,
                file.file,
                file.filename,
                "Cliente_Nuevo",
            )
            uploaded_files.append(
                {
                    "filename": upload_result["filename"],
                    "category": "Cliente_Nuevo",
                }
            )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Public intake failed. Check backend logs for details."
        ) from error

    return {
        "status": "received",
        "client": intake_result["client"],
        "intake_file": intake_result["intake_file"],
        "uploaded_files": uploaded_files,
        "framework_ready": intake["framework_ready"],
        "next_step": "Brand Experience OS recibio el contexto. El framework queda listo para ejecutarse desde el dashboard privado.",
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


@app.get("/api/entity/conversation/{client_name}")
async def entity_conversation_context(client_name: str):

    result = build_entity_conversation_context(client_name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.post("/api/entity/conversation/{client_name}")
async def entity_conversation(client_name: str, request: EntityConversationRequest):

    try:
        result = run_entity_conversation(
            client_name,
            request.message,
            request.mode,
        )
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


@app.post("/api/entity/chat")
async def entity_chat(request: EntityChatRequest, http_request: Request):
    access_session = getattr(http_request.state, "access_session", None)

    if (
        access_session
        and access_session.get("mode") == "client"
        and request.client.casefold() != access_session.get("client", "").casefold()
    ):
        raise HTTPException(
            status_code=403,
            detail="This key can only chat with its assigned client entity."
        )

    try:
        result = chat_with_entity(
            request.client,
            request.message,
            request.mode,
        )
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


@app.post("/api/clients/{client_name}/cinematic-campaigns/generate")
async def client_generate_cinematic_campaign(client_name: str, request: CinematicCampaignRequest):

    result = generate_cinematic_campaign(
        client_name,
        request.model_dump() if hasattr(request, "model_dump") else request.dict(),
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    return result


@app.get("/api/clients/{client_name}/cinematic-campaigns/recommended-brief")
async def client_cinematic_campaign_recommended_brief(client_name: str):

    result = get_recommended_cinematic_brief(client_name)

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


@app.post("/clients/{client_name}/analyze-latest-intake")
async def analyze_latest_client_intake(client_name: str):

    if not client_name.strip():
        raise HTTPException(
            status_code=400,
            detail="Client name is required."
        )

    try:
        latest = load_latest_client_intake(client_name)
    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        ) from error

    intake = latest["intake"]
    prompt = build_framework_prompt(latest["client"], intake)
    client = ensure_client(latest["client"], "Framework analysis started from latest saved intake.")
    save_client_analysis(
        client,
        prompt,
        "Analisis en progreso. Brand Experience OS cargo el ultimo intake guardado y esta ejecutando el flujo multiagente.",
        provider=get_provider_status(),
        concepts=["Latest intake framework run"],
        agents=[],
        structured_analysis={
            "headline": "Analisis en progreso desde intake guardado.",
            "overall_score": 0,
            "confidence": 0,
            "diagnosis": {
                "current_state": "El sistema esta procesando el framework multiagente con el ultimo intake del cliente.",
                "main_gap": "Pendiente de sintesis final",
                "strategic_decision": "Esperar la respuesta final del orquestador.",
            },
        },
        status="running",
    )

    try:
        result = process_request(
            prompt,
            latest["client"]
        )
    except AnalysisSaveError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        ) from error

    result["intake_source"] = {
        "intake_file": latest["intake_file"],
        "created_at": latest.get("created_at"),
    }
    return result


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
