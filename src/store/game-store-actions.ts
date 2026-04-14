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

  // Sort by template order to get correct game-flow sequence, then assign sequential numbers
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
      id: `ab_${Math.random().toString(36).slice(2, 9)}`,
    })),
  }));
}

// Generate unique ID (counter avoids collision on rapid clicks)
let _counter = 0;
function uid(): string {
  return `${Date.now()}_${++_counter}_${Math.random().toString(36).slice(2, 9)}`;
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
  return players.slice(0, newCount);
}

// ===== Role Actions =====
export function addRoleFromTemplate(
  roles: GameRole[],
  template: RoleTemplate,
): GameRole[] {
  const newRole: GameRole = {
    id: uid(),
    templateId: template.id,
    name: template.name,
    nameKey: template.nameKey,
    order: roles.length + 1,
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
  const newTemplate: RoleTemplate = {
    id,
    name: draft.name,
    nameKey: `roles.${id}`,
    order: 10,
    category: "custom",
    faction: draft.faction,
    abilities: draft.abilities,
  };
  const newRole: GameRole = {
    id: uid(),
    templateId: id,
    name: draft.name,
    order: 10,
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

// ===== Game Actions =====
export function executeAction(
  players: Player[],
  actionLog: ActionLog[],
  sourceId: number,
  ability: Ability,
  targets: number[],
  faction: Faction,
  nightCount: number,
): { players: Player[]; actionLog: ActionLog[] } {
  // Validate limited ability usage
  if (ability.type === "limited") {
    const source = players.find((p) => p.id === sourceId);
    const currentCount = source?.abilityUsage[ability.id] || 0;
    if (currentCount >= ability.max) {
      return { players, actionLog };
    }
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

  const executionId = ++_counter;
  const newActions: ActionLog[] = targets.map((targetId) => ({
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
  }));

  return {
    players: newPlayers,
    actionLog: [...actionLog, ...newActions],
  };
}

export function undoAction(
  players: Player[],
  actionLog: ActionLog[],
  actionId: string,
): { players: Player[]; actionLog: ActionLog[] } {
  const actionToUndo = actionLog.find((a) => a.id === actionId);
  if (!actionToUndo) return { players, actionLog };

  // Decrement usage only when removing the last action in its execution group
  const sameExecution = actionLog.filter(
    (a) => a.executionId === actionToUndo.executionId,
  );
  let newPlayers = players;
  if (sameExecution.length === 1) {
    newPlayers = players.map((p) => {
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
  }

  return {
    players: newPlayers,
    actionLog: actionLog.filter((a) => a.id !== actionId),
  };
}

// ===== UI Actions =====
export type { CardViewMode, TimerSettings };
