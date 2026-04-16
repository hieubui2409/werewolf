# Code Review: Phase 4 -- UX Animations, Gamification & Polish

**Date:** 2026-04-16
**Reviewer:** code-reviewer
**Scope:** Phase 4 changes across 11 files (CSS keyframes, animation logic, swipe gestures, keyboard shortcuts, PWA update dialog, night overlay)
**Build:** PASS | **TypeScript:** PASS | **Tests:** 157/157 PASS

---

## Overall Assessment

Solid implementation. Animations use GPU-friendly properties (transform, opacity, filter). `prefers-reduced-motion` global reset is correctly placed. The swipe-to-dismiss implementation is well-thought-out with proper scroll disambiguation, velocity threshold, and animation race guard. No security issues found. Several medium-priority issues around race conditions, stale closure, and missing `will-change` hints.

---

## Critical Issues

**(none)**

---

## High Priority

### H1. Night overlay double-fire race condition (game-screen.tsx:155-161)

**Problem:** `prevNight` state tracking via `useState` + `useEffect` can trigger the overlay multiple times or miss updates in React 18 StrictMode or under rapid state batching. The pattern:

```tsx
const [prevNight, setPrevNight] = useState(nightCount);
useEffect(() => {
  if (nightCount > prevNight) {
    setNightOverlay(true);
  }
  setPrevNight(nightCount);
}, [nightCount, prevNight]);
```

When `setPrevNight(nightCount)` fires, it updates `prevNight`, which is a dependency of the same effect -- creating a second invocation where `nightCount === prevNight` (no-op, but wasteful). In StrictMode this effect runs twice on mount, and the double-invocation pattern means 2 renders per night transition instead of 1.

**Fix:** Use `useRef` for previous value tracking (no re-render):

```tsx
const prevNightRef = useRef(nightCount);
useEffect(() => {
  if (nightCount > prevNightRef.current) {
    setNightOverlay(true);
  }
  prevNightRef.current = nightCount;
}, [nightCount]);
```

**Impact:** Unnecessary re-render per night transition; potential double overlay in StrictMode dev builds.

### H2. Keyboard shortcuts D/J are no-ops (game-screen.tsx:127-131)

**Problem:** The `d` and `j` keyboard shortcut cases call `e.preventDefault()` but perform no action. The plan (U6) specifies D = start/stop debate timer, J = start/stop judgment timer. But the timer lives inside `TimerBoard` via its own `useTimer()` hook -- GameScreen has no reference to `start`/`stop`.

```tsx
case "d":
  e.preventDefault();
  break;  // <-- no-op
case "j":
  e.preventDefault();
  break;  // <-- no-op
```

**Impact:** Two of six documented keyboard shortcuts are non-functional. Users pressing D or J will see nothing happen.

**Fix:** Either lift the timer hook to GameScreen and pass down, or expose `start`/`stop` via a ref/callback from TimerBoard.

### H3. Timer Escape handler duplication (timer-board.tsx:36-43 vs game-screen.tsx:118-123)

**Problem:** Both `TimerBoard` and `GameScreen` register `keydown` listeners for Escape. TimerBoard's listener calls `stop()` (stops timer), GameScreen's calls `setModal(null)` (closes sheet). Both fire on the same keypress. If a sheet is open AND timer is active, pressing Escape stops the timer AND closes the sheet simultaneously. The plan says Escape should "close any open sheet / stop timer" -- but sequentially (close sheet first, then on next Escape stop timer).

**Impact:** User presses Escape once, two unrelated things happen simultaneously. Unexpected UX.

**Fix:** In GameScreen's Escape handler, check if a sheet/FAB is open first. Only if nothing is open, stop the timer (requires exposing timer state or stop callback). Alternatively, remove the Escape handler from TimerBoard since GameScreen already handles it.

---

## Medium Priority

### M1. Death/revive animation + `dead-card` class flash (player-card.tsx:170-178)

**Problem:** When a player dies, the sequence is:

1. `player.alive` changes to `false`
2. `useEffect` sets `animClass = "death-anim"`
3. `deadClass` is `""` (because `animClass` is truthy)
4. Animation plays (0.6s)
5. `onAnimationEnd` clears `animClass` to `""`
6. `deadClass` becomes `"dead-card"` (because `!player.alive && !animClass`)

This works correctly. BUT there is a subtle issue: the `playerDeath` keyframe ends at `filter: saturate(0) brightness(0.5); opacity: 0.4` and uses `forwards` fill mode. When `onAnimationEnd` clears the class, the `forwards` fill is removed, and the element briefly flashes back to normal before `dead-card` CSS kicks in. This is a single-frame flash.

**Fix:** In `handleAnimEnd`, set both `animClass` to `""` synchronously -- React batches this in the same microtask, so `dead-card` should apply in the same render. However, the browser may paint the intermediate state. A safer approach: don't clear `animClass` for death -- just let `forwards` persist. Only clear on revive.

### M2. Missing `will-change` for heavy animations

**Problem:** `playerDeath` and `playerRevive` animate `filter`, `transform`, `box-shadow`, and `opacity` simultaneously. On mid-range mobile devices, animating `filter` (especially `saturate` + `brightness`) can cause jank because the browser may not promote the element to its own compositing layer.

**Fix:** Add `will-change: filter, transform, opacity` to `.death-anim` and `.revive-anim` classes. Remove after animation via the `onAnimationEnd` handler (already in place).

```css
.death-anim {
  will-change: filter, transform, opacity;
  animation: playerDeath 0.6s ease-out forwards;
}
```

### M3. `timerShake` + `pulse` animation conflict (index.css:372-377)

**Problem:** `.timer-glow-critical` runs TWO animations simultaneously:

```css
animation:
  timerShake 0.3s infinite,
  pulse 0.5s infinite;
```

Both `timerShake` and `pulse` animate `transform`. `timerShake` uses `translateX`, `pulse` uses `scale`. Because CSS animations on the same property replace each other (not compose), only the LAST listed animation's transform wins per keyframe tick. In practice, the shake effect will be intermittently overridden by the scale pulse, causing visual stuttering.

**Fix:** Merge the two animations into a single `@keyframes timerCritical` that combines both translateX and scale, or separate them onto different elements (e.g., shake on a wrapper, pulse on the text).

### M4. Night overlay `onComplete` is not stable across renders (night-transition-overlay.tsx:18-24)

**Problem:** The `onComplete` callback is created via `useCallback` in GameScreen, so it IS stable. However, the `useEffect` in NightTransitionOverlay lists `[onComplete]` as a dependency. If the parent ever re-renders with a new callback identity (e.g., if `useCallback` deps change), the `useEffect` cleanup will fire, clearing the timeouts, and new timeouts will be set -- potentially extending or restarting the overlay.

Currently safe because `handleNightOverlayComplete` has `[]` deps. But fragile -- any future change to add deps will silently break the overlay timing.

**Fix:** Store `onComplete` in a ref inside the overlay:

```tsx
const onCompleteRef = useRef(onComplete);
onCompleteRef.current = onComplete;
useEffect(() => {
  const skipTimer = setTimeout(() => setCanSkip(true), 500);
  const autoEnd = setTimeout(() => onCompleteRef.current(), 2000);
  return () => {
    clearTimeout(skipTimer);
    clearTimeout(autoEnd);
  };
}, []); // stable -- runs once
```

### M5. Bottom sheet `canSwipe` ref never set true if animation is skipped (bottom-sheet.tsx:41,73)

**Problem:** `canSwipe` is set to `false` on open and only set to `true` via `animationend` event on the sheet element. If `prefers-reduced-motion: reduce` is active, the global CSS rule sets `animation-duration: 0.01ms !important` and `animation-iteration-count: 1 !important`. The `animationend` event DOES still fire for 0.01ms animations in most browsers, so this likely works. However, if the animation is somehow canceled (e.g., by removing/re-adding the class during React reconciliation), `animationend` never fires and `canSwipe` stays `false` permanently -- swipe-to-dismiss is dead.

**Fix:** Add a fallback timer:

```tsx
const fallback = setTimeout(() => {
  canSwipe.current = true;
}, 500);
// In cleanup: clearTimeout(fallback);
```

### M6. Duplicate `id="sheet-title"` when multiple sheets coexist (bottom-sheet.tsx:177)

**Problem:** All BottomSheet instances use `id="sheet-title"`. If PwaUpdateSheet and a game sheet are both open, the DOM has two elements with the same ID. This violates HTML spec and breaks `aria-labelledby` (screen readers will read the first match, which may be the wrong title).

**Fix:** Generate a unique ID per instance:

```tsx
const titleId = useId(); // React 18 useId()
// or: const titleId = useRef(`sheet-title-${Math.random().toString(36).slice(2)}`).current;
```

### M7. Touch event handlers don't call `preventDefault` during drag (bottom-sheet.tsx:122-129)

**Problem:** During swipe-to-dismiss, `handleTouchMove` sets `dragY` but never calls `e.preventDefault()`. This means the browser will simultaneously perform native scroll AND the JS-driven drag, causing visual fighting (content scrolls while sheet moves down). The `sheet-dragging` class disables CSS transitions but not native scrolling.

**Fix:** Call `e.preventDefault()` in `handleTouchMove` when `isDragging` is true and the touch started on the drag handle or at scroll top. Note: this requires the event listener to NOT be passive. React synthetic touch events are not passive by default, so this should work.

```tsx
const handleTouchMove = (e: React.TouchEvent) => {
  if (!touchStart.current) return;
  const dy = e.touches[0].clientY - touchStart.current.y;
  if (dy > 0) {
    e.preventDefault(); // prevent native scroll during drag
    setDragY(dy);
    setIsDragging(true);
  }
};
```

---

## Low Priority

### L1. Card entrance animation replays on every re-render (game-screen.tsx:182-183)

**Problem:** The `.card-enter` class is always applied. If the player list re-renders (e.g., after a kill/revive), all cards replay the entrance animation. This is likely fine for UX but may be unintentional.

**Fix (optional):** Track whether entrance has played via a ref, or use `animation-fill-mode: both` with a one-time class.

### L2. Missing `game.tapToSkip` key handling (night-transition-overlay.tsx:43)

**Problem:** `t("game.tapToSkip", "Chay de bo qua")` uses inline fallback. Both `vi.json` and `en.json` do NOT include the `game.tapToSkip` key, so the fallback string will always be used.

**Fix:** Add `"tapToSkip": "Chay de bo qua"` to `vi.json` and `"tapToSkip": "Tap to skip"` to `en.json` under the `game` namespace.

### L3. `game.undo` key uses inline fallback (player-card.tsx:68,95)

**Problem:** `t("game.undo", "Hoan tac")` -- the `game.undo` key is not in either JSON file. Always uses fallback.

**Fix:** Add the key to both locale files.

### L4. Faction indicator visible even for villager who has `roleId` set (player-card.tsx:255-260)

**Problem:** The condition `{player.roleId && (...)}` shows faction label on the NAME face (front) when a role is assigned. This reveals faction information (wolf/villager/third emoji + text) on the un-flipped card, which may be undesirable in "nameFirst" mode where the point is to hide role information.

**Impact:** Potential gameplay information leak. The plan (A11Y-A6) says "Faction emoji + text label on card name face" -- but this seems to contradict the game's hidden-role mechanic unless intentional for the moderator view.

**Assessment:** Likely intentional since this is a moderator tool, not a player-facing display. The moderator sees all cards. Flagging for confirmation.

### L5. No `aria-label` or screen reader text on night overlay skip interaction

**Problem:** The night overlay's click-to-skip uses a plain `<div>` with `role="status"`. The skip text only appears after 0.5s. Before that, clicking does nothing, but there's no indication to assistive tech.

**Fix:** Add `aria-label` to the overlay div.

---

## Positive Observations

1. **GPU-friendly animations:** All keyframes use `transform`, `opacity`, `filter` -- no layout-triggering properties (width, height, top, left, margin). Good compositing behavior.

2. **`prefers-reduced-motion` global reset** is comprehensive -- `0.01ms` duration + `iteration-count: 1` effectively kills all animations and transitions.

3. **Swipe-to-dismiss architecture** is well-designed:
   - Scroll disambiguation via `scrollTop === 0` check
   - Velocity threshold for fast flicks
   - Animation race guard via `canSwipe` ref
   - `sheet-dragging` class disables transitions during drag

4. **`isTypingContext()` guard** is thorough -- covers INPUT, TEXTAREA, SELECT, contentEditable, and `role="textbox"`. Escape bypasses the guard correctly.

5. **PWA event bridge** is clean -- CustomEvent dispatch from SW registration, listened in React component, with proper cleanup.

6. **Death/revive animation pattern** using `prevAlive` ref + `animClass` state + `onAnimationEnd` cleanup is a correct approach for one-shot CSS animations triggered by prop changes.

7. **Test coverage** maintained -- all 157 tests pass, existing bottom-sheet and player-card tests remain green.

---

## Metrics

| Metric                   | Value                             |
| ------------------------ | --------------------------------- |
| TypeScript               | PASS (0 errors)                   |
| Build                    | PASS (350KB JS gzipped: 105KB)    |
| Tests                    | 157/157 PASS                      |
| `prefers-reduced-motion` | Covered globally                  |
| Lighthouse               | Not run (requires deployed build) |

---

## Summary of Recommended Actions

| Priority | ID  | Action                                                                       | Effort |
| -------- | --- | ---------------------------------------------------------------------------- | ------ |
| HIGH     | H1  | Fix night overlay `prevNight` tracking -- use `useRef` instead of `useState` | 5 min  |
| HIGH     | H2  | Implement D/J keyboard shortcuts (currently no-ops)                          | 30 min |
| HIGH     | H3  | Deduplicate Escape handler between TimerBoard and GameScreen                 | 15 min |
| MED      | M1  | Prevent death animation single-frame flash on class swap                     | 10 min |
| MED      | M3  | Fix `timerShake` + `pulse` transform conflict                                | 15 min |
| MED      | M4  | Stabilize overlay `onComplete` with ref pattern                              | 5 min  |
| MED      | M5  | Add `canSwipe` fallback timer for edge cases                                 | 5 min  |
| MED      | M7  | Add `preventDefault` in touch move during drag                               | 5 min  |
| LOW      | L1  | Card entrance animation replays on re-render                                 | 10 min |
| LOW      | L2  | Add missing i18n keys (`tapToSkip`, `undo`)                                  | 5 min  |

---

## Unresolved Questions

1. **L4 -- Faction emoji on name face:** Is showing wolf/villager/third faction on the un-flipped card intentional for moderator view? If so, no action needed. If not, the condition should be removed or gated by a setting.

2. **SHEET-SNAP:** The plan mentions progressive 90vh -> 50vh -> dismiss snap points, but the current implementation only has fixed 90vh sheets with swipe-to-dismiss. Was snap points deferred?

3. **Missing plan items:** ANIM10 (FAB stagger), INT2, INT4, INT5, INT7, GAME6 (typewriter), U1 (setup progress), LAY2 (sticky turn indicator), SND sync points -- these are marked as unchecked in the plan. Were they deferred to a follow-up?

---

**Status:** DONE_WITH_CONCERNS
**Summary:** Phase 4 animation/UX implementation is well-architected with correct use of GPU-friendly CSS, proper accessibility escape hatches, and solid swipe gesture handling. Three high-priority issues need attention: D/J keyboard shortcuts are no-ops, night overlay tracking has a wasteful re-render pattern, and Escape key fires in two places simultaneously.
**Concerns:** H2 (D/J no-ops) is a functional gap vs the plan spec. H3 (double Escape) is a UX issue that users will notice.
