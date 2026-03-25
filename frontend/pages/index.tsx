import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StrategyCard } from "../components/cards/StrategyCard";
import { StrategyFlow } from "../components/cards/StrategyFlow";
import { useChatStore } from "../store/chatStore";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMantlePortfolio } from "../hooks/useMantlePortfolio";

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

function formatScore(value: number): string {
  return value.toFixed(4);
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
        const opportunityData: OpportunityItem[] =
          await opportunitiesResponse.json();

        setEcosystem(ecosystemData);
        setOpportunities(opportunityData);
        
        useChatStore.getState().setContextData(
          ecosystemData.top_protocols.slice(0, 10),
          opportunityData.slice(0, 5),
          isConnected ? `User Wallet: ${address}. Balances: MNT=${mnt}, mETH=${meth}` : undefined
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load Mantle Atlas dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const topOpportunities = useMemo(
    () => opportunities.slice(0, 5),
    [opportunities]
  );

  const topProtocols = useMemo(
    () => ecosystem?.top_protocols.slice(0, 5) || [],
    [ecosystem]
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-mantle-500/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

      <header className="mb-16 flex flex-col gap-10 md:flex-row md:items-end md:justify-between relative z-10 animate-slide-up">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 backdrop-blur-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-glow" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">System Live</span>
          </div>
          <Link href="/">
            <h1 className="text-6xl font-black tracking-tighter md:text-8xl mb-6 text-white leading-[0.9] hover:text-accent-cyan transition-colors cursor-pointer">
              Mantle <span className="text-accent-cyan">Atlas</span>
            </h1>
          </Link>
          <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl border-l-2 border-accent-cyan/30 pl-6">
            The intelligent capital allocation layer for the Mantle Ecosystem.
          </p>
        </div>

        {isConnected && personalizedStrategy && (
          <div className="glass-panel p-6 rounded-[32px] border border-accent-cyan/20 bg-accent-cyan/5 w-full md:w-96 animate-scale-in relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl group-hover:scale-110 transition-transform">💎</div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-cyan mb-2">Personalized Strategy</p>
              <h3 className="text-xl font-black text-white mb-2">{personalizedStrategy.title}</h3>
              <p className="text-sm text-slate-400 mb-4 font-medium leading-relaxed">
                {personalizedStrategy.description}
              </p>
              <a 
                href={personalizedStrategy.link} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-black text-accent-cyan hover:gap-3 transition-all"
              >
                {personalizedStrategy.action} <span>&rarr;</span>
              </a>
            </div>
          </div>
        )}

        <nav className="flex flex-wrap gap-4 items-center">
          <Link
            href="/ecosystem"
            className="rounded-xl border border-white/5 bg-white/[0.03] px-6 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-white/[0.08] hover:border-white/20 glass-card"
          >
            Ecosystem Radar
          </Link>
          <Link
            href="/opportunities"
            className="rounded-xl border border-white/5 bg-white/[0.03] px-6 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-white/[0.08] hover:border-white/20 glass-card"
          >
            Alpha Signals
          </Link>
          <Link
            href="/opportunities"
            className="rounded-xl border border-white/5 bg-white/[0.03] px-6 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-white/[0.08] hover:border-white/20 glass-card"
          >
            Alpha Signals
          </Link>
          <Link
            href="/insights"
            className="rounded-xl bg-accent-cyan px-6 py-3 text-sm font-black text-dark-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            AI INSIGHTS
          </Link>
          <div className="ml-4">
            <ConnectButton />
          </div>
        </nav>
      </header>

      {loading ? (
        <div className="glass-panel rounded-3xl p-12 text-center relative z-10 animate-slide-up animate-stagger-1">
          <div className="inline-block w-10 h-10 border-4 border-mantle-500/30 border-t-mantle-400 rounded-full animate-spin mb-4" />
          <p className="text-mantle-300 font-medium">Synthesizing Mantle Analytics...</p>
        </div>
      ) : error ? (
        <div className="glass-panel rounded-3xl border-red-500/30 bg-red-950/20 p-8 text-red-300 relative z-10 animate-slide-up animate-stagger-1 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="font-medium text-lg">{error}</p>
        </div>
      ) : (
        <>
          <section className="grid gap-6 md:grid-cols-3 relative z-10 mb-10">
            <div className="glass-card rounded-3xl p-8 animate-slide-up animate-stagger-1 group hover:premium-glow">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Total Ecosystem TVL</p>
                <div className="w-10 h-10 rounded-full bg-mantle-500/10 flex items-center justify-center text-mantle-400 group-hover:bg-mantle-500/20 transition-colors">
                  💰
                </div>
              </div>
              <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {formatCurrency(ecosystem?.total_tvl || 0)}
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 animate-slide-up animate-stagger-2 group hover:premium-glow">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Active Protocols</p>
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                  🏗️
                </div>
              </div>
              <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {ecosystem?.protocol_count || 0}
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 animate-slide-up animate-stagger-3 group hover:premium-glow">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Ranked Opportunities</p>
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                  🎯
                </div>
              </div>
              <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {topOpportunities.length}
              </p>
            </div>
          </section>

          <section className="mb-20 relative z-10 animate-slide-up animate-stagger-3">
            {topOpportunities.length > 0 && (
              <div className="glass-panel rounded-[40px] p-12 border border-white/5 relative overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <StrategyFlow opportunity={topOpportunities[0]} />
              </div>
            )}
          </section>

          <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] relative z-10">
            {/* Alpha Strategies List */}
            <div className="flex flex-col animate-slide-up animate-stagger-3">
              <div className="mb-10 flex items-end justify-between px-2">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
                    <span className="w-8 h-1 bg-accent-cyan rounded-full"></span>
                    Alpha Signals
                  </h2>
                  <p className="text-slate-400 font-medium">Alternative high-conviction yield paths</p>
                </div>
                <Link
                  href="/opportunities"
                  className="text-sm font-black text-accent-cyan hover:text-cyan-300 transition-all flex items-center gap-2 group"
                >
                  VIEW ALL SIGNALS <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>

              <div className="grid gap-6">
                 {topOpportunities.slice(1).map((item, idx) => (
                    <StrategyCard key={`top-${item.protocol}-${item.asset}-${idx}`} opportunity={item} rank={idx + 2} />
                 ))}
              </div>
            </div>

            {/* Ecosystem Leaders */}
            <div className="flex flex-col animate-slide-up animate-stagger-4">
              <div className="mb-10 flex items-end justify-between px-2">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Ecosystem Map</h2>
                  <p className="text-slate-400 font-medium">Dominant protocols by TVL</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {topProtocols.map((protocol, index) => (
                  <div
                    key={`${protocol.name}-${index}`}
                    className="glass-card rounded-[24px] p-6 hover:border-accent-cyan/30 group cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/0 to-accent-cyan/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-dark-950 border border-white/5 flex items-center justify-center text-xl font-black text-slate-400 group-hover:scale-110 group-hover:bg-accent-cyan/10 group-hover:text-accent-cyan group-hover:border-accent-cyan/20 transition-all duration-300">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-black text-xl text-slate-100 group-hover:text-white transition-colors tracking-tight">
                            {protocol.name}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mt-1">
                            {protocol.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-slate-200 group-hover:text-accent-cyan transition-colors">
                          {formatCurrency(protocol.tvl)}
                        </p>
                        <p
                          className={`mt-1 text-sm font-black ${
                            protocol.tvl_growth_percentage >= 0
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          {formatPercent(protocol.tvl_growth_percentage)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
