import React from 'react';

interface PersonalizedStrategyCardProps {
  strategy: {
    title: string;
    description: string;
    action: string;
    link: string;
  };
}

export function PersonalizedStrategyCard({ strategy }: PersonalizedStrategyCardProps) {
  return (
    <section className="mb-12 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="glass-panel p-8 md:p-10 rounded-[40px] border border-accent-cyan/20 bg-accent-cyan/5 relative overflow-hidden group hover:premium-glow transition-all duration-500">
        {/* Background Accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-cyan/10 rounded-full blur-[80px] group-hover:bg-accent-cyan/20 transition-all duration-700" />
        
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-dark-950 border border-accent-cyan/20 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(6,182,212,0.1)] group-hover:scale-110 transition-transform duration-500">
            💎
          </div>
          
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan mb-2">Personalized Strategy</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">{strategy.title}</h2>
            <p className="text-slate-400 font-medium leading-relaxed max-w-3xl">
              {strategy.description}
            </p>
          </div>
          
          <div className="flex shrink-0">
            <a 
              href={strategy.link} 
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-accent-cyan text-dark-950 font-black text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group/btn"
            >
              {strategy.action}
              <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
