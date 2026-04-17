export type Faction = "villager" | "wolf" | "third";
export type AbilityType = "nightly" | "limited";
export type Category = "basic" | "advanced" | "custom";
export type CardViewMode = "nameFirst" | "roleFirst" | "both";

export interface Ability {
  id: string;
  name: string;
  nameKey?: string; // i18n key: "abilities.bite"
  type: AbilityType;
  max: number; // 0 = unlimited (nightly)
  targetCount: number;
}

export interface RoleTemplate {
  id: string;
  name: string;
  nameKey: string; // i18n key: "roles.b_wolf"
  order: number;
  category: Category;
  faction: Faction;
  abilities: Ability[];
  version?: number;
}

// Separate type — copy fields from template when creating
export interface GameRole {
  id: string; // unique instance ID
  templateId: string;
  name: string;
  nameKey?: string; // i18n key: "roles.b_wolf"
  order: number;
  faction: Faction;
  abilities: Ability[]; // deep copy from template
}

export interface Player {
  id: number;
  name: string;
  roleId: string | null; // null = unassigned (Dan Lang)
  alive: boolean;
  abilityUsage: Record<string, number>;
}

export interface ActionLog {
  id: string;
  executionId: string;
  turnAdded: number;
  sourceId: number;
  targetId: number;
  abilityId: string;
  abilityName: string;
  abilityNameKey?: string; // i18n key
  abilityType: AbilityType;
  faction: Faction;
  timestamp: number; // Date.now()
}

export interface TurnHistory {
  night: number;
  endedAt: number; // Date.now() when turn ended
  actionLogs: ActionLog[];
  statusLogs: { playerId: number; toStatus: boolean; timestamp: number }[];
  roleLogs: {
    playerId: number;
    fromRoleId: string | null;
    toRoleId: string | null;
    timestamp: number;
  }[];
}

export interface TimerSettings {
  debate: number;
  judgment: number;
  muted: boolean;
}

export interface GameState {
  step: "setup" | "game";
  players: Player[];
  playerCount: number;
  roleTemplates: RoleTemplate[];
  roles: GameRole[];
  actionLog: ActionLog[];
  statusChangeLog: { playerId: number; toStatus: boolean; timestamp: number }[];
  roleChangeLog: {
    playerId: number;
    fromRoleId: string | null;
    toRoleId: string | null;
    timestamp: number;
  }[];
  gameHistory: TurnHistory[];
  nightCount: number;
  timerSettings: TimerSettings;
  cardViewMode: CardViewMode;
  flippedCards: Record<number, boolean>;
}
