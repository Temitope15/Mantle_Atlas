import { useEffect, useMemo, useState } from "react";
import { getOpportunities } from "../services/api";

type OpportunityScores = {
  yield_score: number;
  gap_score: number;
  momentum_score: number;
  opportunity_score: number;
  volume_growth?: number;
};

type Opportunity = {
  protocol: string;
  asset: string;
  apy: number;
  tvl: number;
  scores: OpportunityScores;
};

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

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getOpportunities();
        setOpportunities(data);
      } catch (err) {
        setError("Failed to load Mantle opportunities.");
      } finally {
        setLoading(false);
      }
    };

    void loadOpportunities();
  }, []);

  const topOpportunity = useMemo(() => {
    if (opportunities.length === 0) {
      return null;
    }

    return opportunities[0];
  }, [opportunities]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
            Mantle Atlas
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            Ranked Opportunities
          </h1>
          <p className="max-w-3xl text-slate-300">
            Monitor the highest-conviction yield opportunities across Mantle
            using combined yield, momentum, and liquidity-gap intelligence.
          </p>
        </div>

        {topOpportunity && !loading && !error ? (
          <div className="mb-8 rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-6 shadow-lg shadow-cyan-950/30">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Top Opportunity
            </p>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-slate-400">Protocol</p>
                <p className="text-xl font-semibold text-white">
                  {topOpportunity.protocol}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Asset</p>
                <p className="text-xl font-semibold text-white">
                  {topOpportunity.asset || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">APY</p>
                <p className="text-xl font-semibold text-emerald-400">
                  {formatPercent(topOpportunity.apy)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Opportunity Score</p>
                <p className="text-xl font-semibold text-cyan-300">
                  {formatScore(topOpportunity.scores.opportunity_score)}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-slate-950/40">
          <div className="border-b border-slate-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              Opportunities Table
            </h2>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-slate-300">Loading opportunities...</div>
          ) : error ? (
            <div className="px-6 py-10 text-red-400">{error}</div>
          ) : opportunities.length === 0 ? (
            <div className="px-6 py-10 text-slate-300">
              No opportunity data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-900">
                  <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                    <th className="px-6 py-4">Protocol</th>
                    <th className="px-6 py-4">Asset</th>
                    <th className="px-6 py-4">APY</th>
                    <th className="px-6 py-4">TVL</th>
                    <th className="px-6 py-4">Opportunity Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {opportunities.map((opportunity, index) => (
                    <tr
                      key={`${opportunity.protocol}-${opportunity.asset}-${index}`}
                      className="transition hover:bg-slate-800/60"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {opportunity.protocol}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {opportunity.asset || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-emerald-400">
                        {formatPercent(opportunity.apy)}
                      </td>
                      <td className="px-6 py-4 text-slate-200">
                        {formatCurrency(opportunity.tvl)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-cyan-300">
                        {formatScore(opportunity.scores.opportunity_score)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
