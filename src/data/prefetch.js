// src/data/prefetch.js
import { fetchAndCacheSheet, isCacheFresh } from '../hooks/useSheetData';
import { SHEET_URLS } from '../config/sheets';
import { transformWine, transformQuizQuestions } from './transforms';

const PREFETCH_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

// Beers/Food/Specials are already fetched on initial load by the components
// that render first ("What's On"). Wine and Quiz are otherwise lazy — they
// only fetch once the person taps into that tab. Warming them here means
// the data has often already arrived by the time someone gets there.
const PREFETCH_TARGETS = [
  { url: SHEET_URLS.wine, cacheKey: 'ramblers_wine_v1', transform: transformWine },
  { url: SHEET_URLS.quiz, cacheKey: 'ramblers_quiz_v4', transform: transformQuizQuestions },
];

export function prefetchAllSheets() {
  PREFETCH_TARGETS.forEach(({ url, cacheKey, transform }) => {
    if (!isCacheFresh(cacheKey, PREFETCH_MAX_AGE_MS)) {
      fetchAndCacheSheet(url, cacheKey, transform).catch((err) => {
        console.error(`prefetchAllSheets: failed for "${cacheKey}"`, err);
      });
    }
  });
}