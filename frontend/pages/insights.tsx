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
      <div className="mx-auto max-w-7xl px-6 py-12 relative overflow-hidden min-h-screen">
        {/* Decorative Orbs */}
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-mantle-500/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

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
              <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">Intelligence Active</span>
            </div>

            <h1 className="text-6xl font-black tracking-tighter md:text-8xl mb-6 text-white leading-[0.9]">
              AI <span className="text-accent-cyan">Insights</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl border-l-2 border-accent-cyan/30 pl-6">
              Synthesized intelligence generated directly from real-time Mantle ecosystem data.
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
          <section className="grid gap-8 relative z-10">
            {insights.map((insight, index) => (
              <article
                key={`${index}-${insight}`}
                className="glass-card rounded-[32px] p-10 hover:border-accent-cyan/30 group animate-slide-up relative overflow-hidden"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/0 to-accent-cyan/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="mb-8 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-dark-950 border border-white/5 text-2xl font-black text-slate-400 group-hover:scale-110 group-hover:bg-accent-cyan/10 group-hover:text-accent-cyan group-hover:border-accent-cyan/20 transition-all duration-300">
                      {index + 1}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight">
                        Alpha Intelligence
                      </h2>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-accent-cyan font-black mt-1">
                        System Generated Signal
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-2xl font-medium text-slate-200 leading-[1.6] border-l-4 border-accent-cyan/20 pl-8 ml-2">
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
