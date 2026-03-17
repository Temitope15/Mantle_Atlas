import { useEffect, useState } from "react";
import Link from "next/link";

import { getInsights } from "../services/api";

type InsightsResponse = {
  insights: string[];
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const response = (await getInsights()) as InsightsResponse;
        setInsights(Array.isArray(response.insights) ? response.insights : []);
      } catch (err) {
        setError("Unable to load ecosystem insights.");
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10 flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
              Mantle Atlas
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Ecosystem Insights
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
              Readable intelligence generated from live Mantle ecosystem yield,
              liquidity, and opportunity signals.
            </p>
          </div>

          <nav className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/"
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Home
            </Link>
            <Link
              href="/ecosystem"
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Ecosystem
            </Link>
            <Link
              href="/opportunities"
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Opportunities
            </Link>
            <Link
              href="/insights"
              className="rounded-lg border border-cyan-500 bg-cyan-500/10 px-4 py-2 text-cyan-300"
            >
              Insights
            </Link>
          </nav>
        </header>

        {loading ? (
          <section className="grid gap-4">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="h-4 w-32 rounded bg-slate-800" />
                <div className="mt-4 h-4 w-full rounded bg-slate-800" />
                <div className="mt-2 h-4 w-5/6 rounded bg-slate-800" />
              </div>
            ))}
          </section>
        ) : error ? (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            {error}
          </section>
        ) : insights.length === 0 ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
            No insights are available right now.
          </section>
        ) : (
          <section className="grid gap-5">
            {insights.map((insight, index) => (
              <article
                key={`${index}-${insight}`}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-lg shadow-black/20"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-semibold text-cyan-300">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      Insight
                    </p>
                    <h2 className="text-lg font-semibold text-white">
                      Mantle Ecosystem Signal
                    </h2>
                  </div>
                </div>

                <p className="text-base leading-7 text-slate-200">{insight}</p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
