import { useState, useCallback, useEffect } from 'preact/hooks';
import type { HistoryEntry } from '../types';

/**
 * LocalStorage key for history
 */
const STORAGE_KEY = 'mathpwa-history';

/**
 * Maximum number of history entries
 */
const MAX_ENTRIES = 100;

/**
 * Load history from localStorage
 */
function loadHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    // Validate entries
    return parsed.filter(
      (entry): entry is HistoryEntry =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof entry.id === 'string' &&
        typeof entry.expression === 'string' &&
        typeof entry.result === 'string' &&
        typeof entry.timestamp === 'number'
    );
  } catch {
    return [];
  }
}

/**
 * Save history to localStorage
 */
function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

export interface UseHistoryReturn {
  entries: HistoryEntry[];
  addEntry: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  removeEntry: (id: string) => void;
}

/**
 * Hook for managing calculation history with localStorage persistence
 */
export function useHistory(): UseHistoryReturn {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => loadHistory());

  // Save to localStorage whenever entries change
  useEffect(() => {
    saveHistory(entries);
  }, [entries]);

  const addEntry = useCallback((entry: HistoryEntry) => {
    setEntries((prev) => {
      // Add new entry at the beginning
      const updated = [entry, ...prev];

      // FIFO: Keep only the most recent MAX_ENTRIES
      if (updated.length > MAX_ENTRIES) {
        return updated.slice(0, MAX_ENTRIES);
      }

      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setEntries([]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  return {
    entries,
    addEntry,
    clearHistory,
    removeEntry,
  };
}
