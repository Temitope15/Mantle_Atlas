from algorithms.liquidity_gap import calculate_gap_score
from algorithms.yield_finder import get_yield_score
from data.dexscreener import get_pool_volume_growth_index
from models.intelligence import IntelligenceResult, ScoreBreakdown
from models.pool import Pool
from models.protocol import Protocol


def _build_protocol_momentum_index(protocols: list[Protocol]) -> dict[str, float]:
    momentum_by_protocol: dict[str, float] = {}

    for protocol in protocols:
        momentum_by_protocol[protocol.name] = float(protocol.tvl_growth_percentage)

    return momentum_by_protocol


def get_top_opportunities(
    pools: list[Pool],
    protocols: list[Protocol],
    chain_id: str = "mantle",
) -> list[IntelligenceResult]:
    momentum_by_protocol = _build_protocol_momentum_index(protocols)
    volume_growth_by_pool = get_pool_volume_growth_index(
        pools=pools,
        chain_id=chain_id,
    )
    opportunities: list[IntelligenceResult] = []

    for pool in pools:
        pool_key = f"{pool.protocol}:{pool.asset}"
        yield_score = get_yield_score(pool.apy, pool.tvl)
        gap_score = calculate_gap_score(
            apy=pool.apy,
            tvl=pool.tvl,
            volume_growth=volume_growth_by_pool.get(pool_key),
        )
        momentum_score = momentum_by_protocol.get(pool.protocol, 0.0)
        opportunity_score = yield_score + momentum_score + gap_score

        opportunities.append(
            IntelligenceResult(
                protocol=pool.protocol,
                asset=pool.asset,
                apy=pool.apy,
                tvl=pool.tvl,
                scores=ScoreBreakdown(
                    yield_score=yield_score,
                    gap_score=gap_score,
                    momentum_score=momentum_score,
                    opportunity_score=opportunity_score,
                ),
            )
        )

    opportunities.sort(
        key=lambda item: item.scores.opportunity_score,
        reverse=True,
    )
    return opportunities
