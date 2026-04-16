# Phase 4: UX Animations, Gamification & Polish

## Context

- [UI/UX Redesign](../reports/ui-ux-260415-111014-werewolf-redesign-proposal.md) — Sections 6, 7, 8
- [Code Review Audit](../reports/code-review-260415-102842-full-codebase-audit.md) — U1, U3, U6, U8
- Priority: **P3** — polish layer after core UI stable

## Overview

Add atmospheric animations, gamification elements, swipe gestures, themed PWA dialog, setup UX, keyboard shortcuts, sound-visual sync. All animations respect `prefers-reduced-motion`. Total: 25 items.

---

## Animations (10)

### ANIM1: Card Entrance Stagger

- **File:** `src/components/game/game-screen.tsx` or `player-card.tsx`
- **CSS:** `@keyframes cardEnter { from { opacity:0; transform: translateY(12px) scale(0.95); } to { opacity:1; transform: translateY(0) scale(1); } }`
- **Stagger:** `style={{ animationDelay: \`${index \* 40}ms\` }}`
- **Duration:** 0.3s ease-out
- **Trigger:** On game screen mount

### ANIM2: Card Flip Spring Physics

- Already implemented in Phase 3 (CARD-FLIP). Verify working here.

### ANIM3: Bottom Sheet Spring Enter/Exit

- Already implemented in Phase 3 (SHEET). Verify working here.

### ANIM4: Timer Countdown Urgency (3 tiers)

- **File:** `src/components/game/timer-board.tsx`
- **Tiers:**
  - `>30s`: Steady glow, calm pulse (3s cycle)
  - `10-30s`: Faster pulse (1.5s), glow intensifies
  - `<10s`: Rapid pulse (0.5s), `@keyframes timerShake` (0.3s translateX ±2px), red glow `text-shadow: 0 0 40px rgba(239,68,68,0.8)`
  - `=0`: Flash white (`@keyframes timerFlash` 0.2s × 3), **[RED-TEAM]** safe vibrate: `navigator.vibrate?.(100)` (optional chaining — `navigator.vibrate` is undefined in iOS Safari + some privacy browsers; bare call throws TypeError)

### ANIM5: Night Phase Ambient Gradient

- **File:** `src/components/game/game-screen.tsx`
- **Night:** `::before` pseudo — `radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)`
- **Day:** `::before` pseudo — `radial-gradient(ellipse at 50% 100%, rgba(202,138,4,0.05) 0%, transparent 50%)` when timer active
- **Toggle:** CSS class based on `nightCount > 0` + timer state
- **Optional floating particles:** 3-4 small CSS dots with `@keyframes float` — only if `prefers-reduced-motion: no-preference`

### ANIM6: Night Transition Cinematic Overlay (2s)

- **File:** `src/components/game/game-screen.tsx` (or new `src/components/game/night-overlay.tsx`)
- **Trigger:** On `nextNight()` confirm
- **Design:** Full-screen fixed overlay, dark indigo gradient `radial-gradient(ellipse, #1E1B4B 0%, #020203 100%)`, "NIGHT X" in Bebas Neue font-display, moon icon
- **CSS:** `@keyframes nightTransition { 0%{opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{opacity:0} }`
- **Duration:** 2s, auto-dismiss
- **Decision:** Full cinematic overlay confirmed
- **[VALIDATED] Tap-to-skip:** 0.5s bắt buộc (prevent misclick), sau đó tap anywhere để skip. Best for repeated use.

### ANIM7: Player Death Animation (0.6s)

- **File:** `src/components/game/player-card.tsx`
- **Sequence:** Flash red (border glow + brightness spike 0-30%) → skull fade-in (30-50%) → desaturate + dim (50-100%)
- **CSS:** `@keyframes playerDeath { 0%{filter:saturate(1)brightness(1);transform:scale(1)} 30%{filter:saturate(1.3)brightness(1.2);border-color:rgba(239,68,68,0.6);box-shadow:0 0 20px rgba(239,68,68,0.3)} 100%{filter:saturate(0)brightness(0.5);transform:scale(0.98);opacity:0.4} }`
- **Sound sync:** `playSound('death')` at step 0

### ANIM8: Player Revive Animation (0.5s)

- **File:** `src/components/game/player-card.tsx`
- **Sequence:** Emerald glow → skull fade-out → resaturate to alive
- **CSS:** `@keyframes playerRevive { 0%{filter:saturate(0)brightness(0.5);opacity:0.4} 50%{filter:saturate(1.2)brightness(1.1);box-shadow:0 0 20px rgba(34,197,94,0.3)} 100%{filter:saturate(1)brightness(1);opacity:1} }`
- **Sound sync:** `playSound('revive')` at step 0

### ANIM9: Wizard Step Crossfade

- **File:** `src/components/game/skill-sheet.tsx`
- **Forward:** `@keyframes stepIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }` 0.2s
- **Back:** Reverse translateX direction (-20px → 0)

### ANIM10: FAB Button Entrance

- **File:** `src/components/game/game-screen.tsx`
- **Effect:** `scale(0) → scale(1)` with 50ms stagger when FAB menu expands

---

## Micro-Interactions Catalog (7)

### INT1: Player Card Hover (Desktop)

- **Duration:** 200ms
- **Effect:** Faction glow shadow appears on hover (already in Phase 3 CARD)
- **Verify:** Working with new Glowing Edge design

### INT2: Toggle/Radio Group Selection

- **Duration:** 150ms
- **Effect:** Background color slide + `scale(1.02)` on selected option

### INT3: Action Chip Appear/Remove

- **Appear:** 200ms `fadeIn + translateY(4px)`
- **Remove (undo):** 150ms `scaleX(0)` from center

### INT4: Accordion Expand (Role List)

- **Duration:** 200ms
- **Effect:** Height transition + rotate chevron icon

### INT5: Timer Digits Pulse

- **Duration:** 100ms per second
- **Effect:** Subtle `scale(1.01)` pulse on each tick

### INT6: Night Button Idle Glow

- **Duration:** 3s loop
- **Effect:** Moon icon glow pulse via `text-shadow` animation

### INT7: PWA Update Sheet Entrance

- **Duration:** 400ms spring
- **Effect:** Sheet spring + moon icon spin

---

## Gestures (2)

### U3/INT-SWIPE: Bottom Sheet Swipe-to-Dismiss

- **File:** `src/components/common/bottom-sheet.tsx`
- **Implementation:** `onTouchStart/Move/End` handlers. Drag >100px down = dismiss, <100px = snap back with spring.
- **[RED-TEAM] Scroll disambiguation:** Swipe-to-dismiss ONLY activates when:
  - Touch starts on drag handle (always eligible), OR
  - Content `scrollTop === 0` (at scroll top — downward gesture is unambiguous dismiss)
  - Otherwise treat as scroll (let native scroll handle it)
- **[RED-TEAM] Velocity threshold:** Fast flick (>0.5 px/ms) dismisses even below 100px
- **[RED-TEAM] Animation race guard:** Disable swipe during enter animation. Add `animationend` listener on sheet to set `canSwipe` flag true; reset on unmount. Prevents jumping when user swipes mid-spring.
- **Decision:** Swipe ↓ >100px OR velocity >0.5px/ms = close, <100px = snap back. Gated by scrollTop===0 or drag handle. Disabled during enter animation.

### SHEET-SNAP: Bottom Sheet Snap Points (Full-Height Sheets)

<!-- Updated: Validation Session 2 - Progressive 90vh→50vh→dismiss (Q8) -->

- **File:** `src/components/common/bottom-sheet.tsx`
- **Points:** Half-expanded 50vh (default), Full-expanded 90vh (drag up), Dismissed below 30vh
- **[VALIDATED] Swipe interaction:** Progressive 2-step — swipe down từ 90vh → snap về 50vh trước. Swipe tiếp từ 50vh → dismiss. Prevents accidental dismiss.
- **Apply to:** HistorySheet, SettingsSheet (sheets with scrollable content)

---

## Gamification (5)

### GAME6: Role Reveal Typewriter Effect

<!-- Updated: Validation Session 2 - useRef Set tracking (Q15) -->

- **File:** `src/components/game/player-card.tsx`
- **Trigger:** First flip per player
- **[VALIDATED] Tracking:** `useRef(new Set<number>())` trong GameScreen. Không persist, không trigger re-render. Reset mỗi game. Lightweight.
- **Effect:** Brief `scale(1.05)` with faction glow + role name letters appear one by one (30ms each)
- **Only first flip:** Subsequent flips are instant

### U8: PWA Themed Update Dialog

- **File:** `src/main.tsx` + new `src/components/common/pwa-update-sheet.tsx`
- **Design:** BottomSheet with moon icon, "A new moon rises... Update available!" heading, styled Confirm/Dismiss buttons
- **i18n:** `t('pwa.newMoon')`, `t('pwa.updateAvailable')`, `t('pwa.updateNow')`, `t('pwa.later')`
- **Replaces:** Native `confirm()` call in main.tsx

### U1: Setup Screen Progress Indicator + Role Count Warning

<!-- Updated: Validation Session 2 - Warning only, no block (Q22) -->

- **File:** `src/components/setup/setup-screen.tsx`
- **Progress bar:** `Players ●───● Roles ●───● Go!` with counts
- **Warning badge:** "4 roles but 10 players — 6 will be Villagers" when role count < player count
- **[VALIDATED] Behavior:** Warning only, không block Start button. Moderator biết rõ gameplay — assign Villager cho players thiếu role là valid.

### LAY2: Sticky Turn Indicator

- **File:** `src/components/game/game-screen.tsx`
- **Design:** Centered pill indicator above card grid: `● Night 3 ●`
- **Separate from timer bar:** Own row between timer and cards

### SND: Sound-Visual Synchronization Points

<!-- Updated: Validation Session 2 - Source 4 missing SFX (Q7/Q9) -->

- **Files:** Multiple components
- **[VALIDATED] Missing assets:** 4 sounds cần source từ freesound.org/pixabay: `death.mp3`, `revive.mp3`, `spell.mp3`, `day-start.mp3`. Existing: `timer-tick.mp3` (tick), `timer-end.mp3` (bell/buzzer), `night-ambience.mp3` (night).
- **[USER DESIGN INTENTION] Missing music files:** User yêu cầu source 4 missing SFX assets. Ưu tiên free-license sources (Pixabay, Freesound CC0). Files đặt tại `public/sounds/`. Cần download trước khi implement SND sync points.
- **Map:**

| Event                     | Sound                      | Visual                            | File                       |
| ------------------------- | -------------------------- | --------------------------------- | -------------------------- |
| Night transition          | `night-ambience.mp3` start | Night overlay + indigo gradient   | game-screen                |
| Day timer start           | `day-start.mp3` chime      | Warm amber gradient appears       | timer-board                |
| Player kill               | `death.mp3` thud           | Red flash + skull + desaturate    | player-card                |
| Player revive             | `revive.mp3` chime         | Green flash + resaturate          | player-card                |
| Timer <10s                | `tick.mp3` per second      | Shake + red glow intensify        | timer-board                |
| Timer expired             | `buzzer.mp3`               | White flash + vibrate             | timer-board                |
| Skill confirmed           | `spell.mp3` whoosh         | Brief faction glow on source card | skill-sheet                |
| Night sound stop          | —                          | When day timer starts             | sounds.ts                  |
| **[RED-TEAM]** Tab hidden | `stopAllSounds()`          | —                                 | sounds.ts visibilitychange |

---

## Accessibility Remaining (2)

### A11Y-A6: Faction Text Label on Card Name Face

- **File:** `src/components/game/player-card.tsx`
- **Fix:** Add small faction indicator on name face card (not just color):
  - Wolf: 🐺 + label
  - Villager: 🛡 + label
  - Third: 👁 + label
- **Size:** `text-[8px] font-bold uppercase tracking-wider`

### A11Y-A8: Timer Type Text Label Verification

- **File:** `src/components/game/timer-board.tsx`
- **Status:** Already has text labels ("Tranh Luan"/"Phan Quyet"). Color is supplementary, not sole indicator. **Verify in QA — likely OK.**

---

## Keyboard Shortcuts (1)

### U6: Keyboard Shortcuts for Common Actions

- **File:** `src/components/game/game-screen.tsx` (global keydown handler)
- **Shortcuts:**
  - `D` — Start/stop Debate timer
  - `J` — Start/stop Judgment timer
  - `N` — Next Night
  - `H` — Toggle History sheet
  - `S` — Toggle Settings sheet
  - `Escape` — Close any open sheet / stop timer
- **[RED-TEAM] Consolidated guard spec** (single source of truth — old specs "no sheet open" and "tagName check" were contradictory + incomplete):
  ```ts
  function isTypingContext(e: KeyboardEvent): boolean {
    const t = e.target as HTMLElement;
    if (!t) return false;
    const tag = t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
    if (t.isContentEditable) return true;
    if (t.getAttribute("role") === "textbox") return true;
    return false;
  }
  // In handler: if (isTypingContext(e)) return; (Escape is exception — always active)
  ```
- **Implementation:** `useEffect` with `keydown` listener. Shortcuts fire only when `!isTypingContext(e)`. Escape ignores typing check. Show shortcut hints in tooltip on desktop.
- **Covers:** Setup screen player name inputs (no sheet but typing context), input fields inside sheets, contentEditable name chips, custom textbox widgets.

---

## Quality Assurance (2)

### QA-BROWSER: Cross-Browser Testing

- **Browsers:** Safari iOS 17+, Chrome Android, Firefox 121+, Chrome Desktop 120+
- **Check:** All animations, swipe gestures, font rendering, sound playback, PWA install
- **Devices:** iPhone SE (320px), iPhone 15 (393px), iPad (768px), Desktop (1024px+)

### QA-LIGHTHOUSE: Lighthouse Audit

- **Targets:** Performance 90+, Accessibility 95+, Best Practices 95+, SEO 90+
- **Run:** `npx lighthouse http://localhost:4173 --output=json` on production build

---

## Related Code Files

| File                                         | Action | Items                                 |
| -------------------------------------------- | ------ | ------------------------------------- |
| `src/components/game/game-screen.tsx`        | Modify | ANIM1, ANIM5, ANIM6, ANIM10, LAY2, U6 |
| `src/components/game/player-card.tsx`        | Modify | ANIM7, ANIM8, GAME6, A11Y-A6, INT3    |
| `src/components/game/timer-board.tsx`        | Modify | ANIM4, INT5, INT6, A11Y-A8            |
| `src/components/game/skill-sheet.tsx`        | Modify | ANIM9                                 |
| `src/components/common/bottom-sheet.tsx`     | Modify | U3/INT-SWIPE, SHEET-SNAP              |
| `src/components/common/pwa-update-sheet.tsx` | Create | U8                                    |
| `src/main.tsx`                               | Modify | U8 use PwaUpdateSheet                 |
| `src/components/setup/setup-screen.tsx`      | Modify | U1                                    |
| `src/index.css`                              | Modify | All @keyframes declarations           |
| `src/i18n/locales/vi.json`                   | Modify | U8 new keys                           |
| `src/i18n/locales/en.json`                   | Modify | U8 new keys                           |
| Multiple files                               | Modify | SND sync points                       |

---

## Todo

### Animations

- [x] ANIM1: Card entrance stagger animation (0.3s + 40ms stagger)
- [x] ANIM4: Timer urgency 3-tier system (calm → fast → shake+red)
- [x] ANIM5: Night/day atmospheric gradients (CSS ::before)
- [x] ANIM5: Optional floating particles (reduced-motion aware)
- [x] ANIM6: Night transition cinematic overlay (2s, fullscreen, tap-to-skip after 0.5s)
- [x] ANIM7: Player death animation (0.6s red→skull→desaturate)
- [x] ANIM8: Player revive animation (0.5s green→resaturate)
- [x] ANIM9: Wizard step crossfade transitions (0.2s)
- [x] ANIM10: FAB button entrance with stagger

### Micro-Interactions

- [ ] INT2: Toggle/radio selection animation (150ms) — DEFERRED
- [x] INT3: Action chip appear/remove animations
- [ ] INT4: Accordion expand animation (200ms) — DEFERRED
- [ ] INT5: Timer digits pulse per second — DEFERRED
- [x] INT6: Night button idle moon glow (3s loop)
- [ ] INT7: PWA update sheet entrance (moon spin) — DEFERRED

### Gestures & UX

- [x] U3: Bottom sheet swipe-to-dismiss (>100px threshold)
- [ ] SHEET-SNAP: Bottom sheet snap points (50vh / 90vh / dismiss) — progressive 90vh→50vh→dismiss — DEFERRED: complex, diminishing returns
- [ ] GAME6: Role reveal typewriter effect (first flip only, useRef Set tracking) — DEFERRED: nice-to-have
- [x] U8: PWA themed update BottomSheet (moon + styled buttons)
- [x] U1: Setup progress indicator + role count warning (warning only, no block)
- [ ] LAY2: Sticky turn indicator pill above card grid — DEFERRED: redundant with timer bar
- [x] U6: Keyboard shortcuts for game actions (D, J, N, H, S, Esc)

### Sound-Visual Sync

- [ ] SND-ASSETS: Source 4 missing SFX from freesound.org/pixabay (death, revive, spell, day-start) — BLOCKED: missing sound assets
- [ ] SND-REGISTER: Add new sounds to SoundName type + SOUND_MAP in sounds.ts — BLOCKED: waiting for SND-ASSETS
- [ ] SND: Wire all 7 sound-visual sync points — BLOCKED: waiting for SND-ASSETS

### Accessibility & QA

- [x] A11Y-A6: Faction text label + emoji on card name face
- [x] A11Y-A8: Verify timer type text labels sufficient — OK: already has text labels
- [x] Verify ALL animations respect prefers-reduced-motion
- [ ] QA-BROWSER: Cross-browser testing (Safari iOS, Chrome Android, Firefox, Chrome Desktop) — DEFERRED to deployment
- [ ] QA-LIGHTHOUSE: Run Lighthouse audit → achieve targets — DEFERRED to deployment
- [x] Run `npm test` + `npm run build`
- [x] Final visual QA across all breakpoints (320px → 1024px+)

---

## Success Criteria

- All animations play at 60fps on mid-range mobile
- `prefers-reduced-motion` disables ALL non-essential animations
- Night atmosphere visible when nightCount > 0
- Timer urgency escalates visually at correct thresholds
- Death/revive animations sync with sound effects
- Bottom sheet dismissable via swipe down (>100px)
- Bottom sheet snap points work for tall content
- PWA update shows themed werewolf dialog (not native confirm)
- Setup shows progress + role count warning
- Role reveal typewriter plays on first flip only
- Keyboard shortcuts work on desktop
- Faction labels visible on card name face (not color-only)
- Lighthouse: performance 90+, a11y 95+, best practices 95+

## Risk

- **Swipe gesture** can conflict with iOS Safari back swipe — 100px threshold should avoid
- **Sound sync** timing depends on audio preloading — ensure critical sounds preloaded
- **Night cinematic** 2s overlay may feel slow — could add tap-to-skip (optional enhancement)
- **Keyboard shortcuts** must not fire when typing in input fields — guard with `e.target.tagName`
- **Multiple simultaneous animations** (card stagger + phase gradient) — test on low-end devices
