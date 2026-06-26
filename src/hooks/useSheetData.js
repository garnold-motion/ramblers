// src/hooks/useSheetData.js
import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';

/**
 * @param {string} url
 * @param {string} cacheKey
 * @param {(rows: object[]) => any} [transform]
 */

export function useSheetData(url, cacheKey, transform = (rows) => rows) {
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(() => {
    try {
      return !localStorage.getItem(cacheKey);
    } catch {
      return true;
    }
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Papa.parse(url, {
      download: true,
      header: true,
      complete: (results) => {
        if (cancelled) return;
        try {
          const shaped = transformRef.current(results.data);
          setData(shaped);
          setIsLoading(false);
          setError(null);
          localStorage.setItem(cacheKey, JSON.stringify(shaped));
        } catch (err) {
          console.error(`useSheetData: transform failed for "${cacheKey}"`, err);
          setIsLoading(false);
          setError(err);
        }
      },
      error: (err) => {
        if (cancelled) return;
        console.error(`useSheetData: fetch failed for "${cacheKey}"`, err);
        setIsLoading(false);
        setError(err);
      },
    });

    return () => {
      cancelled = true;
    };
  }, [url, cacheKey]);

  return { data, isLoading, error };
}
