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
  return `${value.toFixed(2)}%`;
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
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10 flex flex-col gap-6 border-b border-slate-800 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Mantle Atlas
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Mantle Ecosystem Radar
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400 md:text-base">
              Production-grade ecosystem intelligence for Mantle Network across
              TVL, yields, liquidity gaps, and ranked opportunity signals.
            </p>
          </div>

          <nav className="flex flex-wrap gap-3">
            <Link
              href="/ecosystem"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
            >
              Ecosystem
            </Link>
            <Link
              href="/opportunities"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
            >
              Opportunities
            </Link>
            <Link
              href="/insights"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
            >
              Insights
            </Link>
          </nav>
        </header>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-sm text-slate-300">
            Loading dashboard...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-sm text-red-200">
            {error}
          </div>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/20">
                <p className="text-sm font-medium text-slate-400">Total TVL</p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {formatCurrency(ecosystem?.total_tvl || 0)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Aggregate Mantle ecosystem value locked
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/20">
                <p className="text-sm font-medium text-slate-400">
                  Active Protocols
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {ecosystem?.protocol_count || 0}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Protocols detected on Mantle
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/20">
                <p className="text-sm font-medium text-slate-400">
                  Top Opportunities
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {topOpportunities.length}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Highest-ranked pools by composite score
                </p>
              </div>
            </section>

            <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Top Opportunities
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Highest-ranked Mantle pools by opportunity score
                    </p>
                  </div>
                  <Link
                    href="/opportunities"
                    className="text-sm font-medium text-emerald-300 hover:text-emerald-200"
                  >
                    View all
                  </Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-800">
                  <table className="min-w-full divide-y divide-slate-800 text-sm">
                    <thead className="bg-slate-950/60">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">
                          Protocol
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">
                          Asset
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">
                          APY
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">
                          TVL
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">
                          Score
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {topOpportunities.map((item) => (
                        <tr key={`${item.protocol}-${item.asset}`}>
                          <td className="px-4 py-3 font-medium text-white">
                            {item.protocol}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {item.asset}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {formatPercent(item.apy)}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {formatCurrency(item.tvl)}
                          </td>
                          <td className="px-4 py-3 text-emerald-300">
                            {formatScore(item.scores.opportunity_score)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Leading Protocols
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Largest Mantle protocols by TVL
                    </p>
                  </div>
                  <Link
                    href="/ecosystem"
                    className="text-sm font-medium text-emerald-300 hover:text-emerald-200"
                  >
                    Explore ecosystem
                  </Link>
                </div>

                <div className="space-y-3">
                  {topProtocols.map((protocol, index) => (
                    <div
                      key={`${protocol.name}-${index}`}
                      className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-white">
                            {protocol.name}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                            {protocol.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-200">
                            {formatCurrency(protocol.tvl)}
                          </p>
                          <p
                            className={`mt-1 text-xs ${
                              protocol.tvl_growth_percentage >= 0
                                ? "text-emerald-300"
                                : "text-rose-300"
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
    </main>
  );
}
