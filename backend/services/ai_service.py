import heapq
import json
from google import genai

from backend.config import settings
from backend.data.defillama import get_mantle_protocols_with_growth, get_mantle_pools
from backend.models.ai_schema import AIAnalysisResponse

def fetch_and_preprocess_data() -> list[dict]:
    protocols = get_mantle_protocols_with_growth()
    pools = get_mantle_pools()
    
    protocol_stats = {}
    
    # Dictionary lookups to group assets by protocol - O(N) complexity
    for p in protocols:
        name = p.get("name", "")
        if not name:
            continue
        
        protocol_stats[name] = {
            "protocol": name,
            "tvl": p.get("tvl", 0.0),
            "change_1d": p.get("change_1d", 0.0),
            "max_apy": 0.0,
        }
        
    for p in pools:
        name = p.protocol
        if not name:
            continue
            
        if name in protocol_stats:
            if p.apy > protocol_stats[name]["max_apy"]:
                protocol_stats[name]["max_apy"] = p.apy
        else:
            protocol_stats[name] = {
                "protocol": name,
                "tvl": p.tvl,
                "change_1d": 0.0,
                "max_apy": p.apy,
            }

    # Single-pass filtering to isolate top 10 by TVL and top 5 by APY using min-heaps
    tvl_heap = []
    apy_heap = []
    
    for item in protocol_stats.values():
        val_tvl = item["tvl"]
        val_apy = item["max_apy"]
        
        heapq.heappush(tvl_heap, (val_tvl, item["protocol"], item))
        if len(tvl_heap) > 10:
            heapq.heappop(tvl_heap)
            
        heapq.heappush(apy_heap, (val_apy, item["protocol"], item))
        if len(apy_heap) > 5:
            heapq.heappop(apy_heap)
            
    final_dict = {}
    for _, _, item in tvl_heap:
        final_dict[item["protocol"]] = item
    for _, _, item in apy_heap:
        final_dict[item["protocol"]] = item
        
    return list(final_dict.values())

def generate_defi_strategy() -> dict:
    preprocessed_data = fetch_and_preprocess_data()
    
    system_prompt = """You are an elite DeFi Strategist specializing in the Mantle ecosystem. 
Your objective is to analyze the provided real-time protocol data and output a strictly typed JSON payload containing:
- ecosystem_summary: A 2-sentence market health update on the Mantle ecosystem.
- top_strategies: An array of exactly 3 actionable strategies, detailing the exact conversion path (e.g., "ETH -> mETH -> INIT Capital").
- liquidity_gaps: Identification of exactly 1 under-supplied pool with high yield potential.

Output MUST strictly adhere to the requested JSON schema and act exclusively as a DeFi strategist."""

    prompt = f"{system_prompt}\n\nMantle Ecosystem Data:\n{json.dumps(preprocessed_data, indent=2)}"
    
    client = genai.Client(api_key=settings.gemini_api_key)
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=genai.types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=AIAnalysisResponse,
            temperature=0.2,
        ),
    )
    
    if not response.text:
        return {}
        
    return json.loads(response.text)
