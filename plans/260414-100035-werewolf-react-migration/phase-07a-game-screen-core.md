---
phase: 7a
status: pending
priority: high
effort: large
---

# Phase 7a: Game Screen — Core

<!-- Updated: Validation Session 1 - Split from Phase 7, responsive sidebar layout, dark/light, i18n, WCAG AA -->

## Overview

Core game screen components: layout container with responsive sidebar, player cards with flip, timer board.

## Files to Create (3 files)

### 1. `src/components/game/game-screen.tsx` (~100 lines)

Container with responsive layout.

**Phone (portrait):**

```
┌──────────────────────────┐
│ [60s ▶Luận] 📖🌙⚙️ [30s]│  ← TimerBoard
│         Turn 1            │
│  ┌────┐  ┌────┐          │
│  │Card│  │Card│          │  ← 2-col grid, scrollable
│  └────┘  └────┘          │
│  ┌────┐  ┌────┐          │
│  │Card│  │Card│          │
│  └────┘  └────┘          │
│ [🎭 Gán Role] [✨ Chiêu] │  ← V17 gradient floating buttons
└──────────────────────────┘
```

**Tablet landscape (md+ breakpoint, >768px):**

```
┌──────────┬───────────────────┐
│ TIMER    │ ┌──┐ ┌──┐ ┌──┐ ┌──┐ │
│ [60s]    │ │P1│ │P2│ │P3│ │P4│ │
│ [30s]    │ └──┘ └──┘ └──┘ └──┘ │
│──────────│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ │
│ Turn 1   │ │P5│ │P6│ │P7│ │P8│ │
│          │ └──┘ └──┘ └──┘ └──┘ │
│ [🎭 Role] │                   │
│ [✨ Skill]│                   │
└──────────┴───────────────────┘
```

**Implementation:**

- Tailwind `md:flex-row` for sidebar layout
- Sidebar: `md:w-64 md:flex-col md:border-r`
- Main: `flex-1` with player grid
- Player grid uses `@container` query for auto column count

**Bottom buttons (V17 style exactly):**

```
Gán Role:  bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full shadow-[0_5px_15px_...]
Dùng Chiêu: bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-[0_5px_15px_...]
```

**State:** Manages modal state: assign, skill, settings, history, night, reset, selectedPlayer.
**i18n:** All labels via `t()`.
**a11y:** Landmark regions (`<main>`, `<aside>`), button labels.

### 2. `src/components/game/player-card.tsx` (~160 lines)

Flip card with 3 view modes. **Most complex UI component.**

**Design: V17 clean dark base + V21 faction color accents**

Name face (front):

```
┌─┬────────────────┐
│▌│ [1]          ⋮ │  ▌= 4px faction-colored left border
│▌│                │  bg: white dark:bg-slate-900
│▌│   Player 1     │  font-bold
│▌│                │
│▌│ [Cắn] [Soi]   │  action chips with faction color
└─┴────────────────┘
```

Role face (back):

```
┌─┬────────────────┐
│▌│ [1]          ⋮ │  ▌= faction-colored left border
│▌│   MA SÓI       │  bg: faction bgLight
│▌│  ──────────    │  role name uppercase, faction text color
│▌│  Cắn    🌙     │  ability list with usage
│▌│ [Cắn] [Soi]   │
└─┴────────────────┘
```

Both mode: combined view, no flip.
Dead: grayscale + red tint overlay.

**Container query:** Card width adapts to grid container.

```typescript
interface PlayerCardProps {
  player: Player;
  role: GameRole | undefined;
  actions: ActionLog[];
  isFlipped: boolean;
  viewMode: CardViewMode;
  onFlip: (id: number) => void;
  onSelect: (id: number, e: React.MouseEvent) => void;
  onUndoAction: (actionId: string, e: React.MouseEvent) => void;
}
```

**Dark/light:** Card bg switches. Faction colors stay consistent.
**a11y:** `role="button"`, `aria-label`, `aria-expanded` for flip state. Action chips as buttons with labels.
**i18n:** Role names via `t("roles.b_wolf")`, action names translated.

### 3. `src/components/game/timer-board.tsx` (~110 lines)

Top bar + fullscreen timer overlay. Port from V17:228-283.

- Top bar: debate time + buttons (History, Night, Settings) + judgment time
- Fullscreen overlay when active: huge timer, pause/stop buttons
- Sound integration: play tick/bell via `useTimer` hook

**Responsive:**

- Phone: horizontal top bar
- Tablet sidebar: vertical layout within sidebar

**a11y:** Timer announced via `aria-live="polite"`. Buttons labeled.
**Dark/light:** Bar bg adapts. Timer overlay dark in both themes (for readability).

## Success Criteria

- Responsive layout works: phone 2-col, tablet sidebar + 4-col grid
- Container query auto-adapts card columns
- Flip cards work in all 3 view modes
- Faction colors on card borders, action chips, role names
- V17 button design on floating action buttons
- Timer counts down with sounds
- Touch targets ≥48px
- Keyboard accessible (Tab through cards, Enter to flip)
- Screen reader announces card state changes
- Dark/light theme renders correctly
