from pydantic import BaseModel, Field


class Strategy(BaseModel):
    conversion_path: str = Field(
        description="Exact conversion path (e.g., 'ETH -> mETH -> INIT Capital')"
    )
    description: str = Field(
        description="Actionable description of the strategy detailing how to execute it."
    )


class LiquidityGap(BaseModel):
    pool: str = Field(
        description="Under-supplied pool name or token pair (e.g., 'USDT/USDC')"
    )
    rationale: str = Field(
        description="Why this pool has high yield potential and represents a liquidity gap."
    )


class AIAnalysisResponse(BaseModel):
    ecosystem_summary: str = Field(
        description="A 2-sentence market health update on the Mantle ecosystem."
    )
    top_strategies: list[Strategy] = Field(
        description="Array of exactly 3 actionable strategies."
    )
    liquidity_gaps: list[LiquidityGap] = Field(
        description="Identification of exactly 1 under-supplied pool with high yield potential."
    )
