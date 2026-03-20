from fastapi import APIRouter

from algorithms.liquidity_gap import detect_liquidity_gaps
from algorithms.opportunity_score import get_top_opportunities
from algorithms.yield_finder import get_yield_ranked_pools
from data.defillama import get_mantle_pools, get_mantle_protocols
from data.dexscreener import get_pool_volume_growth_index

router = APIRouter(tags=["insights"])


def _format_protocol_list(protocols: list[str], limit: int = 3) -> str:
    unique_protocols: list[str] = []
    seen_protocols: dict[str, None] = {}

    for protocol in protocols:
        normalized_protocol = protocol.strip()
        if not normalized_protocol:
            continue

        lowered_protocol = normalized_protocol.lower()
        if lowered_protocol in seen_protocols:
            continue

        seen_protocols[lowered_protocol] = None
        unique_protocols.append(normalized_protocol)

        if len(unique_protocols) == limit:
            break

    if not unique_protocols:
        return "selected"

    if len(unique_protocols) == 1:
        return unique_protocols[0]

    if len(unique_protocols) == 2:
        return f"{unique_protocols[0]} and {unique_protocols[1]}"

    return f"{', '.join(unique_protocols[:-1])}, and {unique_protocols[-1]}"


def _build_yield_insight() -> str | None:
    pools = get_mantle_pools()
    ranked_pools = get_yield_ranked_pools(pools)

    if not ranked_pools:
        return None

    top_results = ranked_pools[:3]
    protocol_names = [result.protocol for result in top_results]
    protocol_text = _format_protocol_list(protocol_names)

    return (
        f"Strong yield conditions are concentrated in {protocol_text} pools on Mantle."
    )


def _build_liquidity_gap_insight() -> str | None:
    pools = get_mantle_pools()
    volume_growth_by_pool = get_pool_volume_growth_index(pools=pools, chain_id="mantle")
    gap_results = detect_liquidity_gaps(pools=pools, chain_id="mantle")

    if not gap_results:
        return None

    flagged_protocols: list[str] = []

    for result in gap_results:
        pool_key = f"{result.protocol}:{result.asset}"
        volume_growth = volume_growth_by_pool.get(pool_key, 0.0)

        if volume_growth > 0.0:
            flagged_protocols.append(result.protocol)

        if len(flagged_protocols) == 3:
            break

    if not flagged_protocols:
        flagged_protocols = [result.protocol for result in gap_results[:3]]

    protocol_text = _format_protocol_list(flagged_protocols)
    return f"High APY and low liquidity detected in {protocol_text} pools."


def _build_opportunity_insight() -> str | None:
    pools = get_mantle_pools()
    protocols = get_mantle_protocols()
    opportunities = get_top_opportunities(
        pools=pools,
        protocols=protocols,
        chain_id="mantle",
    )

    if not opportunities:
        return None

    top_results = opportunities[:3]
    protocol_names = [result.protocol for result in top_results]
    protocol_text = _format_protocol_list(protocol_names)

    return f"Top opportunity scores currently favor {protocol_text} across the Mantle ecosystem."


def _build_momentum_insight() -> str | None:
    protocols = get_mantle_protocols()
    positive_growth_protocols: list[str] = []

    for protocol in protocols:
        if protocol.tvl_growth_percentage > 0:
            positive_growth_protocols.append(protocol.name)

        if len(positive_growth_protocols) == 3:
            break

    if not positive_growth_protocols:
        return None

    protocol_text = _format_protocol_list(positive_growth_protocols)
    return f"Positive ecosystem momentum is visible in {protocol_text} as TVL growth remains elevated."


@router.get("/insights")
def get_insights() -> dict[str, list[str]]:
    insights: list[str] = []

    for insight_builder in (
        _build_yield_insight,
        _build_liquidity_gap_insight,
        _build_opportunity_insight,
        _build_momentum_insight,
    ):
        insight = insight_builder()
        if insight:
            insights.append(insight)

    return {"insights": insights}
