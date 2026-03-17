from fastapi import APIRouter

from backend.algorithms.yield_finder import get_yield_ranked_pools
from backend.data.defillama import get_mantle_pools

router = APIRouter(prefix="/api", tags=["yields"])


@router.get("/yields")
def get_yields() -> list[dict[str, object]]:
    pools = get_mantle_pools()
    results = get_yield_ranked_pools(pools)
    return [result.model_dump() for result in results]
