import React, { useState } from "react";
import { getProtocolMetadata } from "../../utils/protocolMap";

type OpportunityScores = {
  yield_score: number;
  gap_score: number;
  momentum_score: number;
  opportunity_score: number;
  volume_growth?: number;
};

export type OpportunityItem = {
  protocol: string;
  asset: string;
  apy: number;
  tvl: number;
  scores: OpportunityScores;
};

interface StrategyCardProps {
  opportunity: OpportunityItem;
  rank?: number;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

const formatScore = (value: number): string => {
  return value.toFixed(4);
};

export function StrategyCard({ opportunity, rank }: StrategyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const metadata = getProtocolMetadata(opportunity.protocol, opportunity.asset);

  return (
    <div
      className={`glass-card rounded-3xl p-6 transition-all duration-300 border ${
        expanded
          ? "border-mantle-500/50 bg-white/[0.04]"
          : "border-glass-border hover:bg-white/[0.02] hover:premium-glow"
      }`}
    >
      {/* Simple View */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          {rank && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-mantle-500/20 to-cyan-600/20 border border-mantle-500/30 text-mantle-400 font-bold">
              {rank}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {metadata.actionCopy}
            </h3>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                {opportunity.asset || "Multi-Asset"}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                {opportunity.protocol}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6">
          <div className="text-right">
            <p className="text-sm uppercase tracking-widest text-slate-400 font-semibold mb-1">
              Expected APY
            </p>
            <p className="text-2xl font-black text-emerald-400">
              {formatPercent(opportunity.apy)}
            </p>
          </div>

          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Toggle details"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable Alpha View */}
      {expanded && (
        <div className="mt-6 pt-6 border-t border-glass-border/50 animate-slide-up origin-top">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-mantle-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-mantle-400 animate-pulse"></span>
              Alpha Quantitative Metrics
            </h4>
            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-mantle-500/10 text-mantle-300 border border-mantle-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
                Total Liquidity
              </p>
              <p className="text-lg font-bold text-slate-200">
                {formatCurrency(opportunity.tvl)}
              </p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
                Yield Score
              </p>
              <p className="text-lg font-bold text-slate-200">
                {formatScore(opportunity.scores.yield_score)}
              </p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
                Momentum Score
              </p>
              <p className="text-lg font-bold text-slate-200">
                {formatScore(opportunity.scores.momentum_score)}
              </p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-cyan-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-mantle-500/10 to-cyan-500/10 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-xs uppercase tracking-widest text-cyan-400/80 font-semibold mb-1 relative z-10">
                Opp Score
              </p>
              <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-mantle-300 to-cyan-400 relative z-10">
                {formatScore(opportunity.scores.opportunity_score)}
              </p>
            </div>
          </div>

          <div className="bg-rose-950/10 border border-rose-500/20 rounded-xl p-4 flex gap-3 items-start">
            <div className="mt-0.5 shrink-0">
              <svg
                className="w-5 h-5 text-rose-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-rose-200 mb-1">
                Smart Contract Risk Notice
              </p>
              <p className="text-xs text-rose-300/80 leading-relaxed">
                {metadata.riskProfile === "High Risk"
                  ? "This strategy involves highly volatile pairs, complex algorithmic mechanisms, or un-audited dependencies. Impermanent loss risk is significant."
                  : metadata.riskProfile === "Medium Risk"
                  ? "This strategy depends on multiple smart contracts and liquidity constraints. Regular monitoring is advised."
                  : "While considered low risk, this strategy is still susceptible to stablecoin depegs and general structural protocol risks."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
