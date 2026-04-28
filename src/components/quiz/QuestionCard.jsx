// src/components/quiz/QuestionCard.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const isTrueFalse = question.type === "tf";
  const options = question.options;
  const correctIndex = question.answer;

  const handleSelect = (index) => {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);
  };

  const isCorrect = selected === correctIndex;

  const handleNext = () => {
    onAnswer(isCorrect);
    setSelected(null);
    setRevealed(false);
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      // Use flex-1 and h-full to force it to fill the screen vertically
      className="w-full h-full flex flex-col max-w-2xl mx-auto" 
    >
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          Question {questionNumber} / {totalQuestions}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-org-1">
          {Math.round(progress)}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-[#222] rounded-full overflow-hidden mb-4 border border-white/5 shrink-0">
        <motion.div
          className="h-full bg-brand-org-1"
          initial={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Main Card - flex-1 forces it to stretch down */}
      <div className="bg-[#222] border border-white/5 rounded-[2rem] p-4 sm:p-6 shadow-2xl relative overflow-hidden flex-1 flex flex-col">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-org-1 rounded-full blur-[80px] opacity-10 pointer-events-none shrink-0"></div>

        {/* Question Text */}
        <h2 className="text-xl font-black text-white leading-snug mb-4 relative z-10 shrink-0">
          {question.q}
        </h2>

        {/* Options Grid - scrolls if the screen is tiny, but usually static */}
        <div className={`grid gap-2 ${isTrueFalse ? "grid-cols-2" : "grid-cols-1"} relative z-10 shrink-0`}>
          {options.map((option, index) => {
            const isThis = selected === index;
            const isCorrectOption = index === correctIndex;
            
            let optionStyle = "bg-[#111] border border-white/5 text-gray-300";
            let letterStyle = "bg-[#222] text-gray-500";

            if (revealed) {
              if (isCorrectOption) {
                optionStyle = "bg-green-500/10 border-green-500/30 text-green-400";
                letterStyle = "bg-green-500/20 text-green-400";
              } else if (isThis && !isCorrectOption) {
                optionStyle = "bg-red-500/10 border-red-500/30 text-red-400";
                letterStyle = "bg-red-500/20 text-red-400";
              } else {
                optionStyle = "bg-[#111] border-white/5 text-gray-600 opacity-50";
              }
            } else {
              optionStyle += " hover:border-brand-org-1/30 cursor-pointer";
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={revealed}
                // Reduced padding (p-3) to save vertical space
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 text-left active:scale-[0.98] ${optionStyle}`}
              >
                {!isTrueFalse && (
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-colors ${letterStyle}`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                )}
                <span className="flex-1 text-sm font-semibold">{option}</span>
                
                {revealed && isCorrectOption && <CheckCircle2 size={16} className="text-green-400 shrink-0" />}
                {revealed && isThis && !isCorrectOption && <XCircle size={16} className="text-red-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Feedback Section - Takes up remaining space */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              // flex-1 ensures this section expands to fill the bottom of the card
              className="mt-4 pt-4 border-t border-white/5 relative z-10 flex flex-col flex-1 min-h-0"
            >
              {question.fact && (
                // Overflow-y-auto allows the fact to scroll IF it's too long, preventing the card from breaking
                <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex-1 overflow-y-auto mb-4">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <span className="text-brand-org-1 font-bold block mb-1 uppercase tracking-wider text-[10px]">The More You Know</span>
                    {question.fact}
                  </p>
                </div>
              )}
              
              {/* Next Button - Pinned to the bottom */}
              <div className="flex items-center justify-between mt-auto shrink-0">
                <span className={`font-black uppercase tracking-widest text-xs ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                  {isCorrect ? "Spot On! 🍺" : "Not Quite! 🍻"}
                </span>
                
                <button
                  onClick={handleNext}
                  className="bg-brand-org-1 text-black text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl flex items-center gap-2 active:scale-95 transition-transform"
                >
                  {questionNumber === totalQuestions ? "Results" : "Next"}
                  <ArrowRight size={14} />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}