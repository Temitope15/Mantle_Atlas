from pydantic import BaseModel


class ScoreBreakdown(BaseModel):
    yield_score: float = 0.0
    gap_score: float = 0.0
    momentum_score: float = 0.0
    opportunity_score: float = 0.0


class IntelligenceResult(BaseModel):
    protocol: str
    asset: str
    apy: float
    tvl: float
    scores: ScoreBreakdown
