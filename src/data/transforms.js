// src/data/transforms.js
import { shuffleArray } from '../utils/shuffleArray';

const dayMap = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

export const transformBeers = (rows) =>
  rows.filter(b => b.name && b.name.trim() !== "");

export const transformFood = (rows) =>
  rows.filter(f => f.name && f.name.trim() !== "");

export const transformWine = (rows) =>
  rows.filter(w => w.name && w.name.trim() !== "" && w.is_available?.toUpperCase() === 'TRUE');

export const transformSpecials = (rows) =>
  rows
    .filter(row => row.Day && row.Title)
    .map(row => ({
      day: row.Day,
      title: row.Title,
      desc: row.Desc,
      dayId: dayMap[row.Day.toLowerCase().trim()] ?? 0,
    }))
    .sort((a, b) => {
      const valA = a.dayId === 0 ? 7 : a.dayId;
      const valB = b.dayId === 0 ? 7 : b.dayId;
      return valA - valB;
    });

export const transformQuizQuestions = (rows) => {
  const validQuestions = rows.filter(q => q.Question && q.Question.trim() !== "");

  return validQuestions.map((q, index) => {
    const originalOptions = [
      q["Option A"],
      q["Option B"],
      q["Option C"],
      q["Option D"]
    ].filter(val => val !== undefined && val !== "");

    const correctLetter = q["Correct Answer"];
    const letterMap = { A: 0, B: 1, C: 2, D: 3 };
    const correctText = originalOptions[letterMap[correctLetter]];
    const shuffledOptions = shuffleArray(originalOptions);
    const newCorrectIndex = shuffledOptions.indexOf(correctText);

    return {
      id: index,
      q: q.Question,
      type: "mc",
      options: shuffledOptions,
      answer: newCorrectIndex,
      fact: q["Did You Know? (Fact)"],
      category: q.Category?.trim() || "General",
    };
  });
};