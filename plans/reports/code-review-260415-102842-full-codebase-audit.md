# Full Codebase Audit — Werewolf Moderator

**Date:** 2026-04-15  
**Scope:** All 37 source files (~7000 LOC)  
**Stack:** React 19 + Zustand 5 + Tailwind 4 + Vite 8 + PWA  
**Tests:** 5 failing / 157 total  
**Reviewers:** Manual deep-read + 2 parallel adversarial agents  
**Interview:** 15 design decisions resolved with product owner

---

## CRITICAL BUGS (3)

### C1: Role deletion orphans players — permanently unassignable

**File:** `game-store.ts:159-160`  
`deleteRole` removes role but doesn't clear `roleId` on assigned players. Orphaned players have `hasOtherRole=true` in `AssignRoleSheet` → can never be reassigned. Only fix: reset entire game.

### C2: SkillSheet wizard resets mid-use when any player state changes

**File:** `skill-sheet.tsx:57-89`  
`selectAbility` depends on `[players]`, recreated on every player mutation. `useEffect` at line 85 depends on `selectAbility` → re-fires whenever any player changes while sheet is open, resetting wizard back to step 1 from `initialContext`. **Real scenario:** Moderator opens skill sheet, another action changes a player's state → wizard jumps back. Most impactful UX bug.

### C3: Timer interval leak on rapid start — new timer becomes un-stoppable

**File:** `use-timer.ts:33-44`  
Rapid "Debate" → "Judgment" tap: old interval cleared, but stale callback can fire once more. It calls `clearInterval(id)` (its own stale id, no-op) then sets `timerRef.current = null`. This nulls the NEW timer's ref → Stop button becomes inert. User stuck in fullscreen timer overlay.

---

## HIGH BUGS (8)

### H1: Multi-target undo removes single action, not execution group

**File:** `game-store-actions.ts:187-219`  
Multi-target abilities (Cupid: 2, Fox: 3) create multiple ActionLog entries sharing one `executionId`. `undoAction` removes only the clicked entry → remaining targets become orphaned. Usage decrement fires only when `sameExecution.length === 1`, so partial undo doesn't restore charge.

> **Decision:** Undo entire execution group + show confirm dialog before removing.

### H2: Night sound never stops

**File:** `night-confirm-sheet.tsx:17`  
`playSound("night")` plays `night-ambience.mp3` (confirmed: long ambient loop). No `stopSound("night")` anywhere → audio plays indefinitely over game UI.

> **Decision:** Real bug — need stop mechanism.

### H3: requestIdleCallback crashes Safari

**File:** `main.tsx:10`  
`requestIdleCallback` unavailable in Safari (iOS + macOS). Sound preloading fails silently → first plays have delay/failure.

### H4: 5 failing tests — store/component drift

- `game-store.test.ts`: expects `statusChangeLog`/`roleChangeLog` without `timestamp`
- `player-card.test.tsx`: queries `aria-label="Undo Cắn"` but chips lack aria-labels

### H5: Dead source player can still execute actions

**File:** `game-store-actions.ts:136-184`  
`executeAction` has no alive-check for source player. If moderator kills a player then uses their skill in same night → action executes silently.

> **Decision:** Show confirmation BottomSheet when source is dead ("Hunter bị giết → xác nhận bắn?"). Common Ma Sói scenario (Hunter death shot), so don't block outright — confirm instead.

### H6: Bottom-sheet focus trap breaks during wizard transitions

**File:** `bottom-sheet.tsx:36-48`  
SkillSheet wizard step transitions momentarily have 0 focusable elements. Focus trap fails silently. Also `requestAnimationFrame` on line 54 can fire after sheet unmounts → null ref access.

### H7: Bottom-sheet `onClose` in useEffect deps causes focus-jump

**File:** `bottom-sheet.tsx:65`  
When parent doesn't memoize `onClose` (e.g., `PlayerActionSheet:38`), effect re-runs every render. Teardown calls `previousFocus.current?.focus()` causing jarring focus jumps on mobile.

### H8: All 6 sheets always mounted — ~30 redundant Zustand subscriptions

**File:** `game-screen.tsx:130-147`  
`HistorySheet`, `AssignRoleSheet`, `SkillSheet`, etc. are always rendered (hidden via `isOpen`). Each subscribes to multiple store slices. HistorySheet alone has 7 subscriptions + runs `buildCurrentRows()` on every mutation even when invisible. **Biggest re-render waste.**

---

## MEDIUM BUGS (11 — M5 downgraded to Low)

### M1: Custom roles always get `order: 10`

**File:** `game-store-actions.ts:104,112`  
Multiple custom roles = identical order = unpredictable night sequence.

### M2: `_counter` resets on reload — executionId collision with persisted log

**File:** `game-store-actions.ts:48`  
Module-level `_counter` starts at 0 on each page load. Persisted `actionLog` from previous session has old `executionId` values. If counter reaches same value, `undoAction` may affect wrong execution group.

### M3: Player ID collision on shrink-then-expand

**File:** `game-store-actions.ts:54-71`  
Shrink from 10→5 then expand to 10: new players reuse IDs 6-10. Old `flippedCards`, `actionLog`, `statusChangeLog` entries for those IDs are still in state → stale data bleeds into new players.

> **Decision:** Not a real scenario (must end game before returning to setup), but clean stale data as defensive measure. Low priority.

### M4: `actionMap.get()` returns new array ref every time, defeating `PlayerCard` memo

**File:** `game-store-selectors.ts:16-27`  
`usePlayerActionMap` builds new arrays inside map. Every action change creates new refs for ALL players → all PlayerCards re-render even if their actions didn't change.

### ~~M5~~ → Downgraded to LOW (storage optimization, not a bug)

**File:** `game-store.ts:290`  
`nextNight` keeps all `limited` actions in `actionLog` — this is **intentional by design**. Limited abilities must persist across the entire game for: action chips on PlayerCard, undo functionality, and `abilityUsage` tracking. The only concern is minor storage duplication: limited actions from turn N exist in both `actionLog` (ongoing) and `gameHistory[N].actionLogs` (archived). Practical impact is negligible since limited abilities are few (Witch heal 1x, Hunter shoot 1x, etc.).

### M6: `handlePlayerCountChange` doesn't clean related state

**File:** `game-store.ts:105-109`  
Removing players doesn't clear their entries from `flippedCards`, `actionLog`, `statusChangeLog`, `roleChangeLog`.

### M7: SkillSheet step 3 ability name not translated

**File:** `skill-sheet.tsx:269` — Uses `wizard.ability.name` instead of `tr(t, ...)`.

### M8: `GameState` type out of sync — missing `timestamp` field

**File:** `types/game.ts:83-88` — Misleading type definition.

### M9: `addAbility` hardcodes Vietnamese string "Kỹ năng"

**File:** `game-store.ts:170` — Store has no i18n access.

### M10: Nightly abilities have no per-night usage guard

No check prevents using Wolf Bite twice in same night. Counter increments but button stays enabled.

> **Decision:** Show warning modal/BottomSheet when moderator attempts 2nd use in same night. Wait for confirm before executing. Not a hard block — moderator has final say.

### M11: `executeAction` with empty targets increments usage with no log

**File:** `game-store-actions.ts:167` — `confirmNoTarget` creates 0 ActionLog entries but still increments `abilityUsage`. Action invisible in history, un-undoable.

> **Decision:** UI already blocks this (skills have target count). Add server-side guard as fallback. If edge case occurs, resolve history/log entry for traceability.

### M12: Timer overlay has no escape on touch

**File:** `timer-board.tsx:28-66` — No Escape handler, no backdrop dismiss. If buttons error, user trapped in fullscreen overlay.

> **Decision:** Add Escape key handler only. No tap-to-dismiss (prevent accidental touch during tense game moments).

---

## I18N ISSUES (5)

| ID  | File                              | Issue                                                                                 |
| --- | --------------------------------- | ------------------------------------------------------------------------------------- |
| I1  | `history-sheet.tsx:230,250,279`   | `"— Current"`, `"Past Turns"`, `"actions"` hardcoded English                          |
| I2  | `create-role-sheet.tsx:14-17,200` | Faction labels `"Dân"/"Sói"/"Phe 3"` + type toggle `"Đêm"/"Lần"` hardcoded Vietnamese |
| I3  | `role-library-sheet.tsx:112-113`  | `"skill"/"passive"` hardcoded English                                                 |
| I4  | `main.tsx:15`                     | PWA update prompt hardcoded Vietnamese, bypasses i18n (merged into U8)                |
| I5  | `game-store.ts:170`               | New ability name `"Kỹ năng"` hardcoded Vietnamese                                     |

---

## PERFORMANCE ISSUES (9)

| Severity   | Issue                                                                                       | File                            |
| ---------- | ------------------------------------------------------------------------------------------- | ------------------------------- |
| **High**   | Google Fonts render-blocking CSS import                                                     | `index.css:1`                   |
| **High**   | Font Awesome entire library imported (~1MB)                                                 | `index.css:3`                   |
| **Medium** | PlayerConfig re-renders 30 inputs on any keystroke                                          | `player-config.tsx`             |
| **Medium** | HistorySheet row builders not memoized                                                      | `history-sheet.tsx:69-110`      |
| **Medium** | `flipCard` creates new object → cascading re-render                                         | `game-store.ts:316`             |
| **Medium** | Persist serializes `roleTemplates` (~14KB) + unbounded `gameHistory` sync on every mutation | `game-store.ts:326`             |
| **Low**    | Timer interval runs while paused                                                            | `use-timer.ts:33-44`            |
| **Low**    | PlayerActionSheet hooks run when hidden                                                     | `player-action-sheet.tsx:21-25` |
| **Low**    | `nextNight()` O(P\*R) scan + inline arrows in GameScreen                                    | multiple                        |

---

## UI/UX ISSUES (7)

| ID     | Issue                                                                                                                      |
| ------ | -------------------------------------------------------------------------------------------------------------------------- |
| U1     | No player count vs roles count validation warning                                                                          |
| U2     | Dead players not visually distinguished as targets in SkillSheet step 3                                                    |
| U3     | No swipe-to-dismiss on bottom sheets                                                                                       |
| U4     | No confirmation before role deletion (accidental delete = lost config)                                                     |
| ~~U5~~ | ~~Card height `h-44` overflows~~ — **Not a bug.** Intentional: three-dot menu opens `PlayerActionSheet` showing full list. |
| U6     | No keyboard shortcuts for common game actions                                                                              |
| U7     | `targetCount: 0` can't be set back via SelectorModal UI                                                                    |
| U8     | PWA update uses native `confirm()` — replace with themed BottomSheet (see detail below)                                    |

### U8: Custom gamified PWA update dialog

**File:** `main.tsx:13-17`  
Current implementation uses bare `confirm("Có bản cập nhật mới. Tải lại?")` which:

- Breaks immersion — native browser dialog looks out of place in a polished game PWA
- Hardcoded Vietnamese — bypasses i18n (also listed as I4)
- No branding — misses opportunity for thematic "werewolf" update prompt
- Poor mobile UX — native confirm is small, unstyled, easily dismissed

> **Decision:** Replace with themed BottomSheet — moon icon, werewolf aesthetic, styled Confirm/Dismiss buttons matching existing design system. i18n-aware.

---

## ARCHITECTURE CONCERNS (6 — A4 resolved)

| ID     | Issue                                         | Decision                                                                           |
| ------ | --------------------------------------------- | ---------------------------------------------------------------------------------- |
| A1     | No localStorage version/migration strategy    | **Add version=1 + migrate function now** — prepare for future schema changes       |
| A2     | Custom role templates accumulate forever      | **Add delete button** in RoleLibrarySheet for custom templates                     |
| A3     | Duplicate `uid()` in 2 files                  | **Extract to `utils/uid.ts`** — single shared utility                              |
| ~~A4~~ | ~~`flippedCards` excluded from persist~~      | **Confirmed intentional** — flip is transient UI state, reset on reload is correct |
| A5     | `default-roles.ts` is 921 lines               | **Split by category** — `basic-roles.ts`, `advanced-roles.ts`, etc.                |
| A6     | No error recovery from corrupted localStorage | **Show recovery dialog** — let user choose Reset or Export raw data for debugging  |
| A7     | Error boundary exposes raw error stack        | **Toggle by env** — show stack in dev, hide with friendly message in production    |

---

## SUMMARY

| Category     | Critical | High   | Medium | Low   | Total  |
| ------------ | -------- | ------ | ------ | ----- | ------ |
| Bugs         | 3        | 8      | 11     | 1     | 23     |
| I18N         | 0        | 0      | 5      | 0     | 5      |
| Performance  | 0        | 2      | 4      | 3     | 9      |
| UI/UX        | 0        | 0      | 5      | 2     | 7      |
| Architecture | 0        | 0      | 4      | 2     | 6      |
| **Total**    | **3**    | **10** | **29** | **8** | **50** |

> **Notes:**
>
> - M5 downgraded Medium→Low: limited action persistence is intentional design
> - A4 resolved: flippedCards exclusion confirmed intentional
> - U5 resolved: card overflow is intentional design (three-dot menu as escape hatch)

---

## RECOMMENDED FIX PRIORITY (Top 10)

| #   | ID       | Issue                              | Impact                                        |
| --- | -------- | ---------------------------------- | --------------------------------------------- |
| 1   | **C2**   | SkillSheet wizard resets mid-use   | Users lose wizard progress during live game   |
| 2   | **C1**   | Role deletion orphans players      | Players become permanently unassignable       |
| 3   | **C3**   | Timer interval leak on rapid start | User stuck in fullscreen overlay              |
| 4   | **H8**   | All sheets always mounted          | 30+ wasted subscriptions, constant re-renders |
| 5   | **H1**   | Multi-target undo broken           | Undo group + confirm dialog                   |
| 6   | **H4**   | 5 failing tests                    | CI broken                                     |
| 7   | **H3**   | requestIdleCallback Safari crash   | PWA broken on iOS                             |
| 8   | **PERF** | Font imports blocking render       | Slow first paint (~1-2s extra)                |
| 9   | **H2**   | Night sound never stops            | Ambient loop plays indefinitely               |
| 10  | **A1**   | No persist migration               | Add version=1 + migrate now                   |

---

## INTERVIEW DECISIONS LOG

| Question                  | Decision                               | Rationale                                        |
| ------------------------- | -------------------------------------- | ------------------------------------------------ |
| A4: flippedCards persist? | **Intentional — no persist**           | Flip is transient UI state                       |
| Q2: Nightly multi-use?    | **Warning modal + confirm**            | Moderator has final say but prevent accidents    |
| Q3: Dead players?         | **Block dead source + confirm dialog** | Hunter death shot is common — confirm, not block |
| Q3b: Dead targets?        | **Show all + visual indicator**        | Dead can be valid targets (some abilities)       |
| Q4: Night sound?          | **Long ambient loop**                  | H2 confirmed real bug — need stop mechanism      |
| H1: Multi-target undo?    | **Undo entire group + confirm**        | Partial undo too confusing                       |
| A2: Custom templates?     | **Add delete button**                  | Users need cleanup capability                    |
| M12: Timer escape?        | **Escape key only**                    | No tap-dismiss (accidental touch risk)           |
| M3: Player ID collision?  | **Clean defensively, low priority**    | Not real scenario (setup only)                   |
| A1: Persist migration?    | **Add version + migrate now**          | Prevent future deploy crashes                    |
| A7: Error boundary?       | **Toggle dev/prod**                    | Stack useful for devs, hide from users           |
| A5: Roles data?           | **Split by category**                  | Better maintainability                           |
| M11: Skip button?         | **Guard + resolve edge log**           | UI already blocks, add fallback                  |
| A6: Corrupt storage?      | **Recovery dialog**                    | Reset or Export options                          |
| A3: Duplicate uid()?      | **Extract to utils/uid.ts**            | DRY                                              |
| U8: PWA dialog?           | **Themed BottomSheet**                 | Werewolf aesthetic, moon icon, i18n              |

---

## RESOLVED QUESTIONS

All 4 original unresolved questions have been answered:

1. ~~Is `flippedCards` intentionally excluded from persistence?~~ → **Yes, intentional.**
2. ~~Is nightly ability multi-use per night intended?~~ → **No — add warning confirm modal.**
3. ~~Should dead players be valid targets in SkillSheet?~~ → **Yes (valid targets), but dead source gets confirm dialog.**
4. ~~Is the `night-ambience.mp3` a short SFX or long ambient loop?~~ → **Long ambient loop — H2 is real bug.**
