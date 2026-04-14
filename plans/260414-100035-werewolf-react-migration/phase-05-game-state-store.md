---
phase: 5
status: pending
priority: critical
effort: large
---

# Phase 5: Game State Store (Zustand)

<!-- Updated: Validation Session 1 - Complete rewrite from useGameState hook to Zustand store -->

## Overview

`src/store/game-store.ts` — the core brain. Single Zustand store with selectors and persist middleware. Replaces V17/V21's monolithic component state.

**This is the most critical file.** All screens consume this store via selectors.

## Files to Create

### 1. `src/store/game-store.ts` (~180 lines)

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GameStore {
  // === STATE ===
  step: "setup" | "game";
  playerCount: number;
  players: Player[];
  roleTemplates: RoleTemplate[];
  roles: GameRole[];
  actionLog: ActionLog[];
  statusChangeLog: { playerId: number; toStatus: boolean }[];
  roleChangeLog: {
    playerId: number;
    fromRoleId: string | null;
    toRoleId: string | null;
  }[];
  gameHistory: TurnHistory[];
  nightCount: number;
  timerSettings: TimerSettings;
  cardViewMode: CardViewMode;
  flippedCards: Record<number, boolean>;

  // === PLAYER ACTIONS ===
  setStep: (step: "setup" | "game") => void;
  handlePlayerCountChange: (newCount: number) => void;
  updatePlayerName: (id: number, name: string) => void;
  togglePlayerStatus: (id: number) => void;

  // === ROLE ACTIONS ===
  addRoleFromTemplate: (template: RoleTemplate) => void;
  createCustomRole: (draft: {
    name: string;
    faction: Faction;
    abilities: Ability[];
  }) => void;
  updateRoleName: (id: string, name: string) => void;
  changeRoleOrder: (roleId: string, newPosition: number) => void;
  deleteRole: (id: string) => void;
  addAbility: (roleId: string) => void;
  updateAbility: (
    roleId: string,
    abilityId: string,
    field: string,
    value: any,
  ) => void;
  deleteAbility: (roleId: string, abilityId: string) => void;

  // === ROLE ASSIGNMENT ===
  togglePlayerRole: (playerId: number, targetRoleId: string) => void;

  // === GAME ACTIONS ===
  executeAction: (
    sourceId: number,
    ability: Ability,
    targets: number[],
    roleId: string,
  ) => void;
  undoAction: (actionId: string) => void;

  // === TURN MANAGEMENT ===
  nextNight: () => void;
  resetGame: () => void;

  // === CARD VIEW ===
  flipCard: (id: number) => void;
  setCardViewMode: (mode: CardViewMode) => void;
  setTimerSettings: (settings: TimerSettings) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state...
      step: "setup",
      playerCount: 10,
      players: createInitialPlayers(10),
      // ...

      // Actions implemented here...
      handlePlayerCountChange: (newCount) =>
        set((state) => {
          // Grow/shrink player array (port from V17:416)
        }),

      togglePlayerRole: (playerId, targetRoleId) =>
        set((state) => {
          // Toggle + log role change (port from V17:499)
        }),

      executeAction: (sourceId, ability, targets, roleId) =>
        set((state) => {
          // Renamed from V17 executeGlobalAction (V17:532)
          // Add faction to log
        }),

      undoAction: (actionId) =>
        set((state) => {
          // Undo single action, decrement usage (V17:429)
        }),

      nextNight: () =>
        set((state) => {
          // Save history, reset nightly usage, clear temp logs (V17:564)
        }),

      resetGame: () =>
        set((state) => {
          // Full game reset (V17:583)
        }),
    }),
    {
      name: "werewolf-game",
      storage: createJSONStorage(() => localStorage),
      // Partialize: exclude UI-only state from persistence
      partialize: (state) => ({
        step: state.step,
        playerCount: state.playerCount,
        players: state.players,
        roleTemplates: state.roleTemplates,
        roles: state.roles,
        actionLog: state.actionLog,
        statusChangeLog: state.statusChangeLog,
        roleChangeLog: state.roleChangeLog,
        gameHistory: state.gameHistory,
        nightCount: state.nightCount,
        timerSettings: state.timerSettings,
        cardViewMode: state.cardViewMode,
        // EXCLUDED: flippedCards (UI state, reset on load)
      }),
    },
  ),
);
```

### 2. `src/store/selectors.ts` (~40 lines)

Derived data selectors — prevent unnecessary re-renders:

```typescript
import { useGameStore } from "./game-store";
import { useMemo } from "react";

// O(1) role lookup (from V21:394)
export function useRoleMap() {
  const roles = useGameStore((s) => s.roles);
  return useMemo(() => {
    const map = new Map<string, GameRole>();
    roles.forEach((r) => map.set(r.id, r));
    return map;
  }, [roles]);
}

// Pre-computed actions per target (from V21:402)
export function usePlayerActionMap() {
  const actionLog = useGameStore((s) => s.actionLog);
  return useMemo(() => {
    const map = new Map<number, ActionLog[]>();
    actionLog.forEach((a) => {
      const arr = map.get(a.targetId) || [];
      arr.push(a);
      map.set(a.targetId, arr);
    });
    return map;
  }, [actionLog]);
}

// Sorted roles by order
export function useSortedRoles() {
  const roles = useGameStore((s) => s.roles);
  return useMemo(() => [...roles].sort((a, b) => a.order - b.order), [roles]);
}

// Sorted players by roleId assignment
export function useSortedPlayers() {
  const players = useGameStore((s) => s.players);
  const roleMap = useRoleMap();
  return useMemo(
    () =>
      [...players].sort((a, b) => {
        const ra = a.roleId ? (roleMap.get(a.roleId)?.order ?? 999) : 999;
        const rb = b.roleId ? (roleMap.get(b.roleId)?.order ?? 999) : 999;
        return ra - rb || a.id - b.id;
      }),
    [players, roleMap],
  );
}
```

### 3. (Optional split) `src/store/game-store-actions.ts`

If `game-store.ts` exceeds 200 lines, extract action implementations:

- `createPlayerActions(set, get)` — player CRUD
- `createRoleActions(set, get)` — role CRUD, abilities
- `createGameActions(set, get)` — actions, history, turns

## Logic Ported From

| Function                  | Source                        | Notes                                   |
| ------------------------- | ----------------------------- | --------------------------------------- |
| `handlePlayerCountChange` | V17:416                       | Grow/shrink player array                |
| `togglePlayerRole`        | V17:499                       | Toggle + log role change                |
| `executeAction`           | V17:532 (executeGlobalAction) | Renamed, add faction to log             |
| `undoAction`              | V17:429                       | Undo single action, decrement usage     |
| `nextNight`               | V17:564                       | Save history, reset nightly, clear temp |
| `resetGame`               | V17:583                       | Full game reset                         |
| `changeRoleOrder`         | V17:464                       | Reorder roles with splice               |
| Selectors (roleMap etc.)  | V21:394-410                   | O(1) lookups, moved to selectors.ts     |

## Key Differences from Original Plan

- **Zustand store** replaces `useGameState()` hook — no more props drilling
- **Persist middleware** replaces manual `storage.ts` save/load calls
- **Selectors** in separate file — components select only what they need
- **Partialize** excludes `flippedCards` from persistence (UI state)
- Components access store directly: `const players = useGameStore(s => s.players)`

## Success Criteria

- All V17/V21 game logic works identically
- Selectors (roleMap, playerActionMap) provide O(1) lookups
- Persist middleware auto-saves to localStorage on state change
- Load from localStorage works on app restart
- TypeScript compiles clean
- Store file ≤200 lines (split if needed)
