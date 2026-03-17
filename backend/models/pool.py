from pydantic import BaseModel, Field


class Pool(BaseModel):
    protocol: str
    asset: str
    apy: float
    tvl: float
    chain: str
    token_addresses: list[str] = Field(default_factory=list)
