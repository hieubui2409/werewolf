# System Architecture — Werewolf Moderator

**Last Updated:** 2026-04-17  
**Version:** 1.1.0  
**Scope:** App structure, data flow, component hierarchy, state management

---

## Architecture Overview

Werewolf Moderator is a **single-page React application** with tier-based architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│            (React Components, UI State, Animations)          │
├─────────────────────────────────────────────────────────────┤
│                    State Management Layer                    │
│  (Zustand Store, Memoized Selectors, Persist Middleware)    │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                      │
│    (Game Actions, Undo/Redo, Role Execution, Skill Rules)   │
├─────────────────────────────────────────────────────────────┤
│                      Utility Layer                           │
│   (Sounds, i18n, ID Generation, Faction Theming, Helpers)   │
├─────────────────────────────────────────────────────────────┤
│                     Storage Layer                            │
│          (localStorage via Zustand Persist Middleware)       │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

### Root Structure

```
App.tsx
├── Setup Flow (Step: "setup")
│   └── SetupScreen
│       ├── PlayerConfig
│       ├── RoleList
│       ├── CreateRoleSheet
│       └── RoleLibrarySheet
│
└── Game Flow (Step: "game")
    └── GameScreen
        ├── TimerBoard (display timer + phase info)
        ├── PlayerCard[] (grid of players)
        ├── Modals (Zustand-driven visibility)
        │   ├── HistorySheet
        │   ├── SettingsSheet
        │   ├── NightConfirmSheet
        │   ├── AssignRoleSheet
        │   ├── SkillSheet
        │   └── PlayerActionSheet
        ├── NightTransitionOverlay (cinematic)
        └── BottomSheet (container for modals)
```

### Layout Layers (Desktop)

**Mobile (xs-sm):**

- 2-column grid (player cards + sidebar)
- Bottom sheets full-height

**Tablet+ (md-xl):**

- Left: Player grid (80% width)
- Right: Sidebar with controls (20% width)
- Bottom sheets max-width 640px, centered

---

## Data Flow Patterns

### State Management (Zustand)

**Store Structure:**

```typescript
type GameStore = {
  // Game state
  players: Player[];
  roles: GameRole[];
  currentPhase: "setup" | "night" | "day" | "finished";
  actionLog: GameAction[];
  undoStack: UndoEntry[];
  redoStack: UndoEntry[];

  // UI state (NOT persisted)
  expandedPlayerId: string | null;
  selectedRoleId: string | null;

  // Persist: all except UI state
};
```

**Lifecycle:**

1. **Init** → App loads → Zustand rehydrates from localStorage
2. **Setup** → Player/role config → `players[]`, `roles[]` updated
3. **Game Active** → Actions mutate state → added to `actionLog`
4. **Undo Triggered** → Entry moved `actionLog` → `undoStack`, state restored
5. **Game End** → Final state persisted → next load restores game

### Action Execution Flow

```
User Action (e.g., "kill player")
    ↓
GameScreen keyboard/button handler
    ↓
executeAction() in game-store-actions.ts
    ↓
Pure function: calculate side effects
    ↓
Zustand setState() updates store
    ↓
useGameStore subscribers (components) re-render
    ↓
UI reflects new state
```

### Undo/Redo Flow

```
User presses Ctrl+Z
    ↓
game-screen.tsx handleKeyDown detects key
    ↓
undoAction(actionId) called
    ↓
game-store-undo-history.ts popUndo()
    ↓
Reverse action side effects (restore players, decrement usages)
    ↓
Move entry: actionLog → undoStack
    ↓
Zustand setState() + redoStack.push()
    ↓
UI updates show previous state
```

---

## Key Architectural Patterns

### 1. Memoized Selectors

**Problem:** Every store update triggers all subscribers to re-render.  
**Solution:** Zustand selectors with identity checks.

```typescript
// Selector — only re-renders if `players` changes
useGameStore((state) => state.players);

// vs direct access — re-renders on ANY store change
useGameStore.getState().players;
```

**Files:**

- `src/store/game-store-selectors.ts` — memoized derivations
- Components use selectors to prevent unnecessary renders

### 2. Pure Functions for Business Logic

**Pattern:** Extract mutations into `game-store-actions.ts`, keep store state immutable.

```typescript
// Before: Mixed in store
// After: Pure function in actions
export function killPlayer(playerId: string) {
  useGameStore.setState((state) => ({
    players: state.players.map((p) =>
      p.id === playerId ? { ...p, status: "dead" } : p,
    ),
  }));
}
```

### 3. Zustand Subscribe Integration

**Sound Mute Sync Example:**

```typescript
// In sounds.ts
let globalMuted = false;

export function initMuteSync(
  subscribe: (cb: (muted: boolean) => void) => () => void,
) {
  subscribe((muted) => {
    globalMuted = muted; // Side effect: sync to audio module
  });
}

// In App.tsx or store init
useGameStore.subscribe(
  (state) => state.settings.soundMuted,
  (muted) => {
    /* handle mute change */
  },
);
```

### 4. JSDOM-Compatible Animation Listeners

**Problem:** React's `onAnimationEnd` doesn't fire in jsdom (tests).  
**Solution:** Use native `addEventListener` with cleanup.

```typescript
// bottom-sheet.tsx
useEffect(() => {
  const sheet = sheetRef.current;
  const handler = () => onCloseRef.current();
  sheet?.addEventListener("animationend", handler, { once: true });
  return () => sheet?.removeEventListener("animationend", handler);
}, [closing]);
```

---

## Component Communication

### Props Down, Events Up

**SetupScreen → PlayerConfig:**

```typescript
<PlayerConfig
  player={player}
  onUpdate={(updated) => updatePlayer(updated)}
/>
```

**GameScreen → HistorySheet:**

- HistorySheet reads from Zustand store directly
- Zustand state updates trigger re-render
- No prop drilling needed

### Keyboard Event Coordination

**Global listeners** in game-screen.tsx detect keypresses.  
**Typing context** check prevents conflicts:

```typescript
function isTypingContext(e: KeyboardEvent) {
  const active = document.activeElement;
  return active?.tagName === "INPUT" || active?.tagName === "TEXTAREA";
}
```

---

## State Persistence

### Storage Strategy

**localStorage key:** `game-store`  
**Partialize:** Excludes UI state (modals, selections)  
**Format:** JSON string of GameStore state

**On app load:**

1. Zustand rehydrates from localStorage
2. If corrupt/missing → fallback to initial state
3. Validation checks for date objects, missing fields

### Migration Concerns

- Old V17/V21 saves stored in `game-state` key (different format)
- V22+ uses new schema → migration needed if supporting old saves
- Current version fresh restart recommended

---

## i18n Architecture

**Setup:** `src/i18n/index.ts` configures react-i18next

**Locales:**

- `src/i18n/vi.json` — Vietnamese (default)
- `src/i18n/en.json` — English

**Usage in components:**

```typescript
const { t } = useTranslation();
return <button>{t("game.startGame")}</button>;
```

**Language persistence:** Zustand store `settings.language` key triggers rehydration

---

## Performance Optimizations

### Code Splitting

- Vite handles automatic chunk splitting
- Setup vs Game components lazy-loaded (React.lazy)

### Memoization

- **Selectors:** Prevent re-renders on unrelated state changes
- **useMemo/useCallback:** Used sparingly in hot-path components (timer, player card)
- **React.memo:** Applied to static components (RoleList, HistorySheet)

### Bundle Optimization

- Lucide-react icons: tree-shakeable (vs Font Awesome monolithic)
- Tailwind v4 with `@theme`: CSS-in-JS eliminates PostCSS step
- Self-hosted fonts in `public/fonts/` (vs CDN latency)

### Runtime Optimizations

- Debounced swipe handlers in BottomSheet
- Timer interval cleanup on unmount
- Sound preload + audio element reuse (audioCache)

---

## Error Handling Strategy

### Error Boundaries

```
App
└── ErrorBoundary (catches render errors)
    ├── SetupScreen
    └── GameScreen
        └── ErrorBoundary (catches modal errors)
            └── HistorySheet, SkillSheet, etc.
```

### Try/Catch Patterns

- **Audio playback:** Wrap in try/catch (Safari restrictions)
- **Vibrate API:** Check navigator.vibrate before calling (fallback for Safari)
- **Storage:** Rehydration guards against corrupt localStorage

### User Feedback

- Error boundary displays fallback UI with reload button
- Toast notifications for transient errors (future enhancement)

---

## Testing Architecture

### Test Structure

```
src/
├── __tests__/           # Integration tests
│   └── game-store.test.ts
├── components/
│   └── __tests__/       # Component tests
│       └── bottom-sheet.test.tsx
└── hooks/
    └── (no tests yet, use in integration)
```

### Test Patterns

- **Unit:** Store logic, pure functions
- **Integration:** Component + store interactions
- **E2E:** Full game flow (Playwright)

### JSDOM Considerations

- `addEventListener("animationend")` required (React synthetic events don't fire)
- `requestAnimationFrame` used for animation frame checks
- timers via jest.useFakeTimers() in tests

---

## Security Considerations

### Data Protection

- **No backend:** All data client-side (localStorage)
- **No auth:** Single-user app, no API keys exposed
- **No user input sanity check:** Custom role creation validated client-side

### PWA Security

- Service worker precaches assets (offline support)
- No dynamic content loading
- Manifest scope: `/` (full domain)

### Input Validation

- Role names: length checks, no special chars
- Player counts: min 2, max 99
- Custom abilities: max 5, usage limits enforced

---

## Deployment Architecture

### Build Pipeline

```
npm run build
    ↓
Vite bundles src/ → dist/
    ↓
Cloudflare Pages detects & auto-deploys
    ↓
Service worker generated by vite-plugin-pwa
    ↓
Live at werewolf.pages.dev
```

### Environment

- **Static hosting:** Cloudflare Pages (no serverless needed)
- **No env vars required:** Self-contained app
- **Build cache:** Cloudflare respects Cache-Control headers

---

## Extensibility Points

### Adding a New Feature

1. **Types:** Add to `src/types/game.ts`
2. **State:** Add field to GameStore in `src/store/game-store.ts`
3. **Actions:** Add mutation to `src/store/game-store-actions.ts`
4. **Selectors:** Add memoized getter to `src/store/game-store-selectors.ts`
5. **UI:** Create component in `src/components/{setup|game}/`
6. **i18n:** Add strings to `src/i18n/{vi,en}.json`
7. **Tests:** Add unit test in `__tests__/` directory

### Adding a New Role

1. File: `src/data/roles/{faction}-roles.ts`
2. Export: Array of GameRole templates
3. Import: Register in role library sheet
4. Test: Add role to default-roles test suite

### Adding a New Animation

1. **CSS:** Define keyframe in `src/index.css`
2. **Component:** Apply class + `data-` attribute
3. **Listener:** Attach `addEventListener("animationend")` if JSDOM-critical
4. **Accessibility:** Respect `prefers-reduced-motion` media query

---

## Known Limitations & Constraints

| Constraint         | Details                                 |
| ------------------ | --------------------------------------- |
| Single user        | No multiplayer, no auth system          |
| One game at a time | Store persists only last game state     |
| Custom roles       | Max 5 abilities per role, validated     |
| Sounds             | MP3 only (no Web Audio synthesis)       |
| Offline            | Works offline after first load          |
| Browser support    | Chrome 120+, Firefox 121+, Safari 17+   |
| Storage            | Limited by browser localStorage (~10MB) |

---

## Related Documentation

- **Codebase Summary:** See `./codebase-summary.md` for file structure & code standards
- **Code Standards:** See `./code-standards.md` for TypeScript & component patterns
- **Project Roadmap:** See `./project-roadmap.md` for phase progress & milestones
- **Main README:** See `../../README.md` for getting started
