from typing import Any

from backend.config import settings
from backend.models.pool import Pool
from backend.utils.http_client import HTTPClient

DEXSCREENER_BATCH_SIZE = 30
http_client = HTTPClient()


def _chunk_addresses(token_addresses: list[str], chunk_size: int) -> list[list[str]]:
    chunks: list[list[str]] = []
    current_chunk: list[str] = []

    for token_address in token_addresses:
        address = token_address.strip()
        if not address:
            continue

        current_chunk.append(address)

        if len(current_chunk) == chunk_size:
            chunks.append(current_chunk)
            current_chunk = []

    if current_chunk:
        chunks.append(current_chunk)

    return chunks


def _safe_float(value: object) -> float:
    if isinstance(value, (int, float)):
        return float(value)

    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            return 0.0

    return 0.0


def _normalize_address(address: str) -> str:
    return address.strip().lower()


def _normalize_pair(pair: dict[str, Any]) -> dict[str, Any]:
    base_token = pair.get("baseToken")
    quote_token = pair.get("quoteToken")
    liquidity = pair.get("liquidity")
    volume = pair.get("volume")
    txns = pair.get("txns")
    price_change = pair.get("priceChange")
    info = pair.get("info")
    boosts = pair.get("boosts")

    if not isinstance(base_token, dict):
        base_token = {}
    if not isinstance(quote_token, dict):
        quote_token = {}
    if not isinstance(liquidity, dict):
        liquidity = {}
    if not isinstance(volume, dict):
        volume = {}
    if not isinstance(txns, dict):
        txns = {}
    if not isinstance(price_change, dict):
        price_change = {}
    if not isinstance(info, dict):
        info = {}
    if not isinstance(boosts, dict):
        boosts = {}

    return {
        "chain_id": pair.get("chainId"),
        "dex_id": pair.get("dexId"),
        "pair_address": pair.get("pairAddress"),
        "url": pair.get("url"),
        "labels": pair.get("labels", []),
        "base_token": {
            "address": base_token.get("address"),
            "symbol": base_token.get("symbol"),
            "name": base_token.get("name"),
        },
        "quote_token": {
            "address": quote_token.get("address"),
            "symbol": quote_token.get("symbol"),
            "name": quote_token.get("name"),
        },
        "price_native": pair.get("priceNative"),
        "price_usd": pair.get("priceUsd"),
        "price_change": {
            "m5": _safe_float(price_change.get("m5")),
            "h1": _safe_float(price_change.get("h1")),
            "h6": _safe_float(price_change.get("h6")),
            "h24": _safe_float(price_change.get("h24")),
        },
        "liquidity": {
            "usd": _safe_float(liquidity.get("usd")),
            "base": _safe_float(liquidity.get("base")),
            "quote": _safe_float(liquidity.get("quote")),
        },
        "volume": {
            "m5": _safe_float(volume.get("m5")),
            "h1": _safe_float(volume.get("h1")),
            "h6": _safe_float(volume.get("h6")),
            "h24": _safe_float(volume.get("h24")),
        },
        "transactions": txns,
        "fdv": _safe_float(pair.get("fdv")),
        "market_cap": _safe_float(pair.get("marketCap")),
        "pair_created_at": pair.get("pairCreatedAt"),
        "info": info,
        "boosts": boosts,
    }


def _extract_pool_token_addresses(pools: list[Pool]) -> list[str]:
    seen_addresses: dict[str, None] = {}
    token_addresses: list[str] = []

    for pool in pools:
        for token_address in pool.token_addresses:
            normalized_address = _normalize_address(token_address)
            if not normalized_address:
                continue

            if normalized_address in seen_addresses:
                continue

            seen_addresses[normalized_address] = None
            token_addresses.append(token_address.strip())

    return token_addresses


def _calculate_volume_growth(pair: dict[str, Any]) -> float:
    volume = pair.get("volume")
    if not isinstance(volume, dict):
        return 0.0

    volume_h24 = _safe_float(volume.get("h24"))
    volume_h6 = _safe_float(volume.get("h6"))
    volume_h1 = _safe_float(volume.get("h1"))

    baseline_volume = volume_h24 - volume_h6
    if baseline_volume <= 0.0:
        baseline_volume = volume_h1

    if volume_h6 <= 0.0 or baseline_volume <= 0.0:
        return 0.0

    return volume_h6 / baseline_volume


def get_liquidity_pairs(
    token_addresses: list[str],
    chain_id: str = "mantle",
) -> list[dict[str, Any]]:
    if not token_addresses:
        return []

    unique_addresses: dict[str, None] = {}

    for token_address in token_addresses:
        normalized_address = _normalize_address(token_address)
        if normalized_address:
            unique_addresses[normalized_address] = None

    if not unique_addresses:
        return []

    seen_pairs: dict[str, dict[str, Any]] = {}

    for address_batch in _chunk_addresses(
        list(unique_addresses.keys()),
        DEXSCREENER_BATCH_SIZE,
    ):
        joined_addresses = ",".join(address_batch)
        url = f"{settings.dexscreener_base_url}/tokens/v1/{chain_id}/{joined_addresses}"
        response = http_client.get(url)

        if not isinstance(response, list):
            continue

        for pair in response:
            if not isinstance(pair, dict):
                continue

            pair_address = pair.get("pairAddress")
            if not isinstance(pair_address, str) or not pair_address:
                continue

            seen_pairs[pair_address] = _normalize_pair(pair)

    return list(seen_pairs.values())


def get_volume_growth_index(
    token_addresses: list[str],
    chain_id: str = "mantle",
) -> dict[str, float]:
    pairs = get_liquidity_pairs(
        token_addresses=token_addresses,
        chain_id=chain_id,
    )

    volume_growth_by_address: dict[str, float] = {}

    for pair in pairs:
        growth_score = _calculate_volume_growth(pair)

        base_token = pair.get("base_token")
        if isinstance(base_token, dict):
            base_address = base_token.get("address")
            if isinstance(base_address, str) and base_address.strip():
                normalized_base = _normalize_address(base_address)
                current_growth = volume_growth_by_address.get(normalized_base, 0.0)
                if growth_score > current_growth:
                    volume_growth_by_address[normalized_base] = growth_score

        quote_token = pair.get("quote_token")
        if isinstance(quote_token, dict):
            quote_address = quote_token.get("address")
            if isinstance(quote_address, str) and quote_address.strip():
                normalized_quote = _normalize_address(quote_address)
                current_growth = volume_growth_by_address.get(normalized_quote, 0.0)
                if growth_score > current_growth:
                    volume_growth_by_address[normalized_quote] = growth_score

    return volume_growth_by_address


def get_pool_volume_growth_index(
    pools: list[Pool],
    chain_id: str = "mantle",
) -> dict[str, float]:
    token_addresses = _extract_pool_token_addresses(pools)
    if not token_addresses:
        return {}

    volume_growth_by_address = get_volume_growth_index(
        token_addresses=token_addresses,
        chain_id=chain_id,
    )

    volume_growth_by_pool: dict[str, float] = {}

    for pool in pools:
        pool_key = f"{pool.protocol}:{pool.asset}"
        max_growth = 0.0

        for token_address in pool.token_addresses:
            normalized_address = _normalize_address(token_address)
            if not normalized_address:
                continue

            growth_score = volume_growth_by_address.get(normalized_address, 0.0)
            if growth_score > max_growth:
                max_growth = growth_score

        volume_growth_by_pool[pool_key] = max_growth

    return volume_growth_by_pool
