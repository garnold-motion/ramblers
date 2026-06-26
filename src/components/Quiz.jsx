// src/components/Quiz.jsx
import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import StartScreen from "./quiz/StartScreen";
import QuestionCard from "./quiz/QuestionCard";
import ResultsScreen from "./quiz/ResultsScreen";
import { useSheetData } from "../hooks/useSheetData";
import { SHEET_URLS } from "../config/sheets";

const QUIZ_SIZE = 10;

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const transformQuizQuestions = (rows) => {
  const validQuestions = rows.filter(q => q.Question && q.Question.trim() !== "");

  return validQuestions.map((q, index) => {
    const originalOptions = [
      q["Option A"],
      q["Option B"],
      q["Option C"],
      q["Option D"]
    ].filter(val => val !== undefined && val !== "");

    const correctLetter = q["Correct Answer"];

    const letterMap = { "A": 0, "B": 1, "C": 2, "D": 3 };
    const correctText = originalOptions[letterMap[correctLetter]];
    const shuffledOptions = shuffleArray(originalOptions);
    const newCorrectIndex = shuffledOptions.indexOf(correctText);

    return {
      id: index,
      q: q.Question,
      type: "mc",
      options: shuffledOptions,
      answer: newCorrectIndex,
      fact: q["Did You Know? (Fact)"]
    };
  });
};

export default function Quiz() {
  const [phase, setPhase] = useState("start");
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const {
    data: allQuestions,
    isLoading,
  } = useSheetData(SHEET_URLS.quiz, "ramblers_quiz_v3", transformQuizQuestions);

  const startQuiz = useCallback(() => {
    if (allQuestions.length === 0) return;
    const shuffled = shuffleArray(allQuestions);
    setActiveQuestions(shuffled.slice(0, Math.min(QUIZ_SIZE, shuffled.length)));
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