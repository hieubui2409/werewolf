import { useMemo, useRef } from "react";
import { useGameStore } from "./game-store";
import type { GameRole, ActionLog } from "../types/game";

/** O(1) role lookup by role ID */
export function useRoleMap() {
  const roles = useGameStore((s) => s.roles);
  return useMemo(() => {
    const map = new Map<string, GameRole>();
    roles.forEach((r) => map.set(r.id, r));
    return map;
  }, [roles]);
}

/**
 * M4: Pre-computed actions grouped by target player ID.
 * Uses structural sharing — only creates new arrays for players whose actions changed.
 */
export function usePlayerActionMap() {
  const actionLog = useGameStore((s) => s.actionLog);
  const prevMapRef = useRef<Map<number, ActionLog[]>>(new Map());

  return useMemo(() => {
    const newMap = new Map<number, ActionLog[]>();
    actionLog.forEach((a) => {
      const arr = newMap.get(a.targetId) || [];
      arr.push(a);
      newMap.set(a.targetId, arr);
    });

    // Structural sharing: reuse previous array refs if content unchanged
    const prevMap = prevMapRef.current;
    const result = new Map<number, ActionLog[]>();
    for (const [id, actions] of newMap) {
      const prev = prevMap.get(id);
      if (
        prev &&
        prev.length === actions.length &&
        prev.every((a, i) => a.id === actions[i].id)
      ) {
        result.set(id, prev);
      } else {
        result.set(id, actions);
      }
    }
    prevMapRef.current = result;
    return result;
  }, [actionLog]);
}

/** Roles sorted by night order */
export function useSortedRoles() {
  const roles = useGameStore((s) => s.roles);
  return useMemo(() => [...roles].sort((a, b) => a.order - b.order), [roles]);
}

/** Players sorted by assigned role order, then by ID */
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
