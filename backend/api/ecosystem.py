from fastapi import APIRouter

from backend.data.defillama import get_mantle_protocols

router = APIRouter()


@router.get("/ecosystem")
def get_ecosystem() -> dict[str, object]:
    protocols = get_mantle_protocols()

    total_tvl = 0.0
    top_protocols = []

    for protocol in protocols:
        total_tvl += protocol.tvl
        top_protocols.append(
            {
                "name": protocol.name,
                "tvl": protocol.tvl,
                "category": protocol.category,
                "chain": protocol.chain,
                "tvl_growth_percentage": protocol.tvl_growth_percentage,
            }
        )

    top_protocols.sort(key=lambda item: float(item["tvl"]), reverse=True)

    return {
        "total_tvl": total_tvl,
        "protocol_count": len(protocols),
        "top_protocols": top_protocols[:10],
    }

