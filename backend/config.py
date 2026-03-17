from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "Mantle Atlas"
    mantle_rpc_url: str = "https://mantle-rpc.publicnode.com"
    defillama_protocols_url: str = "https://api.llama.fi/protocols"
    defillama_pools_url: str = "https://yields.llama.fi/pools"
    coingecko_simple_price_url: str = "https://api.coingecko.com/api/v3/simple/price"
    dexscreener_base_url: str = "https://api.dexscreener.com"
    http_timeout_seconds: int = 15
    http_retries: int = 3
    http_backoff_seconds: float = 1.0


settings = Settings()
