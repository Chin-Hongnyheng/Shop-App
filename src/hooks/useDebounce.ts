import { useState, useEffect, useRef } from 'react';

/**
 * Hand-written useDebounce<T>
 *
 * Why useRef instead of a bare variable?
 *   The timer id must survive re-renders without causing them.
 *   A plain variable would be reset each render; useState would trigger
 *   an extra render on every keystroke just to store a number.
 *   useRef keeps a stable mutable box that React ignores for scheduling.
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  // Stable mutable box — survives re-renders, never triggers a render itself
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Cancel any in-flight timer before scheduling a new one
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebounced(value);   // only fires if `delay` ms pass with no new value
    }, delay);

    // Cleanup: if the component unmounts mid-wait, kill the timer
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
