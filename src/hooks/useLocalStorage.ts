import { useState } from 'react';

/**
 * Hand-written useLocalStorage<T>
 * - Reads the stored JSON on first render (lazy initialiser → no SSR flash)
 * - setValue keeps React state and localStorage in sync atomically
 * - Swallows parse / access errors silently so the app never hard-crashes
 */
function useLocalStorage<T>(
  key: string,
  initial: T
): [T, (val: T | ((prev: T) => T)) => void] {
  // Lazy initialiser: runs once; never re-reads localStorage after mount
  const [stored, setStored] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setValue = (val: T | ((prev: T) => T)) => {
    try {
      setStored((prev) => {
        const next = typeof val === 'function' ? (val as (prev: T) => T)(prev) : val;
        window.localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    } catch {
      /* quota exceeded or private-browsing restriction — degrade gracefully */
    }
  };

  return [stored, setValue];
}

export default useLocalStorage;
