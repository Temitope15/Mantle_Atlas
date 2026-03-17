from backend.models.intelligence import IntelligenceResult, ScoreBreakdown
from backend.models.pool import Pool

TVL_CAP = 10_000_000.0


def get_tvl_weight(tvl: float) -> float:
    if tvl <= 0:
        return 0.0
    return min(tvl / TVL_CAP, 1.0)


def get_yield_score(apy: float, tvl: float) -> float:
    return apy * get_tvl_weight(tvl)


def build_yield_result(pool: Pool) -> IntelligenceResult:
    yield_score = get_yield_score(pool.apy, pool.tvl)

    return IntelligenceResult(
        protocol=pool.protocol,
        asset=pool.asset,
        apy=pool.apy,
        tvl=pool.tvl,
        scores=ScoreBreakdown(
            yield_score=yield_score,
            gap_score=0.0,
            momentum_score=0.0,
            opportunity_score=yield_score,
        ),
    )


def get_yield_ranked_pools(pools: list[Pool]) -> list[IntelligenceResult]:
    ranked_pools: list[IntelligenceResult] = []

    for pool in pools:
        ranked_pools.append(build_yield_result(pool))

    ranked_pools.sort(
        key=lambda item: item.scores.yield_score,
        reverse=True,
    )

    return ranked_pools
