# Phase 1: Complete Bug Fix & Stabilization

## Context

- [Code Review Audit](../reports/code-review-260415-102842-full-codebase-audit.md)
- Priority: **P0** — fix ALL bugs before any other work

## Overview

Fix every bug identified in the code review: 3 critical, 8 high, 11 medium, 5 i18n, 2 UX bugs. Total: 33 items. After this phase, the app has zero known bugs.

---

## Prerequisite — Storage Versioning (from Phase 2 A1)

**[RED-TEAM]** Moved here: data-mutating fixes in this phase (M8 timestamps, M10 usage guard, H1 undo semantics) MUST ship under a version marker. Without this, Phase 2's eventual `migrate()` cannot distinguish pre-fix from post-fix state.

### PRE-A1: Storage version marker (no-op migration)
- **File:** `src/store/game-store.ts:290+`
- **Fix:** Add `version: 1` to Zustand persist config. Initial `migrate()` is a no-op passthrough. Full migration logic lands in Phase 2 A1 when schema changes accumulate.
- **Code:**
  ```ts
  persist(storeCreator, {
    name: 'game-store',
    version: 1,
    migrate: (state, version) => state, // no-op; Phase 2 A1 expands
  })
  ```
- **Test:** Verify localStorage has `"version": 1` after first write

---

## Critical Bugs (3)

### C1: Role deletion orphans players — permanently unassignable
- **File:** `src/store/game-store.ts:159-160`
- **Root cause:** `deleteRole` removes role but doesn't clear `roleId` on assigned players
- **Fix:** In `deleteRole`, iterate `players` and set `roleId = null` for any player with deleted `roleId`. Also clear related `roleChangeLog` entries.
- **Test:** Delete role assigned to 3 players → all 3 get `roleId: null`, can be reassigned

### C2: SkillSheet wizard resets mid-use when any player state changes
- **File:** `src/components/game/skill-sheet.tsx:57-89`
- **Root cause:** `selectAbility` depends on `[players]`, recreated every mutation. `useEffect:85` depends on `selectAbility` → re-fires, resetting wizard to step 1
- **Fix:** Memoize `selectAbility` with `useMemo`. Move `initialContext` outside reactive path. Use `useRef` for wizard state to break dependency loop.
- **Test:** Open skill sheet → trigger external player state change → wizard stays on current step

### C3: Timer interval leak on rapid start — un-stoppable timer
- **File:** `src/hooks/use-timer.ts:33-44`
- **Root cause:** Rapid Debate→Judgment: stale callback nulls `timerRef.current` → Stop inert
- **Fix:** Guard `startTimer`: if `timerRef.current` exists, `clearInterval` first. Use functional ref update. Add cleanup in `useEffect` return.
- **Test:** Rapid-tap Debate→Judgment→Debate → timer always stoppable

---

## High Bugs (8)

### H1: Multi-target undo removes single action, not execution group
- **File:** `src/store/game-store-actions.ts:187-219`
- **Fix:** `undoAction` finds all entries sharing `executionId`, removes them atomically, decrements `abilityUsage` once. Add confirm before undo.
- **[RED-TEAM] Scope clarification:** Undo is **log-only + usage decrement**. `executeAction` does NOT modify `alive` status (status changes are separate operations via `setPlayerAlive`/status log). Undo does NOT revert `statusChangeLog` or `roleChangeLog`. Confirm dialog copy must clarify: "Undo chỉ gỡ log hành động — trạng thái người chơi cần sửa thủ công nếu cần."
- **Decision:** Undo entire execution group + confirm dialog with scope warning

### H2: Night sound never stops
- **File:** `src/components/game/night-confirm-sheet.tsx:17`, `src/utils/sounds.ts`
- **[RED-TEAM] Correction:** `stopSound(id)` ALREADY EXISTS at `sounds.ts:29-35`. Do NOT re-add.
- **Fix:**
  1. **Verify** `stopSound` exists — do not duplicate
  2. Add NEW `stopAllSounds()` helper (iterate active sounds, stop each)
  3. Wire `stopSound("night")` calls at: (a) timer `start()` (day), (b) `resetGame()` in store, (c) settings reset
  4. **[RED-TEAM]** Add `document.addEventListener('visibilitychange', () => { if (document.hidden) stopAllSounds(); })` in sounds.ts init — prevents ambience blasting from phone speaker when moderator switches apps during night
- **Mute/unmute** toggle UI deferred to Phase 3 timer bar.

### H3: requestIdleCallback crashes Safari
- **File:** `src/main.tsx:10`
- **Fix:** Polyfill: `const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));`

### H4: 5 failing tests — store/component drift
- **Files:** `src/store/__tests__/game-store.test.ts`, `src/components/game/__tests__/player-card.test.tsx`
- **Fix:** Update test expectations: add `timestamp` field to log assertions. Add `aria-label` to action chips (also fixes A5 a11y). Update player-card queries.

### H5: Dead source player can still execute actions
- **File:** `src/store/game-store-actions.ts:136-184`
- **Fix:** Add alive-check at start of `executeAction`. Dead source → return `{ blocked: true, reason: 'dead_source' }`. UI shows confirm BottomSheet ("Xác nhận hành động từ người chết?"). If confirmed, allow.
- **Decision:** Confirm dialog, not hard block (Hunter death shot valid)

### H6: Bottom-sheet focus trap breaks during wizard transitions
- **File:** `src/components/common/bottom-sheet.tsx:36-48`
- **Fix:** Guard focus trap: if 0 focusable elements, retry after rAF. Null-check `sheetRef.current` in rAF callback. MutationObserver for dynamic content.

### H7: Bottom-sheet `onClose` in useEffect deps causes focus-jump
- **File:** `src/components/common/bottom-sheet.tsx:65`
- **Fix:** Use `useRef` for `onClose` callback to avoid effect re-runs. Or `useCallback` with stable deps in parent (`PlayerActionSheet:38`, etc.)

### H8: All 6 sheets always mounted — ~30 redundant Zustand subscriptions
- **File:** `src/components/game/game-screen.tsx:130-147`
- **Fix:** Conditional render: `{isHistoryOpen && <HistorySheet />}` for all 6 sheets. Eliminates ~30 wasted subscriptions + `buildCurrentRows()` running invisibly. Also fixes P8 (PlayerActionSheet hooks when hidden).

---

## Medium Bugs (11)

### M1: Custom roles always get `order: 10`
- **File:** `src/store/game-store-actions.ts:104,112`
- **Fix:** Auto-increment: `const maxOrder = Math.max(0, ...roles.map(r => r.order)); newRole.order = maxOrder + 1;`

### M2: _counter resets on reload — executionId collision
- **Files:** `src/store/game-store-actions.ts:48` (`uid()`), `src/store/game-store-actions.ts:165` (`executeAction` — **[RED-TEAM]** second `_counter` usage**), `src/types/game.ts` (ActionLog type)
- **Fix:**
  1. Replace `_counter` in `uid()` with stable generator
  2. **[RED-TEAM]** ALSO replace `const executionId = ++_counter` in `executeAction:165` with same generator
  3. **[RED-TEAM]** Change `ActionLog.executionId` type from `number` → `string`
  4. **[RED-TEAM]** Use `crypto.randomUUID?.() ?? uid()` fallback — `crypto.randomUUID` fails in non-secure contexts (HTTP dev server on local network)
  5. **[RED-TEAM]** Phase 1 PRE-A1 migration must convert existing numeric `executionId` → string format on v0→v1
- **No dependency** on persisted state at module init.

### M3 + M6: Player ID collision — consolidated cleanup
- **Files:** `src/store/game-store-actions.ts:54-71`, `src/store/game-store.ts:105-109`
- **[RED-TEAM] Consolidated:** M3 (shrink-then-expand recycling) and M6 (shrink-only cleanup) describe overlapping cleanup needs. Merge into single `cleanupPlayerReferences(removedIds)` utility called from `handlePlayerCountChange`.
- **Cleanup targets (comprehensive):**
  - `flippedCards[id]` — delete
  - `actionLog` — filter out entries where `sourceId === id` OR `targets.includes(id)`
  - `statusChangeLog` — filter by `playerId`
  - `roleChangeLog` — filter by `playerId`
  - Player's embedded `abilityUsage` auto-cleared via `createInitialPlayers` for new IDs
  - `gameHistory` — ghost references accepted (historical data, documented decision)
- **Decision:** Single utility function, defensive cleanup, M3 and M6 merged

### M4: actionMap.get() returns new array ref — defeats PlayerCard memo
- **File:** `src/store/game-store-selectors.ts:16-27`
- **Fix:** Memoize per-player action arrays. Use `useMemo` or `useShallow` from Zustand for map value comparison.

### M6: handlePlayerCountChange doesn't clean related state
- **[RED-TEAM] Consolidated with M3.** See M3 above — both fixes share same `cleanupPlayerReferences` utility.

### M7: SkillSheet step 3 ability name not translated
- **File:** `src/components/game/skill-sheet.tsx:269`
- **Fix:** Replace `wizard.ability.name` with `tr(t, wizard.ability.name)` using existing translation helper.

### M8: GameState type out of sync — missing `timestamp` field
- **File:** `src/types/game.ts:83-88`
- **Fix:** Add `timestamp: number` to `StatusChangeLog` and `RoleChangeLog` interfaces.

### M9: addAbility hardcodes Vietnamese string "Kỹ năng"
- **File:** `src/store/game-store.ts:170`
- **Fix:** Use generic English key `"Ability"` as fallback name. Or pass translated name from calling component.

### M10: Nightly abilities have no per-night usage guard
- **File:** `src/store/game-store-actions.ts:146` (`executeAction` type check)
- **[RED-TEAM] Correction:** Do NOT introduce `nightUsageMap` — `nextNight()` already resets `abilityUsage[ab.id] = 0` for nightly abilities (line 282-283). That creates redundant state with two sources of truth.
- **Fix:** Extend existing `limited` guard in `executeAction` to also cover `nightly`:
  ```ts
  if ((ability.type === "limited" || ability.type === "nightly")
      && (player.abilityUsage[ability.id] ?? 0) >= 1) {
    return { blocked: true, reason: ability.type === 'nightly' ? 'already_used_night' : 'limit_reached' };
  }
  ```
- **UI:** If blocked with `already_used_night` → show warning confirm. Moderator can bypass (e.g., role exception) → proceed.
- **Decision:** Warning modal + confirm, no new state

### M11: executeAction with empty targets increments usage with no log
- **File:** `src/store/game-store-actions.ts:167`
- **Fix:** Create 1 ActionLog entry with `targets: []` for traceability + undoability. Or prevent usage increment when no targets.
- **Decision:** Create log entry

### M12: Timer overlay has no escape on touch
- **File:** `src/components/game/timer-board.tsx:28-66`
- **Fix:** Add `useEffect` with `Escape` keydown handler → calls stop/close.
- **Decision:** Escape key only, no tap-dismiss

---

## i18n Issues (5)

### I1: history-sheet.tsx hardcoded English
- **File:** `src/components/game/history-sheet.tsx:230,250,279`
- **Strings:** `"— Current"`, `"Past Turns"`, `"actions"`
- **Fix:** `t('history.current')`, `t('history.pastTurns')`, `t('history.actions')`

### I2: create-role-sheet.tsx hardcoded Vietnamese
- **File:** `src/components/setup/create-role-sheet.tsx:14-17,200`
- **Strings:** `"Dân"/"Sói"/"Phe 3"`, `"Đêm"/"Lần"`
- **Fix:** `t('factions.villager')`, `t('factions.wolf')`, `t('factions.third')`, `t('ability.night')`, `t('ability.limited')`

### I3: role-library-sheet.tsx hardcoded English
- **File:** `src/components/setup/role-library-sheet.tsx:112-113`
- **Strings:** `"skill"`, `"passive"`
- **Fix:** `t('ability.skill')`, `t('ability.passive')`

### I4: main.tsx PWA update prompt hardcoded Vietnamese
- **File:** `src/main.tsx:15`
- **Fix:** Replace `confirm("Có bản cập nhật mới...")` with `confirm(t('pwa.updatePrompt'))`. Themed BottomSheet replacement in Phase 4.

### I5: game-store.ts addAbility hardcodes "Kỹ năng"
- **File:** `src/store/game-store.ts:170`
- **Fix:** Same as M9 — use generic fallback or pass translated string from caller.

---

## UX Bugs (2)

### U4: No confirmation before role deletion
- **File:** `src/components/setup/role-list.tsx`
- **Fix:** Add confirm dialog before `deleteRole`: "Xóa vai [name]? Các người chơi đã gán sẽ mất vai."

### U7: targetCount 0 can't be set back via SelectorModal UI
- **File:** `src/components/common/selector-modal.tsx`
- **Fix:** Allow setting `targetCount` back to 0 (or "no target") in the selector.

---

## Related Code Files

| File | Action | Items |
|------|--------|-------|
| `src/store/game-store.ts` | Modify | C1, M6, M9/I5 |
| `src/components/game/skill-sheet.tsx` | Modify | C2, M7 |
| `src/hooks/use-timer.ts` | Modify | C3 |
| `src/store/game-store-actions.ts` | Modify | H1, H5, M1, M2, M3, M10, M11 |
| `src/utils/sounds.ts` | Modify | H2: add stopSound API |
| `src/components/game/night-confirm-sheet.tsx` | Modify | H2: call stopSound |
| `src/main.tsx` | Modify | H3, I4 |
| `src/store/__tests__/game-store.test.ts` | Modify | H4 |
| `src/components/game/__tests__/player-card.test.tsx` | Modify | H4 |
| `src/components/common/bottom-sheet.tsx` | Modify | H6, H7 |
| `src/components/game/game-screen.tsx` | Modify | H8 |
| `src/store/game-store-selectors.ts` | Modify | M4 |
| `src/types/game.ts` | Modify | M8 |
| `src/components/game/timer-board.tsx` | Modify | M12 |
| `src/components/game/history-sheet.tsx` | Modify | I1 |
| `src/components/setup/create-role-sheet.tsx` | Modify | I2 |
| `src/components/setup/role-library-sheet.tsx` | Modify | I3 |
| `src/i18n/locales/vi.json` | Modify | I1-I5 new keys |
| `src/i18n/locales/en.json` | Modify | I1-I5 new keys |
| `src/components/setup/role-list.tsx` | Modify | U4 |
| `src/components/common/selector-modal.tsx` | Modify | U7 |

---

## Todo

### Prerequisite (Red Team Finding 1)
- [ ] PRE-A1: Add `version: 1` + no-op migrate to Zustand persist (BEFORE any data schema changes)

### Critical
- [ ] C1: Fix deleteRole to clear orphaned player roleIds
- [ ] C2: Memoize SkillSheet wizard state, prevent reset on player changes
- [ ] C3: Guard timer interval creation, prevent leak on rapid start

### High
- [ ] H1: Fix multi-target undo to remove entire execution group + confirm
- [ ] H2: Verify existing stopSound + add stopAllSounds + wire visibilitychange (red-team)
- [ ] H3: Polyfill requestIdleCallback for Safari
- [ ] H4: Fix 5 failing test expectations (timestamp + aria-label)
- [ ] H5: Add dead source confirm dialog in executeAction
- [ ] H6: Guard focus trap for 0-element states + null-check rAF
- [ ] H7: Stabilize onClose ref in bottom-sheet
- [ ] H8: Lazy-mount all 6 sheets in game-screen (also fixes P8)

### Medium
- [ ] M1: Auto-increment custom role order
- [ ] M2: Replace _counter at BOTH sites (uid + executeAction:165) with `crypto.randomUUID?.() ?? uid()` fallback; change ActionLog.executionId type number→string
- [ ] M3+M6: Consolidated cleanupPlayerReferences utility covering all player-id-referencing state (red-team)
- [ ] M4: Memoize per-player action arrays in selectors
- [ ] M6: Consolidated with M3 (see above)
- [ ] M7: Translate SkillSheet step 3 ability name
- [ ] M8: Add timestamp to StatusChangeLog/RoleChangeLog types
- [ ] M9: Remove hardcoded "Kỹ năng" from addAbility
- [ ] M10: Extend limited-guard in executeAction to cover nightly type (use existing abilityUsage, no new state) + warning confirm
- [ ] M11: Create ActionLog entry for empty-target executions
- [ ] M12: Add Escape key handler to timer overlay

### i18n
- [ ] I1: Fix history-sheet hardcoded English (3 strings)
- [ ] I2: Fix create-role-sheet hardcoded Vietnamese (5 strings)
- [ ] I3: Fix role-library-sheet hardcoded English (2 strings)
- [ ] I4: Fix main.tsx PWA prompt with i18n t()
- [ ] I5: Fix game-store addAbility hardcoded name
- [ ] Add all new i18n keys to vi.json + en.json

### UX Bugs
- [ ] U4: Add confirm dialog before role deletion
- [ ] U7: Allow targetCount 0 reset in SelectorModal

### Validation
- [ ] Run `npm test` — all tests pass (including fixed H4)
- [ ] Run `npm run build` — no compile errors
- [ ] Manual test: Safari loads without errors (H3)
- [ ] Manual test: Timer always stoppable after rapid taps (C3)
- [ ] Manual test: Wizard doesn't reset mid-use (C2)
- [ ] Manual test: Night sound stops on day/reset (H2)
- [ ] Manual test: Role deletion cleans players (C1)

---

## Success Criteria

- 0 critical, 0 high, 0 medium bugs remaining
- 0 hardcoded i18n strings (grep for non-t() literal text in components)
- All existing + fixed tests pass
- Safari iOS loads without console errors
- Timer always stoppable
- Wizard never resets mid-use
- Night sound stops appropriately
- Multi-target undo removes entire group
- Dead source shows confirm before executing

## Risk

- **C2** is trickiest — memoization must not break wizard ability selection. Test exhaustively with multiple role types.
- **H8** lazy mount changes sheet lifecycle — no animation work yet, just ensure sheets appear/disappear correctly. Animation layered in Phase 3-4.
- **M10** per-night guard needs careful UX — warning modal should not slow down experienced moderators.
