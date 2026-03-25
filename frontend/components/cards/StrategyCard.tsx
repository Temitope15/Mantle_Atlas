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

import { Tooltip } from '../ui/Tooltip';
import { TOOLTIPS } from '../../utils/tooltipConstants';

export function StrategyCard({ opportunity, rank }: StrategyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const metadata = getProtocolMetadata(opportunity.protocol, opportunity.asset);

  return (
    <div
      className={`glass-card rounded-3xl p-6 transition-all duration-500 border group ${
        expanded
          ? "border-accent-cyan/40 bg-white/[0.04] shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
          : "border-white/5 hover:border-accent-cyan/20 hover:bg-white/[0.02] hover:premium-glow"
      }`}
    >
      {/* Simple View */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-5">
          {rank && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-dark-950 border border-white/10 text-slate-500 font-black group-hover:text-accent-cyan group-hover:border-accent-cyan/30 transition-all duration-500">
              {rank}
            </div>
          )}
          <div>
            <h3 className="text-xl font-black text-white mb-1 group-hover:text-accent-cyan transition-colors">
              {metadata.actionCopy}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/5 text-slate-400">
                {opportunity.asset || "Multi-Asset"}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/5 text-slate-400">
                {opportunity.protocol}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-10">
          <div className="text-right">
            <Tooltip content={TOOLTIPS.APY}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 underline decoration-slate-500/30 decoration-dotted underline-offset-4">
                Expected APY
              </p>
            </Tooltip>
            <p className="text-2xl font-black text-emerald-400">
              {formatPercent(opportunity.apy)}
            </p>
          </div>

          <button
            className={`w-10 h-10 flex items-center justify-center rounded-2xl border transition-all duration-500 ${
              expanded 
                ? 'bg-accent-cyan border-accent-cyan text-dark-950 rotate-180' 
                : 'bg-white/5 border-white/5 text-slate-500 group-hover:text-white group-hover:border-white/20'
            }`}
            aria-label="Toggle details"
          >
            <svg
              className="w-5 h-5"
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
        <div className="mt-8 pt-8 border-t border-white/5 animate-slide-up origin-top text-left">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Tooltip content={TOOLTIPS.ALPHA_SIGNALS}>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent-cyan flex items-center gap-2 underline decoration-accent-cyan/30 decoration-dotted underline-offset-8">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
                Alpha Quantitative Metrics
              </h4>
            </Tooltip>
            
            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg bg-dark-950 text-slate-400 border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-950 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
              <Tooltip content={TOOLTIPS.TVL}>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1 underline decoration-slate-600/30 decoration-dotted underline-offset-4">
                  Total Liquidity
                </p>
              </Tooltip>
              <p className="text-xl font-black text-slate-200">
                {formatCurrency(opportunity.tvl)}
              </p>
            </div>
            <div className="bg-dark-950 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
              <Tooltip content={TOOLTIPS.METRICS}>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1 underline decoration-slate-600/30 decoration-dotted underline-offset-4">
                  Yield Score
                </p>
              </Tooltip>
              <p className="text-xl font-black text-slate-200">
                {formatScore(opportunity.scores.yield_score)}
              </p>
            </div>
            <div className="bg-dark-950 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
              <Tooltip content={TOOLTIPS.METRICS}>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1 underline decoration-slate-600/30 decoration-dotted underline-offset-4">
                  Momentum Score
                </p>
              </Tooltip>
              <p className="text-xl font-black text-slate-200">
                {formatScore(opportunity.scores.momentum_score)}
              </p>
            </div>
            <div className="bg-dark-950 rounded-2xl p-5 border border-accent-cyan/20 group/score relative overflow-hidden">
              <div className="absolute inset-0 bg-accent-cyan/5 opacity-0 group-hover/score:opacity-100 transition-opacity"></div>
              <Tooltip content={TOOLTIPS.OPPORTUNITY_SCORE}>
                <p className="text-[10px] font-black uppercase tracking-widest text-accent-cyan/80 mb-1 relative z-10 underline decoration-accent-cyan/30 decoration-dotted underline-offset-4">
                  Opp Score
                </p>
              </Tooltip>
              <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-cyan relative z-10">
                {formatScore(opportunity.scores.opportunity_score)}
              </p>
            </div>
          </div>

          <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-6 flex gap-4 items-start group/il relative">
            <div className="mt-0.5 shrink-0 w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
              <svg
                className="w-5 h-5"
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
              <Tooltip content={TOOLTIPS.IMPERMANENT_LOSS}>
                <p className="text-xs font-black uppercase tracking-widest text-rose-300 mb-2 underline decoration-rose-300/30 decoration-dotted underline-offset-4">
                  Smart Contract Risk & Impermanent Loss
                </p>
              </Tooltip>
              <p className="text-xs text-rose-200/60 leading-relaxed font-medium">
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