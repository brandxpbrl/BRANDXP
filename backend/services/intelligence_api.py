"""Developer-only entry points for the optional knowledge and Gravity tools."""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from services.gravity_bridge import (
    approve_gravity_run,
    get_gravity_run,
    gravity_status,
    preview_gravity_agent,
    run_gravity_agent,
)
from services.knowledge_catalog import search_knowledge


intelligence_router = APIRouter()


class GravityRequest(BaseModel):
    agent_id: str = Field(min_length=2, max_length=5)
    question: str = Field(default="", max_length=2000)


def _bad_request(error):
    detail = str(error)
    raise HTTPException(status_code=404 if "not found" in detail.lower() else 400, detail=detail) from error


@intelligence_router.get("/{client_name}/intelligence")
def intelligence_status(client_name: str):
    try:
        return gravity_status(client_name)
    except ValueError as error:
        _bad_request(error)


@intelligence_router.get("/{client_name}/intelligence/knowledge")
def intelligence_knowledge(client_name: str, query: str = Query(min_length=2, max_length=200), limit: int = Query(default=4, ge=1, le=6)):
    try:
        gravity_status(client_name)
    except ValueError as error:
        _bad_request(error)
    return {"query": query, "results": search_knowledge(query, limit=limit)}


@intelligence_router.post("/{client_name}/intelligence/gravity/preview")
def intelligence_preview(client_name: str, request: GravityRequest):
    try:
        return preview_gravity_agent(client_name, request.agent_id, request.question)
    except ValueError as error:
        _bad_request(error)


@intelligence_router.post("/{client_name}/intelligence/gravity/run")
def intelligence_run(client_name: str, request: GravityRequest):
    try:
        return run_gravity_agent(client_name, request.agent_id, request.question)
    except ValueError as error:
        _bad_request(error)
    except RuntimeError as error:
        raise HTTPException(status_code=502, detail="AI provider unavailable for this Gravity run.") from error


@intelligence_router.post("/{client_name}/intelligence/gravity/runs/{run_id}/approve")
def intelligence_approve(client_name: str, run_id: str):
    try:
        return approve_gravity_run(client_name, run_id)
    except ValueError as error:
        _bad_request(error)


@intelligence_router.get("/{client_name}/intelligence/gravity/runs/{run_id}")
def intelligence_run_detail(client_name: str, run_id: str):
    try:
        return get_gravity_run(client_name, run_id)
    except ValueError as error:
        _bad_request(error)
