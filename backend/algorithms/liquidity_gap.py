from backend.data.dexscreener import get_pool_volume_growth_index
from backend.models.intelligence import IntelligenceResult, ScoreBreakdown
from backend.models.pool import Pool


def _build_pool_key(protocol: str, asset: str) -> str:
    return f"{protocol}:{asset}"


def calculate_gap_score(
    apy: float,
    tvl: float,
    volume_growth: float | None = None,
) -> float:
    if tvl <= 0:
        return 0.0

    if volume_growth is None or volume_growth <= 0:
        return apy / tvl

    return (apy * volume_growth) / tvl


def detect_liquidity_gaps(
    pools: list[Pool],
    chain_id: str = "mantle",
    min_gap_score: float = 0.0,
) -> list[IntelligenceResult]:
    volume_growth_by_pool = get_pool_volume_growth_index(
        pools=pools,
        chain_id=chain_id,
    )
    results: list[IntelligenceResult] = []

    for pool in pools:
        pool_key = _build_pool_key(pool.protocol, pool.asset)
        volume_growth = volume_growth_by_pool.get(pool_key)
        gap_score = calculate_gap_score(
            apy=pool.apy,
            tvl=pool.tvl,
            volume_growth=volume_growth,
        )

        if gap_score < min_gap_score:
            continue

        results.append(
            IntelligenceResult(
                protocol=pool.protocol,
                asset=pool.asset,
                apy=pool.apy,
                tvl=pool.tvl,
                scores=ScoreBreakdown(
                    yield_score=0.0,
                    gap_score=gap_score,
                    momentum_score=0.0,
                    opportunity_score=gap_score,
                ),
            )
        )

    results.sort(
        key=lambda item: item.scores.gap_score,
        reverse=True,
    )
    return results
