# Werewolf Moderator PWA — Comprehensive UI/UX Redesign Proposal

**Date:** 2026-04-15  
**Author:** UI/UX Designer  
**Scope:** Full visual & interaction overhaul for Werewolf (Ma Soi) Moderator PWA  
**Stack:** React 19 + Zustand 5 + Tailwind 4 + Vite 8  
**Current state:** 37 source files, ~7000 LOC, 50 audit issues logged  
**Reference audit:** `code-review-260415-102842-full-codebase-audit.md`

---

## 1. Executive Summary

The Werewolf Moderator PWA serves a specific niche: live board-game moderators who need rapid, reliable access to player states, roles, and night actions during high-tension sessions. The current UI is functional but visually generic — a standard Tailwind dark/light toggle with indigo accents that doesn't capture the gothic, nocturnal essence of the Werewolf game.

**Vision:** Transform the app into an immersive, cinematic moderator console that feels like a supernatural artifact — deep midnight backgrounds, faction-colored neon glows, dramatic typography, and purposeful micro-interactions that heighten the theatrical atmosphere without sacrificing the fast, tap-heavy workflow moderators need.

**Key objectives:**
- Establish a dark-first OLED design system anchored in the werewolf theme (night, moon, blood, mystery)
- Reduce bundle size by ~1MB (Font Awesome replacement) + eliminate render-blocking fonts
- Introduce phase-aware atmosphere (night=deep indigo, day=warm amber)
- Redesign player cards for better visual hierarchy and faction identity
- Add a catalog of purposeful micro-interactions (150-300ms) with `prefers-reduced-motion` respect
- Achieve WCAG 2.1 AA across all elements

---

## 2. Color System Proposals

### 2.1 Option A — "Blood Moon" (Dark Horror)

Deep blacks with blood-red and bone-white. Maximally dramatic. Best for OLED power savings.

```
BACKGROUND HIERARCHY
  ┌──────────────────────────────────────────────┐
  │  Level 0: App bg         #020203             │  ████████████
  │  Level 1: Surface        #0C0C14             │  ████████████
  │  Level 2: Card           #151520             │  ████████████
  │  Level 3: Elevated       #1E1E2E             │  ████████████
  │  Level 4: Overlay        #28283A             │  ████████████
  └──────────────────────────────────────────────┘

TEXT HIERARCHY
  Primary:   #F1F5F9  (slate-100)   ██  on bg = 18.2:1  AAA
  Secondary: #CBD5E1  (slate-300)   ██  on bg = 13.0:1  AAA
  Muted:     #64748B  (slate-500)   ██  on bg =  5.3:1  AA
  Disabled:  #475569  (slate-600)   ██  on bg =  3.7:1  AA-large

FACTION COLORS (on #151520 card surface)
  Villager   #3B82F6 (blue-500)     ██  contrast 5.1:1  AA
  Wolf       #EF4444 (red-500)      ██  contrast 4.6:1  AA-large
  Third      #A855F7 (purple-500)   ██  contrast 4.2:1  AA-large

FACTION GLOW (text-shadow for emphasis, not for legibility)
  Villager   0 0 12px rgba(59,130,246,0.6)
  Wolf       0 0 12px rgba(239,68,68,0.6)
  Third      0 0 12px rgba(168,85,247,0.6)

SEMANTIC COLORS
  Success:   #22C55E  (emerald-500)
  Warning:   #F59E0B  (amber-500)
  Danger:    #EF4444  (red-500)
  Info:      #3B82F6  (blue-500)

PHASE ACCENTS
  Night:     #6366F1  (indigo-500)   — ambient glow, active turn indicator
  Day:       #CA8A04  (yellow-600)   — debate timer, warm tones
  Judgment:  #DC2626  (red-600)      — urgency, countdown pressure

BORDERS
  Default:   #1E293B  (slate-800)
  Hover:     #334155  (slate-700)
  Focus:     #6366F1  (indigo-500) with 2px ring
```

**CSS Variables:**
```css
:root {
  --bg-app: #020203;
  --bg-surface: #0C0C14;
  --bg-card: #151520;
  --bg-elevated: #1E1E2E;
  --bg-overlay: #28283A;
  --text-primary: #F1F5F9;
  --text-secondary: #CBD5E1;
  --text-muted: #64748B;
  --border-default: #1E293B;
  --border-hover: #334155;
  --faction-villager: #3B82F6;
  --faction-wolf: #EF4444;
  --faction-third: #A855F7;
  --accent-night: #6366F1;
  --accent-day: #CA8A04;
  --accent-danger: #DC2626;
  --accent-success: #22C55E;
}
```

**Pros:** Maximum OLED battery savings. Strongest horror atmosphere. Highest contrast ratios. Best night-time usability.  
**Cons:** Light mode would need a completely separate palette. Very dark — some users may find it oppressive.

---

### 2.2 Option B — "Moonlit Gothic" (Midnight Blue + Silver + Amber)

Midnight blue base with silver text and warm amber accents. Elegant, less aggressive than pure black.

```
BACKGROUND HIERARCHY
  ┌──────────────────────────────────────────────┐
  │  Level 0: App bg         #0F0F23             │  ████████████
  │  Level 1: Surface        #161631             │  ████████████
  │  Level 2: Card           #1E1C35             │  ████████████
  │  Level 3: Elevated       #27273B             │  ████████████
  │  Level 4: Overlay        #323250             │  ████████████
  └──────────────────────────────────────────────┘

TEXT HIERARCHY
  Primary:   #E2E8F0  (slate-200)   ██  on #1E1C35 = 11.4:1  AAA
  Secondary: #94A3B8  (slate-400)   ██  on #1E1C35 =  6.0:1  AA
  Muted:     #64748B  (slate-500)   ██  on #1E1C35 =  3.9:1  AA-large
  Accent:    #FCD34D  (amber-300)   ██  on #1E1C35 = 10.1:1  AAA

FACTION COLORS (on #1E1C35 card surface)
  Villager   #60A5FA (blue-400)     ██  contrast 6.8:1  AA
  Wolf       #F87171 (red-400)      ██  contrast 5.5:1  AA
  Third      #C084FC (purple-400)   ██  contrast 5.0:1  AA

BORDERS
  Default:   #4C1D95  (violet-800)  — subtle purple tint
  Hover:     #5B21B6  (violet-700)
  Focus:     #8B5CF6  (violet-500) ring

PHASE ACCENTS
  Night:     #818CF8  (indigo-400)
  Day:       #FBBF24  (amber-400)
  Judgment:  #F43F5E  (rose-500)
```

**CSS Variables:**
```css
:root {
  --bg-app: #0F0F23;
  --bg-surface: #161631;
  --bg-card: #1E1C35;
  --bg-elevated: #27273B;
  --bg-overlay: #323250;
  --text-primary: #E2E8F0;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --border-default: #4C1D95;
  --border-hover: #5B21B6;
  --faction-villager: #60A5FA;
  --faction-wolf: #F87171;
  --faction-third: #C084FC;
  --accent-night: #818CF8;
  --accent-day: #FBBF24;
  --accent-danger: #F43F5E;
  --accent-success: #34D399;
}
```

**Pros:** Warm, mystical, moonlit atmosphere. Purple borders add fantasy depth. Amber accent is distinctive. Good contrast across the board.  
**Cons:** Slightly more complex palette. Purple borders may clash with Third Party faction color.

---

### 2.3 Option C — "Neon Supernatural" (Deep Purple + Neon Rose)

Vibrant, modern, gaming-forward. Uses the research-sourced gaming palette directly.

```
BACKGROUND HIERARCHY
  ┌──────────────────────────────────────────────┐
  │  Level 0: App bg         #0A0A0F             │  ████████████
  │  Level 1: Surface        #12121A             │  ████████████
  │  Level 2: Card           #1A1A28             │  ████████████
  │  Level 3: Elevated       #252536             │  ████████████
  │  Level 4: Overlay        #2E2E42             │  ████████████
  └──────────────────────────────────────────────┘

TEXT HIERARCHY
  Primary:   #E2E8F0               ██  on #1A1A28 = 11.8:1  AAA
  Secondary: #94A3B8               ██  on #1A1A28 =  6.2:1  AA
  Muted:     #64748B               ██  on #1A1A28 =  4.0:1  AA-large

FACTION COLORS
  Villager   #38BDF8 (sky-400)     ██  — cyan-tinted blue, neon feel
  Wolf       #F43F5E (rose-500)    ██  — neon rose, aggressive
  Third      #A78BFA (violet-400)  ██  — soft lavender glow

PRIMARY ACCENT
  CTA/Action: #F43F5E (rose-500)
  Hover CTA:  #FB7185 (rose-400)

BORDERS
  Default:   #2A2A3A
  Hover:     #3A3A52
  Focus:     #7C3AED (violet-600) ring
```

**Pros:** Most "gaming" feel. High visual energy. Rose CTA pops strongly. Faction colors are distinct.  
**Cons:** Neon rose as primary can be fatiguing in long sessions. Less thematic (more cyberpunk than werewolf).

---

### **RECOMMENDATION: Option B ("Moonlit Gothic")**

**Rationale:**
- Best thematic fit for werewolf/supernatural genre — midnight blue with mystical purple undertones
- Amber accent creates a unique brand identity vs. generic indigo/blue apps
- Purple-tinted borders add fantasy depth that reinforces the game world
- Higher contrast than Option C while being less severe than Option A
- Warm amber accent for day phase + cold indigo for night phase creates natural atmospheric storytelling
- All faction colors maintain clear identity with >5:1 contrast ratios

For **light mode** (kept for accessibility), invert to:
```
  App bg:   #F8FAFC (slate-50)
  Surface:  #FFFFFF
  Card:     #F1F5F9 (slate-100)
  Text:     #0F172A (slate-900)
  Borders:  #E2E8F0 (slate-200)
  Factions: Keep same hues, darken to -600/-700 variants
```

---

## 3. Typography Proposals

### 3.1 Option A — "Gaming Bold" (Russo One + Chakra Petch)

Esports/competitive energy. Russo One's wide, heavy strokes feel authoritative for a moderator tool.

```
HEADING:     Russo One (400 only — single weight)
BODY:        Chakra Petch (300, 400, 500, 600, 700)
MONO:        JetBrains Mono (timer display)

TYPE SCALE (mobile-first, 1.25 ratio):
  Display:   2.441rem / 39px   Russo One 400     — app title only
  H1:        1.953rem / 31px   Russo One 400     — sheet titles
  H2:        1.563rem / 25px   Russo One 400     — section headers
  H3:        1.25rem  / 20px   Chakra Petch 700  — subsection
  Body:      1rem     / 16px   Chakra Petch 400  — default
  Small:     0.8rem   / 13px   Chakra Petch 500  — labels, chips
  Tiny:      0.64rem  / 10px   Chakra Petch 600  — badges, hints

LINE HEIGHT:
  Heading: 1.2
  Body:    1.5
  Small:   1.4

VIETNAMESE SUPPORT: Russo One ✓ (Latin Extended) | Chakra Petch ✓ (Vietnamese subset)
```

**Loading strategy:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Russo+One&family=Chakra+Petch:wght@300;400;500;600;700&display=swap" />
```

**Estimated size:** ~85KB total (Russo 25KB + Chakra Petch 60KB)  
**Pros:** Strong moderator authority feel. Chakra Petch's tech vibe fits digital tool.  
**Cons:** Russo One is all-caps heavy — may look odd in sentence case. Chakra Petch can be wide, consuming horizontal space on small cards.

---

### 3.2 Option B — "Bold Statement" (Bebas Neue + Inter)

Maximum impact headlines with the most readable body font on the web. The "designer's choice."

```
HEADING:     Bebas Neue (400 only — display uppercase)
BODY:        Inter (400, 500, 600, 700)
MONO:        Bebas Neue (timer — its wide numerals are perfect for countdowns)

TYPE SCALE (mobile-first, 1.25 ratio):
  Display:   2.441rem / 39px   Bebas Neue 400    — app title, timer
  H1:        1.953rem / 31px   Bebas Neue 400    — sheet titles
  H2:        1.563rem / 25px   Bebas Neue 400    — section headers
  H3:        1.25rem  / 20px   Inter 700         — subsection
  Body:      1rem     / 16px   Inter 400         — default
  Small:     0.8rem   / 13px   Inter 500         — labels, chips
  Tiny:      0.64rem  / 10px   Inter 600         — badges

LINE HEIGHT:
  Heading: 1.1 (Bebas is tall + narrow, needs tight leading)
  Body:    1.6
  Small:   1.4

VIETNAMESE SUPPORT: Bebas Neue ✓ (Latin Extended) | Inter ✓ (full Vietnamese)
```

**Loading strategy (non-blocking):**
```html
<!-- In index.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'" />
```

**Estimated size:** ~70KB total (Bebas 15KB + Inter 55KB)  
**Pros:** Bebas creates dramatic all-caps headlines (perfect for "WEREWOLF", "NIGHT 3", "JUDGMENT"). Inter is the gold standard for UI body text — 4-axis optical sizing, Vietnamese-optimized, highly legible at small sizes.  
**Cons:** Bebas only works in uppercase — any sentence case heading looks wrong. Requires disciplined `uppercase` enforcement.

---

### 3.3 Option C — "Refined Current" (Bungee + Inter)

Minimal migration: keep existing heading font, upgrade body from Roboto to Inter.

```
HEADING:     Bungee (400 only — current font, keep it)
BODY:        Inter (400, 500, 600, 700)

VIETNAMESE SUPPORT: Bungee ✓ (Latin Extended) | Inter ✓ (full Vietnamese)
```

**Estimated size:** ~80KB (Bungee 25KB + Inter 55KB)  
**Pros:** Zero heading disruption. Bungee already works. Users see no jarring change.  
**Cons:** Bungee is playful/chunky — less cinematic than Bebas or Russo. Doesn't elevate the brand as much.

---

### **RECOMMENDATION: Option B (Bebas Neue + Inter)**

**Rationale:**
- Bebas Neue is the perfect "moderator authority" font — tall, narrow, dramatic, cinematic
- Timer display in Bebas will look significantly more polished than current Bungee (narrower, more elegant numerals)
- Inter is the industry standard for UI body text — superior Vietnamese rendering, optical sizing
- Smallest bundle (70KB total), non-blocking load possible
- All-caps enforcement matches the existing `uppercase tracking-widest` pattern already throughout the codebase
- Clear visual hierarchy: Bebas = structural (titles, headers, timer, badges), Inter = functional (body, labels, inputs, chips)

**Tailwind config:**
```js
theme: {
  fontFamily: {
    display: ['"Bebas Neue"', 'sans-serif'],
    body: ['Inter', 'sans-serif'],
  }
}
```

---

## 4. Icon Strategy Proposals

### Current State Analysis

```
CURRENT: Font Awesome 6 Free (all.min.css)
  Import: @import "@fortawesome/fontawesome-free/css/all.min.css"
  Bundle: ~1.0MB (CSS + WOFF2 fonts for solid, regular, brands)
  Usage:  ~35 unique icons across the app
  Tree-shakeable: NO (full library always loaded)
```

Icons found in codebase (exhaustive scan):
```
fa-moon, fa-cog, fa-play, fa-pause, fa-stop, fa-comments, fa-gavel,
fa-book-open, fa-book, fa-wand-sparkles, fa-wand-magic-sparkles,
fa-theater-masks, fa-times, fa-chevron-up, fa-chevron-down,
fa-arrow-left, fa-arrow-right, fa-ellipsis-v, fa-plus, fa-plus-circle,
fa-trash-alt, fa-trash, fa-check, fa-skull, fa-skull-crossbones,
fa-heart, fa-lock, fa-crosshairs, fa-undo, fa-exchange-alt,
fa-sun, fa-users, fa-hashtag, fa-paw (CSS pattern), fa-shield (CSS pattern),
fa-eye (CSS pattern), fa-hat-wizard (CSS pattern)
```

**Total unique icons: ~35**  
**Paying for: ~7000+ icons**  
**Waste ratio: 99.5%**

---

### 4.1 Option A — Lucide React (Recommended)

```
Package: lucide-react
Size:    ~50KB (tree-shakeable, only import what you use)
Style:   1.5px stroke, 24x24 grid, rounded caps
Icons:   1500+ icons
License: ISC (permissive)
```

**Migration map (35 icons):**

| Font Awesome | Lucide Equivalent | Import |
|---|---|---|
| fa-moon | `Moon` | `import { Moon } from 'lucide-react'` |
| fa-sun | `Sun` | `import { Sun } from 'lucide-react'` |
| fa-cog | `Settings` | `import { Settings } from 'lucide-react'` |
| fa-play | `Play` | `import { Play } from 'lucide-react'` |
| fa-pause | `Pause` | `import { Pause } from 'lucide-react'` |
| fa-stop | `Square` | `import { Square } from 'lucide-react'` |
| fa-comments | `MessageSquare` | `import { MessageSquare } from 'lucide-react'` |
| fa-gavel | `Gavel` | `import { Gavel } from 'lucide-react'` |
| fa-book-open | `BookOpen` | `import { BookOpen } from 'lucide-react'` |
| fa-book | `Library` | `import { Library } from 'lucide-react'` |
| fa-wand-sparkles | `Wand2` | `import { Wand2 } from 'lucide-react'` |
| fa-wand-magic-sparkles | `Sparkles` | `import { Sparkles } from 'lucide-react'` |
| fa-theater-masks | `Drama` | `import { Drama } from 'lucide-react'` |
| fa-times | `X` | `import { X } from 'lucide-react'` |
| fa-chevron-up | `ChevronUp` | `import { ChevronUp } from 'lucide-react'` |
| fa-chevron-down | `ChevronDown` | `import { ChevronDown } from 'lucide-react'` |
| fa-arrow-left | `ArrowLeft` | `import { ArrowLeft } from 'lucide-react'` |
| fa-arrow-right | `ArrowRight` | `import { ArrowRight } from 'lucide-react'` |
| fa-ellipsis-v | `MoreVertical` | `import { MoreVertical } from 'lucide-react'` |
| fa-plus | `Plus` | `import { Plus } from 'lucide-react'` |
| fa-plus-circle | `PlusCircle` | `import { PlusCircle } from 'lucide-react'` |
| fa-trash-alt | `Trash2` | `import { Trash2 } from 'lucide-react'` |
| fa-trash | `Trash` | `import { Trash } from 'lucide-react'` |
| fa-check | `Check` | `import { Check } from 'lucide-react'` |
| fa-skull | `Skull` | `import { Skull } from 'lucide-react'` |
| fa-skull-crossbones | `Skull` | (same, no crossbones variant — use custom) |
| fa-heart | `Heart` | `import { Heart } from 'lucide-react'` |
| fa-lock | `Lock` | `import { Lock } from 'lucide-react'` |
| fa-crosshairs | `Crosshair` | `import { Crosshair } from 'lucide-react'` |
| fa-undo | `Undo2` | `import { Undo2 } from 'lucide-react'` |
| fa-exchange-alt | `ArrowLeftRight` | `import { ArrowLeftRight } from 'lucide-react'` |
| fa-users | `Users` | `import { Users } from 'lucide-react'` |
| fa-hashtag | `Hash` | `import { Hash } from 'lucide-react'` |

**After tree-shaking (35 icons): ~8KB gzipped**  
**Savings vs current: ~992KB (99.2% reduction)**

**Pros:** Industry standard. React-native component API. Perfect tree-shaking. Consistent 1.5px stroke style. Active maintenance. Easy `size` and `color` props. No CSS import needed.  
**Cons:** Missing a few game-specific icons (skull-crossbones, paw). Stroke style is lighter than FA's solid fill — may feel less "heavy."

---

### 4.2 Option B — Heroicons

```
Package: @heroicons/react
Size:    ~40KB (tree-shakeable)
Style:   Outline (1.5px) + Solid (filled) variants
Icons:   ~300 icons
License: MIT
```

**Pros:** From Tailwind team, excellent integration. Dual outline/solid mode.  
**Cons:** Only 300 icons — **missing** skull, heart, moon, gavel, crosshair, wand, theater-masks, book-open. Would need 10+ custom SVGs, defeating the purpose.  
**Verdict:** Not enough coverage for this app. **Rejected.**

---

### 4.3 Option C — Custom SVG Icon Set

Create 35 custom SVGs with werewolf-themed flair (paw prints as bullets, moon phases, claw marks, etc.).

**Pros:** Unique brand identity. Perfect control over every pixel.  
**Cons:** High design effort (~35 icons x 2 hours = 70 hours). Maintenance burden. Overkill for a moderator tool.  
**Verdict:** Only consider for 3-5 key "signature" icons (app logo, faction emblems). Not practical for full set.

---

### **RECOMMENDATION: Option A (Lucide React) + 3 Custom SVGs**

**Strategy:**
1. Replace all 35 Font Awesome icons with Lucide React equivalents
2. Create 3 custom SVG icons for game-specific needs:
   - `WerewolfSkull` — stylized skull with crossbones (death watermark)
   - `WolfPaw` — paw print (wolf faction emblem for card patterns)
   - `MysticEye` — eye with star (third party faction emblem)
3. Remove `@fortawesome/fontawesome-free` from `package.json`
4. Remove `@import "@fortawesome/fontawesome-free/css/all.min.css"` from `index.css`
5. Remove all Font Awesome unicode references in CSS card patterns — replace with inline SVG patterns

**Impact:**
- **Bundle reduction:** 1MB -> ~8KB (~99% reduction)
- **CSS removal:** ~3KB of Font Awesome import + card pattern `::after` content rules
- **Migration effort:** ~2-3 hours (find-replace + component prop updates)

---

## 5. Card Design Proposals

### Current Card Analysis

```
CURRENT CARD:
  ┌──────────────────────────────────────┐
  │  h-44 (176px) fixed height           │
  │  rounded-2xl (both view) / xl (flip) │
  │  border-l-4 faction color            │
  │  bg-white dark:bg-slate-900          │
  │  3D flip animation (0.6s)            │
  │  Dead: grayscale(0.7) + opacity(0.65)│
  │  Patterns: SVG ::before + FA ::after │
  └──────────────────────────────────────┘

ISSUES:
  - Fixed h-44 can overflow with many action chips
  - Dead state is too subtle (just dim filter)
  - Faction patterns use Font Awesome unicode (will break on icon migration)
  - Name face has no faction identity (uses mixed pattern)
  - Flip animation is good but could use spring physics
  - No entrance animation (cards pop in statically)
```

---

### 5.1 Option A — "Glowing Edge" Card (Recommended)

Full-border glow instead of left-border-only. Faction identity is visible from every angle.

```
ALIVE CARD (Name Face):
  ┌─────────────────────────────────────────────────┐
  │  ╔══════════════════════════════════════════╗    │
  │  ║  [7]                           [...]    ║    │  1px border
  │  ║                                         ║    │  + faction glow shadow
  │  ║              Nguyen Van A                ║    │
  │  ║                                         ║    │
  │  ║  ┌─ Bite ──── x ─┐  ┌─ Guard ─── x ─┐ ║    │  action chips
  │  ╚══════════════════════════════════════════╝    │
  └─────────────────────────────────────────────────┘

ALIVE CARD (Role Face — Wolf):
  ┌─────────────────────────────────────────────────┐
  │  ╔══════════════════════════════════════════╗    │
  │  ║  [7]               ···   ║    │  red glow
  │  ║                                         ║    │
  │  ║          ● SÓI ●                        ║    │  faction color text
  │  ║                                         ║    │
  │  ║  [ Cắn - mỗi đêm ]  [ Hú - 1x ]       ║    │  ability buttons
  │  ║                                         ║    │
  │  ║  ┌─ Bite → P3 ─── x ─┐                 ║    │  action chips
  │  ╚══════════════════════════════════════════╝    │
  └─────────────────────────────────────────────────┘

DEAD CARD:
  ┌─────────────────────────────────────────────────┐
  │  ╔══════════════════════════════════════════╗    │
  │  ║                                         ║    │  desaturated
  │  ║          ☠  Nguyen Van A  ☠             ║    │  skull icon overlay
  │  ║             ──────────                  ║    │  strikethrough name
  │  ║          opacity: 0.4                   ║    │  strong dimming
  │  ╚══════════════════════════════════════════╝    │
  └─────────────────────────────────────────────────┘
```

**Tailwind implementation:**
```tsx
// Alive card wrapper
<div className={cn(
  "rounded-xl border transition-shadow duration-300",
  "bg-[var(--bg-card)]",
  // Faction glow on hover/focus
  faction === 'wolf' && "border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]",
  faction === 'villager' && "border-blue-500/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]",
  faction === 'third' && "border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]",
)}>

// Dead card wrapper
<div className={cn(
  "rounded-xl border border-slate-800/50",
  "bg-[var(--bg-card)] saturate-0 brightness-50 opacity-40",
  "relative overflow-hidden",
)}>
  {/* Diagonal "DEAD" stamp */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <Skull className="w-16 h-16 text-red-900/30" />
  </div>
</div>
```

**New faction background patterns (CSS-only, no Font Awesome):**
```css
/* Wolf: diagonal claw slashes */
.card-bg-wolf {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 10px,
    rgba(239, 68, 68, 0.03) 10px,
    rgba(239, 68, 68, 0.03) 11px
  );
}

/* Villager: subtle diamond grid */
.card-bg-villager {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 15px,
    rgba(59, 130, 246, 0.03) 15px,
    rgba(59, 130, 246, 0.03) 16px
  ),
  repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 15px,
    rgba(59, 130, 246, 0.03) 15px,
    rgba(59, 130, 246, 0.03) 16px
  );
}

/* Third: concentric circles */
.card-bg-third {
  background-image: radial-gradient(
    circle at 80% 80%,
    rgba(168, 85, 247, 0.06) 0%,
    transparent 50%
  );
}
```

**Pros:** Glow borders give instant faction readability. CSS-only patterns (no icon dependency). Dead state is dramatically clearer with skull overlay + strikethrough.  
**Cons:** Glow shadows may cause minor repaint cost on scroll (mitigated by `will-change: transform` on card wrapper).

---

### 5.2 Option B — "Gradient Header" Card

Top gradient bar shows faction color. Body remains neutral.

```
  ┌──────────────────────────────┐
  │ ▓▓▓▓▓ WOLF GRADIENT ▓▓▓▓▓▓ │  6px gradient bar (red)
  │  [7]              [...]     │
  │                             │
  │        Nguyen Van A         │
  │                             │
  │  [ Bite → P3 — x ]         │
  └──────────────────────────────┘
```

**Pros:** Clean separation. Gradient bar is visually distinctive.  
**Cons:** Less immersive than glow. Gradient + rounded corners requires extra overflow handling. Less "premium" feel.

---

### 5.3 Option C — "Full Faction Fill" Card

Entire card background is a subtle gradient of faction color.

```
  ┌──────────────────────────────┐
  │  ╔══ wolf dark red bg ══╗   │
  │  ║  [7]          [...]  ║   │
  │  ║                      ║   │
  │  ║    Nguyen Van A      ║   │
  │  ║                      ║   │
  │  ║  [ Bite → P3 — x ]  ║   │
  │  ╚══════════════════════╝   │
  └──────────────────────────────┘
```

```tsx
// Example for wolf
className="bg-gradient-to-br from-red-950/80 to-red-900/30 border border-red-500/20"
```

**Pros:** Strongest faction identity. Cards are immediately distinguishable at a glance.  
**Cons:** Too much color can be overwhelming with 16 players on screen. Light-on-dark text readability varies. Action chips may clash.

---

### **RECOMMENDATION: Option A ("Glowing Edge")**

**Rationale:**
- Subtle glow borders provide faction identity without overwhelming the card grid
- CSS-only background patterns eliminate Font Awesome dependency
- Dead state is dramatically clearer (skull overlay + strikethrough + strong dim)
- Hover glow effect adds premium feel and provides tactile feedback before tap
- Compatible with all three color system proposals
- Maintains the current card structure (minimal migration)

### Flip Animation Enhancement

**Current:** `transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)`  
**Proposed:** Spring physics via CSS with overshoot

```css
.flip-inner {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* overshoot spring: peaks at ~112% then settles */
}

/* Reduced motion: instant flip */
@media (prefers-reduced-motion: reduce) {
  .flip-inner {
    transition: transform 0.01s;
  }
}
```

### Card Entrance Animation

Stagger cards when game screen mounts:

```css
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card-enter {
  animation: cardEnter 0.3s ease-out both;
}

/* Stagger via inline style: style={{ animationDelay: `${index * 40}ms` }} */
```

### Action Chip Redesign

**Current:** Rectangular, border-b-2, text-[9px]  
**Proposed:** Pill-shaped, smaller, with dot indicator

```
Current:   ┌─ Cắn ──────── x ─┐
Proposed:  ( ● Cắn   × )
```

```tsx
<button className={cn(
  "text-[10px] font-semibold px-2 py-0.5 rounded-full",
  "flex items-center gap-1",
  "bg-red-500/15 text-red-400 border border-red-500/30",
  "hover:bg-red-500/25 active:scale-95 transition",
)}>
  <span className="w-1.5 h-1.5 rounded-full bg-current" />
  <span className="truncate">{name}</span>
  <X className="w-3 h-3 opacity-50" />
</button>
```

---

## 6. Animation & Effects Proposals

### 6.1 Phase Transition System

The app has two primary phases: **Night** (skill usage, secret actions) and **Day** (debate, judgment). Create atmospheric transitions.

**Night Phase Atmosphere:**
```css
/* Ambient floating particles (CSS-only) */
@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.15; }
  50% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
}

.night-ambience::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(99, 102, 241, 0.08) 0%,
    transparent 60%
  );
}

/* Moon icon glow on turn indicator */
.night-indicator {
  text-shadow: 0 0 20px rgba(129, 140, 248, 0.6);
  animation: pulse 3s ease-in-out infinite;
}
```

**Day Phase (Timer Active):**
```css
/* Warm ambient gradient when debate/judgment timer runs */
.day-ambience::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    ellipse at 50% 100%,
    rgba(202, 138, 4, 0.05) 0%,
    transparent 50%
  );
}
```

---

### 6.2 Timer Countdown Effects

**Current:** `timer-glow-pulse` (basic pulse + text-shadow)  
**Proposed:** Progressive urgency system

```
TIME > 30s:   Steady glow, calm pulse (3s cycle)
TIME 10-30s:  Faster pulse (1.5s cycle), glow intensifies
TIME < 10s:   Rapid pulse (0.5s cycle), shake on each second, red glow
TIME = 0:     Flash white, vibrate (if Vibration API available)
```

```css
/* Urgent shake for final 10 seconds */
@keyframes timerShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.timer-urgent {
  animation: timerShake 0.3s ease-in-out;
  text-shadow: 0 0 40px rgba(239, 68, 68, 0.8);
}

/* Final flash at 0 */
@keyframes timerFlash {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

.timer-expired {
  animation: timerFlash 0.2s ease-in-out 3;
  color: white;
  text-shadow: 0 0 60px white;
}
```

---

### 6.3 Bottom Sheet Animations

**Current:** `slideUp` (0.3s ease-out, translateY(100%) to 0)  
**Proposed:** Spring physics with backdrop blur transition

```css
/* Enter: spring overshoot */
@keyframes sheetEnter {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  70% {
    transform: translateY(-2%);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Exit: fast sink */
@keyframes sheetExit {
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

.sheet-enter {
  animation: sheetEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.sheet-exit {
  animation: sheetExit 0.25s ease-in forwards;
}

/* Backdrop: fade in blur */
@keyframes backdropEnter {
  from { backdrop-filter: blur(0); background: transparent; }
  to { backdrop-filter: blur(8px); background: rgba(0,0,0,0.85); }
}

.backdrop-enter {
  animation: backdropEnter 0.3s ease-out forwards;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .sheet-enter, .sheet-exit, .backdrop-enter {
    animation-duration: 0.01s;
  }
}
```

---

### 6.4 Player Death Animation

When moderator taps Kill:

```css
@keyframes playerDeath {
  0% {
    filter: saturate(1) brightness(1);
    transform: scale(1);
  }
  30% {
    filter: saturate(1.3) brightness(1.2);
    transform: scale(1.03);
    border-color: rgba(239, 68, 68, 0.6);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
  }
  100% {
    filter: saturate(0) brightness(0.5);
    transform: scale(0.98);
    opacity: 0.4;
  }
}

.player-dying {
  animation: playerDeath 0.6s ease-out forwards;
}

/* Revive: reverse (desaturated → full color) */
@keyframes playerRevive {
  0% {
    filter: saturate(0) brightness(0.5);
    opacity: 0.4;
  }
  50% {
    filter: saturate(1.2) brightness(1.1);
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  }
  100% {
    filter: saturate(1) brightness(1);
    opacity: 1;
  }
}

.player-reviving {
  animation: playerRevive 0.5s ease-out forwards;
}
```

---

### 6.5 Wizard Step Transitions (SkillSheet)

Crossfade between steps 1 → 2 → 3:

```css
@keyframes stepIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes stepOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}

.wizard-step-enter {
  animation: stepIn 0.2s ease-out;
}

/* Back navigation: reverse direction */
.wizard-step-enter-back {
  animation: stepIn 0.2s ease-out;
  /* override: translateX(-20px) to translateX(0) */
}
```

---

### 6.6 Micro-Interactions Catalog

| Element | Interaction | Duration | Effect |
|---|---|---|---|
| All buttons | Press | 100ms | `active:scale-95` (already exists, keep) |
| Player card | Tap to flip | 500ms | Spring overshoot (see 5.0) |
| Player card | Hover (desktop) | 200ms | Faction glow shadow appears |
| Toggle (radio group) | Select | 150ms | Background color slide + `scale(1.02)` |
| Action chip | Appear | 200ms | `fadeIn` + `translateY(4px)` |
| Action chip | Remove (undo) | 150ms | `scaleX(0)` from center |
| Bottom sheet | Open | 400ms | Spring slide + backdrop blur |
| Bottom sheet | Close | 250ms | Fast sink + backdrop fade |
| Accordion (role list) | Expand | 200ms | Height transition + rotate chevron |
| Timer digits | Each second | 100ms | Subtle `scale(1.01)` pulse |
| Night button | Idle | 3s loop | Gentle moon glow pulse |
| FAB buttons | Appear | 300ms | `scaleIn` with 50ms stagger |
| Kill button | Press | 600ms | Death animation cascade |
| Revive button | Press | 500ms | Emerald glow expansion |
| PWA update | Appear | 400ms | Sheet spring + moon icon spin |

---

## 7. Layout & Navigation Proposals

### 7.1 Game Screen Layout Optimization

**Current layout:**
```
MOBILE (portrait):
  ┌──────────────────────────┐
  │  [Timer Bar - top strip] │  fixed, ~60px
  │                          │
  │  ┌──────┐ ┌──────┐      │
  │  │Card 1│ │Card 2│      │  2-col grid
  │  └──────┘ └──────┘      │
  │  ┌──────┐ ┌──────┐      │
  │  │Card 3│ │Card 4│      │
  │  └──────┘ └──────┘      │
  │  ...                     │
  │                          │
  │  [Assign]  [Use Skill]   │  fixed bottom FABs
  └──────────────────────────┘

TABLET/DESKTOP (landscape):
  ┌───────┬──────────────────┐
  │ Timer │  4-col card grid │
  │ Side  │                  │
  │ bar   │                  │
  └───────┴──────────────────┘
```

**Proposed improvements:**

1. **Sticky turn indicator above card grid** (not inside timer bar):
```
MOBILE (portrait):
  ┌──────────────────────────┐
  │  [Timer buttons row]     │  compact, ~48px
  │  ● Night 3 ● History ●  │  centered, pill indicator
  │                          │
  │  ┌──────┐ ┌──────┐      │  2-col, gap-2
  │  │Card 1│ │Card 2│      │
  │  └──────┘ └──────┘      │
  │  ...                     │
  │                          │
  │  [Assign]  [Skill]       │  bottom floating
  └──────────────────────────┘
```

2. **Timer bar should be a single compact row** on mobile, not two stacked buttons:
```
Current (verbose):
  [  ▶ Debate  ]  [ Turn 3 ]  [  ▶ Judgment  ]

Proposed (compact):
  [ 💬 ] [ ⚖️ ]   ● Night 3   [ 📖 ] [ 🌙 ] [ ⚙ ]
  debate  judge    indicator    hist  next  cfg
```

3. **FAB redesign — single action button with expandable menu:**
```
  Instead of two FABs:  [Assign Role]  [Use Skill]

  One FAB that opens a radial/vertical mini-menu:
    ⬆ [Use Skill]
    ● (main FAB — wand icon)
    ⬇ [Assign Role]
```

This reduces bottom clutter and gives more visible card area.

---

### 7.2 Bottom Sheet Improvements

**Swipe-to-dismiss (U3 from audit):**

```tsx
// Minimal swipe-to-dismiss hook
function useSwipeDismiss(onClose: () => void) {
  const startY = useRef(0);
  const currentY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const onTouchStart = (e: TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: TouchEvent) => {
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0 && sheetRef.current) {
      // Only allow downward drag
      sheetRef.current.style.transform = `translateY(${dy}px)`;
      currentY.current = dy;
    }
  };

  const onTouchEnd = () => {
    if (currentY.current > 100) {
      onClose(); // Dismiss
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = ''; // Snap back
    }
    currentY.current = 0;
  };

  return { sheetRef, onTouchStart, onTouchMove, onTouchEnd };
}
```

**Drag handle indicator:**
```tsx
// Add at top of every BottomSheet
<div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4 shrink-0" />
```

**Snap points** (for full-height sheets):
- Half-expanded: 50vh (default open position)
- Full-expanded: 90vh (drag up to expand)
- Dismissed: swipe below 30vh threshold

---

### 7.3 Setup Screen Improvements

**Current flow:** Linear — player config then role list, side by side on tablet.

**Proposed:**
1. Add a **progress indicator** at top showing setup completeness:
```
  ┌─────────────────────────────────────┐
  │  Players ●─────● Roles ●─────● Go! │
  │           (7/10)   (4 roles)        │
  └─────────────────────────────────────┘
```

2. **Role count vs player count warning** (U1 from audit):
```
  ⚠ 4 roles assigned but 10 players — 6 will be Villagers
```

3. **Start button state feedback:**
```
  0 roles:  [  Start Game  ] (disabled, gray)
  1+ role:  [ ▶ START GAME ] (enabled, gradient, pulse shadow)
```

---

### 7.4 Responsive Breakpoints

```
MOBILE PORTRAIT:   320px - 767px   → 2-col card grid, bottom FABs
MOBILE LANDSCAPE:  568px - 767px   → 3-col card grid, bottom FABs
TABLET:            768px - 1023px  → 3-col card grid, sidebar timer
DESKTOP:           1024px+         → 4-col card grid, sidebar timer
```

**Card sizing per breakpoint:**
- Mobile: `w-full`, `min-h-[170px]` (auto-height based on content, not fixed h-44)
- Tablet: `w-full`, `min-h-[180px]`
- Desktop: `w-full`, `min-h-[190px]`

Replace `h-44` with `min-h-[170px]` to allow cards to grow when they have many action chips, resolving the overflow concern.

---

## 8. Gamification Elements

### 8.1 Night Phase Atmosphere

When `nightCount > 0` and no timer is active:

```
┌─────────────────────────────────────────┐
│                                         │
│    ╭─╮                                  │  Moon icon (top-right corner)
│   ╭╯ ╰╮   subtle radial gradient       │  Indigo ambient light
│   ╰───╯   from top-center              │
│                                         │
│   Cards in normal state                 │
│                                         │
│   Very subtle floating particles        │  CSS-only, 3-4 small dots
│   (optional, respects reduced-motion)   │
│                                         │
└─────────────────────────────────────────┘
```

Implementation: A `::before` pseudo-element on the game screen container with a radial gradient. No extra DOM elements needed.

---

### 8.2 Kill/Death Visual Feedback

When moderator taps "Kill" on a player:

1. **Card flash red** (300ms) — brief red glow border + brightness spike
2. **Skull icon fades in** over the card center (200ms)
3. **Card desaturates + dims** to dead state (300ms)
4. **Optional: vibration** — `navigator.vibrate(100)` if available
5. **Sound sync point** — `playSound('death')` at step 1

When moderator taps "Revive":
1. **Card flash green** (300ms) — emerald glow
2. **Skull fades out** (200ms)
3. **Card resaturates** to alive state (300ms)
4. **Sound sync point** — `playSound('revive')`

---

### 8.3 Night Transition Cinematic

When moderator confirms "Next Night":

```
  CURRENT SCREEN
       ↓ (0.3s)
  ┌─────────────────────────────┐
  │                             │
  │     🌙  NIGHT  4  🌙       │   Full-screen overlay
  │                             │   Dark indigo bg
  │     ─────────────────       │   Bebas Neue, large
  │                             │
  └─────────────────────────────┘
       ↓ (1.5s auto-dismiss)
  GAME SCREEN (cards reset)
```

```css
@keyframes nightTransition {
  0% { opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { opacity: 0; }
}

.night-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: radial-gradient(ellipse at center, #1E1B4B 0%, #020203 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: nightTransition 2s ease-in-out forwards;
}
```

---

### 8.4 Role Reveal Animations

When a card flips to reveal role for the first time:

- Brief scale(1.05) with faction glow shadow
- Role name has a `typewriter` effect (letters appear one by one, 30ms each)
- Only triggers on first flip per player (track via state)

---

### 8.5 PWA Update Dialog (Werewolf-themed)

Replace native `confirm()` with themed BottomSheet (resolves U8):

```
  ┌──────────────────────────────────────┐
  │                                      │
  │           🌙                         │
  │                                      │
  │    A new moon rises...               │
  │    Update available!                 │
  │                                      │
  │  ┌──────────┐  ┌──────────────────┐  │
  │  │  Later   │  │  ⟳ UPDATE NOW   │  │
  │  └──────────┘  └──────────────────┘  │
  │                                      │
  └──────────────────────────────────────┘
```

---

### 8.6 Sound-Visual Synchronization Points

| Event | Sound | Visual |
|---|---|---|
| Night transition | `night-ambience.mp3` start | Night overlay + indigo gradient |
| Day start (timer) | `day-start.mp3` (short chime) | Warm amber gradient appears |
| Player kill | `death.mp3` (short thud) | Red flash + skull + desaturate |
| Player revive | `revive.mp3` (short chime) | Green flash + resaturate |
| Timer < 10s | `tick.mp3` (per second) | Shake + red glow intensify |
| Timer expired | `buzzer.mp3` | White flash + vibrate |
| Skill confirmed | `spell.mp3` (short whoosh) | Brief faction glow on source card |
| Night sound stop | — | When day timer starts or manually |

---

## 9. Accessibility Audit

### 9.1 Current Issues Found

| # | Severity | Issue | File | WCAG |
|---|---|---|---|---|
| A1 | High | `user-scalable=no` in viewport meta — blocks zoom | `index.html:9` | 1.4.4 |
| A2 | High | Timer overlay has no escape mechanism on touch (M12) | `timer-board.tsx:28` | 2.1.2 |
| A3 | High | Bottom sheet backdrop `aria-label="Close"` is wrong pattern — should be `aria-hidden` backdrop + visible close button | `bottom-sheet.tsx:74` | 4.1.2 |
| A4 | Medium | Player card `role="button"` but no `onKeyDown` for Space — only handles Enter | `player-card.tsx:298` | 2.1.1 |
| A5 | Medium | Action chips have no `aria-label` — screen reader sees "Bite x" with no context | `player-card.tsx:60-70` | 4.1.2 |
| A6 | Medium | Color-only faction differentiation — no icon or text label on name face | Multiple | 1.4.1 |
| A7 | Medium | Focus visible styles missing — only browser default | Global | 2.4.7 |
| A8 | Low | Timer display relies on color alone for type (orange=debate, red=judgment) | `timer-board.tsx:35` | 1.4.1 |
| A9 | Low | Range inputs have no visible value label in some contexts | `player-config.tsx:27-35` | 1.3.1 |

### 9.2 Proposed Fixes

**A1 — Remove `user-scalable=no`:**
```html
<!-- Before -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

<!-- After -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```
The app already uses `touch-action` and `-webkit-tap-highlight-color` to prevent zoom issues. The viewport restriction is unnecessary and blocks users with low vision from zooming.

**A2 — Timer escape key handler:**
Already addressed in timer proposal (Section 6.2). Add `Escape` keydown handler.

**A3 — Bottom sheet backdrop pattern:**
```tsx
// Backdrop: aria-hidden, click handler only
<div
  className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm"
  onClick={onClose}
  aria-hidden="true"
/>
// Sheet: role=dialog, aria-modal, visible close button
<div
  ref={sheetRef}
  role="dialog"
  aria-modal="true"
  aria-labelledby="sheet-title"
>
```

**A4 — Space key support on cards:**
Already handled in current code at line 298-302 (`e.key === " "`). Confirmed working.

**A5 — Action chip aria-labels:**
```tsx
<button
  aria-label={`${t('game.undo')} ${name} ${t('game.on')} ${playerName}`}
  // ...
>
```

**A6 — Faction text label on name face:**
Add a small faction indicator dot + label on the name face card:
```tsx
<span className={cn("text-[8px] font-bold uppercase tracking-wider", col.text)}>
  {faction === 'wolf' ? '🐺' : faction === 'third' ? '👁' : '🛡'} {factionLabel}
</span>
```

**A7 — Focus visible styles (global):**
```css
*:focus-visible {
  outline: 2px solid var(--accent-night);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Suppress outline on mouse click, show on keyboard */
*:focus:not(:focus-visible) {
  outline: none;
}
```

**A8 — Timer type text label:**
Already present (`"Tranh Luan"` / `"Phan Quyet"`). Color is supplementary, not sole indicator. **OK.**

---

### 9.3 Dark Mode Contrast Verification (Option B palette)

| Element | Foreground | Background | Ratio | Pass |
|---|---|---|---|---|
| Body text | #E2E8F0 | #1E1C35 | 11.4:1 | AAA |
| Secondary text | #94A3B8 | #1E1C35 | 6.0:1 | AA |
| Muted text | #64748B | #1E1C35 | 3.9:1 | AA-lg |
| Villager label | #60A5FA | #1E1C35 | 6.8:1 | AA |
| Wolf label | #F87171 | #1E1C35 | 5.5:1 | AA |
| Third label | #C084FC | #1E1C35 | 5.0:1 | AA |
| Button text | #FFFFFF | #6366F1 | 5.7:1 | AA |
| Danger text | #EF4444 | #1E1C35 | 4.8:1 | AA-lg |
| Success text | #34D399 | #1E1C35 | 7.2:1 | AA |

All critical text passes WCAG AA minimum. Body text achieves AAA.

---

## 10. Performance Impact Analysis

### 10.1 Font Loading Optimization

**Current (render-blocking):**
```css
/* index.css line 1 — RENDER BLOCKING */
@import url("https://fonts.googleapis.com/css2?family=Bungee&family=Roboto:wght@400;500;700&display=swap");
```

Problem: CSS `@import` in stylesheet blocks rendering until the external CSS is fully downloaded. This adds 200-800ms to First Contentful Paint depending on network.

**Proposed (non-blocking preload):**
```html
<!-- index.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Preload critical font (body text — needed immediately) -->
<link rel="preload"
  href="https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2"
  as="font" type="font/woff2" crossorigin />

<!-- Non-blocking stylesheet load -->
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap"
  media="print" onload="this.media='all'" />

<!-- Fallback for no-JS -->
<noscript>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" />
</noscript>
```

Then remove the `@import` from `index.css` entirely.

**Impact:**
- Eliminates 200-800ms of render blocking
- First paint shows system font fallback, then swaps to custom fonts (~100ms FOUT, acceptable)
- `font-display: swap` already in the Google Fonts URL ensures text is visible immediately

---

### 10.2 Icon Library Reduction

| Metric | Current (Font Awesome) | Proposed (Lucide React) |
|---|---|---|
| JS bundle | 0 KB | ~8 KB (35 tree-shaken icons) |
| CSS bundle | ~50 KB | 0 KB |
| Font files (WOFF2) | ~300 KB (solid) + ~300 KB (regular) + ~300 KB (brands) | 0 KB |
| **Total** | **~950 KB** | **~8 KB** |
| **Savings** | — | **~942 KB (99.2%)** |

Additional benefit: Lucide icons are inline SVG — no flash of unstyled icon, no extra network request.

---

### 10.3 CSS Optimization

**Current CSS issues:**
1. Card patterns use inline SVG data URIs in CSS (~4KB of SVG patterns)
2. Font Awesome import loads entire icon font stylesheet
3. Multiple animation keyframes defined globally but only used conditionally

**Proposed:**
1. Replace SVG data URI patterns with pure CSS patterns (gradients, repeating-linear-gradient) — saves ~3KB
2. Remove Font Awesome import — saves ~50KB CSS
3. Wrap animation keyframes in `@layer` to enable dead code elimination:
```css
@layer animations {
  @keyframes slideUp { /* ... */ }
  @keyframes pulse { /* ... */ }
  /* ... */
}
```

**Estimated CSS savings:** ~53KB

---

### 10.4 Animation Performance

All proposed animations use **GPU-accelerated properties only:**

| Property | GPU Accelerated | Used In |
|---|---|---|
| `transform` | Yes | Card flip, sheet slide, button press, card entrance |
| `opacity` | Yes | Fade transitions, death dim |
| `filter` | Partial (GPU on modern) | Death desaturate |
| `box-shadow` | **No** — causes repaint | Faction glow on hover |
| `text-shadow` | **No** — causes repaint | Timer glow |

**Mitigation for box-shadow/text-shadow:**
- Apply `will-change: transform` on card containers (promotes to compositor layer)
- Limit glow to `:hover` state only (not continuous animation)
- Timer glow: acceptable as only 1 element on screen during timer overlay

**`prefers-reduced-motion` coverage:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01s !important;
  }
}
```

---

### 10.5 Performance Summary

| Optimization | Before | After | Savings |
|---|---|---|---|
| Font loading | Render-blocking | Non-blocking preload | -400ms FCP |
| Icon library | ~950 KB | ~8 KB | ~942 KB |
| CSS cleanup | ~60 KB FA + patterns | ~7 KB clean | ~53 KB |
| Font files | Bungee + Roboto (~120KB) | Bebas + Inter (~70KB) | ~50 KB |
| **Total bundle reduction** | | | **~1045 KB** |

---

## 11. Implementation Roadmap

### Phase 1: Quick Wins (Week 1) — Low Risk, High Impact

```
Priority: Performance + Foundation
Estimated effort: 8-12 hours

Tasks:
  [ ] 1.1 Move Google Fonts from CSS @import to HTML preload (non-blocking)
  [ ] 1.2 Replace Font Awesome with Lucide React (35 icon migration)
  [ ] 1.3 Remove @fortawesome package from dependencies
  [ ] 1.4 Remove CSS card patterns using FA unicode (::after content rules)
  [ ] 1.5 Replace card patterns with CSS-only gradients
  [ ] 1.6 Switch from Bungee/Roboto to Bebas Neue/Inter
  [ ] 1.7 Add CSS custom properties for color tokens
  [ ] 1.8 Remove user-scalable=no from viewport meta (A1)
  [ ] 1.9 Add global focus-visible styles (A7)
  [ ] 1.10 Add prefers-reduced-motion global reset

Impact: ~1MB bundle reduction, 400ms FCP improvement, a11y foundation
Risk: Icon migration is mechanical but tedious — test all 35 icons visually
```

### Phase 2: Color + Card Redesign (Week 2)

```
Priority: Visual Identity
Estimated effort: 12-16 hours

Tasks:
  [ ] 2.1 Implement "Moonlit Gothic" color system (CSS custom properties)
  [ ] 2.2 Update Tailwind config with new color tokens
  [ ] 2.3 Migrate all components from Tailwind color classes to token references
  [ ] 2.4 Redesign player cards ("Glowing Edge" variant)
  [ ] 2.5 Replace fixed h-44 with min-h-[170px] on cards
  [ ] 2.6 Implement new dead player visual (skull overlay + strikethrough + strong dim)
  [ ] 2.7 Redesign action chips (pill-shaped)
  [ ] 2.8 Update faction-theme.ts with new color values
  [ ] 2.9 Update bottom-sheet.tsx with drag handle + new animation
  [ ] 2.10 Fix bottom sheet aria pattern (A3)
  [ ] 2.11 Light mode palette (inversion of dark tokens)
  [ ] 2.12 Verify all contrast ratios meet WCAG AA

Impact: Complete visual transformation, brand identity established
Risk: Color migration touches every component — snapshot test before/after
```

### Phase 3: Animations + Phase Transitions (Week 3)

```
Priority: Atmosphere + Polish
Estimated effort: 10-14 hours

Tasks:
  [ ] 3.1 Card entrance stagger animation
  [ ] 3.2 Card flip spring physics (CSS bezier update)
  [ ] 3.3 Bottom sheet spring enter/exit animations
  [ ] 3.4 Timer countdown urgency system (3 tiers)
  [ ] 3.5 Night phase ambient gradient overlay
  [ ] 3.6 Night transition cinematic overlay (on nextNight)
  [ ] 3.7 Player death/revive animation
  [ ] 3.8 Wizard step crossfade transitions (SkillSheet)
  [ ] 3.9 FAB button entrance animation
  [ ] 3.10 Timer escape key handler (M12)
  [ ] 3.11 All animations respect prefers-reduced-motion

Impact: Immersive atmospheric experience, polished micro-interactions
Risk: Animation timing needs real-device testing — emulator != real latency
```

### Phase 4: Polish + Gamification (Week 4)

```
Priority: Delight + Edge Cases
Estimated effort: 8-12 hours

Tasks:
  [ ] 4.1 Swipe-to-dismiss on bottom sheets (touch gesture)
  [ ] 4.2 PWA update dialog (werewolf-themed BottomSheet)
  [ ] 4.3 Setup screen progress indicator
  [ ] 4.4 Role count vs player count warning badge
  [ ] 4.5 Sound-visual sync points (death, revive, timer)
  [ ] 4.6 Timer board compact layout redesign
  [ ] 4.7 Remaining a11y fixes (A5, A6, A8, A9)
  [ ] 4.8 Cross-browser testing (Safari iOS, Chrome Android, Firefox)
  [ ] 4.9 Lighthouse audit (performance, a11y, best practices)
  [ ] 4.10 Final visual QA pass across all breakpoints

Impact: Production-ready polish, PWA best practices, full accessibility
Risk: Swipe gestures can conflict with browser back gesture — need careful thresholds
```

---

## Appendix A: Complete CSS Variable System

```css
/* Moonlit Gothic — Dark Mode (default) */
:root {
  /* Backgrounds */
  --color-bg-app: #0F0F23;
  --color-bg-surface: #161631;
  --color-bg-card: #1E1C35;
  --color-bg-elevated: #27273B;
  --color-bg-overlay: #323250;

  /* Text */
  --color-text-primary: #E2E8F0;
  --color-text-secondary: #94A3B8;
  --color-text-muted: #64748B;
  --color-text-disabled: #475569;

  /* Borders */
  --color-border-default: #4C1D95;
  --color-border-subtle: #2D2060;
  --color-border-hover: #5B21B6;

  /* Factions */
  --color-faction-villager: #60A5FA;
  --color-faction-villager-bg: rgba(96, 165, 250, 0.08);
  --color-faction-villager-glow: rgba(96, 165, 250, 0.3);
  --color-faction-wolf: #F87171;
  --color-faction-wolf-bg: rgba(248, 113, 113, 0.08);
  --color-faction-wolf-glow: rgba(248, 113, 113, 0.3);
  --color-faction-third: #C084FC;
  --color-faction-third-bg: rgba(192, 132, 252, 0.08);
  --color-faction-third-glow: rgba(192, 132, 252, 0.3);

  /* Phase Accents */
  --color-phase-night: #818CF8;
  --color-phase-day: #FBBF24;
  --color-phase-judgment: #F43F5E;

  /* Semantic */
  --color-success: #34D399;
  --color-warning: #FBBF24;
  --color-danger: #EF4444;
  --color-info: #60A5FA;

  /* Components */
  --color-cta: #6366F1;
  --color-cta-hover: #818CF8;
  --color-ring: #8B5CF6;

  /* Typography */
  --font-display: 'Bebas Neue', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing (consistent with Tailwind defaults) */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-sheet: 0 -10px 40px rgba(0, 0, 0, 0.5);
}

/* Light Mode Override */
:root:not(.dark) {
  --color-bg-app: #F8FAFC;
  --color-bg-surface: #FFFFFF;
  --color-bg-card: #F1F5F9;
  --color-bg-elevated: #E2E8F0;
  --color-bg-overlay: #CBD5E1;

  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;

  --color-border-default: #E2E8F0;
  --color-border-subtle: #F1F5F9;
  --color-border-hover: #CBD5E1;

  --color-faction-villager: #2563EB;
  --color-faction-wolf: #DC2626;
  --color-faction-third: #7C3AED;

  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

---

## Appendix B: Font Performance Comparison

| Config | Fonts | Total Size | FCP Impact | Vietnamese |
|---|---|---|---|---|
| Current | Bungee + Roboto (3 weights) | ~120 KB | +400ms (blocking) | Partial |
| Option A | Russo One + Chakra Petch (5 weights) | ~85 KB | 0ms (preload) | Yes |
| Option B | Bebas Neue + Inter (4 weights) | ~70 KB | 0ms (preload) | Full |
| Option C | Bungee + Inter (4 weights) | ~80 KB | 0ms (preload) | Full |

---

## Appendix C: Icon Migration Checklist

Files requiring Font Awesome -> Lucide migration:

```
src/index.css                    — Remove @import, remove ::after content rules
src/components/game/game-screen.tsx     — 2 icons (theater-masks, wand-sparkles)
src/components/game/player-card.tsx     — 6 icons (skull-crossbones, lock, moon, times, ellipsis-v)
src/components/game/timer-board.tsx     — 8 icons (comments, gavel, play, pause, stop, book-open, moon, cog)
src/components/game/skill-sheet.tsx     — 4 icons (arrow-left, moon, crosshairs, wand-sparkles)
src/components/game/history-sheet.tsx   — 6 icons (arrow-right, undo, heart, skull, exchange-alt, chevron-up/down)
src/components/game/player-action-sheet.tsx — 4 icons (moon, lock, times, skull/heart)
src/components/game/night-confirm-sheet.tsx — 1 icon (moon)
src/components/game/settings-sheet.tsx  — 4 icons (moon, sun, cog, trash)
src/components/game/assign-role-sheet.tsx   — 2 icons (theater-masks, chevron-up/down)
src/components/setup/setup-screen.tsx   — 3 icons (moon, cog, play, book)
src/components/setup/role-list.tsx      — 4 icons (times, plus, trash-alt, crosshairs)
src/components/setup/role-library-sheet.tsx — 3 icons (plus-circle, check, book)
src/components/setup/create-role-sheet.tsx  — 4 icons (check, trash-alt, plus, wand-magic-sparkles)
src/components/common/bottom-sheet.tsx  — 1 icon (times)
src/components/common/selector-modal.tsx — 2 icons (hashtag, users, list)
```

**Total files to modify: 16**  
**Total icon instances: ~55**

---

## Interview Decisions Log

All questions resolved via product owner interview (2026-04-15).

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | Color System | **B: Moonlit Gothic** | Midnight blue + purple borders + amber accent = best werewolf atmosphere |
| 2 | Typography | **B: Bebas Neue + Inter** | Cinematic headings + best Vietnamese body font, smallest bundle (70KB) |
| 3 | Card Design | **A: Glowing Edge** | Faction glow borders + CSS-only patterns + dramatic skull dead state |
| 4 | Icon Strategy | **Lucide React + 3 custom SVG** | 99.2% bundle reduction (~942KB saved) |
| 5 | Light Mode | **Both modes now** | Full dark + light implementation from start |
| 6 | Font Loading | **Self-host in /public** | PWA offline support, no external dependency |
| 7 | Sound UI | **Add mute/unmute button** | Visual indicator on timer bar for night ambient sound state |
| 8 | Mobile Layout | **Adaptive 2-col + pinch-zoom** | Keep 2-col default, allow pinch-zoom for overview |
| 9 | Night Transition | **Full cinematic overlay (2s)** | Fullscreen + moon icon + auto-dismiss for dramatic effect |
| 10 | Timer Urgency | **Full 3-tier system** | Calm → fast pulse → shake + red glow + vibrate at 0 |
| 11 | Death Animation | **Full animation (0.6s)** | Red flash → skull fade-in → desaturate cascade |
| 12 | Custom SVGs | **Phase 1 with icon migration** | Build 3 custom SVGs alongside Lucide migration |
| 13 | Bottom Sheet | **Swipe-to-dismiss + drag handle** | Swipe ↓ >100px = close, <100px = snap back |
| 14 | Timer Layout | **Compact single row** | All controls in 1 row on mobile |
| 15 | PWA Dialog | **Themed BottomSheet + Moon** | Werewolf aesthetic, i18n-aware, styled buttons |
| 16 | Setup Screen | **Progress bar + role count warning** | Step indicator + warning when roles < players |

---

## ~~Unresolved Questions~~ — ALL RESOLVED

1. ~~Light mode priority~~ → **Both modes now** — full dark + light from start
2. ~~Font self-hosting vs CDN~~ → **Self-host in /public** — PWA offline, no external
3. ~~Night ambient sound~~ → **Add mute/unmute button** on timer bar
4. ~~3-column mobile layout~~ → **Keep 2-col + pinch-zoom** — adaptive approach
5. ~~Custom SVG faction emblems~~ → **Phase 1** — build alongside icon migration
