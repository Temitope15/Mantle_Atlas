from typing import Any

from backend.config import settings
from backend.models.pool import Pool
from backend.models.protocol import Protocol
from backend.utils.http_client import http_client

MANTLE_CHAIN = "Mantle"


def _to_float(value: Any) -> float:
    if isinstance(value, (int, float)):
        return float(value)
    return 0.0


def _to_string_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []

    items: list[str] = []

    for item in value:
        if isinstance(item, str):
            normalized_item = item.strip()
            if normalized_item:
                items.append(normalized_item)

    return items


def _is_mantle_protocol(item: dict[str, Any]) -> bool:
    chains = item.get("chains")
    if isinstance(chains, list):
        return MANTLE_CHAIN in chains
    return item.get("chain") == MANTLE_CHAIN


def _get_protocol_growth_percentage(item: dict[str, Any]) -> float:
    change_1d = item.get("change_1d")
    change_7d = item.get("change_7d")
    change_1m = item.get("change_1m")

    if isinstance(change_1d, (int, float)):
        return float(change_1d)
    if isinstance(change_7d, (int, float)):
        return float(change_7d)
    if isinstance(change_1m, (int, float)):
        return float(change_1m)

    current_tvl = _to_float(item.get("tvl"))
    previous_tvl = _to_float(item.get("tvlPrevDay"))

    if previous_tvl > 0:
        return ((current_tvl - previous_tvl) / previous_tvl) * 100.0

    return 0.0


def _extract_token_addresses(item: dict[str, Any]) -> list[str]:
    token_sources = (
        item.get("underlyingTokens"),
        item.get("underlying_tokens"),
        item.get("rewardTokens"),
        item.get("reward_tokens"),
    )

    seen_addresses: dict[str, None] = {}

    for source in token_sources:
        for token_address in _to_string_list(source):
            normalized_address = token_address.lower()
            if normalized_address not in seen_addresses:
                seen_addresses[normalized_address] = None

    return list(seen_addresses.keys())


def get_mantle_protocols() -> list[Protocol]:
    payload = http_client.get(settings.defillama_protocols_url)
    if not isinstance(payload, list):
        return []

    protocols: list[Protocol] = []

    for item in payload:
        if not isinstance(item, dict) or not _is_mantle_protocol(item):
            continue

        name = item.get("name")
        category = item.get("category")

        if not isinstance(name, str):
            continue

        protocols.append(
            Protocol(
                name=name,
                tvl=_to_float(item.get("tvl")),
                chain=MANTLE_CHAIN,
                category=category if isinstance(category, str) else "Unknown",
                tvl_growth_percentage=_get_protocol_growth_percentage(item),
            )
        )

    return protocols


def get_mantle_protocols_with_growth() -> list[dict[str, Any]]:
    payload = http_client.get(settings.defillama_protocols_url)
    if not isinstance(payload, list):
        return []

    protocols_with_growth: list[dict[str, Any]] = []

    for item in payload:
        if not isinstance(item, dict) or not _is_mantle_protocol(item):
            continue

        name = item.get("name")
        category = item.get("category")

        if not isinstance(name, str):
            continue

        protocols_with_growth.append(
            {
                "name": name,
                "tvl": _to_float(item.get("tvl")),
                "chain": MANTLE_CHAIN,
                "category": category if isinstance(category, str) else "Unknown",
                "tvl_prev_day": _to_float(item.get("tvlPrevDay")),
                "tvl_prev_week": _to_float(item.get("tvlPrevWeek")),
                "tvl_prev_month": _to_float(item.get("tvlPrevMonth")),
                "change_1d": _to_float(item.get("change_1d")),
                "change_7d": _to_float(item.get("change_7d")),
                "change_1m": _to_float(item.get("change_1m")),
                "tvl_growth_percentage": _get_protocol_growth_percentage(item),
            }
        )

    return protocols_with_growth


def get_mantle_pools() -> list[Pool]:
    payload = http_client.get(settings.defillama_pools_url)
    if not isinstance(payload, dict):
        return []

    data = payload.get("data")
    if not isinstance(data, list):
        return []

    pools: list[Pool] = []

    for item in data:
        if not isinstance(item, dict):
            continue

        if item.get("chain") != MANTLE_CHAIN:
            continue

        protocol = item.get("project")
        asset = item.get("symbol")

        if not isinstance(protocol, str) or not isinstance(asset, str):
            continue

        pools.append(
            Pool(
                protocol=protocol,
                asset=asset,
                apy=_to_float(item.get("apy")),
                tvl=_to_float(item.get("tvlUsd")),
                chain=MANTLE_CHAIN,
                token_addresses=_extract_token_addresses(item),
            )
        )

    return pools
