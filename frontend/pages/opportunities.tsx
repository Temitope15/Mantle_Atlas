import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getOpportunities } from "../services/api";
import { StrategyCard, OpportunityItem as StrategyCardOpp } from "../components/cards/StrategyCard";
import { getProtocolMetadata, RiskProfile } from "../utils/protocolMap";

type OpportunityScores = {
  yield_score: number;
  gap_score: number;
  momentum_score: number;
  opportunity_score: number;
  volume_growth?: number;
};

type Opportunity = StrategyCardOpp;

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

  const groupedOpportunities = useMemo(() => {
    const groups: Record<RiskProfile, Opportunity[]> = {
      "Low Risk": [],
      "Medium Risk": [],
      "High Risk": [],
    };

    for (const opp of opportunities) {
       const meta = getProtocolMetadata(opp.protocol, opp.asset);
       if (groups[meta.riskProfile]) {
         groups[meta.riskProfile].push(opp);
       }
    }

    return groups;
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
            <div className="p-8 pb-12 flex flex-col gap-10">
               {groupedOpportunities["Low Risk"].length > 0 && (
                 <div>
                   <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                     🟢 Low Risk / Stable Strategies
                   </h3>
                   <div className="grid gap-4">
                     {groupedOpportunities["Low Risk"].map((opp, idx) => (
                        <StrategyCard key={`low-${opp.protocol}-${opp.asset}-${idx}`} opportunity={opp} />
                     ))}
                   </div>
                 </div>
               )}
               
               {groupedOpportunities["Medium Risk"].length > 0 && (
                 <div>
                   <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                     🟡 Medium Risk / Neutral Strategies
                   </h3>
                   <div className="grid gap-4">
                     {groupedOpportunities["Medium Risk"].map((opp, idx) => (
                        <StrategyCard key={`medium-${opp.protocol}-${opp.asset}-${idx}`} opportunity={opp} />
                     ))}
                   </div>
                 </div>
               )}
               
               {groupedOpportunities["High Risk"].length > 0 && (
                 <div>
                   <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                     🔴 High Risk / Volatile Strategies
                   </h3>
                   <div className="grid gap-4">
                     {groupedOpportunities["High Risk"].map((opp, idx) => (
                        <StrategyCard key={`high-${opp.protocol}-${opp.asset}-${idx}`} opportunity={opp} />
                     ))}
                   </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
