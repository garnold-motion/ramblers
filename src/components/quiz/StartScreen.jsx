// src/components/quiz/StartScreen.jsx
import React from "react";
import { motion } from "framer-motion";
import { Trophy, Play } from "lucide-react";

export default function StartScreen({ onStart, totalQuestions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-[#222] border-2 border-brand-org-1/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(243,147,27,0.15)]"
      >
        <Trophy className="w-12 h-12 text-brand-org-1" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-tight"
      >
        Ramblers
        <span className="block text-brand-org-1">Beer Quiz</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex items-center gap-4 text-gray-500"
      >
        <span className="w-12 h-px bg-white/10" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          {totalQuestions} Random Questions
        </span>
        <span className="w-12 h-px bg-white/10" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 mt-6 max-w-sm text-sm leading-relaxed italic"
      >
        Test your knowledge of brewing history, beer styles, and pub culture. 
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onStart}
        className="mt-10 bg-brand-org-1 text-black font-black uppercase tracking-widest px-8 py-4 rounded-full flex items-center gap-2 active:scale-95 transition-transform shadow-[0_10px_20px_rgba(243,147,27,0.3)] hover:shadow-[0_10px_30px_rgba(243,147,27,0.5)]"
      >
        <Play size={18} fill="currentColor" />
        Start Challenge
      </motion.button>
    </motion.div>
  );
}