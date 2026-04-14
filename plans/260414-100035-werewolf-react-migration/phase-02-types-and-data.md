---
phase: 2
status: pending
priority: high
effort: small
---

# Phase 2: Types & Data

<!-- Updated: Validation Session 1 - roleId string|null, GameRole separate from RoleTemplate, i18n strings -->

## Overview

Define TypeScript types, 28 merged role templates, faction theme utility, and i18n translation strings.

## Files to Create

### 1. `src/types/game.ts` (~90 lines)

Core type definitions:

```typescript
export type Faction = "villager" | "wolf" | "third";
export type AbilityType = "nightly" | "limited";
export type Category = "basic" | "advanced" | "custom";
export type CardViewMode = "nameFirst" | "roleFirst" | "both";

export interface Ability {
  id: string;
  name: string;
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
}

// Separate type — NOT extends RoleTemplate
// Copy fields from template when creating. Edit in-game doesn't affect template.
export interface GameRole {
  id: string; // unique instance ID (uuid or nanoid)
  templateId: string; // links back to template
  name: string; // copied from template, editable
  order: number;
  faction: Faction;
  abilities: Ability[]; // deep copy from template
}

export interface Player {
  id: number;
  name: string;
  roleId: string | null; // null = unassigned (Dân Làng)
  alive: boolean;
  abilityUsage: Record<string, number>;
}

export interface ActionLog {
  id: string;
  executionId: number;
  turnAdded: number;
  sourceId: number;
  targetId: number;
  abilityId: string;
  abilityName: string;
  abilityType: AbilityType;
  faction: Faction;
}

export interface TurnHistory {
  night: number;
  actionLogs: ActionLog[];
  statusLogs: { playerId: number; toStatus: boolean }[];
  roleLogs: {
    playerId: number;
    fromRoleId: string | null;
    toRoleId: string | null;
  }[];
}

export interface TimerSettings {
  debate: number;
  judgment: number;
}

export interface GameState {
  step: "setup" | "game";
  players: Player[];
  playerCount: number;
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
}
```

### 2. `src/data/default-roles.ts` (~120 lines)

28 merged role templates. Source: V17 (23) + V21 new (5).

```
BASIC (8):
  Dân:  b_seer(Tiên Tri), b_guard(Bảo Vệ), b_witch(Phù Thủy), b_hunter(Thợ Săn),
        b_cupid(Cupid), b_idiot(Kẻ Khờ), b_elder(Già Làng)
  Sói:  b_wolf(Ma Sói)

ADVANCED Dân (10):
  a_silencer, a_fox, a_medium, a_matchgirl, a_knight, a_rusty,
  a_mayor, a_mother*, a_chief*, a_lycan*

ADVANCED Sói (6):
  a_wwolf, a_mwolf, a_iwolf, a_swolf, a_cwolf*, a_traitor*

ADVANCED Phe 3 (7):
  a_piper, a_thief, a_assassin, a_sect, a_angel, a_half,
  a_twins, a_tanner*
```

Each template includes `nameKey` for i18n: `"roles.b_wolf"`, `"roles.a_seer"`, etc.

Also export:

```typescript
export const INITIAL_ROLE_IDS = [
  "b_wolf",
  "b_seer",
  "b_guard",
  "b_witch",
  "b_hunter",
  "a_lycan",
  "a_traitor",
];

// Max abilities per custom role
export const MAX_ABILITIES_PER_ROLE = 5;
```

### 3. `src/utils/theme.ts` (~50 lines)

Faction → Tailwind class mapping. Supports dark/light theme.

```typescript
export interface FactionStyle {
  border: string;       // 'border-blue-500/50'
  borderSolid: string;  // 'border-blue-500'
  bg: string;           // 'bg-blue-600'
  bgLight: string;      // 'bg-blue-900/20'
  text: string;         // 'text-blue-400'
  textBright: string;   // 'text-blue-300'
  badge: string;        // 'bg-blue-700'
  shadow: string;       // 'shadow-[0_0_15px_rgba(59,130,246,0.4)]'
}

const FACTION_STYLES: Record<Faction | 'dead', FactionStyle> = {
  villager: { border: 'border-blue-500/50', borderSolid: 'border-blue-500', ... },
  wolf:     { border: 'border-red-500/50',  borderSolid: 'border-red-500', ... },
  third:    { border: 'border-purple-500/50', ... },
  dead:     { border: 'border-red-900', ... },
};

export function getFactionStyle(faction: Faction | 'dead'): FactionStyle {
  return FACTION_STYLES[faction] ?? FACTION_STYLES.villager;
}
```

### 4. `src/i18n/vi.json` + `src/i18n/en.json` (~100 lines each)

Translation strings organized by feature:

```json
{
  "setup": {
    "title": "THIẾT LẬP",
    "playerCount": "Số người chơi",
    "roles": "Vai Trò",
    "library": "Thư Viện",
    "startGame": "BẮT ĐẦU GAME",
    "createCustomRole": "TẠO ROLE TUỲ CHỈNH"
  },
  "game": {
    "assignRole": "Gán Role",
    "useSkill": "Dùng Chiêu",
    "turn": "Turn {{count}}",
    "endTurn": "Kết thúc Turn {{count}}?",
    "alive": "ĐANG SỐNG",
    "dead": "ĐÃ TỬ VONG"
  },
  "roles": {
    "b_wolf": "Ma Sói",
    "b_seer": "Tiên Tri",
    ...
  },
  "settings": {
    "cardView": "Chế độ xem thẻ",
    "debateTime": "Thời gian luận",
    "judgmentTime": "Thời gian treo",
    "resetGame": "Reset Game",
    "theme": "Giao diện",
    "dark": "Tối",
    "light": "Sáng",
    "language": "Ngôn ngữ"
  },
  "common": {
    "confirm": "Xác nhận",
    "cancel": "Huỷ",
    "close": "Đóng",
    "save": "Lưu",
    "delete": "Xoá",
    "back": "Quay lại"
  }
}
```

## Success Criteria

- Types compile with no errors
- All 28 roles have correct abilities, factions, categories, i18n nameKeys
- `getFactionStyle()` returns valid Tailwind classes for all 4 keys
- i18n strings render correctly with `useTranslation()` hook
- GameRole is a separate type from RoleTemplate (no extends)
- roleId uses `string | null` everywhere
