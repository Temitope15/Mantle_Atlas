from fastapi import APIRouter

from backend.api.ecosystem import router as ecosystem_router
from backend.api.insights import router as insights_router
from backend.api.liquidity_gaps import router as liquidity_gaps_router
from backend.api.opportunities import router as opportunities_router
from backend.api.yields import router as yields_router

api_router = APIRouter()

api_router.include_router(ecosystem_router)
api_router.include_router(yields_router)
api_router.include_router(liquidity_gaps_router)
api_router.include_router(opportunities_router)
api_router.include_router(insights_router)
