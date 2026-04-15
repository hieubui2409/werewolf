# Deep Bug Hunt Report

**Date:** 2026-04-15 | **Reviewer:** code-reviewer | **Scope:** Full codebase edge-case audit

---

## Critical Issues

### 1. Timer interval leak on rapid start() calls (race condition)
**`src/hooks/use-timer.ts:33-44`** -- When `start()` is called, a new `setInterval` is created and its ID stored in `timerRef.current` (line 44). However, the `setInterval` callback on line 36 captures the `id` variable in a closure. If `start()` is called again rapidly (e.g., user taps Debate then immediately taps Judgment), the old interval is cleared (line 25), BUT there is a timing window: if the old interval fires between `clearInterval` and the new assignment to `timerRef.current`, the old callback's `clearInterval(id)` on line 38 will try to clear the OLD `id` (already cleared), not the new one. The real bug: the old callback has a stale closure over its own `id`. When `prev.value <= 1`, it calls `clearInterval(id)` and sets `timerRef.current = null`. If the OLD interval fires one last time after a new timer starts, it will null out `timerRef.current`, making the new timer un-stoppable. -- **Critical**

### 2. Undo only removes single action, not entire execution group (multi-target abilities broken)
**`src/store/game-store-actions.ts:187-219`** -- `undoAction` removes a single action by `actionId` (line 218), but multi-target abilities (Cupid's "Couple" targets 2, Fox's "See 3" targets 3, Cub Wolf's "Rage Bite" targets 2) create multiple `ActionLog` entries sharing the same `executionId`. Undoing one action removes it from the log, but the other targets remain as orphaned actions. Worse: the usage decrement on line 200 only fires when `sameExecution.length === 1` (i.e., last action in group). So undoing the first of 2 actions doesn't decrement usage at all, and undoing the second does decrement -- meaning the user gets the charge back after deleting BOTH, but only if they undo in the right order. If they undo only one, the ability usage is never decremented but one target is still marked. -- **Critical**

### 3. No persist migration/version -- localStorage corruption on schema change
**`src/store/game-store.ts:323-341`** -- The `persist` config has no `version` or `migrate` function. Any schema change (adding/removing fields, changing types) will silently merge stale localStorage data with default values. For example, the `statusChangeLog` in persisted state from an older version may lack `timestamp` (the `GameState` type in `types/game.ts` line 83-84 omits `timestamp` from statusChangeLog/roleChangeLog, confirming a mismatch already exists). On reload, Zustand will deserialize the old shape and the app will crash or behave incorrectly when code accesses `.timestamp`. -- **Critical**

---

## High Priority

### 4. `_counter` module-level state not persisted -- executionId collision after page reload
**`src/store/game-store-actions.ts:48`** -- `_counter` starts at 0 on every page load. `executeAction` (line 165) uses `++_counter` for `executionId`. After reloading the page, the counter resets to 0, so new actions will have `executionId` values that collide with existing persisted actions. The `undoAction` logic (line 196) filters by `executionId` to find related actions in an execution group -- collisions mean undoing a new action could incorrectly affect old actions. -- **High**

### 5. `nightly` ability usage not checked before execution
**`src/store/game-store-actions.ts:146-152`** -- The usage guard only checks `limited` abilities (`if (ability.type === "limited")`). For `nightly` abilities, there is no guard at all -- the usage counter increments (line 159) but is never checked. While `nextNight` resets nightly counters (line 283), nothing prevents a user from executing the same nightly ability multiple times within the same night. The moderator could accidentally mark Wolf's bite twice on the same target. -- **High**

### 6. Dead players can still use abilities and be selected as sources
**`src/components/game/skill-sheet.tsx:59`** -- `selectAbility` filters `capable` players by `p.alive`, which is correct. BUT in Step 3 (target selection, line 273), ALL players are shown as targets including dead ones with no visual distinction or filtering. For some abilities this is correct (medium contacting dead), but for most (wolf bite, guard protect) targeting dead players is a logic error. More critically: the `executeAction` in the store performs NO alive-check on the source. If a player dies mid-night (via togglePlayerStatus) after they were already selected as source in Step 2, the action still executes. -- **High**

### 7. `createInitialRoles` generates colliding IDs on fast calls
**`src/store/game-store-actions.ts:34`** -- The role ID pattern is `init_${Date.now()}_${idx}`. `Date.now()` has millisecond granularity. If `createInitialRoles` is called twice within the same millisecond (e.g., rapid reset + init), all generated role IDs will be identical across both calls. The `resetGame` action (line 297) calls `createInitialRoles()` -- if localStorage persistence triggers a re-render that calls it again, you get duplicate IDs in the role map. -- **High**

### 8. BottomSheet focus trap breaks when 0 focusable elements exist temporarily
**`src/components/common/bottom-sheet.tsx:39`** -- The focus trap checks `if (focusable.length === 0) return;` but during React re-renders (e.g., SkillSheet wizard transitions between steps), there may momentarily be 0 focusable elements. In this state, Tab keypress does nothing, but focus escapes the modal to elements behind the backdrop. Also, the `requestAnimationFrame` on line 54 captures `sheetRef.current` which might be null if the sheet closes before the rAF fires. -- **High**

### 9. `onClose` in BottomSheet useEffect dependency causes re-registration on every parent render
**`src/components/common/bottom-sheet.tsx:65`** -- `onClose` is in the dependency array. If the parent doesn't memoize `onClose` (and `PlayerActionSheet` at line 38 passes `onClose` directly as a prop without `useCallback`), the effect re-runs on every render: removing the old keydown listener and adding a new one. During this teardown cycle, `previousFocus.current?.focus()` fires (line 63), stealing focus from the sheet content back to the element that was focused before. This creates a jarring focus-jump on mobile. -- **High**

---

## Medium Priority

### 10. Player ID collision when shrinking then expanding player count
**`src/store/game-store-actions.ts:61`** -- When adding new players, IDs are calculated as `players.length + i + 1`. If the user goes 10 -> 5 (truncates to 5 players with IDs 1-5) then 5 -> 8, new players get IDs 6,7,8 -- which works. BUT if the user then goes 8 -> 3 -> 6, the new players get IDs 4,5,6 -- and IDs 4,5 may have stale `abilityUsage` data, `roleId` assignments, or action logs referencing the old players. The `flippedCards` record (keyed by player ID) will also retain stale flip state for recycled IDs. -- **Medium**

### 11. `toggleTarget` uses stale closure over `wizard.ability`
**`src/components/game/skill-sheet.tsx:103`** -- `toggleTarget` reads `wizard.ability!.targetCount` outside the `setWizard` updater function. This is a stale closure: if `wizard.ability` changes between when `toggleTarget` was defined and when it's called (unlikely but possible via rapid interactions + React batching), the wrong `targetCount` is used. Should read from `prev.ability` inside the updater. -- **Medium**

### 12. Sound plays on every tick during countdown even when paused
**`src/hooks/use-timer.ts:57-59`** -- The sound effect fires based on `timer.value` and `timer.active` but does NOT check `timer.paused`. When the timer is paused at value <= 10, no tick occurs (the interval callback returns early at line 35), so no sound plays. BUT if the user pauses/resumes around the boundary, the `useEffect` will fire on the state change and play a tick sound even though no actual countdown happened. Minor but confusing UX. -- **Medium**

### 13. `nextNight` preserves `limited` actions from ALL previous nights
**`src/store/game-store.ts:290`** -- `actionLog: s.actionLog.filter((a) => a.abilityType === "limited")` keeps all limited actions forever. Over a long game (15+ nights), this array grows unboundedly with every limited ability used. Each action is also stored in `gameHistory` (line 267-268), so limited actions are stored twice. This is a memory/performance issue for long-running games and also clutters the history view. -- **Medium**

### 14. `handlePlayerCountChange` does not update `flippedCards` or action log
**`src/store/game-store.ts:105-109`** -- When player count shrinks, only `players` is updated. The `flippedCards` record, `actionLog` (which references `sourceId`/`targetId`), `statusChangeLog`, and `roleChangeLog` still reference removed player IDs. When the count is later increased, recycled IDs show stale data from these maps. -- **Medium**

### 15. Custom role validation does not check template name duplicates
**`src/components/setup/create-role-sheet.tsx:40-44`** -- `validate()` checks for duplicate names against `existingRoles` (game instances), but not against `roleTemplates`. Two custom templates with the same name can be created if the first one's game role was deleted. Both templates persist and appear in the library. -- **Medium**

### 16. Timer overlay has no escape mechanism on touch devices
**`src/components/game/timer-board.tsx:28-66`** -- The fullscreen timer overlay only provides Pause and Stop buttons. On mobile, if the buttons become unresponsive (e.g., JavaScript error in onClick), the user is trapped with no way to dismiss the overlay. Unlike BottomSheet, there's no Escape key handler or backdrop click to dismiss. Since `timer.active` is local state (not persisted), a page reload is the only escape, but that resets the entire app state. -- **Medium**

### 17. `PlayerCard` memo is ineffective due to unstable `onSelect` and `onUseSkill` references
**`src/components/game/game-screen.tsx:47-67`** -- `handleSelectPlayer` is wrapped in `useCallback` with `[]` deps -- good. `handleUseSkill` also has `[]` deps -- good. However, `flipCard` is pulled directly from the store with `useGameStore((s) => s.flipCard)` on every render. Zustand selectors return stable references for functions defined in the store, so this is actually fine. But `actionMap.get(player.id)` on line 96 returns a new array reference every time the actionLog changes for ANY player, causing ALL PlayerCards to re-render even if only one player's actions changed. -- **Medium**

### 18. Error boundary exposes error details to end users
**`src/components/common/error-boundary.tsx:35`** -- `this.state.error?.toString()` renders raw error messages including stack traces. For a PWA that might be installed on shared/public devices, this could leak internal implementation details. Should show a generic user-friendly message. -- **Medium**

---

## Low Priority

### 19. `targetCount: 0` abilities (Veteran's "Alert") create empty actions
**`src/store/game-store-actions.ts:167`** -- When `targets` is an empty array and `targetCount` is 0 (e.g., Veteran's Alert ability -- `targetCount: 0` in default-roles.ts line 679), `targets.map()` produces zero `ActionLog` entries. The ability usage IS incremented (line 159), but no action log is created. The SkillSheet's Step 3 `confirm` button is disabled when `targets.length === 0` (line 296), but `confirmNoTarget` works (line 124). The net effect: the ability is marked as used with no log entry, making it invisible in history and un-undoable. -- **Low** (affects only self-targeting abilities)

### 20. SelectorModal `targetCount` options start at 1, never allows 0
**`src/components/common/selector-modal.tsx:42-46`** -- Options start from `i + 1`, meaning `targetCount: 0` cannot be set via the UI. The Veteran and Little Girl abilities have `targetCount: 0` in their templates, but if a user edits them via the setup screen, they cannot restore the 0 value. -- **Low**

### 21. Language state not persisted
**`src/components/game/settings-sheet.tsx:37`** -- `i18n.changeLanguage(lng)` changes the language at runtime, but this is not persisted to localStorage (only the theme is). On page reload, the language resets to the default (likely `vi` from i18n config). Users who switch to English will lose their preference on reload. -- **Low**

### 22. PWA update prompt is hardcoded Vietnamese
**`src/main.tsx:15`** -- `confirm("Co ban cap nhat moi. Tai lai?")` is hardcoded in Vietnamese and doesn't use i18n. Since i18n isn't initialized at this point in the module, this is hard to fix, but worth noting for internationalization completeness. -- **Low**

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 3 |
| High     | 6 |
| Medium   | 9 |
| Low      | 4 |

### Top 3 Recommended Fixes (by impact)

1. **Undo execution group bug (#2)** -- Change `undoAction` to remove ALL actions with the same `executionId`, not just the single action. This is the most user-facing critical bug.

2. **Timer interval leak (#1)** -- Use a ref to track whether the interval is "current" (e.g., increment a generation counter), so stale callbacks become no-ops.

3. **Persist migration (#3)** -- Add `version: 1` and a `migrate` function to the Zustand persist config to handle schema evolution gracefully.

---

**Status:** DONE
**Summary:** Found 22 new bugs across timer hooks, game actions, persist layer, UI components. 3 critical (timer leak, multi-target undo broken, no persist migration), 6 high (counter collision, no nightly guard, dead player abilities, ID collision, focus trap, onClose effect).
**Concerns:** The multi-target undo bug (#2) is likely already causing moderator confusion in games. The persist migration (#3) will become a blocker as soon as any schema field is added.
