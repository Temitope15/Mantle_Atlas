from fastapi import APIRouter

from backend.algorithms.liquidity_gap import detect_liquidity_gaps
from backend.data.defillama import get_mantle_pools
from backend.data.dexscreener import get_pool_volume_growth_index

router = APIRouter(prefix="/api", tags=["liquidity-gaps"])


@router.get("/liquidity-gaps")
def get_liquidity_gaps(
    min_gap_score: float = 0.0,
    chain_id: str = "mantle",
) -> dict[str, object]:
    pools = get_mantle_pools()
    volume_growth_by_pool = get_pool_volume_growth_index(
        pools=pools,
        chain_id=chain_id,
    )
    results = detect_liquidity_gaps(
        pools=pools,
        chain_id=chain_id,
        min_gap_score=min_gap_score,
    )

    return {
        "count": len(results),
        "items": [
            {
                **result.model_dump(),
                "scores": {
                    **result.scores.model_dump(),
                    "volume_growth": volume_growth_by_pool.get(
                        f"{result.protocol}:{result.asset}",
                        0.0,
                    ),
                },
            }
            for result in results
        ],
    }
}
