# Phase 3: UI Design System & Components

## Context

- [UI/UX Redesign](../reports/ui-ux-260415-111014-werewolf-redesign-proposal.md) — Sections 2, 3, 5, 7, 9
- [Code Review Audit](../reports/code-review-260415-102842-full-codebase-audit.md) — U2, U5
- Priority: **P2** — visual transformation after stable + performant codebase

## Overview

Implement Moonlit Gothic color system, swap typography to Bebas Neue + Inter (self-hosted), redesign player cards (Glowing Edge), merge FABs, compact timer layout, fix remaining accessibility. Total: 19 items.

---

## Design System Foundation (7)

### COLOR: Moonlit Gothic Color System (Option B)

- **File:** `src/index.css`
- **Implementation:** Full CSS custom properties for dark mode. **[VALIDATED]** Dark-only — no light mode override.
- **Dark palette:** App bg #0F0F23, Surface #161631, Card #1E1C35, Elevated #27273B, Overlay #323250
- **Text:** Primary #E2E8F0, Secondary #94A3B8, Muted #64748B
- **Borders:** Default #4C1D95, Hover #5B21B6, Focus ring #8B5CF6
- **Factions:** Villager #60A5FA, Wolf #F87171, Third #C084FC + glow variants (rgba 0.08 bg, 0.3 glow)
- **Phase accents:** Night #818CF8, Day #FBBF24, Judgment #F43F5E
- **Semantic:** Success #34D399, Warning #FBBF24, Danger #EF4444, Info #60A5FA
- **CTA:** #6366F1, hover #818CF8
- **Shadows:** card, elevated, sheet variants
- **See:** Appendix A in UI/UX report for complete variable list

### COLOR-LIGHT: Light Mode Palette — **[VALIDATED] REMOVED**

**Decision:** Dark-only. Werewolf là game đêm, không cần light mode. Giảm complexity vĩnh viễn.

- No light mode block in index.css
- No theme toggle UI
- No per-batch light mode QA (Phase 3 MIGRATE chỉ cần check dark)
- Any `prefers-color-scheme: light` media queries remain ignored / stripped

### TYPO: Bebas Neue + Inter (Self-hosted)

<!-- Updated: Validation Session 2 - VN font verify + fallback (Q21) -->

- **Download:** Bebas Neue woff2 (~15KB) + Inter woff2 4 weights (~55KB)
- **Location:** `public/fonts/bebas-neue-latin-ext.woff2`, `public/fonts/inter-*.woff2`
- **CSS:** `@font-face` declarations in `index.css` with `font-display: swap` + `unicode-range` for Vietnamese subset
- **[VALIDATED] VN subset:** Verify Bebas Neue unicode coverage for Vietnamese diacritics (ă, â, ê, ô, ơ, ư, đ). Nếu thiếu → headings fallback `sans-serif` cho VN chars, Bebas chỉ cho Latin. Inter đã hỗ trợ VN đầy đủ.
- **[USER DESIGN INTENTION] Alternative gamification font:** Bebas Neue thiếu Vietnamese support đầy đủ (chỉ có latin-ext, không có Vietnamese subset riêng). Cần tìm alternative display/gamification font hỗ trợ VN tốt hơn. Candidates: **Oswald** (full VN support, condensed gothic), **Teko** (gamification feel, VN support), **Chakra Petch** (cyberpunk/game vibe, VN support), **Orbitron** (sci-fi game feel). Evaluate và chọn font phù hợp nhất cho werewolf game atmosphere + VN diacritics.
- **Remove:** Bungee + Roboto references from index.css and index.html
- **Type scale:** Display 2.441rem → H1 1.953rem → H2 1.563rem → H3 1.25rem → Body 1rem → Small 0.8rem → Tiny 0.64rem
- **Line height:** Headings 1.1 (Bebas tight), Body 1.6, Small 1.4

### TAILWIND: @theme Directive Configuration (Tailwind v4 native)

- **File:** `src/index.css` — top of file, before `@tailwind` imports
- **[VALIDATED]** Use Tailwind v4 `@theme` directive (native CSS variable support) instead of arbitrary value syntax
- **Implementation:**

  ```css
  @theme {
    --font-display: "Bebas Neue", sans-serif;
    --font-body: "Inter", sans-serif;

    --color-bg-app: #0f0f23;
    --color-bg-surface: #161631;
    --color-bg-card: #1e1c35;
    --color-bg-elevated: #27273b;
    --color-bg-overlay: #323250;

    --color-text-primary: #e2e8f0;
    --color-text-secondary: #94a3b8;
    --color-text-muted: #64748b;

    --color-border-default: #4c1d95;
    --color-border-hover: #5b21b6;
    --color-ring-focus: #8b5cf6;

    --color-villager: #60a5fa;
    --color-wolf: #f87171;
    --color-third: #c084fc;
    /* ... etc */
  }
  ```

- **Usage:** `bg-bg-card`, `text-text-primary`, `border-border-default`, `font-display` (Tailwind auto-generates utilities from `@theme` tokens)
- **Update:** All `font-bungee` → `font-display`, body text → `font-body`

### A11Y-FOCUS: Global Focus-Visible Styles

- **File:** `src/index.css`
- **Add:**
  ```css
  *:focus-visible {
    outline: 2px solid var(--color-ring);
    outline-offset: 2px;
    border-radius: 4px;
  }
  *:focus:not(:focus-visible) {
    outline: none;
  }
  ```

### A11Y-MOTION: prefers-reduced-motion Global Reset

- **File:** `src/index.css`
- **Add:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01s !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01s !important;
    }
  }
  ```

### A11Y-ZOOM: Remove user-scalable=no (A1 from a11y audit)

- **File:** `index.html:9`
- **Change:** `<meta name="viewport" content="width=device-width, initial-scale=1.0">` (remove `maximum-scale=1.0, user-scalable=no`)

---

## Component Redesign (10)

### CARD: Glowing Edge Player Card

- **File:** `src/components/game/player-card.tsx`
- **Changes:**
  - Replace `border-l-4` with full-border `border` + faction glow `shadow` on hover
  - Wolf: `border-red-500/30 hover:shadow-[0_0_15px_rgba(248,113,113,0.2)]`
  - Villager: `border-blue-500/30 hover:shadow-[0_0_15px_rgba(96,165,250,0.2)]`
  - Third: `border-purple-500/30 hover:shadow-[0_0_15px_rgba(192,132,252,0.2)]`
  - CSS-only faction background patterns (diagonal lines wolf, diamond grid villager, radial third)
  - See Section 5.1 in UI/UX report for full Tailwind implementation

### CARD-HEIGHT: Replace h-44 with min-h-[170px] (U5 resolved)

- **File:** `src/components/game/player-card.tsx`
- **Change:** `h-44` → `min-h-[170px]` so cards auto-grow with many action chips
- **Responsive:** Mobile min-h-[170px], Tablet min-h-[180px], Desktop min-h-[190px]

### CARD-DEAD: Dead Player Visual Enhancement

- **File:** `src/components/game/player-card.tsx`
- **Changes:**
  - Skull icon (Lucide `Skull`) overlay centered on card (`w-16 h-16 text-red-900/30`)
  - Name with `line-through` decoration
  - Card: `saturate-0 brightness-50 opacity-40` (much stronger than current `grayscale(0.7) + opacity(0.65)`)

### CHIP: Action Chip Pill Redesign

- **File:** `src/components/game/player-card.tsx`
- **Changes:**
  - Rectangular → pill-shaped (`rounded-full`)
  - Add dot indicator: `<span className="w-1.5 h-1.5 rounded-full bg-current" />`
  - `text-[10px] font-semibold px-2 py-0.5`
  - `aria-label` per chip: `{t('game.undo')} {actionName} {t('game.on')} {playerName}` (also covers a11y A5)

### CARD-FLIP: Spring Physics Animation

- **File:** `src/components/game/player-card.tsx`
- **Change:** `transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)` → `transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)` (spring overshoot)
- **Reduced motion:** `transition: transform 0.01s`

### FAB: Merge 2 FABs into 1 Expandable

<!-- Updated: Validation Session 2 - Close-first behavior (Q6), CSS stagger animation (Q19) -->

- **File:** `src/components/game/game-screen.tsx`
- **Changes:**
  - Replace 2 separate FABs → 1 main FAB (wand icon from Lucide `Wand2`)
  - Tap → expand vertically: [Use Skill ↑] [Assign Role ↓]
  - Backdrop overlay to close expanded state
  - All screen sizes (per user decision — always merged)
- **[VALIDATED] Sheet interaction:** Khi sheet đang mở, tap FAB → close current sheet → 300ms delay → expand FAB menu
- **[VALIDATED] Animation:** CSS transform + opacity stagger. Sub-buttons `scale(0)→scale(1)` với 50ms stagger. Backdrop fade-in 200ms. Pure CSS, no JS animation library.

### TIMER: Compact Single Row Layout

- **File:** `src/components/game/timer-board.tsx`
<!-- Updated: Validation Session 2 - Horizontal scroll 320px (Q14) -->
- **Changes:**
  - Single row ~48px: `[💬 Debate] [⚖️ Judge] ● Night 3 [📖 Hist] [🌙 Next] [🔇 Mute] [⚙ Set]`
  - Icon-only buttons with tooltip/aria-label
  - Mute/unmute toggle for night ambient sound (H2 UI part)
  - Turn indicator centered pill
- **[VALIDATED] 320px viewport:** Horizontal scroll with `scroll-snap` for small screens. Turn indicator sticky left (always visible). Buttons scrollable ngang.

### SHEET: Bottom Sheet Drag Handle + Spring + ARIA

- **File:** `src/components/common/bottom-sheet.tsx`
- **Changes:**
  - Drag handle: `<div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4" />`
  - Spring enter: `animation: sheetEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`
  - Fast exit: `animation: sheetExit 0.25s ease-in`
  - Backdrop blur transition: `backdrop-filter: blur(8px); background: rgba(0,0,0,0.85)`
  - ARIA fix (A3 a11y): backdrop `aria-hidden="true"`, sheet `role="dialog" aria-modal="true" aria-labelledby="sheet-title"`

### FACTION: Faction Theme Update

- **File:** `src/utils/faction-theme.ts`
- **Changes:** Update all Tailwind color classes to Moonlit Gothic values
  - Villager: #60A5FA (blue-400)
  - Wolf: #F87171 (red-400)
  - Third: #C084FC (purple-400)
  - Update bg, text, border, glow classes per faction

### U2: Dead Players Not Distinguished in SkillSheet Target Selection

- **File:** `src/components/game/skill-sheet.tsx`
- **Fix:** In step 3 target list, show dead players with dim styling + skull indicator. Still selectable (valid targets per decision). Visual: `opacity-50 italic` + ☠ prefix.

---

## Color Migration (1)

### MIGRATE: All Components Color Class Migration

- **Scope:** Every component file using Tailwind color classes
- **[VALIDATED]** Pattern uses Tailwind v4 `@theme` tokens (see TAILWIND section): `bg-slate-900` → `bg-bg-card`, `text-slate-100` → `text-text-primary`, `border-purple-900` → `border-border-default`
- **Note:** `@theme` tokens auto-generate utility classes — cleaner than arbitrary value `bg-[var(--...)]` syntax. IDE autocomplete works.
- **[RED-TEAM] Incremental batch approach** (NOT big-bang grep-replace):
  1. **Batch 1 — Structural colors:** app bg, surface, card bg, borders (commit + Playwright screenshot QA before Batch 2)
  2. **Batch 2 — Text colors:** primary, secondary, muted (commit + Playwright screenshot QA)
  3. **Batch 3 — Faction colors:** villager/wolf/third glow variants (commit + Playwright screenshot QA)
  4. **Batch 4 — Phase/semantic colors:** night/day/judgment, success/warning/danger (commit + Playwright screenshot QA)
- **[RED-TEAM] Color token mapping table** MUST exist before starting (old Tailwind class → CSS variable). Lives in `docs/02-general/design-guidelines.md` for reuse.
- **[VALIDATED] QA approach:** Automated Playwright screenshot diff per batch. Setup baseline screenshots before migration starts, compare after each batch commit.
- **[RED-TEAM] Per-batch QA checklist** (dark-only):
  - [ ] Playwright screenshot diff passes (no unexpected visual regressions)
  - [ ] All screens render correctly (setup, game, history, settings, action sheets)
  - [ ] No invisible text (low contrast pairs)
  - [ ] Faction glow still visible after text color change
  - [ ] Focus ring visible on all interactive elements

---

## Responsive (1)

### RESPONSIVE: Breakpoint & Card Sizing

- **Card sizing per breakpoint:**
  - Mobile portrait (320-767px): 2-col, min-h-[170px]
  - Mobile landscape (568-767px): 3-col, min-h-[170px]
  - Tablet (768-1023px): 3-col, sidebar timer, min-h-[180px]
  - Desktop (1024px+): 4-col, sidebar timer, min-h-[190px]

---

## Related Code Files

| File                                     | Action | Items                                                                                           |
| ---------------------------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| `src/index.css`                          | Modify | COLOR (dark-only), TYPO @font-face + @theme directive, A11Y-FOCUS, A11Y-MOTION, sheet keyframes |
| `index.html`                             | Modify | A11Y-ZOOM viewport, remove old font links                                                       |
| `public/fonts/`                          | Create | Self-hosted woff2 files (Bebas + Inter)                                                         |
| `src/components/game/player-card.tsx`    | Modify | CARD, CARD-HEIGHT, CARD-DEAD, CHIP, CARD-FLIP                                                   |
| `src/components/game/game-screen.tsx`    | Modify | FAB merge                                                                                       |
| `src/components/game/timer-board.tsx`    | Modify | TIMER compact layout                                                                            |
| `src/components/common/bottom-sheet.tsx` | Modify | SHEET drag handle + spring + ARIA                                                               |
| `src/utils/faction-theme.ts`             | Modify | FACTION new colors                                                                              |
| `src/components/game/skill-sheet.tsx`    | Modify | U2 dead player indicator                                                                        |
| All component files                      | Modify | MIGRATE color classes                                                                           |

---

## Todo

### Design System

- [x] Implement Moonlit Gothic CSS custom properties (dark-only)
- [x] Download + self-host Bebas Neue + Inter woff2 fonts
- [x] Verify Bebas Neue Vietnamese diacritics coverage, configure fallback if needed
- [x] Add @font-face declarations with font-display: swap + unicode-range
- [x] Update Tailwind @theme directive: fontFamily + custom color tokens (bg-bg-card convention)
- [x] Remove Bungee/Roboto references, update all font-\* classes
- [x] Add global focus-visible styles
- [x] Add prefers-reduced-motion global reset
- [x] Remove user-scalable=no from viewport meta
- [x] Setup Playwright screenshot baseline for color migration QA

### Components

- [x] Redesign player card: Glowing Edge borders + faction glow on hover
- [x] Replace h-44 with min-h-[170px] (responsive per breakpoint)
- [x] Implement dead player skull overlay + strikethrough + strong dim
- [x] Redesign action chips: pill-shaped + dot indicator + aria-labels
- [x] Update card flip to spring physics bezier
- [x] Merge 2 FABs into 1 expandable FAB (close-first behavior + CSS stagger animation)
- [x] Redesign timer bar to compact single row + mute button + horizontal scroll 320px
- [x] Add drag handle + spring/exit animations to bottom sheet
- [x] Fix bottom sheet ARIA: role=dialog, aria-modal, aria-hidden backdrop
- [x] Update faction-theme.ts with Moonlit Gothic colors
- [x] Fix dead player indicator in SkillSheet target selection (U2)

### Migration

- [x] Migrate all component color classes to CSS variable references
- [x] Update responsive breakpoints + card sizing

### Validation

- [x] Run `npm test` + `npm run build`
- [x] Visual test: dark mode across all screens
- [x] Playwright screenshot diff per migration batch (automated)
- [x] Verify WCAG AA contrast (see Section 9.3 table in UI/UX report)
- [x] Verify fonts render correctly (Vietnamese characters — especially Bebas Neue diacritics)
- [x] Verify self-hosted fonts load offline (disconnect network, reload)
- [x] Test FAB expandable on mobile + tablet + desktop (including close-first when sheet open)
- [x] Test timer bar horizontal scroll on 320px viewport

---

## Success Criteria

- Moonlit Gothic palette active (dark-only)
- Bebas Neue headings + Inter body text rendering correctly
- No Google Fonts CDN dependency (fully self-hosted, works offline)
- Player cards show faction glow borders on hover
- Dead players clearly distinguishable (skull + dim + strikethrough)
- Action chips pill-shaped with screen reader labels
- 1 expandable FAB on all screen sizes
- Timer bar compact single row with mute toggle
- Bottom sheet has drag handle + spring animation + correct ARIA
- All text passes WCAG AA contrast (4.5:1 normal, 3:1 large)
- `user-scalable=no` removed, pinch-zoom works
- Focus-visible ring on keyboard navigation
- Responsive card sizing across all breakpoints

## Risk

- **Color migration** touches every component — high surface area. Do systematic grep/replace.
- **Self-hosted fonts** need correct unicode-range for Vietnamese subset. Test with Vietnamese text.
- **FAB merge** is significant UX change — test with real gameplay scenario (rapid assign + skill usage).
- **Timer compact** must fit all controls in ~48px row — test on 320px viewport.
