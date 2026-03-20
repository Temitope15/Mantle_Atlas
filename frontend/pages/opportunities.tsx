import Head from "next/head";
import Link from "next/link";
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
    <>
      <Head>
        <title>Mantle Atlas | Alpha Signals</title>
      </Head>
      <div className="mx-auto max-w-7xl px-6 py-12 relative overflow-hidden min-h-screen">
        {/* Decorative Orbs */}
        <div className="absolute top-[-150px] right-[10%] w-[600px] h-[600px] bg-mantle-500/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" />

        <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between relative z-10 animate-slide-up">
          <div className="max-w-3xl">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl mb-4 text-white">
              Alpha <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Signals</span>
            </h1>
            <p className="text-lg text-slate-400 font-light leading-relaxed">
              Monitor the highest-conviction yield opportunities across Mantle
              using combined yield, momentum, and liquidity-gap intelligence.
            </p>
          </div>
        </header>

        {topOpportunity && !loading && !error ? (
          <div className="mb-10 glass-panel rounded-3xl p-8 relative z-10 animate-slide-up animate-stagger-1 border-mantle-500/30 overflow-hidden group hover:premium-glow">
            <div className="absolute top-0 right-0 w-64 h-64 bg-mantle-500/10 blur-[80px] group-hover:bg-mantle-500/20 transition-colors" />
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-mantle-400">
              #1 Top Opportunity
            </p>
            <div className="grid gap-6 md:grid-cols-4 relative z-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-2">Protocol</p>
                <p className="text-3xl font-black text-white">
                  {topOpportunity.protocol}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-2">Pool / Asset</p>
                <p className="text-3xl font-black text-white">
                  {topOpportunity.asset || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-2">Yield APY</p>
                <p className="text-3xl font-black text-emerald-400 inline-block px-4 py-1.5 bg-emerald-400/10 rounded-xl border border-emerald-400/20">
                  {formatPercent(topOpportunity.apy)}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-2">Composite Score</p>
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-mantle-300 to-cyan-400">
                  {formatScore(topOpportunity.scores.opportunity_score)}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="glass-panel shadow-2xl rounded-3xl relative z-10 animate-slide-up animate-stagger-2">
          <div className="px-8 py-6 border-b border-glass-border">
            <h2 className="text-xl font-bold text-white">
              Signal Leaderboard
            </h2>
          </div>

          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center text-slate-300">
               <div className="w-10 h-10 border-4 border-mantle-500/30 border-t-mantle-400 rounded-full animate-spin mb-4" />
               <span className="font-medium animate-pulse">Computing Alpha Opportunities...</span>
            </div>
          ) : error ? (
            <div className="p-16 text-center text-red-400 font-bold">{error}</div>
          ) : opportunities.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              No opportunity data currently available on the network.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-black/20">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Protocol</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Asset</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">APY</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">TVL</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Opp Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border/40">
                  {opportunities.map((opportunity, index) => (
                    <tr
                      key={`${opportunity.protocol}-${opportunity.asset}-${index}`}
                      className="transition-colors hover:bg-white/[0.03]"
                    >
                      <td className="px-8 py-6">
                        <span className="text-lg font-bold text-white">
                          {opportunity.protocol}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-white/5 border border-white/5 rounded text-sm font-semibold tracking-wide text-slate-300">
                          {opportunity.asset || "N/A"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="font-black text-emerald-400">
                          {formatPercent(opportunity.apy)}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right font-bold text-slate-200">
                        {formatCurrency(opportunity.tvl)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-mantle-300 to-cyan-400 text-lg">
                          {formatScore(opportunity.scores.opportunity_score)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
