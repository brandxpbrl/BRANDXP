from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool

from services.entity_bible_v2_mcos import (
    get_candidate,
    get_validation,
    list_candidates,
    review_candidate,
)
from services.entity_bible_v2_loader import (
    CanonValidationError,
    get_approved_unit,
    search_approved_units,
)


entity_bible_v2_router = APIRouter(tags=["Entity Bible v2"])


class CandidateReviewRequest(BaseModel):
    decision: str
    reviewer: str
    note: str = ""


@entity_bible_v2_router.get("/canon")
async def entity_bible_v2_canon(query: str = "", domain: str = "", agent: str = "", limit: int = 20):
    try:
        units = await run_in_threadpool(
            search_approved_units,
            query,
            [domain] if domain else None,
            agent or None,
            limit,
        )
    except CanonValidationError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    return {"access_mode": "approved_canon_only", "count": len(units), "units": units}


@entity_bible_v2_router.get("/canon/{knowledge_id}")
async def entity_bible_v2_canon_unit(knowledge_id: str):
    try:
        unit = await run_in_threadpool(get_approved_unit, knowledge_id)
    except CanonValidationError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    if not unit:
        raise HTTPException(status_code=404, detail="Approved Entity Bible unit not found.")
    return {"access_mode": "approved_canon_only", "unit": unit}


@entity_bible_v2_router.get("/candidates")
async def entity_bible_v2_candidates():
    return {"candidates": await run_in_threadpool(list_candidates)}


@entity_bible_v2_router.get("/candidates/{knowledge_id}")
async def entity_bible_v2_candidate(knowledge_id: str):
    candidate = await run_in_threadpool(get_candidate, knowledge_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Entity Bible candidate not found.")
    return {"candidate": candidate, "mcos_validation": await run_in_threadpool(get_validation, knowledge_id)}


@entity_bible_v2_router.post("/candidates/{knowledge_id}/review")
async def entity_bible_v2_review(knowledge_id: str, request: CandidateReviewRequest):
    try:
        candidate = await run_in_threadpool(
            review_candidate, knowledge_id, request.decision, request.reviewer, request.note
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not candidate:
        raise HTTPException(status_code=404, detail="Entity Bible candidate not found.")
    return candidate
