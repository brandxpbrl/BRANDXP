from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from starlette.concurrency import run_in_threadpool

from services.gravity_runtime import (
    create_dry_run,
    get_dry_run,
    list_dry_runs,
    record_synthetic_output,
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
