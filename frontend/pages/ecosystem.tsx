import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { getEcosystem } from "../services/api";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

type EcosystemProtocol = {
  name: string;
  tvl: number;
  category: string;
  chain: string;
  tvl_growth_percentage: number;
};

type EcosystemResponse = {
  total_tvl: number;
  protocol_count: number;
  top_protocols: EcosystemProtocol[];
};

type NavigationItem = {
  href: string;
  label: string;
};

const navigationItems: NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/insights", label: "Insights" },
];

function DashboardNavigation({
  activePath,
}: {
  activePath: string;
}): JSX.Element {
  return (
    <nav className="flex flex-wrap gap-3">
      {navigationItems.map((item) => {
        const isActive = item.href === activePath;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl border px-6 py-3 text-sm font-black transition-all ${
              isActive
                ? "border-transparent bg-accent-cyan text-dark-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                : "border-white/5 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            {item.label.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercent = (value: number): string => {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};

export default function EcosystemPage(): JSX.Element {
  const [data, setData] = useState<EcosystemResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadEcosystem = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await getEcosystem();
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load Mantle ecosystem data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadEcosystem();
  }, []);

  const categoryChartData = useMemo(() => {
    if (!data) {
      return null;
    }

    const totalsByCategory: Record<string, number> = {};

    for (const protocol of data.top_protocols) {
      const category = protocol.category || "Unknown";
      totalsByCategory[category] =
        (totalsByCategory[category] || 0) + protocol.tvl;
    }

    const labels = Object.keys(totalsByCategory);
    const values = labels.map((label) => totalsByCategory[label]);
    const colors = [
      "#2e9d7f",
      "#0891b2",
      "#0ea5e9",
      "#14b8a6",
      "#6366f1",
      "#8b5cf6",
      "#10b981",
      "#3b82f6",
    ];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: labels.map(
            (_, index) => colors[index % colors.length],
          ),
          borderColor: "#0b111a",
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  }, [data]);

  return (
    <>
      <Head>
        <title>Mantle Atlas | Ecosystem Radar</title>
        <meta
          name="description"
          content="Mantle Atlas ecosystem dashboard for TVL, protocol count, and top Mantle protocols."
        />
      </Head>

      <div className="mx-auto max-w-7xl px-6 py-12 relative overflow-hidden min-h-screen">
        {/* Decorative Orbs */}
        <div className="absolute top-[-50px] left-[30%] w-96 h-96 bg-mantle-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />

        <header className="mb-16 flex flex-col gap-10 md:flex-row md:items-end md:justify-between relative z-10 animate-slide-up">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 backdrop-blur-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-glow" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">Radar Active</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter md:text-8xl mb-6 text-white leading-[0.9]">
              Ecosystem <span className="text-accent-cyan">Radar</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl border-l-2 border-accent-cyan/30 pl-6">
              Monitor Mantle ecosystem TVL, protocol density, and leading protocols.
            </p>
          </div>

          <DashboardNavigation activePath="/ecosystem" />
        </header>

        {isLoading ? (
          <div className="glass-panel rounded-3xl p-12 text-center relative z-10 animate-slide-up animate-stagger-1">
            <div className="inline-block w-10 h-10 border-4 border-mantle-500/30 border-t-mantle-400 rounded-full animate-spin mb-4" />
            <p className="text-mantle-300 font-medium">Scanning Ecosystem...</p>
          </div>
        ) : error ? (
          <div className="glass-panel rounded-3xl border-red-500/30 bg-red-950/20 p-8 text-red-300 relative z-10 animate-slide-up animate-stagger-1 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="font-medium text-lg">{error}</p>
          </div>
        ) : data ? (
          <div className="space-y-8 relative z-10">
            <section className="grid gap-6 md:grid-cols-3">
              <article className="glass-card rounded-3xl p-8 hover:premium-glow animate-slide-up animate-stagger-1">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Total Mantle TVL
                </p>
                <h2 className="mt-4 text-4xl font-black text-white">
                  {formatCurrency(data.total_tvl)}
                </h2>
              </article>

              <article className="glass-card rounded-3xl p-8 hover:premium-glow animate-slide-up animate-stagger-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Active Protocols
                </p>
                <h2 className="mt-4 text-4xl font-black text-white">
                  {data.protocol_count}
                </h2>
              </article>

              <article className="glass-card rounded-3xl p-8 hover:premium-glow animate-slide-up animate-stagger-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Leading Protocol
                </p>
                <h2 className="mt-4 text-4xl font-black text-white">
                  {data.top_protocols[0]?.name ?? "N/A"}
                </h2>
              </article>
            </section>

            <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <article className="glass-panel rounded-3xl p-8 animate-slide-up animate-stagger-3">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Top Protocols
                  </h2>
                  <p className="text-sm text-slate-400">
                    Ranked by total value locked in real-time.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-glass-border">
                        <th className="pb-4 pt-2 px-4 text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-glass-border">Protocol</th>
                        <th className="pb-4 pt-2 px-4 text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-glass-border">Category</th>
                        <th className="pb-4 pt-2 px-4 text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-glass-border text-right">TVL</th>
                        <th className="pb-4 pt-2 px-4 text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-glass-border text-right">Growth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-border/50">
                      {data.top_protocols.map((protocol) => (
                        <tr
                          key={protocol.name}
                          className="group hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-5 px-4 font-bold text-white">
                            {protocol.name}
                          </td>
                          <td className="py-5 px-4 text-slate-400 font-medium">
                            <span className="inline-block px-3 py-1 bg-white/5 rounded-md text-xs tracking-wider">
                              {protocol.category}
                            </span>
                          </td>
                          <td className="py-5 px-4 text-right font-bold text-slate-200">
                            {formatCurrency(protocol.tvl)}
                          </td>
                          <td
                            className={`py-5 px-4 text-right font-black ${
                              protocol.tvl_growth_percentage >= 0
                                ? "text-emerald-400"
                                : "text-rose-400"
                            }`}
                          >
                            {formatPercent(protocol.tvl_growth_percentage)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="glass-panel rounded-3xl p-8 animate-slide-up animate-stagger-4 flex flex-col items-center">
                <div className="mb-8 w-full">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    TVL Distribution
                  </h2>
                  <p className="text-sm text-slate-400">
                    Macro sector allocation across leading Mantle protocols.
                  </p>
                </div>

                <div className="w-full max-w-sm flex-1 flex items-center justify-center">
                  {categoryChartData ? (
                    <Doughnut
                      data={categoryChartData}
                      options={{
                        responsive: true,
                        cutout: '75%',
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              color: "#cbd5e1",
                              padding: 20,
                              font: {
                                family: "'Outfit', sans-serif",
                                size: 13,
                              }
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <p className="text-sm text-slate-400">
                      No category chart data available.
                    </p>
                  )}
                </div>
              </article>
            </section>
          </div>
        ) : null}
      </div>
    </>
  );
}
