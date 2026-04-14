---
phase: 1
status: pending
priority: high
effort: medium
---

# Phase 1: Project Setup

<!-- Updated: Validation Session 1 - Tailwind v4, FA npm, Vitest+RTL+Playwright, react-i18next, dark/light theme -->

## Overview

Scaffold Vite + React 18 + TypeScript + Tailwind CSS v4 project with PWA, i18n, testing, and dark/light theme support.

## Requirements

- Vite dev server with HMR
- TypeScript strict mode
- Tailwind CSS v4 with `@tailwindcss/vite` plugin (NO PostCSS)
- PWA via vite-plugin-pwa (Workbox) with prompt-to-reload
- Font Awesome npm package (`@fortawesome/fontawesome-free`)
- Google Fonts (Bungee, Roboto)
- react-i18next for internationalization
- Vitest + React Testing Library + Playwright
- Dark/Light theme via Tailwind `dark:` class strategy

## Implementation Steps

1. **Init Vite project**

   ```bash
   npm create vite@latest . -- --template react-ts
   npm install
   ```

2. **Install core dependencies**

   ```bash
   # Tailwind v4
   npm install -D tailwindcss @tailwindcss/vite

   # PWA
   npm install -D vite-plugin-pwa

   # Font Awesome (npm, NOT CDN — PWA offline)
   npm install @fortawesome/fontawesome-free

   # State management
   npm install zustand

   # i18n
   npm install react-i18next i18next i18next-browser-languagedetector

   # Testing
   npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
   npm install -D @playwright/test
   npx playwright install
   ```

3. **Configure `vite.config.ts`**

   ```typescript
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";
   import tailwindcss from "@tailwindcss/vite";
   import { VitePWA } from "vite-plugin-pwa";

   export default defineConfig({
     plugins: [
       react(),
       tailwindcss(),
       VitePWA({
         registerType: "prompt", // prompt-to-reload strategy
         manifest: {
           name: "Werewolf Moderator",
           short_name: "Werewolf",
           theme_color: "#0f172a",
           background_color: "#0f172a",
           display: "standalone",
           icons: [
             {
               src: "/icons/icon-192.png",
               sizes: "192x192",
               type: "image/png",
             },
             {
               src: "/icons/icon-512.png",
               sizes: "512x512",
               type: "image/png",
             },
           ],
         },
         workbox: {
           globPatterns: ["**/*.{js,css,html,ico,png,svg,mp3,woff2}"],
         },
       }),
     ],
   });
   ```

4. **Configure `src/index.css`**

   ```css
   @import "tailwindcss";
   @import "@fortawesome/fontawesome-free/css/all.min.css";

   /* Google Fonts */
   @import url("https://fonts.googleapis.com/css2?family=Bungee&family=Roboto:wght@400;500;700&display=swap");

   /* Dark/Light theme base */
   :root {
     color-scheme: light dark;
   }

   /* CSS animations — see bottom of file */
   ```

5. **Configure `index.html`**

   ```html
   <!-- Viewport: no-scale for mobile game tool -->
   <meta
     name="viewport"
     content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
   />
   <meta name="apple-mobile-web-app-capable" content="yes" />
   <meta name="theme-color" content="#0f172a" />
   <!-- NO Font Awesome CDN — using npm package -->
   ```

6. **Configure testing**

   `vitest.config.ts`:

   ```typescript
   import { defineConfig } from "vitest/config";
   import react from "@vitejs/plugin-react";

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: "jsdom",
       globals: true,
       setupFiles: ["./src/test/setup.ts"],
     },
   });
   ```

   `src/test/setup.ts`:

   ```typescript
   import "@testing-library/jest-dom";
   ```

   `playwright.config.ts`:

   ```typescript
   import { defineConfig } from "@playwright/test";
   export default defineConfig({
     testDir: "./e2e",
     webServer: {
       command: "npm run preview",
       port: 4173,
       reuseExistingServer: true,
     },
   });
   ```

7. **Configure i18n**

   `src/i18n/index.ts` — i18next init with browser language detection.
   `src/i18n/vi.json` — Vietnamese strings (primary).
   `src/i18n/en.json` — English strings (placeholder).

8. **Create directory structure**

   ```
   src/
   ├── components/
   │   ├── common/
   │   ├── setup/
   │   └── game/
   ├── data/
   ├── hooks/
   ├── i18n/
   ├── store/
   ├── test/
   ├── types/
   └── utils/
   public/
   ├── icons/
   └── sounds/
   e2e/
   ```

9. **Create PWA assets**
   - `public/icons/icon-192.png` + `icon-512.png` (placeholder)

10. **Verify**
    - `npm run dev` → blank page, no errors
    - `npm run test` → vitest runs (0 tests)
    - `npm run build` → clean production build
    - Tailwind classes work
    - FA icons render
    - Dark/light class toggle works

## Files to Create/Modify

- `package.json` (auto + deps)
- `vite.config.ts`
- `vitest.config.ts`
- `playwright.config.ts`
- `tsconfig.json`
- `src/index.css`
- `src/test/setup.ts`
- `src/i18n/index.ts`
- `index.html`

## CSS Animations (from V17/V21)

```css
/* Flip card */
.flip-container {
  perspective: 1000px;
}
.flip-inner {
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform-style: preserve-3d;
}
.flip-container.flipped .flip-inner {
  transform: rotateY(180deg);
}
.flip-face {
  backface-visibility: hidden;
}
.flip-back {
  transform: rotateY(180deg);
}

/* Bottom sheet slide up */
.modal-enter {
  animation: slideUp 0.3s ease-out forwards;
}
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Timer glow */
.timer-glow-pulse {
  text-shadow: 0 0 30px currentColor;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}
```

## Success Criteria

- `npm run dev` → blank page loads, no errors
- Tailwind v4 classes work (test with `bg-slate-900`)
- FA icons render (`<i className="fas fa-moon" />`)
- PWA manifest registered in DevTools
- `npm run test` → vitest exits clean
- Dark/light toggle: adding `dark` class to `<html>` switches theme
- Directory structure ready
