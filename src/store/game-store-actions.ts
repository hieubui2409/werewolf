import type {
  Player,
  RoleTemplate,
  GameRole,
  Ability,
  ActionLog,
  Faction,
  CardViewMode,
  TimerSettings,
} from "../types/game";
import { DEFAULT_ROLES, INITIAL_ROLE_IDS } from "../data/default-roles";
import { uid } from "../utils/uid";

// Helper: create initial players
export function createInitialPlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `P${i + 1}`,
    roleId: null,
    alive: true,
    abilityUsage: {},
  }));
}

// Helper: create initial roles from template IDs
export function createInitialRoles(): GameRole[] {
  const templates = INITIAL_ROLE_IDS.map((tid) =>
    DEFAULT_ROLES.find((r) => r.id === tid),
  ).filter((tpl): tpl is RoleTemplate => tpl !== null);

  const sorted = [...templates].sort((a, b) => a.order - b.order);

  return sorted.map<GameRole>((tpl, idx) => ({
    id: `init_${Date.now()}_${idx}`,
    templateId: tpl.id,
    name: tpl.name,
    nameKey: tpl.nameKey,
    order: idx + 1,
    faction: tpl.faction,
    abilities: tpl.abilities.map((a) => ({
      ...a,
      id: `ab_${uid()}`,
    })),
  }));
}

// ===== Player Actions =====
export function handlePlayerCountChange(
  players: Player[],
  newCount: number,
): Player[] {
  if (newCount > players.length) {
    return [
      ...players,
      ...Array.from({ length: newCount - players.length }, (_, i) => ({
        id: players.length + i + 1,
        name: `P${players.length + i + 1}`,
        roleId: null as string | null,
        alive: true,
        abilityUsage: {} as Record<string, number>,
      })),
    ];
  }
  if (newCount < players.length) {
    const kept = players.slice(0, newCount);
    // Return kept players; caller is responsible for calling cleanupPlayerReferences
    return kept.map((p) => p);
  }
  return players;
}

// Cleanup all state referencing removed player IDs
export function cleanupPlayerReferences(
  removedIds: Set<number>,
  actionLog: ActionLog[],
  statusChangeLog: { playerId: number; toStatus: boolean; timestamp: number }[],
  roleChangeLog: {
    playerId: number;
    fromRoleId: string | null;
    toRoleId: string | null;
    timestamp: number;
  }[],
  flippedCards: Record<number, boolean>,
): {
  actionLog: ActionLog[];
  statusChangeLog: typeof statusChangeLog;
  roleChangeLog: typeof roleChangeLog;
  flippedCards: Record<number, boolean>;
} {
  if (removedIds.size === 0) {
    return { actionLog, statusChangeLog, roleChangeLog, flippedCards };
  }

  const newFlipped = { ...flippedCards };
  removedIds.forEach((id) => delete newFlipped[id]);

  return {
    actionLog: actionLog.filter(
      (a) => !removedIds.has(a.sourceId) && !removedIds.has(a.targetId),
    ),
    statusChangeLog: statusChangeLog.filter((l) => !removedIds.has(l.playerId)),
    roleChangeLog: roleChangeLog.filter((l) => !removedIds.has(l.playerId)),
    flippedCards: newFlipped,
  };
}

// ===== Role Actions =====
export function addRoleFromTemplate(
  roles: GameRole[],
  template: RoleTemplate,
): GameRole[] {
  const maxOrder = Math.max(0, ...roles.map((r) => r.order));
  const newRole: GameRole = {
    id: uid(),
    templateId: template.id,
    name: template.name,
    nameKey: template.nameKey,
    order: maxOrder + 1,
    faction: template.faction,
    abilities: template.abilities.map((a) => ({
      ...a,
      id: `ab_${uid()}`,
    })),
  };
  return [...roles, newRole];
}

export function createCustomRole(
  templates: RoleTemplate[],
  roles: GameRole[],
  draft: { name: string; faction: Faction; abilities: Ability[] },
): { templates: RoleTemplate[]; roles: GameRole[] } {
  const id = `c_${uid()}`;
  const maxOrder = Math.max(0, ...roles.map((r) => r.order));
  const newTemplate: RoleTemplate = {
    id,
    name: draft.name,
    nameKey: `roles.${id}`,
    order: maxOrder + 1,
    category: "custom",
    faction: draft.faction,
    abilities: draft.abilities,
  };
  const newRole: GameRole = {
    id: uid(),
    templateId: id,
    name: draft.name,
    order: maxOrder + 1,
    faction: draft.faction,
    abilities: draft.abilities.map((a) => ({ ...a, id: `ab_${uid()}` })),
  };
  return {
    templates: [...templates, newTemplate],
    roles: [...roles, newRole],
  };
}

export function changeRoleOrder(
  roles: GameRole[],
  roleId: string,
  newPosition: number,
): GameRole[] {
  const sorted = [...roles].sort((a, b) => a.order - b.order);
  const currentIndex = sorted.findIndex((r) => r.id === roleId);
  if (currentIndex === -1 || currentIndex + 1 === newPosition) return roles;
  const [target] = sorted.splice(currentIndex, 1);
  sorted.splice(newPosition - 1, 0, target);
  return sorted.map((r, i) => ({ ...r, order: i + 1 }));
}

// ===== Execution Validation =====
export interface ExecutionCheck {
  allowed: boolean;
  reason?: "dead_source" | "already_used_night" | "limit_reached";
}

/**
 * Single validation for both canExecute (UI pre-check) and executeAction.
 * force=true: skip dead_source only. Usage limits always enforced.
 */
export function validateExecution(
  players: Player[],
  sourceId: number,
  ability: Ability,
  force = false,
): ExecutionCheck {
  const source = players.find((p) => p.id === sourceId);
  if (!source) return { allowed: false };
  if (!source.alive && !force) return { allowed: false, reason: "dead_source" };
  if (ability.type === "limited" || ability.type === "nightly") {
    const used = source.abilityUsage[ability.id] || 0;
    const max = ability.type === "nightly" ? 1 : ability.max;
    if (used >= max)
      return {
        allowed: false,
        reason:
          ability.type === "nightly" ? "already_used_night" : "limit_reached",
      };
  }
  return { allowed: true };
}

export function canExecute(
  players: Player[],
  sourceId: number,
  ability: Ability,
): ExecutionCheck {
  return validateExecution(players, sourceId, ability, false);
}

// ===== Game Actions =====
export function executeAction(
  players: Player[],
  actionLog: ActionLog[],
  sourceId: number,
  ability: Ability,
  targets: number[],
  faction: Faction,
  nightCount: number,
  force = false,
): {
  players: Player[];
  actionLog: ActionLog[];
  blocked?: boolean;
  reason?: string;
} {
  const check = validateExecution(players, sourceId, ability, force);
  if (!check.allowed) {
    return { players, actionLog, blocked: true, reason: check.reason };
  }

  const newPlayers = players.map((p) => {
    if (p.id === sourceId) {
      const currentCount = p.abilityUsage[ability.id] || 0;
      return {
        ...p,
        abilityUsage: { ...p.abilityUsage, [ability.id]: currentCount + 1 },
      };
    }
    return p;
  });

  const executionId = uid();
  const now = Date.now();

  // M11: Always create at least one log entry (even with empty targets)
  const newActions: ActionLog[] =
    targets.length > 0
      ? targets.map((targetId) => ({
          id: uid(),
          executionId,
          turnAdded: nightCount,
          sourceId,
          targetId,
          abilityId: ability.id,
          abilityName: ability.name,
          abilityNameKey: ability.nameKey,
          abilityType: ability.type,
          faction,
          timestamp: now,
        }))
      : [
          {
            id: uid(),
            executionId,
            turnAdded: nightCount,
            sourceId,
            targetId: sourceId,
            abilityId: ability.id,
            abilityName: ability.name,
            abilityNameKey: ability.nameKey,
            abilityType: ability.type,
            faction,
            timestamp: now,
          },
        ];

  return {
    players: newPlayers,
    actionLog: [...actionLog, ...newActions],
  };
}

// H1: Undo removes entire execution group atomically
export function undoAction(
  players: Player[],
  actionLog: ActionLog[],
  actionId: string,
): { players: Player[]; actionLog: ActionLog[] } {
  const actionToUndo = actionLog.find((a) => a.id === actionId);
  if (!actionToUndo) return { players, actionLog };

  // Find all entries in same execution group
  const executionGroup = actionLog.filter(
    (a) => a.executionId === actionToUndo.executionId,
  );

  // Decrement usage once for the entire group
  const newPlayers = players.map((p) => {
    if (p.id === actionToUndo.sourceId) {
      const currentCount = p.abilityUsage[actionToUndo.abilityId] || 1;
      return {
        ...p,
        abilityUsage: {
          ...p.abilityUsage,
          [actionToUndo.abilityId]: Math.max(0, currentCount - 1),
        },
      };
    }
    return p;
  });

  // Remove all entries in execution group
  const groupIds = new Set(executionGroup.map((a) => a.id));
  return {
    players: newPlayers,
    actionLog: actionLog.filter((a) => !groupIds.has(a.id)),
  };
}

// ===== Template Merge =====
export function mergeRoleTemplates(
  persisted: RoleTemplate[] | undefined,
  defaults: RoleTemplate[],
): RoleTemplate[] {
  if (!persisted || !Array.isArray(persisted)) return [...defaults];

  const persistedMap = new Map(persisted.map((t) => [t.id, t]));
  const merged: RoleTemplate[] = [];

  for (const def of defaults) {
    const saved = persistedMap.get(def.id);
    if (saved && (saved.version ?? 0) >= (def.version ?? 0)) {
      merged.push(saved);
    } else {
      merged.push(def);
    }
    persistedMap.delete(def.id);
  }

  // Keep custom templates
  for (const custom of persistedMap.values()) {
    merged.push(custom);
  }

  return merged;
}

// ===== UI Actions =====
export type { CardViewMode, TimerSettings };
