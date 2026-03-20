import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

      <header className="mb-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between relative z-10 animate-slide-up">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-mantle-500/30 bg-mantle-500/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-mantle-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-mantle-300">Live Dashboard</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl mb-4 text-gradient-primary">
            Mantle Atlas
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
            The intelligent capital allocation layer for the Mantle Ecosystem.
            Real-time analytics across TVL, liquidity gaps, and high-conviction yield strategies.
          </p>
        </div>

        <nav className="flex flex-wrap gap-4">
          <Link
            href="/ecosystem"
            className="rounded-xl border border-glass-border bg-glass-strong px-5 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-mantle-500/20 hover:border-mantle-400/50 hover:text-white glass-card"
          >
            Ecosystem Radar
          </Link>
          <Link
            href="/opportunities"
            className="rounded-xl border border-glass-border bg-glass-strong px-5 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-mantle-500/20 hover:border-mantle-400/50 hover:text-white glass-card"
          >
            Alpha Signals
          </Link>
          <Link
            href="/insights"
            className="rounded-xl border border-transparent bg-gradient-to-r from-mantle-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-mantle-500/25 transition-all hover:shadow-cyan-500/40 hover:-translate-y-0.5"
          >
            AI Insights
          </Link>
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

          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] relative z-10">
            {/* Opportunities Table */}
            <div className="glass-panel rounded-3xl p-8 flex flex-col animate-slide-up animate-stagger-3">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Alpha Strategies</h2>
                  <p className="text-slate-400 font-light">Highest-conviction yield opportunities</p>
                </div>
                <Link
                  href="/opportunities"
                  className="text-sm font-semibold text-mantle-400 hover:text-mantle-300 transition-colors flex items-center gap-1"
                >
                  View full list &rarr;
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-glass-border">
                      <th className="pb-4 pt-2 px-4 text-xs font-bold uppercase tracking-widest text-slate-500">Asset/Pool</th>
                      <th className="pb-4 pt-2 px-4 text-xs font-bold uppercase tracking-widest text-slate-500">Protocol</th>
                      <th className="pb-4 pt-2 px-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">APY</th>
                      <th className="pb-4 pt-2 px-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border/50">
                    {topOpportunities.map((item, idx) => (
                      <tr key={`${item.protocol}-${item.asset}`} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mantle-500 to-cyan-600 flex items-center justify-center text-xs font-bold shadow-lg">
                              {item.asset.substring(0,2)}
                            </div>
                            <span className="font-semibold text-slate-200">{item.asset}</span>
                          </div>
                        </td>
                        <td className="py-5 px-4 text-slate-400 font-medium">
                          {item.protocol}
                        </td>
                        <td className="py-5 px-4 text-right">
                          <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg font-bold text-sm border border-emerald-500/20">
                            {formatPercent(item.apy)}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-right">
                          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-mantle-300 to-cyan-400">
                            {formatScore(item.scores.opportunity_score)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Leading Protocols */}
            <div className="glass-panel rounded-3xl p-8 flex flex-col animate-slide-up animate-stagger-4">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Ecosystem Leaders</h2>
                  <p className="text-slate-400 font-light">Dominant protocols by TVL</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {topProtocols.map((protocol, index) => (
                  <div
                    key={`${protocol.name}-${index}`}
                    className="glass-card rounded-2xl p-5 hover:border-mantle-500/30 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-dark-800 border border-glass-border flex items-center justify-center text-lg font-bold text-slate-300 group-hover:scale-110 group-hover:bg-mantle-500/20 group-hover:text-mantle-300 transition-all">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-lg text-slate-100 group-hover:text-white transition-colors">
                            {protocol.name}
                          </p>
                          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-1">
                            {protocol.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg text-slate-200">
                          {formatCurrency(protocol.tvl)}
                        </p>
                        <p
                          className={`mt-1 text-sm font-bold ${
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
