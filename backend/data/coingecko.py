from typing import Iterable, List

from backend.config import settings
from backend.models.token import Token
from backend.utils.http_client import http_client


def get_token_prices(token_ids: Iterable[str], vs_currency: str = "usd") -> List[Token]:
    unique_ids: dict[str, None] = {}

    for token_id in token_ids:
        normalized_token_id = token_id.strip()
        if normalized_token_id:
            unique_ids[normalized_token_id] = None

    if not unique_ids:
        return []

    payload = http_client.get(
        settings.coingecko_simple_price_url,
        params={
            "ids": ",".join(unique_ids.keys()),
            "vs_currencies": vs_currency,
        },
    )

    tokens: List[Token] = []

    for token_id in unique_ids:
        price_data = payload.get(token_id, {})
        price_value = price_data.get(vs_currency, 0.0)

        tokens.append(
            Token(
                symbol=token_id,
                price=float(price_value),
            )
        )

    return tokens
