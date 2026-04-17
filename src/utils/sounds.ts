type SoundName = "tick" | "bell" | "night";

const SOUND_MAP: Record<SoundName, string> = {
  tick: "/sounds/timer-tick.mp3",
  bell: "/sounds/timer-end.mp3",
  night: "/sounds/night-ambience.mp3",
};

const audioCache: Record<string, HTMLAudioElement> = {};
let preloaded = false;
let globalMuted = false;

export function initMuteSync(
  subscribe: (cb: (muted: boolean) => void) => () => void,
): void {
  subscribe((muted) => {
    globalMuted = muted;
  });
}

export function preloadSounds(): void {
  if (preloaded) return;
  preloaded = true;
  Object.entries(SOUND_MAP).forEach(([key, src]) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audioCache[key] = audio;
  });

  // H2: Stop all sounds when tab becomes hidden (prevents ambient blasting)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAllSounds();
  });
}

export function playSound(name: SoundName): void {
  if (globalMuted) return;
  try {
    const audio = audioCache[name] || new Audio(SOUND_MAP[name]);
    audio.currentTime = 0;
    audio.play().catch(() => {});
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

export function stopAllSounds(): void {
  Object.keys(audioCache).forEach((key) => {
    const audio = audioCache[key];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
}
