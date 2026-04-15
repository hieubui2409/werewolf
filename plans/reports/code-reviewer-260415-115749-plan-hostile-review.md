# Hostile Plan Review: Consolidated Bugfix & Redesign

**Reviewer:** code-reviewer (Security Adversary perspective)
**Date:** 2026-04-15
**Scope:** 4-phase plan (80h est), 50+ audit issues + full UI/UX redesign
**Files reviewed:** plan.md, phase-01 through phase-04

---

## Finding 1: Storage migration (A1) has no schema validation — corrupted data walks straight into the store

- **Severity:** Critical
- **Location:** Phase 2, section "A1: No localStorage version/migration strategy"
- **Flaw:** The plan adds `version: 1` and a `migrate()` function, but never validates the *shape* of rehydrated state. A maliciously crafted or corrupted localStorage payload with unexpected keys, wrong types, or prototype pollution payloads (e.g., `{"__proto__": {"isAdmin": true}}`) will be deserialized by `JSON.parse` inside Zustand's `createJSONStorage` and passed directly into the store without any runtime type checking.
- **Failure scenario:** User shares a "save file" (JSON export from A6 recovery dialog) with another user. The JSON contains `"playerCount": "DROP TABLE"` or `"nightCount": -Infinity`. The store trusts it, components crash with NaN renders or infinite loops in `nextNight()`. Alternatively, `gameHistory` could be injected with millions of entries to exhaust memory, causing a DoS on the PWA.
- **Evidence:** Phase 2 A1 code snippet shows `migrate(state, version)` doing a simple version check, no schema validation. Phase 2 A6 adds JSON export but no import validation.
- **Suggested fix:** Add a Zod/valibot schema for `GameStore` persisted shape. Validate in `onRehydrateStorage` *before* merging into store. Reject invalid payloads entirely with fallback to defaults. Cap `gameHistory` length in the validator, not just `partialize`.

## Finding 2: executionId collision fix (M2) is incomplete — `_counter` still used for `executionId` in `executeAction`

- **Severity:** Critical
- **Location:** Phase 1, section "M2: _counter resets on reload — executionId collision"
- **Flaw:** The plan says "Replace `_counter` with `crypto.randomUUID()` for collision-free IDs." But in the actual codebase, `_counter` is used for TWO purposes: (1) the `uid()` function, and (2) directly as `executionId` at line 165: `const executionId = ++_counter;`. The plan's M2 fix only addresses `uid()`. The `executionId` assignment is a separate code path that also uses `_counter` and also resets on reload, but is NOT mentioned in the fix. Furthermore, `ActionLog.executionId` is typed as `number` but `crypto.randomUUID()` returns `string` — the plan does not mention the type change. If `uid()` switches to UUID but `executeAction` still uses `++_counter`, executionId will still collide across reloads, and the `undoAction` function groups by `executionId` — undo will corrupt.
- **Failure scenario:** After a page reload, `_counter` resets to 0. New `executeAction` calls produce `executionId: 1, 2, 3...` which collide with pre-reload entries persisted in `actionLog`. User clicks undo on a new action, but `undoAction` finds stale actions from before reload sharing the same `executionId`, and incorrectly removes them or miscalculates usage decrements.
- **Evidence:** `src/store/game-store-actions.ts:165` — `const executionId = ++_counter;`. Plan M2 only mentions `uid()`. No type migration for `executionId: number` -> `string`.
- **Suggested fix:** Explicitly change `executeAction` line 165 to use `crypto.randomUUID()` or equivalent for `executionId`. Update `ActionLog.executionId` type from `number` to `string`. Add localStorage migration in A1 that converts existing numeric executionIds.

## Finding 3: H2 sound fix claims `stopSound` needs adding — but it already exists in codebase

- **Severity:** High
- **Location:** Phase 1, section "H2: Night sound never stops"
- **Flaw:** The plan says "Add `stopSound(id)` + `stopAllSounds()` to sounds.ts API." But `stopSound` already exists in `src/utils/sounds.ts:29-35`. Plan was written against stale analysis. If an implementer follows literally, they will either duplicate the function, waste time, or skip the actual root cause — nothing *calls* `stopSound("night")` at the right lifecycle points.
- **Failure scenario:** Implementer reads "Add stopSound API" and writes a second version, shadowing the existing one, or skips the task thinking "it already exists." The actual bug — missing invocations at day-start, game-reset, settings-reset — remains unfixed.
- **Evidence:** `src/utils/sounds.ts` lines 29-35 already have `stopSound`. Plan says "Add `stopSound(id)` + `stopAllSounds()` to sounds.ts API."
- **Suggested fix:** Rewrite H2 to: "Verify `stopSound` exists (it does). Add `stopAllSounds()` helper only. Wire calls at: (1) timer `start()`, (2) `resetGame()`, (3) settings reset."

## Finding 4: Phase 1-2 ordering creates unmanaged migration window — C1 changes data semantics before storage versioning exists

- **Severity:** High
- **Location:** Phase 1 C1 + Phase 2 A1, cross-phase dependency
- **Flaw:** Phase 1 fixes C1 (deleteRole clears orphaned player roleIds) and M3/M6 (clean stale data on player ID recycle/shrink). These change persisted data shape and semantics. Phase 2 then adds storage versioning with `version: 1`. Between deploying Phase 1 and Phase 2, users have persisted state that was mutated by Phase 1 fixes but has no version marker. Phase 2's `migrate(state, 0)` has only a placeholder comment: `/* v0->v1: add timestamp fields */`. It doesn't account for Phase 1's state mutations leaving orphaned entries in `roleChangeLog`, `statusChangeLog`, or `actionLog`.
- **Failure scenario:** User runs Phase 1 code, deletes a role (C1 fix clears player roleIds). State persists. Phase 2 deploys. Migration runs v0->v1 but doesn't clean `roleChangeLog` entries referencing the now-deleted role. History display shows ghost role references.
- **Evidence:** Phase 2 A1: `if (version === 0) { /* v0->v1: add timestamp fields */ }` — placeholder. Phase 1 changes data semantics in C1, M3, M6 without versioning.
- **Suggested fix:** Move A1 (storage versioning) to Phase 1 as the FIRST task. All subsequent Phase 1 mutations then happen under version 1. Or write comprehensive v0->v1 migration in Phase 2 that accounts for every Phase 1 state mutation.

## Finding 5: `navigator.vibrate()` called without feature detection — crashes Safari

- **Severity:** High
- **Location:** Phase 4, section "ANIM4: Timer Countdown Urgency"
- **Flaw:** Plan specifies `navigator.vibrate(100)` at timer=0 with "if available" parenthetical but no implementation spec for the guard. `navigator.vibrate` is undefined in iOS Safari and some privacy browsers. A bare call throws `TypeError`. If this is in a synchronous chain with flash animation and sound, the entire timer-expire sequence breaks.
- **Failure scenario:** Timer hits 0 on iOS Safari. `navigator.vibrate(100)` throws. No visual feedback, no sound, timer stuck in expired state.
- **Evidence:** Phase 4 ANIM4: "`=0`: Flash white...`navigator.vibrate(100)` if available" — no try/catch, no feature detection pattern. Phase 1 H3 fixes a *different* Safari crash (requestIdleCallback) showing Safari compat is a known concern.
- **Suggested fix:** Specify explicitly: `try { navigator.vibrate?.(100); } catch {}`. Or create `safeVibrate()` utility matching the existing `playSound` pattern which already uses try/catch.

## Finding 6: Keyboard shortcuts (U6) have contradictory guard specs — will fire during text input

- **Severity:** High
- **Location:** Phase 4, section "U6: Keyboard Shortcuts for Common Actions"
- **Flaw:** The U6 implementation spec says "only active when no sheet is open (except Escape)." The Risk section says "must not fire when typing in input fields — guard with `e.target.tagName`." These are different guards and both incomplete. Sheets contain input fields. The setup screen has player name inputs on the main screen (no sheet). Neither guard alone is sufficient. `tagName` check also misses `contentEditable` and custom `role="textbox"` elements.
- **Failure scenario:** User types "DNS" as a player name on setup screen (no sheet open). Keydown fires `D` (Debate timer), `N` (Next Night), `S` (Settings). Game state corrupted mid-typing.
- **Evidence:** Phase 4 U6: "only active when no sheet is open." Risk: "guard with `e.target.tagName`." Both present, contradictory, neither complete.
- **Suggested fix:** Single consolidated spec: `isTypingContext(e)` checks `e.target` matches `input|textarea|select|[contenteditable]` or is within `[role="dialog"]`. Put in implementation spec, not just risk.

## Finding 7: Plan has no rollback/branching strategy — Phase 3 mass migration on `main` has no escape hatch

- **Severity:** Critical
- **Location:** plan.md overall structure, Phase 3 MIGRATE
- **Flaw:** Plan metadata: `branch: main`. All 4 phases are sequential on main. Phase 3 touches every component file (color migration) + font swap + component redesign. If Phase 3 fails midway (e.g., light mode broken, FAB merge causes usability regression), the codebase is half-migrated and unshippable. No feature branches, no checkpoint commits, no rollback definition. Phase 3 modifies the same files as Phase 2 (icon migration), so reverting Phase 3 may also revert Phase 2 work.
- **Failure scenario:** Phase 3 color migration is 60% done. Light mode looks broken. Can't ship current state. Can't revert without also losing Phase 2 icon work (same files modified). Project stuck.
- **Evidence:** plan.md `branch: main`. No mention of feature branches anywhere. Phase 3 scope: "All files in `src/components/`, `src/index.css`."
- **Suggested fix:** Each phase on its own feature branch. Phase 3 split into sub-phases: (3a) CSS variables only, (3b) color class migration, (3c) component redesign. Each gets independent merge checkpoint.

## Finding 8: Bottom sheet swipe-to-dismiss (U3) conflicts with scrollable sheet content

- **Severity:** Medium
- **Location:** Phase 4, section "U3/INT-SWIPE: Bottom Sheet Swipe-to-Dismiss"
- **Flaw:** Plan implements raw `onTouchStart/Move/End` with 100px threshold. HistorySheet and SettingsSheet have scrollable content (`overflow-y-auto` in current `bottom-sheet.tsx:101`). No scroll-vs-swipe disambiguation specified. Downward gesture at `scrollTop === 0` is indistinguishable from swipe-to-dismiss without explicit handling. No velocity-based detection either — fast flick < 100px should dismiss but won't.
- **Failure scenario:** User opens HistorySheet at scroll top. Swipes down to browse. Sheet dismisses. Happens every time from top position.
- **Evidence:** Phase 4 U3: "Drag >100px down = dismiss." No mention of scrollTop detection. Current bottom-sheet.tsx line 101: `overflow-y-auto`.
- **Suggested fix:** Specify: swipe-to-dismiss only activates from drag handle OR when content `scrollTop === 0`. Add velocity threshold (>0.5px/ms = dismiss). Or use `@use-gesture/react` which handles this.

## Finding 9: Sound continues playing when user switches tabs/locks phone — no visibility change handler

- **Severity:** Medium
- **Location:** Phase 1 H2 + Phase 4 SND, cross-phase gap
- **Flaw:** H2 fixes night sound stopping on day/reset. Phase 4 SND wires 7 sound-visual sync points. Neither addresses `document.visibilitychange`. Night ambience, ticks, and bells continue playing when user switches tabs or locks phone. For a mobile PWA used in group settings, this is a common and disruptive failure.
- **Failure scenario:** Moderator starts night. Ambience plays. Switches to messaging app. Werewolf ambience blasts from phone speaker for the entire group. No way to stop without switching back.
- **Evidence:** Neither H2 nor SND mention `visibilitychange`. `src/utils/sounds.ts` has no visibility listener.
- **Suggested fix:** Add `document.addEventListener('visibilitychange', () => { if (document.hidden) stopAllSounds(); })` in sound module init. Reference in Phase 2 (architecture) or Phase 4 (SND).

## Finding 10: Time estimates are aggressively low — Phase 2 at 12h covers 35-icon migration + 6 architecture items + 8 perf items

- **Severity:** Medium
- **Location:** plan.md phase table, Phase 2
- **Flaw:** Phase 2 estimated at 12h covering 14 items. P2 alone requires: removing FA dependency, installing Lucide, migrating 35 icons across 16 files, creating 3 custom SVG components, removing CSS `::after` unicode patterns, and visual QA of every icon. This is easily 8-10h of mechanical work. Remaining 6 architecture + 7 performance items get 2-4h total. The `default-roles.ts` split (A5) alone requires updating every import path across the codebase.
- **Evidence:** Phase 2 icon migration map lists 35 icons, 16 files. Estimate: 12h for all 14 items.
- **Failure scenario:** Phase 2 runs 2-3x over estimate. Sequential dependency means Phases 3-4 slip. 80h plan becomes 120h+.
- **Suggested fix:** Re-estimate Phase 2 to 20-24h. Consider splitting icon migration into its own sub-task with dedicated QA checkpoint.

---

**Status:** DONE
**Summary:** 10 findings: 3 Critical (unvalidated storage deserialization, incomplete executionId fix with type mismatch, no branching/rollback for high-risk Phase 3), 4 High (stale codebase analysis for H2, cross-phase migration ordering gap, Safari vibrate crash, contradictory keyboard shortcut guards), 3 Medium (swipe/scroll conflict, missing visibility-change sound handling, aggressive time estimates). The plan's deepest structural flaw is performing a full-codebase visual migration directly on `main` with no feature branches, no automated visual regression, and no checkpoint strategy.
