// src/components/Game.jsx
import React from 'react';
import { Gamepad2 } from 'lucide-react';

const Game = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#1a1a1a] px-6 text-center overflow-hidden relative">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-org-1 rounded-full blur-[120px] opacity-5 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Icon */}
        <div className="mb-6 p-4 bg-white/5 rounded-3xl border border-white/5 shadow-2xl animate-pulse">
          <Gamepad2 size={40} className="text-brand-org-1" />
        </div>

        <h1 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-4">
          PINT <br /> 
          <span className="text-brand-org-1">POURER</span>
        </h1>

        <div className="flex items-center gap-3 mt-4">
          <span className="h-px w-8 bg-white/10"></span>
          <p className="text-sm sm:text-base font-black text-white/40 uppercase tracking-[0.4em]">
            Coming Soon
          </p>
          <span className="h-px w-8 bg-white/10"></span>
        </div>
      </div>
    </div>
  );
};

export default Game;