from fastapi import APIRouter
from models.ai_schema import AIAnalysisResponse
from services.ai_service import generate_defi_strategy

router = APIRouter(prefix="/ai", tags=["ai"])

@router.get("/analysis", response_model=AIAnalysisResponse)
def get_ai_analysis():
    """Returns AI-generated DeFi strategies and market gaps for the Mantle ecosystem."""
    data = generate_defi_strategy()
    return data
