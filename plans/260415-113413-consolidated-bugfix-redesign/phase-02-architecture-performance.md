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
- **[RED-TEAM] Note:** Version marker (`version: 1`) ALREADY added in Phase 1 PRE-A1 as no-op. This task EXPANDS the `migrate()` function with full v0→v1 logic now that Phase 1 schema changes are stable.
- **Fix:** Replace no-op `migrate` with comprehensive v0→v1:
  ```ts
  migrate: (state, version) => {
    if (version === 0 || version === undefined) {
      // v0→v1: add timestamp, convert numeric executionId → string
      state.statusChangeLog?.forEach(e => e.timestamp ??= Date.now());
      state.roleChangeLog?.forEach(e => e.timestamp ??= Date.now());
      state.actionLog?.forEach(e => {
        if (typeof e.executionId === 'number') e.executionId = String(e.executionId);
      });
    }
    return state;
  }
  ```

### A2: Custom role templates accumulate forever
- **File:** `src/components/setup/role-library-sheet.tsx`
- **Fix:** Add delete button for custom templates (`isCustom: true` only). Confirm before delete.

### A3: Duplicate uid() in 2 files
- **Fix:** Extract to `src/utils/uid.ts`. Update imports in `game-store.ts` and `game-store-actions.ts`.
- **New file:** `src/utils/uid.ts`

### A5: default-roles.ts is 921 lines
- **File:** `src/data/default-roles.ts`
- **Fix:** Split by faction:
  - `src/data/roles/village-roles.ts`
  - `src/data/roles/wolf-roles.ts`
  - `src/data/roles/third-party-roles.ts`
  - `src/data/default-roles.ts` — re-export combined array (backward compat)

### A6: No error recovery from corrupted localStorage
- **File:** `src/store/game-store.ts`
- **Fix:** Wrap rehydration in try/catch via `onRehydrateStorage`. On error → show recovery dialog: (1) Reset to defaults, (2) Export raw JSON for debugging.

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

| FA Icon | Lucide | Files |
|---------|--------|-------|
| fa-moon | `Moon` | game-screen, skill-sheet, night-confirm, player-action, settings, setup |
| fa-sun | `Sun` | settings-sheet |
| fa-cog | `Settings` | timer-board, settings-sheet, setup-screen |
| fa-play | `Play` | timer-board, setup-screen |
| fa-pause | `Pause` | timer-board |
| fa-stop | `Square` | timer-board |
| fa-comments | `MessageSquare` | timer-board |
| fa-gavel | `Gavel` | timer-board |
| fa-book-open | `BookOpen` | timer-board |
| fa-book | `Library` | setup-screen |
| fa-wand-sparkles | `Wand2` | game-screen, skill-sheet |
| fa-wand-magic-sparkles | `Sparkles` | create-role-sheet |
| fa-theater-masks | `Drama` | game-screen, assign-role-sheet |
| fa-times | `X` | player-card, player-action-sheet, bottom-sheet, role-list |
| fa-chevron-up/down | `ChevronUp/Down` | history-sheet, assign-role-sheet |
| fa-arrow-left/right | `ArrowLeft/Right` | skill-sheet, history-sheet |
| fa-ellipsis-v | `MoreVertical` | player-card |
| fa-plus | `Plus` | role-list, create-role-sheet |
| fa-plus-circle | `PlusCircle` | role-library-sheet |
| fa-trash-alt/trash | `Trash2/Trash` | role-list, create-role-sheet, settings-sheet |
| fa-check | `Check` | role-library-sheet, create-role-sheet |
| fa-skull | `Skull` | player-card, history-sheet |
| fa-skull-crossbones | Custom `WerewolfSkull` | player-card |
| fa-heart | `Heart` | history-sheet, player-action-sheet |
| fa-lock | `Lock` | player-card, player-action-sheet |
| fa-crosshairs | `Crosshair` | skill-sheet, role-list |
| fa-undo | `Undo2` | history-sheet |
| fa-exchange-alt | `ArrowLeftRight` | history-sheet |
| fa-users | `Users` | selector-modal |
| fa-hashtag | `Hash` | selector-modal |
| fa-paw (CSS) | Custom `WolfPaw` | index.css card pattern |
| fa-shield (CSS) | Custom SVG or Lucide `Shield` | index.css card pattern |
| fa-eye (CSS) | Custom `MysticEye` | index.css card pattern |
| fa-hat-wizard (CSS) | Lucide `Wand2` or remove | index.css card pattern |

### P3: PlayerConfig re-renders 30 inputs on any keystroke
- **File:** `src/components/setup/player-config.tsx`
- **Fix:** Extract each player input into memoized sub-component. Or use uncontrolled inputs with `onBlur`.

### P4: HistorySheet row builders not memoized
- **File:** `src/components/game/history-sheet.tsx:69-110`
- **Fix:** Memoize `buildCurrentRows()` and `buildPastRows()` with `useMemo`. Deps: `actionLog`, `gameHistory`.

### P5: flipCard creates new object → cascading re-render
- **File:** `src/store/game-store.ts:316`
- **Fix:** Structural sharing: only create new entry for flipped card, spread existing for others.

### P6: Persist serializes roleTemplates + unbounded gameHistory + actionLog
- **File:** `src/store/game-store.ts:326`
- **Fix:**
  1. Exclude `roleTemplates` from persist (derived from default-roles.ts)
  2. Cap `gameHistory` to last 50 games in `partialize`
  3. **[RED-TEAM]** Cap `actionLog` to last 500 entries in `partialize` — long marathon games (20 nights × 15 players × 4 abilities) accumulate hundreds of entries, serialized on every `set()` causes jank on low-end mobile

### P7: Timer interval runs while paused
- **File:** `src/hooks/use-timer.ts`
- **Fix:** Clear interval when paused. Only run interval when `isRunning && !isPaused`.

### P9: nextNight() O(P*R) scan + inline arrows in GameScreen
- **Files:** `src/store/game-store.ts`, `src/components/game/game-screen.tsx`
- **Fix:** Cache night computation. Extract inline arrow functions in GameScreen render to named callbacks or `useCallback`.

---

## Related Code Files

| File | Action | Items |
|------|--------|-------|
| `src/store/game-store.ts` | Modify | A1, A3 import, A6, P5, P6 |
| `src/components/setup/role-library-sheet.tsx` | Modify | A2 |
| `src/utils/uid.ts` | Create | A3 |
| `src/data/roles/village-roles.ts` | Create | A5 |
| `src/data/roles/wolf-roles.ts` | Create | A5 |
| `src/data/roles/third-party-roles.ts` | Create | A5 |
| `src/data/default-roles.ts` | Modify | A5 re-export |
| `src/components/common/error-boundary.tsx` | Modify | A7 |
| `src/index.css` | Modify | P1 remove @import, P2 remove FA CSS |
| `index.html` | Modify | P1 preload fonts |
| `package.json` | Modify | P2 remove FA, add lucide-react |
| 16 component files | Modify | P2 FA→Lucide migration |
| `src/components/icons/werewolf-skull.tsx` | Create | P2 custom SVG |
| `src/components/icons/wolf-paw.tsx` | Create | P2 custom SVG |
| `src/components/icons/mystic-eye.tsx` | Create | P2 custom SVG |
| `src/components/setup/player-config.tsx` | Modify | P3 |
| `src/components/game/history-sheet.tsx` | Modify | P4 |
| `src/hooks/use-timer.ts` | Modify | P7 |
| `src/components/game/game-screen.tsx` | Modify | P9 |

---

## Todo

### Architecture
- [ ] A1: Add version=1 + migrate function to Zustand persist
- [ ] A2: Add delete button for custom templates in RoleLibrarySheet
- [ ] A3: Extract uid() to `src/utils/uid.ts`, update imports
- [ ] A5: Split default-roles.ts into 3 faction files + re-export
- [ ] A6: Add corrupted storage recovery handler (onRehydrateStorage)
- [ ] A7: Toggle error boundary stack by import.meta.env.DEV

### Performance
- [ ] P1: Move Google Fonts from CSS @import to HTML preload
- [ ] P2: Install lucide-react, remove @fortawesome/fontawesome-free
- [ ] P2: Migrate all 35 icons across 16 files
- [ ] P2: Create 3 custom SVG icon components
- [ ] P2: Remove FA CSS import + all ::after unicode patterns from index.css
- [ ] P3: Extract PlayerConfig inputs into memoized sub-components
- [ ] P4: Memoize HistorySheet row builders
- [ ] P5: Fix flipCard structural sharing
- [ ] P6: Exclude roleTemplates from persist, cap gameHistory to 50
- [ ] P7: Fix timer interval running while paused
- [ ] P9: Cache nextNight computation, extract inline arrows

### Validation
- [ ] Run `npm test` + `npm run build`
- [ ] Verify all 35 Lucide icons render correctly in browser
- [ ] Verify Font Awesome completely absent from bundle (`npm run build` output)
- [ ] Verify localStorage has version: 1
- [ ] Verify custom template delete works
- [ ] Verify error boundary hides stack in production build

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
