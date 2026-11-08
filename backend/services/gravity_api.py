from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from starlette.concurrency import run_in_threadpool

from services.gravity_runtime import (
    create_dry_run,
    build_specialist_batch_manifest,
    derive_minimal_specialist_run,
    derive_crossing_run,
    derive_cleanup_run,
    derive_synthesis_run,
    derive_macro_cycle_run,
    derive_final_integration_run,
    build_macro_cycle_manifest,
    derive_specialist_batch_run,
    get_dry_run,
    list_dry_runs,
    record_synthetic_output,
    review_task_output,
    review_specialist_batch,
    review_macro_cycle,
    request_task,
)


gravity_runtime_router = APIRouter(tags=["Gravity Runtime"])


class GravityDryRunRequest(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    evidence: str = Field(min_length=2, max_length=20000)
    mode: str = "a23_only"
    execution_mode: str = "dry_run"
    evidence_kind: str = "synthetic"


class GravitySyntheticOutputRequest(BaseModel):
    sources: list[dict] = Field(default_factory=list)
    claims: list[dict] = Field(default_factory=list)
    contradictions: list[dict] = Field(default_factory=list)


class GravityOutputReviewRequest(BaseModel):
    decision: str
    reviewer: str = Field(min_length=2, max_length=200)
    note: str = Field(default="", max_length=2000)


class GravityCrossingRequest(BaseModel):
    source_run_ids: list[str] = Field(min_length=5, max_length=5)


@gravity_runtime_router.post("/runs")
async def create_gravity_dry_run(request: GravityDryRunRequest):
    try:
        return await run_in_threadpool(create_dry_run, request.model_dump())
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@gravity_runtime_router.get("/runs")
async def list_gravity_dry_runs():
    return {"runs": await run_in_threadpool(list_dry_runs)}


@gravity_runtime_router.get("/runs/{run_id}")
async def get_gravity_dry_run(run_id: str):
    try:
        payload = await run_in_threadpool(get_dry_run, run_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity run not found.")
    return payload


@gravity_runtime_router.post("/runs/{run_id}/tasks/{component_id}/request")
async def request_gravity_task(run_id: str, component_id: str):
    try:
        payload = await run_in_threadpool(request_task, run_id, component_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity run not found.")
    return payload


@gravity_runtime_router.post("/runs/{run_id}/tasks/{component_id}/synthetic-output")
async def save_gravity_synthetic_output(
    run_id: str, component_id: str, request: GravitySyntheticOutputRequest
):
    try:
        payload = await run_in_threadpool(
            record_synthetic_output, run_id, component_id, request.model_dump()
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity run not found.")
    return payload


@gravity_runtime_router.post("/runs/{run_id}/tasks/{component_id}/review")
async def review_gravity_output(run_id: str, component_id: str, request: GravityOutputReviewRequest):
    try:
        payload = await run_in_threadpool(
            review_task_output,
            run_id,
            component_id,
            request.decision,
            request.reviewer,
            request.note,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity run not found.")
    return payload


@gravity_runtime_router.post("/runs/{run_id}/derive-minimal-specialists")
async def derive_gravity_minimal_specialists(run_id: str):
    try:
        payload = await run_in_threadpool(derive_minimal_specialist_run, run_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity source run not found.")
    return payload


@gravity_runtime_router.post("/runs/{run_id}/derive-specialist-batch/{batch_id}")
async def derive_gravity_specialist_batch(run_id: str, batch_id: str):
    try:
        payload = await run_in_threadpool(derive_specialist_batch_run, run_id, batch_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity source run not found.")
    return payload


@gravity_runtime_router.post("/runs/{run_id}/batch-manifest")
async def create_gravity_batch_manifest(run_id: str):
    try:
        payload = await run_in_threadpool(build_specialist_batch_manifest, run_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity batch run not found.")
    return payload


@gravity_runtime_router.post("/runs/{run_id}/batch-review")
async def review_gravity_batch(run_id: str, request: GravityOutputReviewRequest):
    try:
        payload = await run_in_threadpool(
            review_specialist_batch, run_id, request.decision, request.reviewer, request.note
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity batch run not found.")
    return payload


@gravity_runtime_router.post("/runs/derive-crossing")
async def derive_gravity_crossing(request: GravityCrossingRequest):
    try:
        payload = await run_in_threadpool(derive_crossing_run, request.source_run_ids)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    return payload


@gravity_runtime_router.post("/runs/{run_id}/derive-cleanup")
async def derive_gravity_cleanup(run_id: str):
    try:
        payload = await run_in_threadpool(derive_cleanup_run, run_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity crossing run not found.")
    return payload


@gravity_runtime_router.post("/runs/{run_id}/derive-synthesis")
async def derive_gravity_synthesis(run_id: str):
    try:
        payload = await run_in_threadpool(derive_synthesis_run, run_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity cleanup run not found.")
    return payload


@gravity_runtime_router.post("/runs/{run_id}/derive-macro-cycle")
async def derive_gravity_macro_cycle(run_id: str):
    try:
        payload = await run_in_threadpool(derive_macro_cycle_run, run_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity synthesis run not found.")
    return payload


@gravity_runtime_router.post("/runs/{run_id}/macro-cycle-manifest")
async def create_gravity_macro_cycle_manifest(run_id: str):
    try:
        payload = await run_in_threadpool(build_macro_cycle_manifest, run_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity macro cycle not found.")
    return payload


@gravity_runtime_router.post("/runs/{run_id}/macro-cycle-review")
async def review_gravity_macro_cycle(run_id: str, request: GravityOutputReviewRequest):
    try:
        payload = await run_in_threadpool(
            review_macro_cycle, run_id, request.decision, request.reviewer, request.note
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity macro cycle not found.")
    return payload


@gravity_runtime_router.post("/runs/{run_id}/derive-final-integration")
async def derive_gravity_final_integration(run_id: str):
    try:
        payload = await run_in_threadpool(derive_final_integration_run, run_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not payload:
        raise HTTPException(status_code=404, detail="Gravity macro cycle not found.")
    return payload
