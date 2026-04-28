// src/components/quiz/ResultsScreen.jsx
import React from "react";
import { motion } from "framer-motion";
import { RotateCcw, Trophy } from "lucide-react";

function getResultMessage(pct) {
  if (pct === 100) return { title: "Brewmaster!", subtitle: "Flawless. You truly know your beer." };
  if (pct >= 80) return { title: "Connoisseur", subtitle: "Impressive knowledge. Cheers to you!" };
  if (pct >= 60) return { title: "Solid Pour", subtitle: "You know your stuff. Keep sipping & learning." };
  if (pct >= 40) return { title: "Getting There", subtitle: "Not bad — a few more pints of study needed." };
  return { title: "Back to Basics", subtitle: "Time to hit the taproom and study up." };
}

export default function ResultsScreen({ score, total, onRestart }) {
  const percentage = Math.round((score / total) * 100);
  const result = getResultMessage(percentage);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      {/* Score Display */}
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        {/* Animated SVG Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" className="stroke-[#222]" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r="54"
            fill="none"
            className={percentage >= 60 ? "stroke-brand-org-1" : "stroke-gray-500"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 54}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - percentage / 100) }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        
        <div className="flex flex-col items-center justify-center relative z-10">
          <span className="text-5xl font-black text-white leading-none">{score}</span>
          <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 border-t border-white/10 pt-1 w-12">
            OF {total}
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Trophy className="w-8 h-8 text-brand-org-1 mx-auto mb-4" />
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
          {result.title}
        </h2>
        <p className="text-gray-400 text-sm italic max-w-xs mx-auto">
          {result.subtitle}
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={onRestart}
        className="mt-12 bg-[#222] border border-white/10 text-white font-black uppercase tracking-widest px-8 py-4 rounded-full flex items-center gap-2 active:scale-95 transition-all hover:bg-[#333] hover:border-brand-org-1/50"
      >
        <RotateCcw size={16} className="text-brand-org-1" />
        Play Again
      </motion.button>
    </motion.div>
  );
}