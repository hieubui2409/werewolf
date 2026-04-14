import { useMemo } from "react";
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

/** Pre-computed actions grouped by target player ID */
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
