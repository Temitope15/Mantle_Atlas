from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    class Config:
        env_file = ".env"
    app_name: str = "Mantle Atlas"
    mantle_rpc_url: str = "https://mantle-rpc.publicnode.com"
    defillama_protocols_url: str = "https://defillama-datasets.llama.fi/lite/v2/protocols"
    defillama_pools_url: str = "https://yields.llama.fi/pools"
    coingecko_simple_price_url: str = "https://api.coingecko.com/api/v3/simple/price"
    dexscreener_base_url: str = "https://api.dexscreener.com"
    http_timeout_seconds: int = 15
    http_retries: int = 3
    http_backoff_seconds: float = 1.0
    gemini_api_key: str = ""


settings = Settings()
