from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse

from api.routes import api_router
from config import settings
from data.mantle_rpc import get_mantle_rpc_client

app = FastAPI(
    title="Mantle Atlas",
    version="1.0.0",
    description="Backend data infrastructure and intelligence engine for Mantle Atlas.",
)

ALLOWED_ORIGINS = [
    "https://mantle-atlas-two.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": "An internal server error occurred.", "detail": str(exc)},
        headers={
            "Access-Control-Allow-Origin": "https://mantle-atlas-two.vercel.app",
            "Access-Control-Allow-Credentials": "true",
        },
    )

app.include_router(api_router, prefix="/api", tags=["api"])


@app.get("/")
def root():
    return RedirectResponse(url="/docs")


@app.get("/health")
def health_check() -> dict[str, object]:
    rpc_client = get_mantle_rpc_client()
    return {
        "status": "ok",
        "app": settings.app_name,
        "rpc_url": settings.mantle_rpc_url,
        "rpc_connected": rpc_client.is_connected(),
    }


@app.get("/rpc/status")
def rpc_status() -> dict[str, object]:
    rpc_client = get_mantle_rpc_client()
    return {
        "chain_id": rpc_client.get_chain_id(),
        "latest_block": rpc_client.get_latest_block_number(),
        "connected": rpc_client.is_connected(),
    }
