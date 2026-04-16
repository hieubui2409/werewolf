# Werewolf Game Codebase Exploration Report

**Date:** 2026-04-16  
**Project:** Werewolf Moderator (React + TypeScript + Zustand)

---

## 1. PROJECT STRUCTURE

**Root directory:** `/home/hieubt/Documents/werewolf/`

### Key directories

- `src/` — Main application source (31 TS/TSX files)
- `public/` — Static assets (sounds, images)
- `dist/` — Built output
- `docs/` — Project documentation
- `plans/` — Planning & reports
- `e2e/` — End-to-end tests (Playwright)
- `test-results/` — Test reports

### Source structure

```
src/
├── components/
│   ├── common/          # Shared components (BottomSheet, ErrorBoundary, SelectorModal)
│   ├── game/            # Game-phase components (GameScreen, PlayerCard, TimerBoard, ActionSheets)
│   └── setup/           # Setup-phase components (SetupScreen, RoleList, RoleLibrary)
├── store/               # Zustand state management (game-store.ts, actions, selectors)
├── types/               # TypeScript interfaces (game.ts)
├── hooks/               # Custom hooks (use-timer.ts)
├── utils/               # Utilities (sounds, faction-theme, i18n-helpers)
├── data/                # Default roles definition (921 lines)
├── i18n/                # i18next localization (vi.json, en.json)
├── test/                # Test setup
├── App.tsx
├── main.tsx
├── index.css            # Tailwind + custom CSS (195 lines)
└── vite-env.d.ts
```

---

## 2. TECHNOLOGY STACK

### Production Dependencies

- **React:** 19.2.4 — UI framework
- **Zustand:** 5.0.12 — Lightweight state management with persistence
- **i18next:** 26.0.4 — Internationalization (vi, en)
- **react-i18next:** 17.0.2 — React i18n integration
- **i18next-browser-languagedetector:** 8.2.1 — Auto language detection
- **@fortawesome/fontawesome-free:** 7.2.0 — Icons

### Build Tools

- **Vite:** 8.0.4 — Build bundler
- **TypeScript:** ~6.0.2 — Type safety
- **Tailwind CSS:** 4.2.2 — Utility CSS
- **@vitejs/plugin-react:** 6.0.1 — React HMR
- **vite-plugin-pwa:** 1.2.0 — PWA support

### Dev Tools

- **Vitest:** 4.1.4 — Unit tests
- **@testing-library/react:** 16.3.2
- **Playwright:** 1.59.1 — E2E tests
- **ESLint:** 9.39.4 — Linting

---

## 3. STORE STRUCTURE

### Location

- `/src/store/game-store.ts` (343 lines) — Main Zustand store with persistence
- `/src/store/game-store-actions.ts` (224 lines) — Pure computation functions
- `/src/store/game-store-selectors.ts` (48 lines) — Memoized selectors

### GameStore Interface (86 state fields + 24 methods)

**State:**

- `step`: "setup" | "game"
- `playerCount`, `players[]` — Player management
- `roleTemplates[]`, `roles[]` — Role definitions and instances
- `actionLog[]` — Action history
- `statusChangeLog[]`, `roleChangeLog[]` — Status/role change tracking
- `gameHistory[]` — Historical turn records
- `nightCount` — Current night number
- `timerSettings` — { debate, judgment } in seconds
- `cardViewMode` — "nameFirst" | "roleFirst" | "both"
- `flippedCards` — Card flip state by player ID

**Key Methods:**

- Player management: `handlePlayerCountChange()`, `updatePlayerName()`, `togglePlayerStatus()`
- Role management: `addRoleFromTemplate()`, `createCustomRole()`, `updateRoleName()`, `changeRoleOrder()`, `deleteRole()`
- Ability management: `addAbility()`, `updateAbility()`, `deleteAbility()`
- Game flow: `togglePlayerRole()`, `executeAction()`, `undoAction()`, `nextNight()`, `resetGame()`
- UI: `flipCard()`, `setCardViewMode()`, `setTimerSettings()`

**Persistence:** localStorage under key `"werewolf-game"` (partialize excludes flippedCards)

---

## 4. TYPES (game.ts — 95 lines)

### Core Interfaces

```typescript
type Faction = "villager" | "wolf" | "third"
type AbilityType = "nightly" | "limited"
type Category = "basic" | "advanced" | "custom"
type CardViewMode = "nameFirst" | "roleFirst" | "both"

Ability {
  id, name, nameKey?, type, max, targetCount
}

RoleTemplate {
  id, name, nameKey, order, category, faction, abilities[]
}

GameRole {
  id, templateId, name, nameKey?, order, faction, abilities[]
}

Player {
  id, name, roleId | null, alive, abilityUsage{}
}

ActionLog {
  id, executionId, turnAdded, sourceId, targetId, abilityId,
  abilityName, abilityNameKey?, abilityType, faction, timestamp
}

TurnHistory {
  night, endedAt, actionLogs[], statusLogs[], roleLogs[]
}

TimerSettings {
  debate: number, judgment: number
}
```

---

## 5. COMPONENTS OVERVIEW

**Total: ~3,678 lines across game, setup, common components**

### Common Components

- **BottomSheet** (107 lines) — Accessible modal drawer with focus trap, keyboard support (Escape, Tab), slide-up animation
- **ErrorBoundary** — Error handling wrapper
- **SelectorModal** — Role/option selection modal

### Setup Phase

- **SetupScreen** — Main setup interface
- **PlayerConfig** — Configure player count, names, status
- **RoleList** — Display and manage roles
- **RoleLibrarySheet** — Browse available roles
- **CreateRoleSheet** — Custom role creation

### Game Phase

- **GameScreen** — Main game interface
- **PlayerCard** (with flip animation) — Show player with name/role toggle
- **TimerBoard** — Display current timer
- **AssignRoleSheet** — Assign role to player
- **PlayerActionSheet** — Execute ability on targets
- **SkillSheet** — View available skills
- **HistorySheet** — Review turn history
- **NightConfirmSheet** — Confirm turn completion
- **SettingsSheet** — Configure timer durations

All sheets use **BottomSheet** wrapper with optional icons and custom title colors.

---

## 6. HOOKS

### use-timer.ts (70 lines)

**State Interface:**

```typescript
TimerState {
  active: boolean
  value: number          // Current countdown seconds
  initial: number        // Original duration
  type: "debate" | "judgment" | null
  paused: boolean
}
```

**API:**

- `start(seconds, type)` — Start countdown (clears previous)
- `togglePause()` — Pause/resume
- `stop()` — Clear timer
- `timer` — Current state

**Features:**

- 1-second resolution countdown
- Sound integration: `playSound("tick")` when ≤10s, `playSound("bell")` at 0
- Auto-cleanup on unmount
- State exposed as `{ timer, start, togglePause, stop }`

---

## 7. i18n SETUP

### Location

- `/src/i18n/index.ts` (20 lines) — i18next config
- `/src/i18n/vi.json` (165 lines) — Vietnamese (fallback)
- `/src/i18n/en.json` (165 lines) — English

### Configuration

- **LanguageDetector:** Auto-detect from browser
- **Fallback:** "vi" (Vietnamese)
- **Interpolation:** `escapeValue: false`

### Usage Pattern

```typescript
import { useTranslation } from "react-i18next";
const { t } = useTranslation();
```

**Helper function** (`src/utils/i18n-helpers.ts`):

```typescript
tr(t: TFunction, nameKey?: string, name: string): string
// Returns t(nameKey) with fallback to hardcoded name
```

---

## 8. SOUNDS UTILITY

### Location

`/src/utils/sounds.ts` (36 lines)

**Sound Map:**

- `tick` → `/sounds/timer-tick.mp3`
- `bell` → `/sounds/timer-end.mp3`
- `night` → `/sounds/night-ambience.mp3`

**API:**

```typescript
preloadSounds(): void          // Cache all audio elements
playSound(name: SoundName): void
stopSound(name: SoundName): void
```

**Features:**

- In-memory audio cache
- Automatic playback error suppression (try/catch)
- Resets `currentTime` before play to allow rapid retriggering

---

## 9. FACTION THEME UTILITY

### Location

`/src/utils/faction-theme.ts` (65 lines)

**Interface:**

```typescript
FactionStyle {
  border, borderSolid, bg, bgLight, text, textBright,
  badge, shadow, gradient
}
```

**Faction Styles:**

- **Villager:** Blue (shield + wheat motif)
- **Wolf:** Red (claw slashes + paw motif)
- **Third:** Purple (stars + mystical eye)
- **Dead:** Dark red (grayscale filter)

---

## 10. BOTTOM SHEET COMPONENT

### Location

`/src/components/common/bottom-sheet.tsx` (107 lines)

### Props

```typescript
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: string; // FontAwesome icon class
  titleColor?: string; // Tailwind color class
  fullHeight?: boolean; // 90vh vs max-h-85vh
  children: ReactNode;
}
```

### Features

- **Accessibility:** ARIA dialog role, aria-modal, aria-labelledby
- **Focus Management:** Trap Tab within sheet, auto-focus first element, restore previous focus on close
- **Keyboard Support:** Escape to close, Tab cycling
- **Animation:** Slide-up `.modal-enter` (0.3s ease-out)
- **Responsive:** Full-width mobile, max-w-640px on desktop
- **Styling:**
  - Dark mode support
  - Backdrop blur + black overlay (85%)
  - Rounded top corners (2rem mobile, 2rem desktop)
  - Safe area padding for notched phones (env `safe-area-inset-bottom`)

---

## 11. INDEX.CSS STRUCTURE

### Location

`/src/index.css` (195 lines)

### Structure

**Imports:**

- Google Fonts (Bungee, Roboto)
- Tailwind CSS v4
- FontAwesome 6 Free

**Global Styles:**

- Root: light/dark color-scheme
- Body: user-select none, -webkit-tap-highlight transparent, no overscroll
- `.hide-scrollbar` — Cross-browser scrollbar hiding

**Flip Card Animation:**

- `.flip-container` / `.flip-inner` — Grid-based 3D perspective
- Transform: `rotateY(180deg)` on `.flipped` state
- Grid overlap ensures auto-height (no layout shift)

**Faction Card Patterns** (pseudo-elements + SVG backgrounds):

- `.card-pattern-villager` — Blue shield pattern (12% opacity)
- `.card-pattern-wolf` — Red claw slashes (12% opacity)
- `.card-pattern-third` — Purple stars + eye (12% opacity)
- `.card-pattern-mixed` — All three factions combined
- All have `::after` FontAwesome icon watermark

**Effects:**

- `.dead-card` — grayscale(0.7) + brightness(0.7) + opacity(0.65)
- `.modal-enter` — Keyframe slideUp animation (translateY 100% → 0)
- `.timer-glow-pulse` — text-shadow glow + scale pulse (2s infinite)

---

## 12. DATA: DEFAULT ROLES

### Location

`/src/data/default-roles.ts` (921 lines)

### Structure

- `DEFAULT_ROLES: RoleTemplate[]` — Comprehensive role library (basic, advanced, custom)
- `INITIAL_ROLE_IDS: string[]` — Subset for game startup

### Role Categories

- **Basic:** Wolf, Seer, Guard, Villager
- **Advanced:** Hunter, Witch, Cupid, Mayor, Medium, etc.
- **Custom:** User-created roles

Each role defines:

- Faction (villager, wolf, third)
- Abilities with type (nightly or limited) and max uses
- i18n nameKey for translations

---

## 13. KEY EXPORTS & INTERFACES SUMMARY

| File                                 | Key Exports                                                                                         |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `game-store.ts`                      | `useGameStore()` hook                                                                               |
| `game-store-actions.ts`              | `createInitialPlayers()`, `addRoleFromTemplate()`, `executeAction()`, `undoAction()`                |
| `game-store-selectors.ts`            | `useRoleMap()`, `usePlayerActionMap()`, `useSortedRoles()`, `useSortedPlayers()`                    |
| `types/game.ts`                      | `Faction`, `Ability`, `RoleTemplate`, `GameRole`, `Player`, `ActionLog`, `TurnHistory`, `GameState` |
| `hooks/use-timer.ts`                 | `useTimer()`                                                                                        |
| `utils/sounds.ts`                    | `preloadSounds()`, `playSound()`, `stopSound()`                                                     |
| `utils/faction-theme.ts`             | `getFactionStyle()`, `FactionStyle`                                                                 |
| `utils/i18n-helpers.ts`              | `tr()`                                                                                              |
| `components/common/bottom-sheet.tsx` | `BottomSheet` component                                                                             |

---

## 14. NOTES

1. **Persistence:** Zustand persists state to localStorage; flippedCards excluded
2. **i18n:** Fallback Vietnamese, auto-detects user language
3. **Sound:** Cached audio elements with fail-silent error handling
4. **Accessibility:** BottomSheet includes focus trapping and keyboard support
5. **Dark Mode:** Tailwind class-based (`.dark` selector)
6. **PWA:** vite-plugin-pwa configured for offline capability
7. **Testing:** Vitest (unit), Playwright (E2E), Testing Library (React components)
8. **ID Generation:** Custom `uid()` function with timestamp + counter + random string

---

**Report complete. All file paths are absolute. Ready for implementation tasks.**
