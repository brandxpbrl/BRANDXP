import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.mpe.mpe_runtime_bridge import build_runtime_snapshot


app = FastAPI(
    title="MPE Runtime Bridge",
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
)


def _origins():
    raw = os.getenv(
        "MPE_BRIDGE_CORS_ORIGINS",
        "https://www.riovibestransfer.com,https://riovibestransfer.com",
    )
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins(),
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "mpe-runtime-bridge", "version": "0.1.0"}


@app.get("/api/state")
def runtime_state():
    return build_runtime_snapshot()
