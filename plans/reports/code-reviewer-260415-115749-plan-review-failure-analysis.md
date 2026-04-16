# Plan Hostile Review: Failure Mode Analysis

**Plan:** Consolidated Bugfix & Redesign (260415-113413)
**Reviewer:** code-reviewer (Failure Mode Analyst)
**Date:** 2026-04-15

---

## Finding 1: localStorage migration (A1) ships AFTER data-mutating bug fixes — corrupts existing user state on upgrade

- **Severity:** Critical
- **Location:** Phase 1 vs Phase 2, overall plan dependency chain
- **Flaw:** Phase 1 modifies data structures (`timestamp` field added to `StatusChangeLog`/`RoleChangeLog` in M8, `nightUsageMap` in M10, changes to `abilityUsage` decrement logic in H1) and persists them to localStorage. But the migration strategy (A1: `version: 1` + `migrate()` function) does not land until Phase 2. Existing users who upgrade after Phase 1 will have localStorage data that was written without a version field and with old schema shapes. When Phase 2 finally adds `migrate()`, it must somehow detect and handle state written by post-Phase-1 code that has no version marker but already has some new fields. This is the classic "migration added too late" problem.
- **Failure scenario:** User runs app after Phase 1 deploy. localStorage has new `timestamp` fields on logs but `version` is absent. Phase 2 deploys with `migrate(state, version)`. Zustand treats unversioned state as `version: 0`, runs the `v0->v1` migration, which assumes old schema and may double-add or corrupt the already-partially-migrated fields.
- **Evidence:** Plan.md Phase order: `Phase 1 (bugs) -> Phase 2 (arch+perf)`. Phase 1 todo includes "M8: Add timestamp to StatusChangeLog/RoleChangeLog types" but A1 migration is in Phase 2.
- **Suggested fix:** Move A1 (localStorage version + migrate skeleton) to the very first task of Phase 1 as a prerequisite. The migration function can be a no-op initially (`version: 1, migrate: (s, v) => s`), but the version marker MUST exist before any schema changes ship. Then each subsequent data change bumps the version with its own migration step.

## Finding 2: undoAction in H1 removes single action but plan says "remove entire execution group" — the current code and the fix description are contradictory, with no reconciliation strategy

- **Severity:** High
- **Location:** Phase 1, H1 "Multi-target undo removes single action, not execution group"
- **Flaw:** The plan says to fix `undoAction` to "find all entries sharing `executionId`, removes them atomically, decrements `abilityUsage` once." But the current code at line 218 does `actionLog.filter((a) => a.id !== actionId)` (removes single action), while the abilityUsage decrement at line 200 only fires when `sameExecution.length === 1` (i.e., when this is the LAST action in the group). The plan does not address what happens to players whose status was changed by those actions. If a multi-target ability killed 3 players and you undo, do those 3 players come back alive? The plan says nothing about reversing status effects, only about removing log entries and decrementing usage.
- **Failure scenario:** Moderator uses Seer to peek at 3 targets. Undo triggers. The plan removes all 3 action logs + decrements usage by 1. But if those actions had side effects on player state (status changes logged in `statusChangeLog`), those are not reverted. The action log is clean but the game state is inconsistent.
- **Evidence:** Phase 1, H1 fix says "removes them atomically, decrements `abilityUsage` once" but does not mention `statusChangeLog` or `roleChangeLog` cleanup. The current `executeAction` code only modifies `players.abilityUsage` and `actionLog` — it does NOT modify `alive` status directly. But the plan's confirm dialog implies these actions have visible game effects worth confirming before undoing.
- **Suggested fix:** Explicitly document in H1 what state is reversed on undo: only actionLog + abilityUsage, or also statusChangeLog entries created in the same execution? Clarify whether `executeAction` ever modifies `alive` status (it does not in the current code — status changes appear to be a separate operation). If status changes are separate, document that undo is log-only and moderator must manually revert status.

## Finding 3: M3 + M6 player ID recycle cleanup is incomplete — only cleans listed stores, misses `flippedCards` race with Phase 2's flipCard structural sharing fix

- **Severity:** High
- **Location:** Phase 1, M3 and M6; Phase 2, P5
- **Flaw:** M3 says "clear stale `flippedCards`, `actionLog`, `statusChangeLog`, `roleChangeLog` entries for recycled IDs." M6 says "On shrink, remove entries from `flippedCards`, `actionLog`, `statusChangeLog`, `roleChangeLog` for removed player IDs." These are the same fix described twice for overlapping scenarios (shrink-then-expand vs just shrink), but they do not mention cleaning `abilityUsage` on the recycled player objects — and the player objects themselves carry `abilityUsage` as an embedded record. Meanwhile Phase 2 P5 changes `flipCard` to use structural sharing. If M3/M6 cleanup code and P5 structural sharing code both touch `flippedCards` with different assumptions about the object shape, the cleanup code written in Phase 1 may break after Phase 2 refactors `flippedCards`.
- **Failure scenario:** Phase 1 implements M3 cleanup that iterates `Object.keys(flippedCards)` and deletes entries. Phase 2 changes `flipCard` to use structural sharing, potentially changing how flippedCards references work. The cleanup code now has stale assumptions. Alternatively: player 5 is removed (shrink), then re-added (expand). The new player 5 inherits a clean `abilityUsage: {}` from `createInitialPlayers`, but if old `actionLog` entries referencing player ID 5 survived because the cleanup was incomplete, the history sheet shows ghost actions for the new player 5.
- **Evidence:** M3 fix: "clear stale `flippedCards`, `actionLog`, `statusChangeLog`, `roleChangeLog`". But `abilityUsage` is on the player object itself (line 20: `abilityUsage: {}`), and `gameHistory` also contains old player IDs.
- **Suggested fix:** Consolidate M3 and M6 into a single cleanup function called from `handlePlayerCountChange`. Document every piece of state that references player IDs. Add `gameHistory` to the cleanup list (or accept ghost references there with a documented decision).

## Finding 4: M10 per-night usage guard introduces new state (`nightUsageMap`) that is not in the persist partialize list and has no clear owner

- **Severity:** High
- **Location:** Phase 1, M10 "Nightly abilities have no per-night usage guard"
- **Flaw:** The plan proposes `nightUsageMap: Record<string, number>` reset in `nextNight()`. But this is new state that needs to be: (1) added to the `GameStore` interface, (2) initialized in the store, (3) added to `partialize` if it should survive page refresh mid-night, (4) reset not just in `nextNight()` but also in `resetGame()`. The plan mentions none of these integration points. Also, the current code at line 282-283 already resets nightly `abilityUsage` to 0 in `nextNight()` — which means nightly abilities are already guarded per-night at the usage level. The actual bug may be that a nightly ability can be used multiple times WITHIN the same night, which `nightUsageMap` would not fix because `executeAction` only checks `limited` type at line 146, not `nightly` type.
- **Failure scenario:** Developer adds `nightUsageMap` to the store but forgets to add it to `partialize`. User uses ability in night 3, refreshes page, `nightUsageMap` is lost, ability appears unused, user double-uses it. Or: the real fix needed is adding a nightly guard in `executeAction` (checking if already used this night), but the plan's `nightUsageMap` approach duplicates the existing `abilityUsage` reset mechanism with different semantics, creating two sources of truth for "has this ability been used this night."
- **Evidence:** Phase 1, M10 fix says `nightUsageMap: Record<string, number>` but the current `nextNight()` at line 282-283 already does `if (ab.type === "nightly") newUsage[ab.id] = 0;` which resets nightly usage each night. The missing piece is enforcement in `executeAction` where only `limited` type is checked (line 146).
- **Suggested fix:** Do not introduce `nightUsageMap`. Instead, add a nightly guard in `executeAction`: `if (ability.type === "nightly" && currentCount >= 1) return { players, actionLog }` (or show warning confirm). This uses the existing `abilityUsage` mechanism that is already persisted and already reset in `nextNight()`. The plan's approach creates redundant state.

## Finding 5: Phase 3 color migration ("MIGRATE: All Components Color Class Migration") has no rollback strategy and no incremental path

- **Severity:** High
- **Location:** Phase 3, section "Color Migration (1)", MIGRATE item
- **Flaw:** The plan describes a grep-and-replace of ALL hardcoded Tailwind color classes across every component file to CSS variable references. This is an atomic big-bang migration with no incremental path and no way to partially roll back. If any component's colors break (wrong variable mapping, missing variable, wrong contrast), the fix requires understanding the entire mapping. The plan says "systematic grep + replace per color tier, manual review per component" but with both dark AND light mode shipping simultaneously (decision #10), the test matrix explodes (N components x 2 modes x M breakpoints).
- **Failure scenario:** Developer replaces `bg-slate-900` with `bg-[var(--color-bg-card)]` across 30+ files. Light mode variable `--color-bg-card` is `#F1F5F9` but some component also had `text-slate-100` which becomes `text-[var(--color-text-primary)]` = `#0F172A` in light mode. The combination renders correctly in dark mode but is invisible in light mode (dark text on dark-ish background) on one specific component. This is caught only by exhaustive visual testing of every component in both modes. The plan's validation section says "Visual test: light mode across all screens" but provides no structured test matrix.
- **Evidence:** Phase 3, MIGRATE: "Systematic grep + replace per color tier, manual review per component." Validation: "Visual test: dark mode across all screens" and "Visual test: light mode across all screens" — no specification of which screens, which states, which data conditions.
- **Suggested fix:** Create an explicit color token mapping table (old class -> new variable) and migrate in batches: (1) layout/structural colors first, (2) component-specific colors second, (3) faction colors last. Add a Storybook-like visual regression step or at minimum a screenshot checklist per component per mode. Consider shipping dark mode first (closer to current), light mode as a follow-up.

## Finding 6: Bottom sheet gets swipe-to-dismiss (Phase 4 U3) AFTER lazy mounting (Phase 1 H8) and spring animations (Phase 3 SHEET) — three phases of touch with the same component, high regression risk

- **Severity:** Medium
- **Location:** Phase 1 H8, Phase 3 SHEET, Phase 4 U3/INT-SWIPE + SHEET-SNAP
- **Flaw:** `bottom-sheet.tsx` is modified in three separate phases: Phase 1 (H6/H7 focus trap + onClose stabilization, H8 lazy mount from parent), Phase 3 (drag handle, spring animations, ARIA, backdrop blur), Phase 4 (swipe-to-dismiss touch handlers, snap points). Each phase builds on the previous one's implementation without seeing the final shape. Specifically, Phase 3 adds `animation: sheetEnter 0.4s` and Phase 4 adds `onTouchStart/Move/End` handlers — but swipe-to-dismiss while a spring enter animation is playing will cause visual glitches (the animation and the touch drag fight over the transform). The plan does not address interaction between enter animation and immediate swipe.
- **Failure scenario:** User opens a sheet (spring animation starts, 0.4s). User immediately swipes down within 0.4s. The CSS animation is still running `translateY` while the touch handler is also setting `translateY` via inline style. The sheet jumps or glitches. On slow devices this window is even larger.
- **Evidence:** Phase 3, SHEET: "Spring enter: `animation: sheetEnter 0.4s`". Phase 4, U3: "`onTouchStart/Move/End` handlers. Drag >100px down = dismiss." No mention of animation completion guard before enabling swipe.
- **Suggested fix:** Add an `animationend` listener that sets a `canSwipe` flag. Or use `animation-fill-mode: forwards` with JS detection. Document this interaction explicitly in Phase 4 as a prerequisite check.

## Finding 7: Phase 2 P6 caps `gameHistory` to 50 but Phase 1 H1 undo relies on `actionLog` which is separate — capping history does not cap actionLog growth within a single game session

- **Severity:** Medium
- **Location:** Phase 2, P6 "Persist serializes roleTemplates + unbounded gameHistory"
- **Flaw:** P6 caps `gameHistory` to 50 games in `partialize`. But `actionLog` (which grows unboundedly within a single game session) is also persisted and is NOT capped. A single long game with 15+ nights and many multi-target abilities could accumulate hundreds of action log entries, all serialized to localStorage on every state mutation via Zustand persist. The plan does not address `actionLog` growth within a session. Additionally, capping at 50 games in `partialize` means the in-memory state still has all games — it's only the serialized version that's capped. If the user never refreshes during a marathon session, memory grows unbounded.
- **Failure scenario:** Power user plays a 20-night game with 15 players and 4 abilities per night. That's potentially 15 \* 20 = 300 action log entries. Every Zustand `set()` call serializes the entire `actionLog` array to localStorage. On low-end mobile, this causes jank on every state mutation.
- **Evidence:** Phase 2, P6 fix: "Cap `gameHistory` to last 50 games in `partialize`." The `partialize` at line 326-338 includes `actionLog: state.actionLog` with no cap. `actionLog` is filtered in `nextNight()` (line 290: keeps only `limited` type) but not within a night.
- **Suggested fix:** Acknowledge `actionLog` growth as a known limitation or cap it (e.g., last 500 entries). More importantly, consider throttling or debouncing localStorage writes rather than writing on every `set()`.

## Finding 8: Plan assumes `crypto.randomUUID()` availability (M2) without checking browser support — same class of bug as H3 (Safari polyfill)

- **Severity:** Medium
- **Location:** Phase 1, M2 "\_counter resets on reload — executionId collision"
- **Flaw:** The plan proposes replacing `_counter` with `crypto.randomUUID()`. While `crypto.randomUUID()` is widely supported in modern browsers, it requires a secure context (HTTPS or localhost). PWA apps served over HTTP during development or in certain WebView contexts will throw. The plan already identifies Safari compatibility as an issue (H3 requestIdleCallback polyfill) but does not apply the same defensive thinking to `crypto.randomUUID()`. The existing `uid()` function at line 50 already uses `Date.now()` + `Math.random()` which works everywhere.
- **Failure scenario:** Developer serves PWA over HTTP for testing (common with `vite --host` on local network for mobile testing). `crypto.randomUUID()` is undefined or throws in non-secure context. Every `executeAction` call crashes.
- **Evidence:** Phase 1, M2: "Replace `_counter` with `crypto.randomUUID()` for collision-free IDs." Line 50 already has `uid()` using `Date.now()` + `Math.random()`. Phase 1, H3 explicitly polyfills `requestIdleCallback` for Safari — same defensive approach not applied to `crypto.randomUUID()`.
- **Suggested fix:** Use the existing `uid()` function (after extracting to `src/utils/uid.ts` per A3) for executionId generation instead of `crypto.randomUUID()`. Or add a fallback: `const uuid = crypto.randomUUID?.() ?? uid()`.

## Finding 9: 80h estimate with 91 items across 4 sequential phases has no buffer for integration testing between phases

- **Severity:** Medium
- **Location:** plan.md, Phases table
- **Flaw:** 28h + 12h + 22h + 18h = 80h for 91 items. That is ~53 minutes per item average. The plan has zero buffer for: (1) integration testing between phases (Phase 2 changes architecture that Phase 3 builds on), (2) regression testing when Phase 3 color migration breaks something Phase 1 fixed, (3) the inevitable "Phase 1 bug fix created a new bug" discovery. The plan's validation sections are per-phase only — there is no cross-phase regression test plan. Phase 3's color migration alone (MIGRATE item) touches every component that Phase 1 and Phase 2 already modified.
- **Failure scenario:** Phase 1 and 2 complete on schedule. Phase 3 color migration changes CSS classes in `player-card.tsx` (which Phase 1 modified for C2, Phase 2 modified for P5). A merge conflict or color variable error reintroduces one of the critical bugs. There is no regression test checkpoint between phases, and the 80h budget has no slack to accommodate discovery.
- **Evidence:** plan.md: "All sequential. Each phase builds on the previous." Phase 1 est. 28h modifies `player-card.tsx` (H4, M4). Phase 3 est. 22h modifies `player-card.tsx` (CARD, CARD-HEIGHT, CARD-DEAD, CHIP, CARD-FLIP). No inter-phase regression test listed.
- **Suggested fix:** Add a 4-6h buffer as "Phase 2.5: Integration validation" between Phase 2 and Phase 3 (the highest-risk boundary, since Phase 3 touches UI of everything Phase 1-2 fixed). Add explicit regression test: "re-run all Phase 1 manual tests after Phase 3 color migration."

---

**Status:** DONE
**Summary:** The plan's most dangerous flaw is shipping data-mutating bug fixes (Phase 1) before the localStorage migration framework (Phase 2 A1), creating a window where user data is modified without version tracking and future migrations cannot distinguish pre-fix from post-fix state. Secondary concerns center on redundant state mechanisms (M10 nightUsageMap vs existing abilityUsage), incomplete undo semantics (H1 doesn't address status reversal), and the high-risk Phase 3 color migration having no incremental rollback path.
