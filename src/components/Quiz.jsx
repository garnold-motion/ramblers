// src/components/Quiz.jsx
import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import StartScreen from "./quiz/StartScreen";
import QuestionCard from "./quiz/QuestionCard";
import ResultsScreen from "./quiz/ResultsScreen";
import { useSheetData } from "../hooks/useSheetData";
import { SHEET_URLS } from "../config/sheets";
import { transformQuizQuestions } from "../data/transforms";
import { shuffleArray } from "../utils/shuffleArray";

const QUIZ_SIZE = 10;
const RAMBLERS_COUNT = 3;

const buildQuizSet = (allQuestions) => {
  const ramblersPool = allQuestions.filter(q => q.category === "Ramblers");
  const generalPool = allQuestions.filter(q => q.category !== "Ramblers");

  const ramblersPick = shuffleArray(ramblersPool).slice(0, RAMBLERS_COUNT);
  const remainingSlots = QUIZ_SIZE - ramblersPick.length;
  const generalPick = shuffleArray(generalPool).slice(0, remainingSlots);

  let combined = [...ramblersPick, ...generalPick];
  if (combined.length < Math.min(QUIZ_SIZE, allQuestions.length)) {
    const usedIds = new Set(combined.map(q => q.id));
    const leftovers = shuffleArray(allQuestions.filter(q => !usedIds.has(q.id)));
    combined = combined.concat(leftovers.slice(0, QUIZ_SIZE - combined.length));
  }

  return shuffleArray(combined);
};

export default function Quiz() {
  const [phase, setPhase] = useState("start");
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const {
    data: allQuestions,
    isLoading,
  } = useSheetData(SHEET_URLS.quiz, "ramblers_quiz_v4", transformQuizQuestions);

  const startQuiz = useCallback(() => {
    if (allQuestions.length === 0) return;
    setActiveQuestions(buildQuizSet(allQuestions));
    setCurrentIndex(0);
    setScore(0);
    setPhase("quiz");
  }, [allQuestions]);

  const handleAnswer = useCallback((isCorrect) => {
    if (isCorrect) setScore((s) => s + 1);
    if (currentIndex + 1 >= activeQuestions.length) {
      setPhase("results");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, activeQuestions.length]);

  if (isLoading) {
    return <div className="flex justify-center pt-20 text-brand-org-1 animate-pulse font-bold tracking-widest uppercase text-xs">Loading Quiz...</div>;
  }

  return (
    <div className="w-full flex flex-col h-full bg-[#1a1a1a] overflow-hidden">
      <div className="flex-1 flex flex-col w-full mx-auto p-4 pb-4">
        <AnimatePresence mode="wait">
          {phase === "start" && (
            <StartScreen key="start" onStart={startQuiz} totalQuestions={Math.min(QUIZ_SIZE, allQuestions.length)} />
          )}
          {phase === "quiz" && activeQuestions[currentIndex] && (
            <QuestionCard
              key={`q-${currentIndex}`}
              question={activeQuestions[currentIndex]}
              questionNumber={currentIndex + 1}
              totalQuestions={activeQuestions.length}
              onAnswer={handleAnswer}
            />
          )}
          {phase === "results" && (
            <ResultsScreen
              key="results"
              score={score}
              total={activeQuestions.length}
              onRestart={startQuiz}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}