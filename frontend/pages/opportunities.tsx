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

import { Tooltip } from "../components/ui/Tooltip";
import { TOOLTIPS } from "../utils/tooltipConstants";

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
        <div className="absolute top-[-100px] left-[20%] w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[10%] w-[500px] h-[500px] bg-mantle-500/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

        <header className="mb-16 flex flex-col gap-10 md:flex-row md:items-end md:justify-between relative z-10 animate-slide-up">
          <div className="max-w-4xl">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 mb-8 text-slate-500 hover:text-accent-cyan transition-all text-xs font-black uppercase tracking-[0.2em] group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Dashboard
            </Link>
            
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 backdrop-blur-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-glow" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">Signals Active</span>
            </div>

            <Tooltip content={TOOLTIPS.ALPHA_SIGNALS}>
              <h1 className="text-6xl font-black tracking-tighter md:text-8xl mb-6 text-white leading-[0.9] underline decoration-accent-cyan/30 decoration-dotted underline-offset-[20px]">
                Alpha <span className="text-accent-cyan">Signals</span>
              </h1>
            </Tooltip>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl border-l-2 border-accent-cyan/30 pl-6">
              Monitor the highest-conviction yield opportunities across Mantle.
            </p>
          </div>
        </header>

        {topOpportunity && !loading && !error ? (
          <div className="mb-20 glass-panel rounded-[40px] p-12 relative z-10 animate-slide-up animate-stagger-1 border-white/5 overflow-hidden group hover:premium-glow transition-all duration-700">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/5 blur-[120px] group-hover:bg-accent-cyan/10 transition-colors" />
            
            <div className="flex items-center gap-4 mb-10 text-accent-cyan font-black uppercase tracking-[0.4em] text-xs">
              <span className="w-8 h-[2px] bg-accent-cyan"></span>
              #1 Ranked Opportunity
            </div>

            <div className="grid gap-12 md:grid-cols-4 relative z-10">
              <div className="border-l border-white/10 pl-8">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Protocol</p>
                <p className="text-4xl font-black text-white tracking-tighter">
                  {topOpportunity.protocol}
                </p>
              </div>
              <div className="border-l border-white/10 pl-8">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Asset / Pool</p>
                <p className="text-4xl font-black text-white tracking-tighter">
                  {topOpportunity.asset || "N/A"}
                </p>
              </div>
              <div className="border-l border-white/10 pl-8">
                <Tooltip content={TOOLTIPS.APY}>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 underline decoration-slate-500/30 decoration-dotted underline-offset-4">Yield APY</p>
                </Tooltip>
                <p className="text-5xl font-black text-white tracking-tighter inline-flex items-baseline gap-2">
                  {topOpportunity.apy.toFixed(1)}% <span className="text-accent-cyan text-sm tracking-widest">APY</span>
                </p>
              </div>
              <div className="border-l border-white/10 pl-8">
                <Tooltip content={TOOLTIPS.OPPORTUNITY_SCORE}>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 underline decoration-slate-500/30 decoration-dotted underline-offset-4">Opportunity Score</p>
                </Tooltip>
                <p className="text-5xl font-black text-accent-cyan tracking-tighter shadow-accent-cyan/20">
                  {formatScore(topOpportunity.scores.opportunity_score)}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="relative z-10 animate-slide-up animate-stagger-2">
          <div className="mb-12 px-2 flex items-center justify-between">
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
              <span className="w-10 h-1 bg-accent-cyan rounded-full"></span>
              Signal Leaderboard
            </h2>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Categorized by risk profile
            </div>
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
            <div className="flex flex-col gap-16">
               {groupedOpportunities["Low Risk"].length > 0 && (
                 <div>
                   <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                     <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
                     Low Risk / Capital Preservation
                   </h3>
                   <div className="grid gap-6">
                     {groupedOpportunities["Low Risk"].map((opp, idx) => (
                        <StrategyCard key={`low-${opp.protocol}-${opp.asset}-${idx}`} opportunity={opp} />
                     ))}
                   </div>
                 </div>
               )}
               
               {groupedOpportunities["Medium Risk"].length > 0 && (
                 <div>
                   <h3 className="text-xs font-black text-amber-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                     <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></span>
                     Medium Risk / Yield Focused
                   </h3>
                   <div className="grid gap-6">
                     {groupedOpportunities["Medium Risk"].map((opp, idx) => (
                        <StrategyCard key={`medium-${opp.protocol}-${opp.asset}-${idx}`} opportunity={opp} />
                     ))}
                   </div>
                 </div>
               )}
               
               {groupedOpportunities["High Risk"].length > 0 && (
                 <div>
                   <h3 className="text-xs font-black text-rose-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                     <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]"></span>
                     High Risk / Alpha Maximization
                   </h3>
                   <div className="grid gap-6">
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
