from fastapi import APIRouter

from services.mpe.mpe_runtime_bridge import build_runtime_snapshot


mpe_runtime_router = APIRouter()


@mpe_runtime_router.get("/runtime")
def get_mpe_runtime_snapshot():
    """Return a sanitized, read-only snapshot of configured MPE runtime sources."""
    return build_runtime_snapshot()
