const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export type ScoreBreakdown = {
  yield_score: number;
  gap_score: number;
  momentum_score: number;
  opportunity_score: number;
  volume_growth?: number;
};

export type ProtocolSummary = {
  name: string;
  tvl: number;
  category: string;
  chain: string;
  tvl_growth_percentage: number;
};

export type EcosystemResponse = {
  total_tvl: number;
  protocol_count: number;
  top_protocols: ProtocolSummary[];
};

export type OpportunityItem = {
  protocol: string;
  asset: string;
  apy: number;
  tvl: number;
  scores: ScoreBreakdown;
};

export type YieldItem = OpportunityItem;

export type LiquidityGapItem = OpportunityItem;

export type InsightsResponse = {
  insights: string[];
};

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function getEcosystem(): Promise<EcosystemResponse> {
  return apiGet<EcosystemResponse>("/api/ecosystem");
}

export async function getYields(): Promise<YieldItem[]> {
  return apiGet<YieldItem[]>("/api/yields");
}

export async function getLiquidityGaps(): Promise<{
  count: number;
  items: LiquidityGapItem[];
}> {
  return apiGet<{ count: number; items: LiquidityGapItem[] }>(
    "/api/liquidity-gaps"
  );
}

export async function getOpportunities(): Promise<OpportunityItem[]> {
  return apiGet<OpportunityItem[]>("/api/opportunities");
}

export async function getInsights(): Promise<InsightsResponse> {
  return apiGet<InsightsResponse>("/api/insights");
}
