import React from "react";

type OpportunityScores = {
  yield_score: number;
  gap_score: number;
  momentum_score: number;
  opportunity_score: number;
  volume_growth?: number;
};

export type OpportunityRow = {
  protocol: string;
  asset: string;
  apy: number;
  tvl: number;
  scores: OpportunityScores;
};

type OpportunitiesTableProps = {
  opportunities: OpportunityRow[];
};

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatScore(value: number): string {
  return value.toFixed(4);
}

import { Tooltip } from "../ui/Tooltip";
import { TOOLTIPS } from "../../utils/tooltipConstants";

export default function OpportunitiesTable({
  opportunities,
}: OpportunitiesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Protocol
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Asset
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Tooltip content={TOOLTIPS.APY}>
                  <span className="underline decoration-slate-400/30 decoration-dotted underline-offset-4">APY</span>
                </Tooltip>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Tooltip content={TOOLTIPS.TVL}>
                  <span className="underline decoration-slate-400/30 decoration-dotted underline-offset-4">TVL</span>
                </Tooltip>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Tooltip content={TOOLTIPS.OPPORTUNITY_SCORE}>
                  <span className="underline decoration-slate-400/30 decoration-dotted underline-offset-4">Opportunity Score</span>
                </Tooltip>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800 bg-slate-950">
            {opportunities.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-slate-400"
                >
                  No opportunities available.
                </td>
              </tr>
            ) : (
              opportunities.map((opportunity, index) => (
                <tr
                  key={`${opportunity.protocol}-${opportunity.asset}-${index}`}
                  className="transition-colors hover:bg-slate-900/60"
                >
                  <td className="px-4 py-4 text-sm font-medium text-white">
                    {opportunity.protocol}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-300">
                    {opportunity.asset || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-emerald-400">
                    {formatPercent(opportunity.apy)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-slate-300">
                    {formatCurrency(opportunity.tvl)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-cyan-400">
                    {formatScore(opportunity.scores.opportunity_score)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
