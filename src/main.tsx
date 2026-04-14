import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { preloadSounds } from "./utils/sounds";
import { registerSW } from "virtual:pwa-register";

// Preload sounds
preloadSounds();

// PWA: prompt-to-reload
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Có bản cập nhật mới. Tải lại?")) {
      updateSW(true);
    }
  },
});

// Theme: apply saved preference or system default
const savedTheme = localStorage.getItem("werewolf-theme");
if (
  savedTheme === "dark" ||
  (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
