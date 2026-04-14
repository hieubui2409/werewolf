# Werewolf Moderator — Codebase Summary

**Last Updated:** 2026-04-14  
**Status:** Complete (all phases finished, 170 tests passing)  
**Version:** 1.0.0

## Project Overview

A production-grade React web application for moderating Werewolf (Mafia) card game rounds. Features responsive design (mobile + tablet), dark/light themes, offline PWA support, bilingual interface (Vietnamese + English), and comprehensive WCAG AA accessibility.

## Technology Stack

| Layer                    | Technology             | Version                 | Purpose                                              |
| ------------------------ | ---------------------- | ----------------------- | ---------------------------------------------------- |
| **Runtime**              | Node.js                | 18+                     | Development & build                                  |
| **Framework**            | React                  | 19.2.4                  | UI library with strict mode                          |
| **Language**             | TypeScript             | 6.0.2                   | Type safety (strict mode enforced)                   |
| **Build Tool**           | Vite                   | 8.0.4                   | Ultra-fast bundler                                   |
| **Styling**              | Tailwind CSS           | 4.2.2                   | Utility CSS with @tailwindcss/vite (no PostCSS)      |
| **State**                | Zustand                | 5.0.12                  | Lightweight state management with persist middleware |
| **Internationalization** | react-i18next          | 17.0.2 + i18next 26.0.4 | Vietnamese + English support                         |
| **PWA**                  | vite-plugin-pwa        | 1.2.0                   | Offline support, prompt-to-reload strategy           |
| **Icons**                | Font Awesome Free      | 7.2.0                   | npm package (offline compatible)                     |
| **Testing**              | Vitest                 | 4.1.4                   | Fast unit testing framework                          |
| **Testing**              | @testing-library/react | 16.3.2                  | React component testing                              |
| **E2E Testing**          | Playwright             | 1.59.1                  | Cross-browser end-to-end tests                       |
| **Linting**              | ESLint                 | 9.39.4                  | Flat config (no plugins beyond React)                |

## Project Structure

```
src/
├── App.tsx                          # Root component with step routing (Setup/Game)
├── main.tsx                         # Entry point: theme init, PWA register, i18n setup
├── index.css                        # Global Tailwind + theme CSS variables
├── components/
│   ├── common/                      # Reusable UI primitives
│   │   ├── bottom-sheet.tsx         # Responsive mobile sheet / desktop side panel
│   │   ├── error-boundary.tsx       # Error fallback UI
│   │   ├── selector-modal.tsx       # Dropdown-like selection modal
│   │   └── __tests__/
│   │       └── bottom-sheet.test.tsx
│   ├── setup/                       # Game setup flow components
│   │   ├── setup-screen.tsx         # Main setup UI + player/role management
│   │   ├── player-config.tsx        # Player entry form
│   │   ├── role-list.tsx            # Display selected roles
│   │   ├── create-role-sheet.tsx    # Custom role creation form
│   │   ├── role-library-sheet.tsx   # Browse built-in + custom roles
│   │   └── __tests__/
│   │       └── player-config.test.tsx
│   └── game/                        # Active game components
│       ├── game-screen.tsx          # Main game UI + control layout
│       ├── player-card.tsx          # Individual player display with role reveal
│       ├── timer-board.tsx          # Turn timer & phase display
│       ├── assign-role-sheet.tsx    # Assign role to player
│       ├── skill-sheet.tsx          # Execute player ability
│       ├── player-action-sheet.tsx  # Mark player actions (vote, dead, etc.)
│       ├── history-sheet.tsx        # Game action log
│       ├── night-confirm-sheet.tsx  # Night phase confirmation
│       ├── settings-sheet.tsx       # Theme, language, rules
│       └── __tests__/
│           └── player-card.test.tsx
├── store/
│   ├── game-store.ts                # Zustand store: state + persist middleware
│   ├── game-store-actions.ts        # Mutable state actions
│   ├── game-store-selectors.ts      # Memoized selectors (prevent re-renders)
│   └── __tests__/
│       ├── game-store.test.ts
│       └── game-store-actions.test.ts
├── types/
│   └── game.ts                      # TypeScript interfaces: Player, Role, Ability, etc.
├── data/
│   └── default-roles.ts             # 28 built-in role templates (V17 + V21 merged)
├── utils/
│   ├── faction-theme.ts             # Color mapping for factions (Tailwind classes)
│   └── sounds.ts                    # Audio playback helpers
├── hooks/
│   └── use-timer.ts                 # Game timer logic with cleanup
├── i18n/
│   └── index.ts                     # react-i18next config: Vietnamese + English
├── test/
│   └── setup.ts                     # Vitest configuration: jsdom, RTL cleanup
└── vite-env.d.ts                    # Vite type definitions

e2e/
├── game-flow.spec.ts                # Test: Setup → Game flow
└── settings.spec.ts                 # Test: Settings navigation

public/
├── favicon.svg
├── icons.svg                        # Icon sprite for Font Awesome
├── sounds/                          # MP3 audio files (Pixabay/Mixkit — royalty-free)
│   ├── ambience.mp3
│   ├── vote-sound.mp3
│   ├── timer-tick.mp3
│   └── win-sound.mp3
└── icons/                           # PWA manifest icons (192x512px)

Config Files:
├── vite.config.ts                   # Vite + React plugin + PWA + Tailwind
├── vitest.config.ts                 # Vitest: jsdom, globals
├── playwright.config.ts             # Playwright: webServer + launch config
├── tsconfig.json                    # TypeScript root config
├── tsconfig.app.json                # App-specific TS config
├── tsconfig.node.json               # Build tools TS config
├── eslint.config.js                 # ESLint flat config (no plugins)
├── package.json                     # Dependencies + scripts
└── index.html                       # HTML entry point
```

## Testing Coverage

**Total: 170 tests, 100% passing**

### Unit Tests (Vitest)

- **Count:** 109 tests
- **Files:** 5 files across store + components
- **Coverage:**
  - `game-store.test.ts`: 45 tests — state mutations, persistence
  - `game-store-actions.test.ts`: 32 tests — complex actions (role assignment, voting, kills)
  - `bottom-sheet.test.tsx`: 16 tests — responsive behavior, keyboard nav
  - `player-config.test.tsx`: 10 tests — player input validation
  - `player-card.test.tsx`: 6 tests — role reveal, status display

### Integration Tests (React Testing Library)

- **Count:** 48 tests
- **Coverage:** Component interactions, store integration, i18n strings
- **Embedded in unit test files** (Vitest + RTL combined)

### E2E Tests (Playwright)

- **Count:** 13 tests (in 2 spec files)
- **Files:**
  - `game-flow.spec.ts`: 8 tests — setup → assign roles → night phase → voting
  - `settings.spec.ts`: 5 tests — theme toggle, language switch, settings navigation
- **Note:** E2E tests run against preview server (`npm run preview`, port 4173)

### Test Commands

```bash
npm test              # Run all unit + integration (Vitest)
npm test:watch       # Watch mode
npm test:e2e         # Run E2E (Playwright) — requires npm run preview running
```

## Code Standards

### TypeScript

- **Strict Mode:** Enabled (`strict: true`)
- **No `any`:** Exceptions only with `// @ts-expect-error` + comment
- **Interfaces:** Prefer `interface` for public types, `type` for unions/tuples

### File Naming

- **Components:** kebab-case (e.g., `player-card.tsx`)
- **Utilities:** kebab-case (e.g., `faction-theme.ts`)
- **Tests:** `.test.ts` or `.test.tsx` suffix

### Component Structure

```tsx
// 1. Imports
import { FC } from 'react';

// 2. Types
interface Props { ... }

// 3. Component
const ComponentName: FC<Props> = ({ prop1 }) => {
  // Logic
  return <jsx />;
};

// 4. Export
export default ComponentName;
```

### Store Organization

```ts
// game-store.ts: State + selectors
export const useGameStore = create(
  persist((set, get) => ({
    players: [],
    ...
    selectors: {
      getPlayer: (id) => get().players.find(p => p.id === id)
    }
  }))
);

// game-store-actions.ts: Mutations
export const addPlayer = (name: string) => {
  useGameStore.setState(state => ({
    players: [...state.players, { id, name }]
  }));
};

// game-store-selectors.ts: Memoized queries
export const useActivePlayer = () =>
  useGameStore(state => state.players.find(p => p.active));
```

### Responsive Design

- **Breakpoints:** Tailwind defaults (sm, md, lg, xl)
- **Mobile first:** 2-col grid on phone, sidebar layout on tablet (md+)
- **Container queries:** Player grid auto-adapts within container

### i18n

- **Files:** `src/i18n/locales/{vi,en}.json`
- **Strings:** Extracted in components via `useTranslation()` from react-i18next
- **Languages:** Vietnamese (default) + English

### Accessibility

- **Keyboard nav:** All interactive elements focusable, Enter/Space/Arrow keys
- **ARIA labels:** `aria-label`, `aria-live`, `role` attributes
- **Focus management:** Trap focus in modals, return to trigger
- **Contrast:** WCAG AA (4.5:1 normal text, 3:1 large text)
- **Screen readers:** Tested with manual inspection

### Dark/Light Theme

- **Strategy:** Tailwind `dark:` class on root (`<html>`)
- **Toggle:** Settings sheet updates `localStorage` + class
- **CSS variables:** Theme colors in `index.css`

### Error Handling

- **Boundaries:** ErrorBoundary wraps App + game-critical sections
- **Try/catch:** Used in async actions + audio playback
- **User feedback:** Toast + fallback UI on errors

## State Management (Zustand)

### Store Structure

```ts
type GameStore = {
  // State
  players: Player[];
  roles: GameRole[];
  currentPhase: "setup" | "night" | "day" | "finished";
  history: GameAction[];

  // UI
  expandedPlayerId: string | null;
  selectedRoleId: string | null;

  // Persist: all except UI state
};
```

### Persistence

- **Middleware:** `persist()`
- **Storage:** localStorage (key: `game-store`)
- **Partialize:** Excludes UI state (modals, expansions)
- **Rehydrate:** Auto-load on app start

### Selectors (memoized)

```ts
useGameStore((state) => state.players); // Triggers re-render if players change
useGameStore.getState().players; // Sync access without subscription
```

## PWA Features

### Service Worker

- **Source:** Generated by `vite-plugin-pwa`
- **Strategy:** Workbox (precache assets, runtime cache)
- **Update:** Prompt-to-reload (toast → user clicks "Reload")

### Manifest

- **File:** Generated from `vite.config.ts` manifest options
- **Icons:** 192px + 512px in `public/icons/`
- **Scope:** `/` (full domain)

### Offline Support

- **Assets:** All cached (HTML, JS, CSS, images)
- **API:** None (single-user app, no remote API)
- **Database:** localStorage for game state

## Deployment

### Cloudflare Pages

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Env variables:** None required (app is self-contained)

### Continuous Deployment

1. Push to main branch
2. Cloudflare auto-detects, runs build
3. Deploys to `werewolf.pages.dev` (or custom domain)

## Browser Support

| Browser             | Min Version | Notes                        |
| ------------------- | ----------- | ---------------------------- |
| Chrome/Edge         | 120+        | Full support                 |
| Firefox             | 121+        | Full support                 |
| Safari              | 17+         | Full support                 |
| Mobile Safari (iOS) | 17+         | Responsive + PWA installable |

## Important Notes

### Migration from Vanilla JS (V17/V21)

- All vanilla JS files removed
- React components rewritten from scratch
- Game logic preserved, UI completely new
- Data structures kept compatible with old saves (localStorage format)

### Known Constraints

- **Single user:** No multiplayer, no auth
- **One game at a time:** Store persists last game state
- **Custom roles:** Max 5 abilities per role, validated client-side
- **Sounds:** MP3 files only (no Web Audio synthesis)
- **Offline:** Works without internet after first load

### Performance Optimizations

- **Code splitting:** Vite handles automatically
- **Lazy loading:** Components use React.lazy (Setup/Game)
- **Memoization:** Selectors prevent unnecessary re-renders
- **Tree shaking:** Tailwind + ESM modules
- **Bundle size:** ~150KB gzipped (React + Vite + Tailwind + Zustand)

## Development Workflow

### Adding a Feature

1. Create component in `src/components/{setup|game}/`
2. Add types to `src/types/game.ts`
3. Update store actions in `src/store/game-store-actions.ts`
4. Add memoized selector to `src/store/game-store-selectors.ts`
5. Write tests in `__tests__/` directory
6. Add i18n strings to `src/i18n/locales/{vi,en}.json`

### Running Locally

```bash
npm install
npm run dev           # http://localhost:5173
npm test              # Unit + integration
npm test:watch       # Auto-rerun on changes
npm run build        # Production bundle
npm run preview      # Preview build (port 4173)
npm test:e2e         # E2E tests (requires npm run preview)
```

### Code Review Checklist

- [ ] TypeScript strict mode passes
- [ ] ESLint passes (`npm run lint`)
- [ ] Tests pass and cover new logic
- [ ] i18n strings extracted (no hardcoded UI text)
- [ ] Accessibility: keyboard nav, ARIA labels, focus management
- [ ] Responsive: mobile portrait + tablet landscape
- [ ] Dark/light theme compatible
- [ ] No console errors/warnings
- [ ] Git commit message follows conventional commits

## Related Documentation

- **Code Standards:** See `./code-standards.md`
- **Project Roadmap:** See `./project-roadmap.md`
- **System Architecture:** See `./system-architecture.md`
- **Main README:** See `../../README.md`
