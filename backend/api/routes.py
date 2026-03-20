from fastapi import APIRouter

from api.ecosystem import router as ecosystem_router
from api.insights import router as insights_router
from api.liquidity_gaps import router as liquidity_gaps_router
from api.opportunities import router as opportunities_router
from api.yields import router as yields_router
from api.ai_analysis import router as ai_analysis_router

api_router = APIRouter()

api_router.include_router(ecosystem_router)
api_router.include_router(yields_router)
api_router.include_router(liquidity_gaps_router)
api_router.include_router(opportunities_router)
api_router.include_router(insights_router)
api_router.include_router(ai_analysis_router)
