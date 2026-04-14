---
phase: 3
status: pending
priority: medium
effort: small
---

# Phase 3: Utility Layer

<!-- Updated: Validation Session 1 - Zustand persist replaces manual storage, MP3 sounds from Pixabay/Mixkit -->

## Overview

Sound effects (MP3), timer hook, and theme/i18n utilities. LocalStorage persistence handled by Zustand persist middleware in Phase 5 — no manual `storage.ts` needed.

## Files to Create

### 1. `src/utils/sounds.ts` (~40 lines)

MP3 sound player with preloading.

```typescript
type SoundName = "tick" | "bell" | "night";

const SOUND_MAP: Record<SoundName, string> = {
  tick: "/sounds/timer-tick.mp3",
  bell: "/sounds/timer-end.mp3",
  night: "/sounds/night-ambience.mp3",
};

const audioCache: Record<string, HTMLAudioElement> = {};

export function preloadSounds(): void {
  Object.entries(SOUND_MAP).forEach(([key, src]) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audioCache[key] = audio;
  });
}

export function playSound(name: SoundName): void {
  try {
    const audio = audioCache[name] || new Audio(SOUND_MAP[name]);
    audio.currentTime = 0;
    audio.play().catch(() => {}); // Silently handle autoplay policy
  } catch {
    /* no-op if sound fails */
  }
}

export function stopSound(name: SoundName): void {
  const audio = audioCache[name];
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}
```

**Sound sources (royalty-free, no attribution required):**

- Timer tick: Pixabay — pixabay.com/sound-effects/search/timer%20ticking/
- Bell/ding: Mixkit — mixkit.co/free-sound-effects/bell/
- Night ambience: Pixabay or Freesound (CC0 uploads)

Download short clips (<50KB each), place in `public/sounds/`.

### 2. `src/hooks/use-timer.ts` (~50 lines)

Timer hook extracted from V17/V21 TimerBoard.

```typescript
interface TimerState {
  active: boolean;
  value: number;
  initial: number;
  type: "debate" | "judgment" | null;
  paused: boolean;
}

export function useTimer() {
  const [timer, setTimer] = useState<TimerState>(initialState);
  const timerRef = useRef<number | null>(null);

  const start = (seconds: number, type: "debate" | "judgment") => { ... };
  const togglePause = () => { ... };
  const stop = () => { ... };

  // Sound integration
  useEffect(() => {
    if (timer.value <= 10 && timer.value > 0) playSound("tick");
    if (timer.value === 0 && timer.initial > 0) playSound("bell");
  }, [timer.value]);

  // Cleanup interval on unmount
  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return { timer, start, togglePause, stop };
}
```

### 3. Sound files

Download and place in `public/sounds/`:

- `timer-tick.mp3` — short tick (~1s, <10KB)
- `timer-end.mp3` — bell ding (~2s, <20KB)
- `night-ambience.mp3` — wolf howl/night atmosphere (~5s, <30KB)

### ~~4. `src/utils/storage.ts`~~ — REMOVED

No longer needed. Zustand persist middleware (Phase 5) handles all localStorage persistence automatically.

## Success Criteria

- `playSound("tick")` plays audio (after user interaction)
- `useTimer()` counts down, pauses, stops correctly
- Sound playback doesn't crash even without audio files
- No manual storage utilities — Zustand persist handles persistence
