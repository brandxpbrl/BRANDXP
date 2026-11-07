from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from starlette.concurrency import run_in_threadpool

from .runtime import create_objective, decide_approval, get_objective, list_objectives, transition_task


orbis_runtime_router = APIRouter(tags=["ORBIS Runtime"])


class ObjectiveRequest(BaseModel):
    title: str
    description: str = ""
    created_by: str = "Felipe Vallejo"
    owner_agent_id: str = "nicolas"
    project_name: str | None = None
    success_criteria: list[str] = Field(default_factory=list)
    assumptions: list[str] = Field(default_factory=list)
    tasks: list[dict] = Field(default_factory=list)
    required_approver: str = "Felipe Vallejo"
    due_at: str | None = None


class TaskTransitionRequest(BaseModel):
    state: str
    actor: str
    note: str = ""


class ApprovalDecisionRequest(BaseModel):
    decision: str
    approver: str
    note: str = ""


@orbis_runtime_router.post("/objectives")
async def create_orbis_objective(request: ObjectiveRequest):
    try:
        return await run_in_threadpool(create_objective, request.model_dump())
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@orbis_runtime_router.get("/objectives")
async def list_orbis_objectives():
    return {"objectives": await run_in_threadpool(list_objectives)}


@orbis_runtime_router.get("/objectives/{objective_id}")
async def get_orbis_objective(objective_id: str):
    try:
        objective = await run_in_threadpool(get_objective, objective_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not objective:
        raise HTTPException(status_code=404, detail="ORBIS objective not found.")
    return objective


@orbis_runtime_router.post("/objectives/{objective_id}/tasks/{task_id}/transition")
async def transition_orbis_task(objective_id: str, task_id: str, request: TaskTransitionRequest):
    try:
        objective = await run_in_threadpool(
            transition_task, objective_id, task_id, request.state, request.actor, request.note
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not objective:
        raise HTTPException(status_code=404, detail="ORBIS objective not found.")
    return objective


@orbis_runtime_router.post("/objectives/{objective_id}/approvals/{approval_id}/decision")
async def decide_orbis_approval(objective_id: str, approval_id: str, request: ApprovalDecisionRequest):
    try:
        objective = await run_in_threadpool(
            decide_approval, objective_id, approval_id, request.decision, request.approver, request.note
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not objective:
        raise HTTPException(status_code=404, detail="ORBIS objective not found.")
    return objective
