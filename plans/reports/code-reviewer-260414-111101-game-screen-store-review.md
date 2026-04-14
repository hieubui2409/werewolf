# Code Review: Game Screen + Store Layer

**Reviewer:** code-reviewer  
**Date:** 2026-04-14  
**Score: 7.5 / 10**  
**Scope:** 13 files (~1,780 LOC) -- game screen components, Zustand store, selectors, actions

## Overall Assessment

Solid first implementation of a Werewolf moderator tool. Good type definitions, proper use of Zustand with persistence, decent accessibility groundwork (focus traps, ARIA attributes, keyboard support on cards). Architecture is clean: store split into store/actions/selectors is well-structured. No XSS vectors found (no `dangerouslySetInnerHTML`). Build compiles clean (0 TS errors).

Main concerns: one ID-collision bug that **will** bite in production, a stale-reference timer bug, untyped dynamic property writes, and several unnecessary re-render paths.

---

## Critical Issues

### C1. `Date.now()` ID collisions in rapid operations

**File:** `src/store/game-store.ts:160`, `src/store/game-store-actions.ts:151`

`addAbility` uses `Date.now()` alone for ability IDs:

```ts
id: `ab_${Date.now()}`,
```

Two rapid clicks within the same millisecond produce duplicate IDs. Same problem with `executionId = Date.now()` -- two fast `executeAction` calls in the same ms will share an `executionId`, breaking `undoAction` logic (which filters by executionId to decide whether to decrement usage).

The `uid()` function already exists and uses `Date.now() + Math.random()`. Use it everywhere.

**Impact:** Duplicate keys cause React warnings; shared executionId causes undo to skip usage decrement.

### C2. Timer `setInterval` callback reads stale `timerRef.current`

**File:** `src/hooks/use-timer.ts:37`

Inside the interval callback:

```ts
clearInterval(timerRef.current!);
```

`timerRef.current` is captured at callback creation time for the non-null assertion, but the ref itself is accessed correctly since refs are mutable. However, the actual bug is subtler: if `start()` is called again while a timer is running, the old interval's callback still references the **old** `timerRef.current` value, which was already cleared. The new interval sets a new value, and when the old callback fires one last time, `clearInterval(timerRef.current!)` clears the **new** timer.

**Fix:** Capture the interval ID locally:

```ts
const id = window.setInterval(() => { ... clearInterval(id); ... }, 1000);
timerRef.current = id;
```

### C3. `updateAbility` allows arbitrary field injection

**File:** `src/store/game-store.ts:59-65, 172-183`

```ts
updateAbility: (roleId, abilityId, field: string, value: string | number) =>
  // ...
  a.id === abilityId ? { ...a, [field]: value } : a;
```

`field` is typed as `string`, meaning callers can write any property name onto an Ability object (e.g., `__proto__`, `constructor`, or completely invented fields). This bypasses the `Ability` interface contract.

**Fix:** Constrain `field` to `keyof Ability`:

```ts
field: keyof Pick<Ability, "name" | "type" | "max" | "targetCount">,
```

---

## High Priority

### H1. New `[]` array literal on every render causes unnecessary PlayerCard re-renders

**File:** `src/components/game/game-screen.tsx:72`

```tsx
actions={actionMap.get(player.id) || []}
```

`|| []` creates a new array reference every render. Since `PlayerCard` is wrapped in `memo`, this defeats memoization for every player without actions (likely most players). Hoist a `const EMPTY_ACTIONS: ActionLog[] = []` constant outside the component.

### H2. `settings-sheet.tsx` reads DOM directly for theme state -- not reactive

**File:** `src/components/game/settings-sheet.tsx:27`

```ts
const isDark = document.documentElement.classList.contains("dark");
```

This runs once at render time but never re-renders when theme changes. After `toggleTheme()`, the radio buttons will show the **old** state until the component unmounts/remounts. Use `useState` + sync with the DOM mutation, or store theme in Zustand.

### H3. `SkillSheet` wizard state persists after close via backdrop click

**File:** `src/components/game/skill-sheet.tsx:40-44`

`handleClose` properly resets wizard state, but it is passed as `onClose` to `BottomSheet`. If the user clicks the backdrop overlay in `BottomSheet`, `onClose` (= `handleClose`) is called -- this works. However, `SkillSheet` is not unmounted when `isOpen=false` because `BottomSheet` returns null. The internal `useState` for `wizard` will reset on next mount anyway. **This is fine** -- no actual bug, but if BottomSheet ever changes to hide-via-CSS instead of unmount, state will leak. Document this coupling.

### H4. `useSortedPlayers` depends on `useRoleMap` -- double subscription

**File:** `src/store/game-store-selectors.ts:36-48`

`useSortedPlayers` calls `useRoleMap()` internally. Both subscribe to `useGameStore((s) => s.roles)` and `useGameStore((s) => s.players)`. When `roles` changes, both hooks recompute -- the roleMap recomputes, then sortedPlayers recomputes using the new roleMap. This is correct but results in two renders per roles change. For a game with ~10-30 players this is negligible. Noting for awareness.

### H5. `undoAction` only decrements usage when action is last in execution group

**File:** `src/store/game-store-actions.ts:179-183`

When undoing a multi-target action (e.g., Cupid targets 2 players), removing the first action leaves `sameExecution.length > 1`, so usage isn't decremented. Removing the second action then has `sameExecution.length === 1` (the first was already removed), so it decrements. Result: usage is correctly decremented exactly once. **However**, if the user removes the second action first (length becomes 1 from the remaining first), usage is decremented. Then removing the first also has length 1 (only itself left), so usage is decremented **again**. Total: decremented twice instead of once.

**Fix:** Decrement on the first undo within an execution group, or track by executionId rather than counting remaining.

---

## Medium Priority

### M1. ESLint: unused `_get` parameter

**File:** `src/store/game-store.ts:83`

```ts
(set, _get) => ({
```

Remove `_get` or suppress. Currently the only lint error.

### M2. `executeAction` creates a dummy `role` object that caller patches over

**File:** `src/store/game-store-actions.ts:139`

```ts
const role = { faction: "villager" as Faction }; // Will be resolved by caller
```

Then in `game-store.ts:239-243`, the caller patches the faction. This is a code smell -- the function lies about faction, and the caller must know to fix it. Pass `faction` as a parameter instead.

### M3. Hardcoded Vietnamese strings in components

**Files:** `player-card.tsx:70,191`, `player-action-sheet.tsx:29`

```ts
const roleName = isVillager ? "Dan Lang" : role?.name || "Dan Lang";
```

These bypass i18n. Should use `t("game.villager")`.

### M4. `BottomSheet` uses static `id="sheet-title"` -- conflicts if multiple sheets rendered

**File:** `src/components/common/bottom-sheet.tsx:79,86`

Multiple `BottomSheet` instances exist in the DOM (though only one is `isOpen`). Since closed sheets return `null`, this is safe **today**. If rendering changes to CSS-hidden, duplicate IDs will break `aria-labelledby`.

### M5. `NightConfirmSheet` has `role="alertdialog"` inside a `role="dialog"` (BottomSheet)

**File:** `src/components/game/night-confirm-sheet.tsx:25`

Nested landmark roles. The inner `alertdialog` should replace the outer `dialog`, not nest inside it. Pass `role` prop to `BottomSheet` or remove the inner one.

### M6. `nextNight` clears `actionLog` of nightly actions but keeps limited ones

**File:** `src/store/game-store.ts:275`

```ts
actionLog: s.actionLog.filter((a) => a.abilityType === "limited"),
```

Limited actions from previous turns accumulate across all nights, displayed on player cards indefinitely. Intentional? If so, document. If not, filter by `turnAdded` as well.

---

## Low Priority

### L1. `actionMap.get(player.id) || []` could use `?? []`

Stylistic: `||` and `??` behave identically here since Map returns `undefined` for missing keys. `??` is more precise.

### L2. `PlayerCard` in "both" mode doesn't have keyboard navigation

The flip-card variant has `tabIndex={0}` and `onKeyDown`, but the "both" mode branch has no keyboard interactivity for the options button.

### L3. Timer overlay `role="timer"` is non-standard

**File:** `src/components/game/timer-board.tsx:27`
`role="timer"` is not a valid WAI-ARIA role. Use `role="status"` or `role="alert"` with `aria-live="assertive"`.

### L4. `preloadSounds()` runs synchronously at module load in `main.tsx`

Blocks initial render slightly. Move to `useEffect` or `requestIdleCallback`.

---

## Positive Observations

1. **Type system is well-designed** -- `Faction`, `AbilityType`, `CardViewMode` unions are clean and exhaustive
2. **Good Zustand patterns** -- `partialize` for persistence, selectors split into separate file, immutable state updates
3. **BottomSheet focus trap** -- Proper Escape handling, Tab cycling, focus restore on close
4. **PlayerCard memo + keyboard support** -- `onKeyDown` for Enter/Space, `aria-expanded`, proper `key` props
5. **Error boundary** -- Present and renders gracefully with reload option
6. **No XSS surface** -- No `dangerouslySetInnerHTML`, no raw HTML injection
7. **Sound loading** -- Graceful error handling with try/catch and `.catch(() => {})`
8. **Reset game has confirmation** -- Two-step destructive action pattern

---

## Metrics

| Metric               | Value                                                        |
| -------------------- | ------------------------------------------------------------ |
| TypeScript errors    | 0                                                            |
| ESLint errors        | 1 (unused `_get`)                                            |
| XSS vectors          | 0                                                            |
| Accessibility (a11y) | Good -- focus trap, ARIA roles, keyboard nav; 3 minor issues |
| memo usage           | Appropriate (PlayerCard, TimerBoard)                         |
| Test coverage        | Not evaluated (no game-specific tests found)                 |

---

## Recommended Actions (priority order)

1. **[C1]** Replace all `Date.now()` IDs with `uid()` function
2. **[C2]** Fix timer interval stale reference -- capture ID locally
3. **[C3]** Constrain `updateAbility` field parameter to `keyof Ability`
4. **[H1]** Hoist empty array constant for PlayerCard actions prop
5. **[H2]** Make theme state reactive in SettingsSheet
6. **[H5]** Fix double-decrement bug in multi-target action undo
7. **[M2]** Pass faction directly to `executeAction` instead of patching
8. **[M3]** Replace hardcoded Vietnamese strings with i18n keys

---

## Unresolved Questions

1. Is the accumulation of limited-action logs across nights in `actionLog` intentional (M6)?
2. Are there tests planned for the store actions? The action logic (especially undo) has enough edge cases to warrant unit tests.
3. Should `createInitialRoles()` be called at module load time (Zustand initializer)? If `DEFAULT_ROLES` changes, the store won't reflect it until reset.

**Status:** DONE
**Summary:** 3 critical issues (ID collisions, timer race, untyped field injection), 5 high-priority items, 6 medium. Overall solid architecture with good a11y foundation. Score: 7.5/10.
