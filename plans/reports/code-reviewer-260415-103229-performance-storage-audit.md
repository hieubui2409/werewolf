# Performance & Storage Audit Report

**Date:** 2026-04-15 | **Scope:** Full codebase (38 source files) | **Focus:** Performance + Storage (NEW issues only)

---

## Critical Issues

### 1. localStorage Persist Serializes `roleTemplates` — Unbounded Growth

**File:** `/src/store/game-store.ts` lines 326-339

The `partialize` function includes `roleTemplates` in persisted state. `roleTemplates` starts with 49 default roles from `DEFAULT_ROLES` (~14KB JSON) and grows with every custom role — these are never cleaned up. Combined with `gameHistory` accumulating across turns (each `TurnHistory` contains full `actionLogs[]`, `statusLogs[]`, `roleLogs[]`), a 20-turn game with 20 players can produce 30-50KB of persisted data, written synchronously to localStorage on **every single store mutation** (name keystroke, card flip, timer setting change).

**Impact:** High — localStorage writes are synchronous and block the main thread. On low-end mobile devices used as moderator tablets, this causes noticeable jank during rapid interactions (typing player names, flipping cards).

**Fix:** 
- Remove `roleTemplates` from `partialize` — it's derived from `DEFAULT_ROLES` + custom roles. Persist only custom templates.
- Add `debounce` or `throttle` to the persist middleware (Zustand supports `options.skipHydration` but a simple `merge` + debounced `setItem` wrapper is cleaner).
- Consider removing `gameHistory` from persist or capping it (e.g., last 5 turns).

---

### 2. `flipCard` Creates a New Object on Every Flip — Cascading Re-renders

**File:** `/src/store/game-store.ts` line 316-318

```ts
flipCard: (id) =>
  set((s) => ({
    flippedCards: { ...s.flippedCards, [id]: !s.flippedCards[id] },
  })),
```

Every card flip creates a **new `flippedCards` object reference**, which triggers re-renders for **every component** selecting `flippedCards` — that includes `GameScreen` which selects it at line 29. Since `GameScreen` passes `isFlipped={!!flippedCards[player.id]}` to each `PlayerCard`, a flip of player 1 recalculates all 20-30 cards.

The `PlayerCard` is `memo()`-wrapped which helps, but the parent still diffs the entire `sortedPlayers.map(...)` output. More critically, the `flippedCards` reference change means `GameScreen` re-runs every time — recomputing the JSX for all cards.

**Impact:** Medium — In "nameFirst"/"roleFirst" mode with 20+ players, each flip triggers a full grid re-render cycle. On low-end devices this produces visible lag.

**Fix:** Extract `flippedCards` access into individual selectors per player, or use a `Map`/`Set` and compare by value. Alternatively, move flip state into each `PlayerCard` as local state since it's purely UI.

---

### 3. `GameScreen` Creates Unstable Callback on Every Render for `PlayerActionSheet.onUseSkill`

**File:** `/src/components/game/game-screen.tsx` lines 139-143

```tsx
<PlayerActionSheet
  playerId={selectedPlayer}
  onClose={() => setSelectedPlayer(null)}
  onUseSkill={(roleId, ability) => {
    setSelectedPlayer(null);
    setSkillContext({ ability, roleId });
    setModal("skill");
  }}
/>
```

Both `onClose` and `onUseSkill` are **inline arrow functions** — new reference every render. Since `GameScreen` re-renders on any store change (it subscribes to 7 different store slices + 3 selector hooks), these callbacks are recreated constantly. `PlayerActionSheet` is not memo-wrapped, but even if it were, these unstable props would defeat it.

**Impact:** Low-Medium — `PlayerActionSheet` is lightweight and returns `null` when `playerId === null`, but the diffing cost still adds up when `GameScreen` re-renders frequently (every card flip, every action).

**Fix:** Wrap in `useCallback`.

---

### 4. `HistorySheet` Subscribes to 7 Store Slices — Re-renders on Every Game Mutation

**File:** `/src/components/game/history-sheet.tsx` lines 34-42

```ts
const gameHistory = useGameStore((s) => s.gameHistory);
const actionLog = useGameStore((s) => s.actionLog);
const statusChangeLog = useGameStore((s) => s.statusChangeLog);
const roleChangeLog = useGameStore((s) => s.roleChangeLog);
const players = useGameStore((s) => s.players);
const roles = useGameStore((s) => s.roles);
const nightCount = useGameStore((s) => s.nightCount);
const undoAction = useGameStore((s) => s.undoAction);
```

Every one of these 7 subscriptions triggers a re-render whenever its slice changes — and almost every game action changes at least one (toggle status -> players + statusChangeLog, execute action -> players + actionLog, etc.). Since `HistorySheet` is **always mounted** (it's in `GameScreen` JSX regardless of `isOpen`), it re-renders on every game mutation even when the sheet is closed.

`BottomSheet` returns `null` when `!isOpen`, but the `HistorySheet` function body **still executes fully** including all 7 `useGameStore` subscriptions, `buildCurrentRows()`, and the JSX construction before `BottomSheet` discards it.

**Impact:** High — This is the most impactful re-render issue. Every game action (kill, undo, use skill, role change) triggers a full re-render of `HistorySheet` even when invisible, including row building logic with `O(n)` sorting.

**Fix:** Gate all expensive logic behind `if (!isOpen) return <BottomSheet isOpen={false} onClose={onClose} .../>` at the top of the component, or lazy-mount the entire component conditionally from `GameScreen`.

---

### 5. `AssignRoleSheet` and `SkillSheet` Also Always Mounted — Same Pattern

**Files:** 
- `/src/components/game/assign-role-sheet.tsx` — subscribes to `players`, `togglePlayerRole`, `useSortedRoles()`
- `/src/components/game/skill-sheet.tsx` — subscribes to `players`, `executeAction`, `useSortedRoles()`
- `/src/components/game/night-confirm-sheet.tsx` — subscribes to `nightCount`, `nextNight`
- `/src/components/game/settings-sheet.tsx` — subscribes to `cardViewMode`, `timerSettings`, etc.

All 6 sheets are rendered unconditionally in `GameScreen` (lines 130-147). Each subscribes to multiple store slices. Combined, these 6 always-mounted invisible sheets account for ~30+ redundant store subscriptions running on every mutation.

**Impact:** Medium — Individually each is fast, but collectively the subscription + diff overhead is significant. On a store mutation like `executeAction`, the following all re-render: GameScreen, HistorySheet, SkillSheet, AssignRoleSheet, PlayerActionSheet.

**Fix:** Conditionally render sheets: `{modal === "history" && <HistorySheet ... />}`. This eliminates subscriptions when sheets are closed. Trade-off: no preserved state — acceptable since sheets are stateless or reset on open.

---

### 6. `GameScreen` Subscribes to `flipCard` Function — Unnecessary Reference Change

**File:** `/src/components/game/game-screen.tsx` line 30

```ts
const flipCard = useGameStore((s) => s.flipCard);
```

In Zustand 5, action selectors return **stable references** (the function identity doesn't change). However, selecting both `flippedCards` state AND `flipCard` action means `GameScreen` is subscribed to the entire `flippedCards` object changes. The real issue is that `GameScreen` should not need to own `flippedCards` state — each `PlayerCard` could select its own flip state independently.

**Impact:** Low — Zustand does action identity stabilization, so `flipCard` itself is stable. The perf cost comes from `flippedCards` object subscription as noted in Issue #2.

**Fix:** Covered by fix for Issue #2.

---

### 7. `sounds.ts` — `playSound("tick")` Reuses Cached Audio Element Without Cloning

**File:** `/src/utils/sounds.ts` lines 19-26

```ts
export function playSound(name: SoundName): void {
  try {
    const audio = audioCache[name] || new Audio(SOUND_MAP[name]);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch { /* no-op */ }
}
```

When timer tick fires at `value <= 10`, `playSound("tick")` is called every second. Resetting `currentTime = 0` on an already-playing audio element causes the sound to **restart instead of overlapping**, which is audibly jarring. More critically, if the tick sound is longer than 1 second, resetting `currentTime` mid-playback creates an audio glitch. There's no check for whether the audio is already playing.

Additionally, `preloadSounds()` stores **one** `Audio` element per sound. For the `night-ambience.mp3` (1.1MB), there's no way to play it as background while also using other sounds, since `audioCache` is a shared object.

**Impact:** Medium — Audible glitch on timer countdown. The 1.1MB night ambience file is preloaded eagerly via `requestIdleCallback` even if no game is started — wastes bandwidth on initial load.

**Fix:** 
- For tick: clone the audio element (`audioCache[name].cloneNode()`) or use Web Audio API.
- For preload: lazy-load night ambience only when game starts (not on page load).

---

### 8. `nextNight()` — O(P*R) Player Reset Loop

**File:** `/src/store/game-store.ts` lines 276-286

```ts
const newPlayers = s.players.map((p) => {
  if (!p.roleId) return p;
  const role = s.roles.find((r) => r.id === p.roleId);
  if (!role) return p;
  const newUsage = { ...p.abilityUsage };
  role.abilities.forEach((ab) => {
    if (ab.type === "nightly") newUsage[ab.id] = 0;
  });
  return { ...p, abilityUsage: newUsage };
});
```

For each player, `s.roles.find()` performs a linear scan of the roles array. With 20 players and 10 roles, that's 200 iterations per night transition. Not critical, but this runs inside Zustand `set()` which triggers the persist middleware synchronous write.

**Impact:** Low — Linear scan is fast for small N, but combined with the synchronous localStorage write of the entire state (including the new `gameHistory` entry), this can cause a visible frame drop during night transition animation.

**Fix:** Use the `roleMap` pattern from selectors (build a `Map` before the loop).

---

### 9. `SkillSheet` `selectAbility` `useCallback` Depends on `players` — Recreated on Every Player Mutation

**File:** `/src/components/game/skill-sheet.tsx` lines 57-82

```ts
const selectAbility = useCallback(
  (ability: Ability, roleId: string) => {
    const capable = players.filter((p) => p.roleId === roleId && p.alive);
    // ...
  },
  [players],
);
```

Since `players` is a new array reference on every store mutation (Zustand immutable updates), `selectAbility` is recreated every time any player changes. This callback is a dependency of the `useEffect` at line 85-89, which means the effect re-fires on every player mutation when the sheet is open — potentially re-triggering `selectAbility(initialContext.ability, initialContext.roleId)` unexpectedly.

**Impact:** Medium — If a moderator opens SkillSheet with initialContext, then another player's status changes, the useEffect re-fires and could reset the wizard state back to the initial context. This is a **correctness bug** masked as a performance issue.

**Fix:** Move `players` access inside the callback using `useGameStore.getState().players` instead of closure capture, or add a ref guard to prevent re-firing.

---

### 10. `DEFAULT_ROLES` Array Spread on Every Store Initialization

**File:** `/src/store/game-store.ts` line 93

```ts
roleTemplates: [...DEFAULT_ROLES],
```

`DEFAULT_ROLES` is a 49-element array of objects. The spread creates a shallow copy on store init, but the inner objects still share references with the constant. This is fine for reads, but if any mutation path accidentally mutates a template object in-place (none currently do, but it's fragile), it would corrupt the constant for future store resets.

**Impact:** Low — No current mutation path hits this, but it's a latent correctness risk, not a performance issue per se.

**Fix:** This is acceptable as-is. Deep-clone only if template mutation is ever added.

---

## Summary Table

| # | Issue | Impact | File |
|---|-------|--------|------|
| 1 | localStorage persists `roleTemplates` + `gameHistory` unbounded, sync write on every mutation | **High** | game-store.ts |
| 2 | `flipCard` creates new `flippedCards` object, cascading GameScreen re-render | **Medium** | game-store.ts |
| 3 | Inline arrow callbacks for PlayerActionSheet in GameScreen | **Low-Med** | game-screen.tsx |
| 4 | HistorySheet always mounted, 7 subscriptions re-render on every mutation when invisible | **High** | history-sheet.tsx, game-screen.tsx |
| 5 | All 6 sheets always mounted — ~30 redundant store subscriptions | **Medium** | game-screen.tsx |
| 6 | GameScreen subscribes to flippedCards object (covered by #2) | **Low** | game-screen.tsx |
| 7 | Audio playback restarts instead of overlapping; 1.1MB eager preload | **Medium** | sounds.ts |
| 8 | O(P*R) linear scan in nextNight() + sync persist write | **Low** | game-store.ts |
| 9 | SkillSheet useEffect re-fires on player mutation — correctness bug | **Medium** | skill-sheet.tsx |
| 10 | DEFAULT_ROLES shallow spread — latent fragility | **Low** | game-store.ts |

## Recommended Priority

1. **Issue #4 + #5** (conditional rendering of sheets) — highest ROI, single change eliminates most redundant re-renders
2. **Issue #1** (debounce persist, trim serialized data) — prevents localStorage bottleneck
3. **Issue #9** (SkillSheet useEffect correctness bug) — real user-facing bug
4. **Issue #7** (audio handling) — user-facing audio glitches
5. **Issue #2** (flippedCards as local state) — reduces card flip cascade
6. Rest are low priority

---

**Status:** DONE
**Summary:** Found 10 new performance/storage issues beyond the 6 known ones. Top priorities: conditional sheet rendering (#4/#5), persist debounce (#1), and SkillSheet effect correctness bug (#9).
