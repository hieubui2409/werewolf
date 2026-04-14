---
phase: 8
status: pending
priority: high
effort: small
---

# Phase 8: Integration & Polish

<!-- Updated: Validation Session 1 - Cloudflare Pages, PWA prompt-to-reload, responsive, Zustand (no Context), dark/light -->

## Overview

Wire everything together in App.tsx + main.tsx. PWA setup with prompt-to-reload, Cloudflare Pages deploy config, mobile polish.

## Files to Create/Modify

### 1. `src/App.tsx` (~40 lines)

```tsx
import { ErrorBoundary } from "./components/common/error-boundary";
import { SetupScreen } from "./components/setup/setup-screen";
import { GameScreen } from "./components/game/game-screen";
import { useGameStore } from "./store/game-store";
import { useTranslation } from "react-i18next";

export function App() {
  const step = useGameStore((s) => s.step);
  const { t } = useTranslation();

  return (
    <ErrorBoundary>
      <div
        className="w-full min-h-screen md:min-h-screen max-w-lg md:max-w-none mx-auto
                      bg-gray-50 dark:bg-slate-900
                      md:border-x md:border-gray-200 dark:md:border-slate-800 shadow-2xl"
      >
        {step === "setup" ? <SetupScreen /> : <GameScreen />}
      </div>
    </ErrorBoundary>
  );
}
```

**Note:** No Context providers needed — Zustand store is global. i18n initialized in main.tsx.

### 2. `src/main.tsx` (~20 lines)

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import "./i18n"; // i18next init
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### 3. PWA Final Setup

Verify in `vite.config.ts`:

- Manifest: name "Werewolf Moderator", short_name "Werewolf", theme_color `#0f172a`, background_color `#0f172a`, icons
- registerType: `"prompt"` — prompt-to-reload strategy
- Workbox: precache all assets including MP3 sounds, runtime cache for Google Fonts CDN

### 4. Cloudflare Pages Deploy

Create `wrangler.toml` or use Cloudflare dashboard:

- Build command: `npm run build`
- Output dir: `dist`
- No special config needed for SPA — Cloudflare Pages auto-handles SPA routing

Optional `public/_redirects`:

```
/*  /index.html  200
```

### 5. Mobile Polish Checklist

- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`
- [ ] `<meta name="apple-mobile-web-app-capable" content="yes">`
- [ ] `<meta name="theme-color" content="#0f172a">`
- [ ] Body: `user-select: none; -webkit-tap-highlight-color: transparent; overflow: hidden; overscroll-behavior-y: none;`
- [ ] All touch targets ≥48px
- [ ] Bottom buttons avoid iPhone safe area (`pb-safe` or `env(safe-area-inset-bottom)`)
- [ ] No hover-only interactions
- [ ] Dark/light meta theme-color updates on toggle

### 6. Build Verification

```bash
npm run build    # Should produce dist/ with no errors
npm run preview  # Serve production build, test on mobile
```

- Check: no TypeScript errors
- Check: no console errors
- Check: PWA installable + prompt-to-reload works
- Check: Zustand persist saves/loads from localStorage
- Check: sound plays on timer
- Check: dark/light theme toggles correctly
- Check: i18n language switch works
- Check: responsive sidebar layout on tablet
- Check: WCAG AA keyboard navigation

## Success Criteria

- `npm run dev` → full app works
- `npm run build` → clean production build
- PWA installable on mobile, prompt-to-reload on update
- All game flows work end-to-end
- Cloudflare Pages deployment ready
- Lighthouse PWA score ≥90
- Lighthouse Accessibility score ≥90
