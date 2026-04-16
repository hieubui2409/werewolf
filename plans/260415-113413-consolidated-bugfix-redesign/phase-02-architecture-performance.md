# Phase 2: Architecture, Performance & Bundle Optimization

## Context

- [Code Review Audit](../reports/code-review-260415-102842-full-codebase-audit.md) — A1-A7, P1-P9
- [UI/UX Redesign](../reports/ui-ux-260415-111014-werewolf-redesign-proposal.md) — Section 4 (Icons), Section 10 (Perf)
- Priority: **P1** — architecture + performance before visual changes

## Overview

Fix 6 architecture concerns, 8 performance issues, replace Font Awesome with Lucide React (~1MB savings). Stabilize codebase structure before UI redesign.

---

## Architecture Concerns (6)

### A1: No localStorage version/migration strategy — EXPAND migration logic

- **File:** `src/store/game-store.ts:290+`
- **[RED-TEAM] Note:** Version marker (`version: 1`) + executionId conversion ALREADY added in Phase 1 PRE-A1. This task EXPANDS `migrate()` with remaining v0→v1 logic (timestamps).
- **[VALIDATED]** executionId number→string conversion already handled by Phase 1 PRE-A1. This phase adds timestamp backfill only.
- **Fix:** Expand `migrate()` to add timestamp backfill:
  ```ts
  migrate: (state, version) => {
    if (version === 0 || version === undefined) {
      // executionId conversion already done by PRE-A1
      // v0→v1 expansion: add timestamp defaults
      state.statusChangeLog?.forEach((e) => (e.timestamp ??= Date.now()));
      state.roleChangeLog?.forEach((e) => (e.timestamp ??= Date.now()));
    }
    return state;
  };
  ```

### A2: Custom role templates accumulate forever

- **File:** `src/components/setup/role-library-sheet.tsx`
- **Fix:** Add delete button for custom templates (`isCustom: true` only). Confirm before delete.

### A3: Duplicate uid() in 2 files

- **Fix:** Extract to `src/utils/uid.ts`. Update imports in `game-store.ts` and `game-store-actions.ts`.
- **New file:** `src/utils/uid.ts`

### A5: default-roles.ts is 921 lines

- **File:** `src/data/default-roles.ts`
<!-- Updated: Validation Session 2 - Re-export + update imports (Q16) -->
- **[VALIDATED] Approach:** Re-export barrel + update imports gradually.
- **Fix:** Split by faction:
  - `src/data/roles/village-roles.ts`
  - `src/data/roles/wolf-roles.ts`
  - `src/data/roles/third-party-roles.ts`
  - `src/data/default-roles.ts` — re-export combined array (safety net barrel)
  - Update import sites to use faction-specific files where possible

### A6: No error recovery from corrupted localStorage

<!-- Updated: Validation Session 2 - ErrorBoundary + native fallback (Q17) -->

- **File:** `src/store/game-store.ts`
- **[VALIDATED] Approach:** React ErrorBoundary + fallback UI. onRehydrateStorage error → set error state → ErrorBoundary catch → render recovery dialog. Nếu React mount fail hoàn toàn → fallback native confirm().
- **Fix:** Wrap rehydration in try/catch via `onRehydrateStorage`. On error → show recovery dialog: (1) Reset to defaults, (2) Export raw JSON for debugging. Fallback: native `confirm()` if React unavailable.

### A7: Error boundary exposes raw error stack

- **File:** `src/components/common/error-boundary.tsx`
- **Fix:** Toggle stack visibility by `import.meta.env.DEV`. Production = friendly message only.

---

## Performance Issues (8)

### P1: Google Fonts render-blocking CSS import

- **File:** `src/index.css:1` — remove `@import url("https://fonts.googleapis.com/...")`
- **File:** `index.html` — add `<link rel="preload">` + non-blocking stylesheet load
- **Note:** Keep current fonts (Bungee+Roboto) for now. Font swap to Bebas+Inter in Phase 3.
- **Impact:** -200-800ms FCP

### P2: Font Awesome entire library imported (~1MB)

- **Remove:** `@fortawesome/fontawesome-free` from `package.json`
- **Remove:** `@import "@fortawesome/fontawesome-free/css/all.min.css"` from `src/index.css`
- **Install:** `lucide-react`
- **Migrate:** All 35 FA `<i className="fa-*">` → Lucide React components across 16 files
- **Custom SVGs (3):** Create `src/components/icons/werewolf-skull.tsx`, `wolf-paw.tsx`, `mystic-eye.tsx`
- **CSS cleanup:** Remove all `::after` content rules using FA unicode from `index.css`
- **Impact:** ~1MB → ~8KB (99.2% reduction)

**Icon migration map (35 icons, 16 files):**

| FA Icon                | Lucide                        | Files                                                                   |
| ---------------------- | ----------------------------- | ----------------------------------------------------------------------- |
| fa-moon                | `Moon`                        | game-screen, skill-sheet, night-confirm, player-action, settings, setup |
| fa-sun                 | `Sun`                         | settings-sheet                                                          |
| fa-cog                 | `Settings`                    | timer-board, settings-sheet, setup-screen                               |
| fa-play                | `Play`                        | timer-board, setup-screen                                               |
| fa-pause               | `Pause`                       | timer-board                                                             |
| fa-stop                | `Square`                      | timer-board                                                             |
| fa-comments            | `MessageSquare`               | timer-board                                                             |
| fa-gavel               | `Gavel`                       | timer-board                                                             |
| fa-book-open           | `BookOpen`                    | timer-board                                                             |
| fa-book                | `Library`                     | setup-screen                                                            |
| fa-wand-sparkles       | `Wand2`                       | game-screen, skill-sheet                                                |
| fa-wand-magic-sparkles | `Sparkles`                    | create-role-sheet                                                       |
| fa-theater-masks       | `Drama`                       | game-screen, assign-role-sheet                                          |
| fa-times               | `X`                           | player-card, player-action-sheet, bottom-sheet, role-list               |
| fa-chevron-up/down     | `ChevronUp/Down`              | history-sheet, assign-role-sheet                                        |
| fa-arrow-left/right    | `ArrowLeft/Right`             | skill-sheet, history-sheet                                              |
| fa-ellipsis-v          | `MoreVertical`                | player-card                                                             |
| fa-plus                | `Plus`                        | role-list, create-role-sheet                                            |
| fa-plus-circle         | `PlusCircle`                  | role-library-sheet                                                      |
| fa-trash-alt/trash     | `Trash2/Trash`                | role-list, create-role-sheet, settings-sheet                            |
| fa-check               | `Check`                       | role-library-sheet, create-role-sheet                                   |
| fa-skull               | `Skull`                       | player-card, history-sheet                                              |
| fa-skull-crossbones    | Custom `WerewolfSkull`        | player-card                                                             |
| fa-heart               | `Heart`                       | history-sheet, player-action-sheet                                      |
| fa-lock                | `Lock`                        | player-card, player-action-sheet                                        |
| fa-crosshairs          | `Crosshair`                   | skill-sheet, role-list                                                  |
| fa-undo                | `Undo2`                       | history-sheet                                                           |
| fa-exchange-alt        | `ArrowLeftRight`              | history-sheet                                                           |
| fa-users               | `Users`                       | selector-modal                                                          |
| fa-hashtag             | `Hash`                        | selector-modal                                                          |
| fa-paw (CSS)           | Custom `WolfPaw`              | index.css card pattern                                                  |
| fa-shield (CSS)        | Custom SVG or Lucide `Shield` | index.css card pattern                                                  |
| fa-eye (CSS)           | Custom `MysticEye`            | index.css card pattern                                                  |
| fa-hat-wizard (CSS)    | Lucide `Wand2` or remove      | index.css card pattern                                                  |

### P3: PlayerConfig re-renders 30 inputs on any keystroke

<!-- Updated: Validation Session 2 - Memoized sub-component approach (Q23) -->

- **File:** `src/components/setup/player-config.tsx`
- **[VALIDATED] Approach:** Memoized sub-component. Extract `<PlayerInput />` with `React.memo`. Controlled inputs, predictable behavior.
- **Fix:** Extract each player input into memoized `<PlayerInput />` sub-component. Each input only re-renders when its own props change.

### P4: HistorySheet row builders not memoized

- **File:** `src/components/game/history-sheet.tsx:69-110`
- **Fix:** Memoize `buildCurrentRows()` and `buildPastRows()` with `useMemo`. Deps: `actionLog`, `gameHistory`.

### P5: flipCard creates new object → cascading re-render

- **File:** `src/store/game-store.ts:316`
- **Fix:** Structural sharing: only create new entry for flipped card, spread existing for others.

### P6: Persist serializes roleTemplates + unbounded gameHistory + actionLog

- **File:** `src/store/game-store.ts:326`
<!-- Updated: Validation Session 2 - Silent truncation confirmed (Q10) -->
- **[USER DESIGN DECISION]** actionLog = UNLIMITED (no cap). gameHistory = cap 50.
- **Fix:**
  1. Exclude `roleTemplates` from persist (derived from default-roles.ts)
  2. Cap `gameHistory` to last 50 games in `partialize` — **[VALIDATED] silent truncation**, no user notification
  3. ~~Cap `actionLog`~~ — **[OVERRIDDEN]** User wants unlimited actionLog. No cap applied.

### P7: Timer interval runs while paused

- **File:** `src/hooks/use-timer.ts`
- **Fix:** Clear interval when paused. Only run interval when `isRunning && !isPaused`.

### P9: nextNight() O(P\*R) scan + inline arrows in GameScreen

- **Files:** `src/store/game-store.ts`, `src/components/game/game-screen.tsx`
- **Fix:** Cache night computation. Extract inline arrow functions in GameScreen render to named callbacks or `useCallback`.

---

## Related Code Files

| File                                          | Action | Items                               |
| --------------------------------------------- | ------ | ----------------------------------- |
| `src/store/game-store.ts`                     | Modify | A1, A3 import, A6, P5, P6           |
| `src/components/setup/role-library-sheet.tsx` | Modify | A2                                  |
| `src/utils/uid.ts`                            | Create | A3                                  |
| `src/data/roles/village-roles.ts`             | Create | A5                                  |
| `src/data/roles/wolf-roles.ts`                | Create | A5                                  |
| `src/data/roles/third-party-roles.ts`         | Create | A5                                  |
| `src/data/default-roles.ts`                   | Modify | A5 re-export                        |
| `src/components/common/error-boundary.tsx`    | Modify | A7                                  |
| `src/index.css`                               | Modify | P1 remove @import, P2 remove FA CSS |
| `index.html`                                  | Modify | P1 preload fonts                    |
| `package.json`                                | Modify | P2 remove FA, add lucide-react      |
| 16 component files                            | Modify | P2 FA→Lucide migration              |
| `src/components/icons/werewolf-skull.tsx`     | Create | P2 custom SVG                       |
| `src/components/icons/wolf-paw.tsx`           | Create | P2 custom SVG                       |
| `src/components/icons/mystic-eye.tsx`         | Create | P2 custom SVG                       |
| `src/components/setup/player-config.tsx`      | Modify | P3                                  |
| `src/components/game/history-sheet.tsx`       | Modify | P4                                  |
| `src/hooks/use-timer.ts`                      | Modify | P7                                  |
| `src/components/game/game-screen.tsx`         | Modify | P9                                  |

---

## Todo

### Architecture

- [x] A1: Add version=1 + migrate function to Zustand persist
- [x] A2: Add delete button for custom templates in RoleLibrarySheet
- [x] A3: Extract uid() to `src/utils/uid.ts`, update imports
- [x] A5: Split default-roles.ts into 3 faction files + re-export
- [x] A6: Add corrupted storage recovery handler (onRehydrateStorage)
- [x] A7: Toggle error boundary stack by import.meta.env.DEV

### Performance

- [x] P1: Move Google Fonts from CSS @import to HTML preload
- [x] P2: Install lucide-react, remove @fortawesome/fontawesome-free
- [x] P2: Migrate all 35 icons across 16 files
- [x] P2: Create 3 custom SVG icon components
- [x] P2: Remove FA CSS import + all ::after unicode patterns from index.css
- [x] P3: Extract PlayerConfig inputs into memoized sub-components
- [x] P4: Memoize HistorySheet row builders
- [x] P5: Fix flipCard structural sharing
- [x] P6: Exclude roleTemplates from persist, cap gameHistory to 50
- [x] P7: Fix timer interval running while paused
- [x] P9: Cache nextNight computation, extract inline arrows

### Validation

- [x] Run `npm test` + `npm run build`
- [x] Verify all 35 Lucide icons render correctly in browser
- [x] Verify Font Awesome completely absent from bundle (`npm run build` output)
- [x] Verify localStorage has version: 1
- [x] Verify custom template delete works
- [x] Verify error boundary hides stack in production build

---

## Success Criteria

- Font Awesome completely removed from bundle
- Lucide icons rendering in all 16 files (35 icons + 3 custom)
- Bundle size reduced by ~1MB
- No render-blocking font loading
- localStorage has `version: 1`
- Corrupt storage shows recovery dialog
- Error boundary hides stack in production
- default-roles.ts < 50 lines (re-export only)
- uid() from single source
- No cascading re-renders on flipCard/player action
- HistorySheet doesn't rebuild rows when closed
- PlayerConfig doesn't re-render all 30 inputs on keystroke

## Risk

- **P2** icon migration is mechanical but tedious — visually test all 35 icons
- **FA CSS patterns** (::after content with FA unicode) need careful replacement with CSS-only gradients
- **A5** splitting roles needs import path updates across files
