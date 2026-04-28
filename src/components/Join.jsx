import React from 'react';
import { Beer, Star, Gift, ArrowUpRight } from 'lucide-react';

const Join = () => {
  const benefits = [
    { icon: <Star className="text-brand-org-1" size={18} />, text: "10% back in points on every purchase" },
    { icon: <Beer className="text-brand-org-1" size={18} />, text: "Exclusive access to free beer rewards" },
    { icon: <Gift className="text-brand-org-1" size={18} />, text: "Up to $150 in Birthday Credit" },
  ];

  return (
    <div className="flex flex-col items-center justify-between h-full w-full bg-[#1a1a1a] px-6 py-4 text-center overflow-hidden relative">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-org-1 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <header className="relative z-10 mt-8">
        <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-2">
          BECOME A <span className="text-brand-org-1">RAMBLER</span>
        </h1>
        <p className="text-lg sm:text-xl font-black text-white/90 uppercase tracking-tight">
          CASH IN, DRINK BETTER.
        </p>
      </header>

      <div className="relative z-10 w-full max-w-sm bg-[#222] border border-white/5 rounded-[2rem] p-5 shadow-2xl my-4">
        <div className="flex flex-col gap-4 text-left">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="bg-white/5 p-2 rounded-xl shrink-0">{b.icon}</div>
              <p className="text-gray-300 font-bold leading-tight uppercase text-[11px] sm:text-sm">
                {b.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-white/5">
          <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-tight">
            Earn & Redeem Online or at the Taproom <br />
            Credit valid 2 weeks either side of your birthday
          </p>
        </div>
      </div>

      {/* FOOTER: Tightened button and bottom status */}
      <div className="relative z-10 flex flex-col items-center gap-4 mb-2 w-full">
        <a 
          href="https://www.ramblersaleworks.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full max-w-xs bg-brand-org-1 text-black font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_10px_20px_rgba(243,147,27,0.2)]"
        >
          Join The Crew
          <ArrowUpRight size={18} strokeWidth={3} />
        </a>

        <div className="flex items-center gap-3 opacity-60">
          <span className="h-px w-6 bg-white/20"></span>
          <span className="text-brand-org-1 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">
            LIVE APRIL 2026
          </span>
          <span className="h-px w-6 bg-white/20"></span>
        </div>
      </div>
    </div>
  );
};

export default Join;