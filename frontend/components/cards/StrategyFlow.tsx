import React from "react";
import { OpportunityItem } from "./StrategyCard";
import { getProtocolMetadata } from "../../utils/protocolMap";

interface StrategyFlowProps {
  opportunity: OpportunityItem;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 1000000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
};

export function StrategyFlow({ opportunity }: StrategyFlowProps) {
  const metadata = getProtocolMetadata(opportunity.protocol, opportunity.asset);
  
  // Logic to determine steps based on the opportunity
  // For now, we simulate the flow structure seen in the reference
  const steps = [
    {
      title: "Step 1",
      action: `Deposit ${opportunity.asset}`,
      subTitle: opportunity.asset,
      details: [
        { label: "Amount:", value: "10 " + opportunity.asset },
        { label: "Protocol:", value: "Native" },
        { label: "Action:", value: "Staking" }
      ],
      icon: "🔹"
    },
    {
      title: "Step 2",
      action: "Receive Receipts",
      subTitle: `st${opportunity.asset}`,
      details: [
        { label: "Amount:", value: "~10 st" + opportunity.asset },
        { label: "Yield:", value: "~4.5% APR" },
        { label: "Type:", value: "Liquid Staked" }
      ],
      icon: "💎"
    },
    {
      title: "Step 3",
      action: `Lend on ${opportunity.protocol}`,
      subTitle: opportunity.protocol,
      details: [
        { label: "Amount:", value: "10 st" + opportunity.asset },
        { label: "Action:", value: "Supply Liquidity" },
        { label: "Yield APY:", value: opportunity.apy.toFixed(1) + "%" }
      ],
      icon: "🚀"
    }
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">DeFi Strategy Hub</h2>
        <p className="text-slate-400 text-lg font-medium opacity-80 uppercase tracking-widest text-sm">Automated Yield Optimization</p>
      </div>

      <div className="mb-10 text-2xl font-bold text-slate-200 tracking-tight">
        {opportunity.asset} to st{opportunity.asset} to {opportunity.protocol}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full mb-12">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="relative group w-full md:w-72">
              {/* Card Glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-cyan/20 to-mantle-500/20 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
              
              <div className="relative glass-card rounded-2xl p-6 border border-white/10 hover:border-accent-cyan/50 transition-all duration-300 h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{step.title}</span>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                
                <h4 className="text-lg font-bold text-white mb-1">{step.action}</h4>
                <div className="text-accent-cyan text-xl font-black mb-6 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center text-[10px]">
                    {step.icon}
                  </div>
                  {step.subTitle}
                </div>

                <div className="space-y-3">
                  {step.details.map((detail, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">{detail.label}</span>
                      <span className="text-slate-200 font-bold">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="hidden md:flex items-center text-accent-cyan animate-pulse">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Summary Footer Bar */}
      <div className="w-full max-w-4xl glass-card rounded-3xl p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 hover:premium-glow transition-all">
        <div className="flex flex-col text-center md:text-left">
           <span className="text-[56px] font-black text-white leading-none tracking-tighter flex items-baseline gap-2">
             {opportunity.apy.toFixed(1)}% <span className="text-accent-cyan text-4xl">APY</span>
           </span>
           <span className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm mt-2">Total Estimated Yield</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="px-8 py-4 rounded-2xl border-2 border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan font-black text-2xl tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            {metadata.riskProfile.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}
