export type RiskProfile = "Low Risk" | "Medium Risk" | "High Risk";

export interface ProtocolMetadata {
  actionCopy: string;
  riskProfile: RiskProfile;
  tags: string[];
}

// O(1) dictionary mapping for protocol metadata extraction
export const PROTOCOL_MAP: Record<string, ProtocolMetadata> = {
  "Merchant Moe": {
    actionCopy: "Provide Liquidity on Merchant Moe",
    riskProfile: "High Risk",
    tags: ["DEX", "Volatile Pairs"],
  },
  "Agni Finance": {
    actionCopy: "Trade & Earn on Agni Finance",
    riskProfile: "High Risk",
    tags: ["DEX", "Yield Farming"],
  },
  "Ondo": {
    actionCopy: "Earn Real World Yield with Ondo",
    riskProfile: "Low Risk",
    tags: ["RWA", "Stable Returns"],
  },
  "Mantle LSP": {
    actionCopy: "Stake MNT for Liquid Yield",
    riskProfile: "Low Risk",
    tags: ["Liquid Staking", "Native Asset"],
  },
  Meth: {
    actionCopy: "Stake ETH for mETH Yield",
    riskProfile: "Low Risk",
    tags: ["LSD", "Ethereum"],
  },
  Lendle: {
    actionCopy: "Supply Assets on Lendle",
    riskProfile: "Medium Risk",
    tags: ["Lending", "Borrowing"],
  },
  Stargate: {
    actionCopy: "Provide Stable Liquidity on Stargate",
    riskProfile: "Low Risk",
    tags: ["Cross-Chain", "Stablecoins"],
  },
  Pendle: {
    actionCopy: "Trade Yield on Pendle",
    riskProfile: "High Risk",
    tags: ["Yield Trading", "Derivatives"],
  },
  Aurelius: {
    actionCopy: "Mint aUSD on Aurelius",
    riskProfile: "Medium Risk",
    tags: ["CDP", "Stablecoin"],
  },
  Initia: {
    actionCopy: "Interact with Initia ecosystem",
    riskProfile: "Medium Risk",
    tags: ["DeFi", "Ecosystem"],
  },
  Butter: {
    actionCopy: "Swap and Earn on Butter",
    riskProfile: "High Risk",
    tags: ["DEX", "Aggregator"],
  },
  FusionX: {
    actionCopy: "Provide Liquidity on FusionX",
    riskProfile: "High Risk",
    tags: ["DEX", "Concentrated Liquidity"],
  },
  Circuit: {
    actionCopy: "Trade Perps on Circuit",
    riskProfile: "High Risk",
    tags: ["Perpetuals", "Derivatives"],
  },
  Tsunami: {
    actionCopy: "Trade Margin on Tsunami",
    riskProfile: "High Risk",
    tags: ["Perpetuals", "Leverage"],
  },
  Looper: {
    actionCopy: "Leverage Yield on Looper",
    riskProfile: "High Risk",
    tags: ["Leveraged Farming", "Yield"],
  },
  Ethena: {
    actionCopy: "Earn USDe Yield Validation",
    riskProfile: "Low Risk",
    tags: ["Delta Neutral", "Stablecoin"],
  },
};

/**
 * Performant O(1) lookup to get actionable copy and risk
 * profile for a specific protocol.
 */
export function getProtocolMetadata(
  protocolId: string,
  assetId?: string
): ProtocolMetadata {
  const baseData = PROTOCOL_MAP[protocolId];

  if (baseData) {
    // Edge case handling for assets commonly functioning as stablecoins
    if (
      baseData.riskProfile !== "Low Risk" &&
      assetId &&
      (assetId.includes("USDC") ||
        assetId.includes("USDT") ||
        assetId.includes("DAI")) &&
      !assetId.includes("-") // ensure it's not a volatile pair like USDC-MNT
    ) {
      return {
        ...baseData,
        riskProfile: "Low Risk",
        tags: [...baseData.tags, "Stable Asset"],
      };
    }
    return baseData;
  }

  // Fallback for unknown protocols dynamically
  const isLikelyStable = assetId
    ? (assetId.includes("USDC") ||
        assetId.includes("USDT") ||
        assetId.includes("DAI")) &&
      !assetId.includes("-")
    : false;

  return {
    actionCopy: `Earn Yield on ${protocolId || "Protocol"}`,
    riskProfile: isLikelyStable ? "Low Risk" : "Medium Risk",
    tags: ["DeFi", "Yield Opportunity"],
  };
}
