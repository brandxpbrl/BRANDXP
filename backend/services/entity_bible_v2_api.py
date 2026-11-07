from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool

from services.entity_bible_v2_mcos import (
    get_candidate,
    get_validation,
    list_candidates,
    review_candidate,
)


entity_bible_v2_router = APIRouter(tags=["Entity Bible v2"])


class CandidateReviewRequest(BaseModel):
    decision: str
    reviewer: str
    note: str = ""


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
