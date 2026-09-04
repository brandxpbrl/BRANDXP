from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any

from .core.creative_kernel import ConceptSeed, CreativeKernel
from .literary_adapter import LiteraryAdapterRequest, build_literary_analysis, get_literary_adapter_status
from .runtime.session import session

mcos_router = APIRouter(tags=["MCOS World-to-Experience Engine"])

try:
    default_seed = ConceptSeed(name="MPE WORLD", core_intent="First Contact through geometry", metadata={"core_mechanics": ["First Contact Paradigm"], "narrative_themes": ["Technology as magic"]})
    default_world = CreativeKernel.spawn_creation(default_seed, creation_type="world")
    default_world.creation_id = "mpe_world"
    session.world_manager.register_world(default_world)
except Exception:
    pass

class CreateWorldRequest(BaseModel):
    name: str
    core_intent: str
    metadata: Dict[str, Any] = {}

class RuntimeInitRequest(BaseModel):
    world_id: str

class ExecuteRequest(BaseModel):
    action: str
    payload: Dict[str, Any]

class LiteraryAnalyzeRequest(BaseModel):
    text: str
    source: str = "MPE_LITERATURE_UI"
    chapter: str = ""
    knowledge_context: list[dict[str, Any]] = Field(default_factory=list)
    character_canon: dict[str, Any] | None = None

@mcos_router.post("/worlds/")
async def create_world(request: CreateWorldRequest):
    try:
        seed = ConceptSeed(name=request.name, core_intent=request.core_intent, metadata=request.metadata)
        new_world = CreativeKernel.spawn_creation(seed, creation_type="world")
        session.world_manager.register_world(new_world)
        return {"status": "success", "world": new_world.get_status()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@mcos_router.get("/worlds/")
async def list_worlds():
    try:
        return {"status": "success", "worlds": session.world_manager.list_active_worlds()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@mcos_router.post("/runtime/bootstrap")
async def bootstrap_session():
    try:
        return {"status": "success", "state": session.bootstrap()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@mcos_router.post("/runtime/session/init")
async def init_session(req: RuntimeInitRequest):
    try:
        return {"status": "success", "state": session.init_session(req.world_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@mcos_router.get("/runtime/session/state")
async def get_session_state():
    try:
        return {"status": "success", "state": session.get_state()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@mcos_router.post("/runtime/session/execute")
async def execute_command(req: ExecuteRequest):
    try:
        return {"status": "success", "result": session.execute_command(req.action, req.payload)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@mcos_router.get("/literary/status")
async def literary_status():
    return get_literary_adapter_status()

@mcos_router.post("/literary/analyze")
async def literary_analyze(req: LiteraryAnalyzeRequest):
    try:
        return build_literary_analysis(LiteraryAdapterRequest(text=req.text, source=req.source, chapter=req.chapter, knowledge_context=req.knowledge_context, character_canon=req.character_canon))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"MCOS literary adapter failed: {type(exc).__name__}") from exc
