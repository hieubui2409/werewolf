import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { preloadSounds, initMuteSync } from "./utils/sounds";
import { useGameStore } from "./store/game-store";
import { registerSW } from "virtual:pwa-register";

// H3: Polyfill requestIdleCallback for Safari
const ric =
  window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1));

// Preload sounds after initial render
ric(() => preloadSounds());

// Sync mute state from Zustand → sounds module
initMuteSync((cb) => {
  cb(useGameStore.getState().timerSettings.muted);
  return useGameStore.subscribe((state) => cb(state.timerSettings.muted));
});

// U8: PWA update via themed BottomSheet (replaces native confirm)
const updateSW = registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent("sw-update-available"));
  },
});
(window as unknown as { __updateSW?: typeof updateSW }).__updateSW = updateSW;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
