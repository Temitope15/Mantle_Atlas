import { useEffect, useState } from "react";
import Head from "next/head";
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
    <>
      <Head>
        <title>Mantle Atlas | AI Insights</title>
      </Head>
      <div className="mx-auto max-w-5xl px-6 py-12 relative overflow-hidden min-h-screen">
        {/* Decorative Orbs */}
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-mantle-600/10 rounded-full blur-[180px] animate-pulse-slow pointer-events-none" />

        <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between relative z-10 animate-slide-up">
          <div className="max-w-2xl">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl mb-4 text-white">
              AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-mantle-400 to-emerald-400">Insights</span>
            </h1>
            <p className="text-lg text-slate-400 font-light leading-relaxed">
              Synthesized intelligence generated directly from real-time Mantle
              ecosystem yield, liquidity, and momentum.
            </p>
          </div>
        </header>

        {loading ? (
          <section className="grid gap-6 relative z-10 animate-slide-up animate-stagger-1">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="glass-card rounded-3xl p-8 border-glass-border/50 animate-pulse"
              >
                <div className="h-4 w-32 rounded bg-white/10 mb-6" />
                <div className="h-5 w-full rounded bg-white/5 mb-3" />
                <div className="h-5 w-5/6 rounded bg-white/5" />
              </div>
            ))}
          </section>
        ) : error ? (
          <section className="glass-panel rounded-3xl border-red-500/30 bg-red-950/20 p-8 text-red-200 relative z-10 text-center font-semibold text-lg animate-slide-up">
            {error}
          </section>
        ) : insights.length === 0 ? (
          <section className="glass-panel rounded-3xl p-12 text-slate-400 relative z-10 text-center animate-slide-up">
            No actionable insights detected at this moment.
          </section>
        ) : (
          <section className="grid gap-6 relative z-10">
            {insights.map((insight, index) => (
              <article
                key={`${index}-${insight}`}
                className="glass-card rounded-3xl p-8 hover:premium-glow group animate-slide-up"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-mantle-500 to-cyan-600 text-lg font-black text-white shadow-lg transition-transform group-hover:scale-110">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Alpha Intelligence
                    </h2>
                    <p className="text-sm font-semibold uppercase tracking-widest text-mantle-400">
                      System Generated
                    </p>
                  </div>
                </div>

                <p className="text-xl font-light text-slate-200 leading-relaxed border-l-2 border-mantle-500/50 pl-6 ml-2">
                  {insight}
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    </>
  );
}
