// src/components/Quiz.jsx
import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import StartScreen from "./quiz/StartScreen";
import QuestionCard from "./quiz/QuestionCard";
import ResultsScreen from "./quiz/ResultsScreen";

const QUIZ_SIZE = 10; 

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function Quiz() {
  const [phase, setPhase] = useState("start"); 
  const [allQuestions, setAllQuestions] = useState([]);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. INSTANT BOOT: Using 'ramblers_quiz_v2' to ensure we get the fresh Aussie questions
    const cacheKey = 'ramblers_quiz_v2';
    const cachedQuiz = localStorage.getItem(cacheKey);
    
    if (cachedQuiz) {
      console.log("Loading from cache...");
      setAllQuestions(JSON.parse(cachedQuiz));
      setIsLoading(false);
    }

    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTV2u2qZRaxVYdmuUljK4VG8ay4eECd6DFXB2fy0o0BIq65-XakEXTz7_GvxpCWpEctIW9FIiSVJ3l/pub?gid=2087075376&single=true&output=csv"; 
    
    Papa.parse(sheetURL, {
      download: true,
      header: true,
      complete: (results) => {
        console.log("Sheet data received:", results.data[0]); // Debug log

        const validQuestions = results.data.filter(q => q.Question && q.Question.trim() !== "");
        
        const formattedQuestions = validQuestions.map((q, index) => {
          // ALIGNED HEADERS: Matching the new XLSX column names exactly
          const originalOptions = [
            q["Option A"],
            q["Option B"],
            q["Option C"],
            q["Option D"]
          ].filter(val => val !== undefined && val !== ""); 

          const correctLetter = q["Correct Answer"]; // "A", "B", etc.
          
          // Map letter to the index in our originalOptions array
          const letterMap = { "A": 0, "B": 1, "C": 2, "D": 3 };
          const correctText = originalOptions[letterMap[correctLetter]];

          // Shuffle for the game
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

        setAllQuestions(formattedQuestions);
        setIsLoading(false);
        localStorage.setItem(cacheKey, JSON.stringify(formattedQuestions));
      },
      error: (error) => {
        console.error("Fetch failed:", error);
        if (!cachedQuiz) setIsLoading(false); 
      }
    });
  }, []);

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