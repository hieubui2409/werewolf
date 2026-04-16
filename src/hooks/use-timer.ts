import { useState, useRef, useEffect, useCallback } from "react";
import { playSound } from "../utils/sounds";

interface TimerState {
  active: boolean;
  value: number;
  initial: number;
  type: "debate" | "judgment" | null;
  paused: boolean;
}

const INITIAL_STATE: TimerState = {
  active: false,
  value: 0,
  initial: 0,
  type: null,
  paused: false,
};

export function useTimer() {
  const [timer, setTimer] = useState<TimerState>(INITIAL_STATE);
  const timerRef = useRef<number | null>(null);

  // C3: Defensive clear — always clear before creating new interval
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(
    (seconds: number, type: "debate" | "judgment") => {
      clearTimer();
      setTimer({
        active: true,
        value: seconds,
        initial: seconds,
        type,
        paused: false,
      });
      const id = window.setInterval(() => {
        setTimer((prev) => {
          if (!prev.active) {
            clearInterval(id);
            timerRef.current = null;
            return prev;
          }
          if (prev.paused) return prev;
          if (prev.value <= 1) {
            clearInterval(id);
            timerRef.current = null;
            return { ...prev, value: 0, active: false };
          }
          return { ...prev, value: prev.value - 1 };
        });
      }, 1000);
      timerRef.current = id;
    },
    [clearTimer],
  );

  const togglePause = useCallback(() => {
    setTimer((prev) => ({ ...prev, paused: !prev.paused }));
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setTimer(INITIAL_STATE);
  }, [clearTimer]);

  // Sound integration
  useEffect(() => {
    if (timer.value <= 10 && timer.value > 0 && timer.active) playSound("tick");
    if (timer.value === 0 && timer.initial > 0) playSound("bell");
  }, [timer.value, timer.active, timer.initial]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, []);

  return { timer, start, togglePause, stop };
}
