from fastapi import APIRouter

from algorithms.opportunity_score import get_top_opportunities
from data.defillama import get_mantle_pools, get_mantle_protocols
from data.dexscreener import get_pool_volume_growth_index

router = APIRouter(tags=["opportunities"])


@router.get("/opportunities")
def get_opportunities(chain_id: str = "mantle") -> list[dict[str, object]]:
    pools = get_mantle_pools()
    protocols = get_mantle_protocols()

    results = get_top_opportunities(
        pools=pools,
        protocols=protocols,
        chain_id=chain_id,
    )
    volume_growth_by_pool = get_pool_volume_growth_index(
        pools=pools,
        chain_id=chain_id,
    )

    return [
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
    ]

