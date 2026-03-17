from pydantic import BaseModel


class Protocol(BaseModel):
    name: str
    tvl: float
    chain: str
    category: str
    tvl_growth_percentage: float = 0.0
