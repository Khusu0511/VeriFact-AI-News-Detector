import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'veriFactAnalysisHistory';
const MAX_ITEMS = 15;

/**
 * Custom hook for managing analysis history with localStorage persistence.
 */
export function useHistory() {
  const [history, setHistory] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const addToHistory = useCallback((headline, prediction, confidence) => {
    setHistory(prev => {
      const entry = {
        headline,
        prediction,
        confidence,
        timestamp: Date.now(),
      };
      const updated = [entry, ...prev].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addToHistory, clearHistory };
}
