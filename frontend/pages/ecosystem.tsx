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
    <nav className="flex flex-wrap gap-3 text-sm">
      {navigationItems.map((item) => {
        const isActive = item.href === activePath;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg border px-4 py-2 transition ${
              isActive
                ? "border-teal-500 bg-teal-500/10 text-teal-300"
                : "border-slate-700 text-slate-300 hover:border-teal-400 hover:text-white"
            }`}
          >
            {item.label}
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
      "#14b8a6",
      "#3b82f6",
      "#8b5cf6",
      "#f59e0b",
      "#ef4444",
      "#22c55e",
      "#ec4899",
      "#06b6d4",
    ];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: labels.map(
            (_, index) => colors[index % colors.length],
          ),
          borderColor: "#0f172a",
          borderWidth: 2,
        },
      ],
    };
  }, [data]);

  return (
    <>
      <Head>
        <title>Mantle Atlas | Ecosystem</title>
        <meta
          name="description"
          content="Mantle Atlas ecosystem dashboard for TVL, protocol count, and top Mantle protocols."
        />
      </Head>

      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <header className="mb-10 flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-400">
                Mantle Atlas
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                Ecosystem Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                Monitor Mantle ecosystem TVL, protocol density, and leading
                protocols from the Atlas intelligence backend.
              </p>
            </div>

            <DashboardNavigation activePath="/ecosystem" />
          </header>

          {isLoading ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
              <p className="text-sm text-slate-400">
                Loading ecosystem radar...
              </p>
            </section>
          ) : error ? (
            <section className="rounded-2xl border border-red-900 bg-red-950/40 p-8">
              <p className="text-sm text-red-300">{error}</p>
            </section>
          ) : data ? (
            <div className="space-y-8">
              <section className="grid gap-4 md:grid-cols-3">
                <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    Total Mantle TVL
                  </p>
                  <h2 className="mt-4 text-3xl font-bold text-white">
                    {formatCurrency(data.total_tvl)}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Aggregated from Mantle-deployed DeFi protocols.
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    Active Protocols
                  </p>
                  <h2 className="mt-4 text-3xl font-bold text-white">
                    {data.protocol_count}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Protocol count currently detected on Mantle.
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    Leading Protocol
                  </p>
                  <h2 className="mt-4 text-3xl font-bold text-white">
                    {data.top_protocols[0]?.name ?? "N/A"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Highest TVL protocol in the current Mantle snapshot.
                  </p>
                </article>
              </section>

              <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Top Protocols
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        Ranked by total value locked.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-y-3">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                          <th className="px-3 py-2">Protocol</th>
                          <th className="px-3 py-2">Category</th>
                          <th className="px-3 py-2">TVL</th>
                          <th className="px-3 py-2">Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.top_protocols.map((protocol) => (
                          <tr
                            key={protocol.name}
                            className="rounded-xl bg-slate-950/70 text-sm text-slate-200"
                          >
                            <td className="rounded-l-xl px-3 py-4 font-semibold text-white">
                              {protocol.name}
                            </td>
                            <td className="px-3 py-4 text-slate-300">
                              {protocol.category}
                            </td>
                            <td className="px-3 py-4">
                              {formatCurrency(protocol.tvl)}
                            </td>
                            <td
                              className={`rounded-r-xl px-3 py-4 font-medium ${
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

                <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white">
                      TVL by Category
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Category mix across the leading Mantle protocols.
                    </p>
                  </div>

                  <div className="mx-auto flex max-w-md items-center justify-center">
                    {categoryChartData ? (
                      <Doughnut
                        data={categoryChartData}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: "bottom",
                              labels: {
                                color: "#cbd5e1",
                                padding: 18,
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
          ) : (
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
              <p className="text-sm text-slate-400">
                No ecosystem data is currently available.
              </p>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
