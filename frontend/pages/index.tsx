import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StrategyCard } from "../components/cards/StrategyCard";
import { StrategyFlow } from "../components/cards/StrategyFlow";
import { useChatStore } from "../store/chatStore";
import { useMantlePortfolio } from "../hooks/useMantlePortfolio";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { PersonalizedStrategyCard } from "../components/cards/PersonalizedStrategyCard";

import { Tooltip } from "../components/ui/Tooltip";
import { TOOLTIPS } from "../utils/tooltipConstants";

type EcosystemResponse = {
  total_tvl: number;
  protocol_count: number;
  top_protocols: Array<{
    name: string;
    tvl: number;
    category: string;
    chain: string;
    tvl_growth_percentage: number;
  }>;
};

type OpportunityItem = {
  protocol: string;
  asset: string;
  apy: number;
  tvl: number;
  scores: {
    yield_score: number;
    gap_score: number;
    momentum_score: number;
    opportunity_score: number;
    volume_growth?: number;
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export default function HomePage() {
  const [ecosystem, setEcosystem] = useState<EcosystemResponse | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const { mnt, meth, isConnected, address } = useMantlePortfolio();

  const personalizedStrategy = useMemo(() => {
    if (!isConnected) return null;
    
    const mntVal = parseFloat(mnt);
    const methVal = parseFloat(meth);

    if (mntVal > 10) {
      return {
        title: "Native Yield Strategy",
        description: `You have ${mnt} MNT idle. Consider minting mETH via Mantle LSP for ~4.5% native yield.`,
        action: "MINT mETH",
        link: "https://meth.mantle.xyz/"
      };
    }
    
    if (methVal > 0.01) {
      return {
        title: "mETH Boosting",
        description: `Your ${meth} mETH can be supplied to INIT Capital to earn an additional 2-5% supply APY plus points.`,
        action: "DEPOSIT ON INIT",
        link: "https://init.capital/"
      };
    }

    return {
      title: "Growth Strategy",
      description: "Start your Mantle journey by bridging assets or swapping for MNT to unlock ecosystem yield.",
      action: "BRIDGE ASSETS",
      link: "https://bridge.mantle.xyz/"
    };
  }, [isConnected, mnt, meth]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [ecosystemResponse, opportunitiesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/ecosystem`),
          fetch(`${API_BASE_URL}/api/opportunities`),
        ]);

        if (!ecosystemResponse.ok || !opportunitiesResponse.ok) {
          throw new Error("Failed to load dashboard data.");
        }

        const ecosystemData: EcosystemResponse = await ecosystemResponse.json();
        const opportunityData: OpportunityItem[] = await opportunitiesResponse.json();

        setEcosystem(ecosystemData);
        setOpportunities(opportunityData);
        
        useChatStore.getState().setContextData(
          ecosystemData.top_protocols.slice(0, 10),
          opportunityData.slice(0, 5),
          isConnected ? `User Wallet: ${address}. Balances: MNT=${mnt}, mETH=${meth}` : undefined
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load Mantle Atlas dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [isConnected, address, mnt, meth]);

  const topOpportunities = useMemo(() => opportunities.slice(0, 5), [opportunities]);
  const topProtocols = useMemo(() => ecosystem?.top_protocols.slice(0, 5) || [], [ecosystem]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 relative overflow-hidden flex flex-col min-h-screen">
      {/* Decorative Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-mantle-500/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

      <Header />

      <main className="flex-1 relative z-10 w-full">
        {isConnected && personalizedStrategy && (
          <PersonalizedStrategyCard strategy={personalizedStrategy} />
        )}

        {loading ? (
          <div className="glass-panel rounded-3xl p-12 text-center animate-slide-up">
            <div className="inline-block w-10 h-10 border-4 border-mantle-500/30 border-t-mantle-400 rounded-full animate-spin mb-4" />
            <p className="text-mantle-300 font-medium">Synthesizing Mantle Analytics...</p>
          </div>
        ) : error ? (
          <div className="glass-panel rounded-3xl border-red-500/30 bg-red-950/20 p-8 text-red-300 animate-slide-up text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="font-medium text-lg">{error}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Quick Metrics Grid */}
            <section className="grid gap-6 md:grid-cols-3">
              <div className="glass-card rounded-[32px] p-8 animate-slide-up animate-stagger-1 group hover:premium-glow">
                <div className="flex items-center justify-between mb-4">
                  <Tooltip content={TOOLTIPS.TVL}>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 underline decoration-slate-500/30 decoration-dotted underline-offset-4">Total Ecosystem TVL</p>
                  </Tooltip>
                  <div className="w-10 h-10 rounded-2xl bg-dark-950 flex items-center justify-center text-xl text-mantle-400 border border-white/5 group-hover:bg-mantle-500/20 transition-colors">💰</div>
                </div>
                <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  {formatCurrency(ecosystem?.total_tvl || 0)}
                </p>
              </div>

              <div className="glass-card rounded-[32px] p-8 animate-slide-up animate-stagger-2 group hover:premium-glow">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Active Protocols</p>
                  <div className="w-10 h-10 rounded-2xl bg-dark-950 flex items-center justify-center text-xl text-cyan-400 border border-white/5 group-hover:bg-cyan-500/20 transition-colors">🏗️</div>
                </div>
                <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  {ecosystem?.protocol_count || 0}
                </p>
              </div>

              <div className="glass-card rounded-[32px] p-8 animate-slide-up animate-stagger-3 group hover:premium-glow">
                <div className="flex items-center justify-between mb-4">
                  <Tooltip content={TOOLTIPS.ALPHA_SIGNALS}>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 underline decoration-slate-500/30 decoration-dotted underline-offset-4">Top Yield Opps</p>
                  </Tooltip>
                  <div className="w-10 h-10 rounded-2xl bg-dark-950 flex items-center justify-center text-xl text-emerald-400 border border-white/5 group-hover:bg-emerald-500/20 transition-colors">🎯</div>
                </div>
                <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  {topOpportunities.length}
                </p>
              </div>
            </section>

            {/* Strategy Spotlight Section */}
            <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
              {topOpportunities.length > 0 && (
                <div className="glass-panel rounded-[48px] p-8 md:p-12 border border-white/5 relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <StrategyFlow opportunity={topOpportunities[0]} />
                </div>
              )}
            </section>

            {/* Deep Analytics Grid */}
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Left Column: Alpha Signals */}
              <section className="animate-slide-up" style={{ animationDelay: '500ms' }}>
                <div className="mb-8 flex items-end justify-between px-2">
                  <div>
                    <Tooltip content={TOOLTIPS.ALPHA_SIGNALS}>
                      <h2 className="text-3xl font-black text-white mb-2 tracking-tighter flex items-center gap-4 underline decoration-accent-cyan/30 decoration-dotted underline-offset-8">
                        <span className="w-10 h-1 bg-accent-cyan rounded-full"></span>
                        Alpha Signals
                      </h2>
                    </Tooltip>
                    <p className="text-slate-500 font-medium">Alternative high-conviction yield paths</p>
                  </div>
                  <Link href="/opportunities" className="text-xs font-black text-accent-cyan hover:text-cyan-300 transition-all flex items-center gap-2 group">
                    VIEW ALL <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </Link>
                </div>

                <div className="grid gap-4">
                  {topOpportunities.slice(1).map((item, idx) => (
                    <StrategyCard key={`top-${item.protocol}-${item.asset}`} opportunity={item} rank={idx + 2} />
                  ))}
                </div>
              </section>

              {/* Right Column: ecosystem Leaders */}
              <section className="animate-slide-up" style={{ animationDelay: '600ms' }}>
                <div className="mb-8 px-2">
                  <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Ecosystem Leaders</h2>
                  <Tooltip content={TOOLTIPS.TVL}>
                    <p className="text-slate-500 font-medium underline decoration-slate-500/30 decoration-dotted underline-offset-4">Dominant protocols by TVL</p>
                  </Tooltip>
                </div>

                <div className="space-y-3">
                  {topProtocols.map((protocol, index) => (
                    <div key={protocol.name} className="glass-card rounded-[28px] p-6 border border-white/5 hover:border-accent-cyan/30 group cursor-pointer relative overflow-hidden transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/0 to-accent-cyan/[0.03] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-dark-950 border border-white/10 flex items-center justify-center text-xl font-black text-slate-500 group-hover:scale-110 group-hover:bg-accent-cyan/10 group-hover:text-accent-cyan group-hover:border-accent-cyan/30 transition-all duration-500">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-black text-xl text-slate-100 group-hover:text-white transition-colors tracking-tight">
                              {protocol.name}
                            </p>
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-600 group-hover:text-accent-cyan/60 transition-colors">
                              {protocol.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-xl text-slate-200 group-hover:text-accent-cyan transition-colors">
                            {formatCurrency(protocol.tvl)}
                          </p>
                          <p className={`mt-0.5 text-xs font-black ${protocol.tvl_growth_percentage >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {formatPercent(protocol.tvl_growth_percentage)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
