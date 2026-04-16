# Werewolf Moderator App - Skill System & Player Card Exploration Report

## Overview

This report documents the complete skill system architecture in the werewolf moderator app, including the skill bottom sheet, player card interactions, player action sheet, and the game store integration.

---

## 1. Skill Bottom Sheet (`skill-sheet.tsx`)

### Purpose

The skill sheet is a bottom sheet component that implements a 3-step wizard for moderators to execute player abilities/skills during the game.

### Component Structure

- **Props:** `{ isOpen: boolean, onClose: () => void }`
- **Local State:** `WizardState` tracking the wizard progress through 3 steps
- **Wizard Steps:**
  1. **Step 1:** Select ability by role (collapsible role list showing all abilities)
  2. **Step 2:** Choose source player (when multiple players share the same role)
  3. **Step 3:** Select targets and confirm execution

### Key Features

#### WizardState Interface

```typescript
interface WizardState {
  step: 1 | 2 | 3;
  ability: Ability | null;
  roleId: string | null;
  sourceId: number | null;
  targets: number[];
  possibleSources: { id: number; name: string }[];
}
```

#### Step 1: Role & Ability Selection

- Displays all sorted roles (via `useSortedRoles()`)
- Each role is collapsible/expandable
- Shows players assigned to each role (with strikethrough for dead players)
- Lists all abilities in the role
- **Ability filtering:**
  - Disables ability if `allExhausted` (all assigned players have used up limited uses)
  - Shows ability icon (moon for nightly, `{max}x` for limited)
  - Shows target count (`⊕ {targetCount}`)
- Auto-skips to step 2 if multiple capable players, or directly to step 3 if only one

#### Step 2: Source Selection

- Grid layout of selectable player buttons (3 columns)
- Only shows players alive and assigned to the selected role
- Transitions to step 3 on selection

#### Step 3: Target Selection

- Grid layout of all players (4 columns)
- Click to toggle targets (max = `ability.targetCount`)
- Shows progress: `{selected}/{targetCount}`
- Two buttons:
  - "Skip" (confirmNoTarget): executes with empty targets
  - "Confirm": executes with selected targets

### Integration Points

- **Store:** Uses `useGameStore` for:
  - `players` (to filter capable source players)
  - `executeAction(sourceId, ability, targets, roleId)` — calls game store action
- **Selectors:** Uses `useSortedRoles()` to get role list in game order
- **i18n:** Full translation support with `tr()` helper

---

## 2. Player Card (`player-card.tsx`)

### Purpose

Displays individual player cards with role information, ability status, and action history. Supports multiple view modes (name-first, role-first, combined).

### Component Structure

- **Props:**
  - `player: Player` — the player data
  - `role: GameRole | undefined` — the assigned role
  - `actions: ActionLog[]` — actions performed on/by this player
  - `isFlipped: boolean` — card flip state
  - `viewMode: CardViewMode` — "nameFirst", "roleFirst", or "both"
  - `onFlip, onSelect, onUndoAction` — callbacks
- **Memoized:** Uses `memo()` for performance optimization

### View Modes

#### 1. "both" Mode (Combined View)

- **Layout:** Single card showing name + role + abilities simultaneously
- **Height:** Fixed `h-44`
- **Content:**
  - Player ID badge (top-left)
  - Role name (top-right, with faction color)
  - Player name (large, centered)
  - Abilities section (horizontal/wrapped grid)
  - Action chips (bottom)
  - Three-dot menu button (top-right)
- **Styling:**
  - Faction-specific border (`border-l-4`) and background pattern
  - Dead card effect: watermark + opacity

#### 2. "nameFirst" Mode (Flip Card)

- **Front face:** Name and action chips
- **Back face (role side):** Role name, abilities with usage tracking
- **Flip behavior:** XOR with `isFlipped` state (normal flip logic)
- **Visual:**
  - Faction-specific styling on back face
  - Abilities show usage: `{used}/{max}` for limited, moon icon for nightly
  - Disabled appearance for exhausted limited abilities

#### 3. "roleFirst" Mode (Flip Card, Inverted)

- **Front face:** Role side (inverted from nameFirst)
- **Back face:** Name side
- **Flip behavior:** XOR with `!isFlipped` (inverted logic)

### ActionChips Sub-component

**Purpose:** Display skills/actions performed on the player.

**Features:**

- **Max Visible:** 2 chips on portrait, all on landscape (via `md:` breakpoints)
- **Overflow Handling:** Last chip fades (opacity-40) + "+X" indicator for overflow
- **Chip Content:**
  - Lock icon (fa-lock) for limited abilities
  - Ability name (translated via `tr()`)
  - Click to undo action
- **Responsive:**
  - Portrait (mobile): `flex gap-1 w-full` (full width per chip)
  - Landscape (desktop): `hidden md:contents` (all visible, auto width)

### Ability Display

- **"both" and back face:** Shows all abilities with:
  - Dashed border
  - Ability name (translated)
  - Usage tracker: `{used}/{max}` (limited) or moon icon (nightly)
  - Disabled styling when exhausted (`opacity-40 cursor-not-allowed`)
- **Styling:**
  - Full width on mobile, flexible on desktop
  - Faction-neutral styling (light gray border)

### Three-Dot Menu

- **Placement:** Top-right corner (all modes)
- **Trigger:** `onSelect(playerId, e)` — opens `PlayerActionSheet`
- **Icon:** `fa-ellipsis-v`

### Death Watermark

- **Condition:** Shows when `!player.alive`
- **Visual:** Large skull icon (fa-skull-crossbones) with red tint and 25% opacity
- **Positioning:** Absolute, centered, z-10 (above content)

### Accessibility

- Flip button is keyboard-accessible (Enter/Space keys)
- Proper ARIA labels and roles
- Live region for action chips

---

## 3. Player Action Sheet (`player-action-sheet.tsx`)

### Purpose

Bottom sheet that displays all actions performed on/by a specific player and provides options to undo actions or toggle player status (alive/dead).

### Component Structure

- **Props:**
  - `playerId: number | null` — currently selected player
  - `onClose: () => void` — dismiss callback
- **Opening condition:** Triggered by three-dot menu from player cards

### Layout & Content

#### Header

- **Title:** Player name
- **Icon:** `fa-user`

#### Status Section

- **Role name:** Faction-styled, all-caps, uppercase tracking
- **Alive/Dead status:**
  - Green emerald-500 text: "ALIVE"
  - Red text: "DEAD"
  - Aria-live region for live updates

#### Actions List (if any)

- **Each action button:**
  - Displays ability name (translated via `tr()`)
  - Shows source player: `({sourceId.name})`
  - Lock icon for limited abilities
  - Click to undo via `undoAction(actionId)`
  - Faction-styled background with colored border-bottom
  - Full width, padded buttons

#### Status Toggle Button

- **Large button:** `py-4` (tall, clickable)
- **Dynamic:**
  - **If alive:** Red button (bg-red-600) with skull icon, label "KILL"
  - **If dead:** Green button (bg-emerald-600) with heart icon, label "REVIVE"
- **Action:**
  - Calls `togglePlayerStatus(playerId)`
  - Closes sheet on completion

### Data Sources

- **Store integration:**
  - `players`, `roles`, `togglePlayerStatus`, `undoAction` from `useGameStore`
  - `actionMap` from `usePlayerActionMap()` selector — maps playerId → actions
- **Role lookup:** Joins player.roleId with role definition for faction styling

### i18n Support

- Full translation keys for: "ALIVE", "DEAD", "KILL", "REVIVE"
- Ability name translation via `tr(abilityNameKey, fallback)`

---

## 4. Game Store Actions (`game-store-actions.ts`)

### Purpose

Pure functions that handle game state mutations related to skills, players, and actions.

### Key Skill-Related Functions

#### `executeAction()`

**Signature:**

```typescript
executeAction(
  players: Player[],
  actionLog: ActionLog[],
  sourceId: number,
  ability: Ability,
  targets: number[],
  faction: Faction,
  nightCount: number
): { players: Player[]; actionLog: ActionLog[] }
```

**Behavior:**

1. **Validates limited ability usage:**
   - Checks if source player has exceeded `ability.max` uses
   - Returns unchanged state if exhausted
2. **Increments ability usage:**
   - Updates `players[sourceId].abilityUsage[ability.id]` by 1
3. **Creates ActionLog entries:**
   - Creates one `ActionLog` per target (if multi-target ability)
   - Shares same `executionId` across all targets (groups them)
   - Stores: source, target, ability, faction, turn number, etc.
4. **Returns:**
   - Updated players with incremented usage
   - Appended action log with new entries

**Note:** Even if targets is empty (skip case), the ability usage is still incremented.

#### `undoAction()`

**Signature:**

```typescript
undoAction(
  players: Player[],
  actionLog: ActionLog[],
  actionId: string
): { players: Player[]; actionLog: ActionLog[] }
```

**Behavior:**

1. **Finds action by ID** in action log
2. **Groups undo by executionId:**
   - Checks if other actions share same execution group
   - Only decrements usage if this is the last action in the group
3. **Decrements usage:**
   - `abilityUsage[abilityId] -= 1` (clamps to 0)
4. **Removes action** from log
5. **Returns:** Updated players and action log

**Key insight:** Multi-target actions share an `executionId`, so undoing one action only decrements usage when the last action in that group is removed.

#### Helper Functions

- **`createInitialPlayers(count)`** — generates `count` players with default names (P1, P2, etc.)
- **`createInitialRoles()`** — creates game roles from `INITIAL_ROLE_IDS` template list
- **`addRoleFromTemplate(roles, template)`** — adds a new role instance from template
- **`createCustomRole(...)`** — creates a new custom role and template
- **`changeRoleOrder(...)`** — reorders roles in the game
- **`handlePlayerCountChange(...)`** — adds/removes players when count changes

---

## 5. Game Store Types (`src/types/game.ts`)

### Core Type Definitions

#### `Faction`

```typescript
type Faction = "villager" | "wolf" | "third";
```

Used to style UI elements and track role affiliation.

#### `AbilityType`

```typescript
type AbilityType = "nightly" | "limited";
```

- **"nightly":** Resets daily, unlimited uses per night
- **"limited":** Fixed max uses (stored in `ability.max`)

#### `CardViewMode`

```typescript
type CardViewMode = "nameFirst" | "roleFirst" | "both";
```

Determines how player cards display (flip direction or combined).

#### `Category`

```typescript
type Category = "basic" | "advanced" | "custom";
```

Role template categorization.

### Entity Types

#### `Ability`

```typescript
interface Ability {
  id: string;
  name: string;
  nameKey?: string; // i18n key: "abilities.bite"
  type: AbilityType; // "nightly" or "limited"
  max: number; // max uses (0 for unlimited on nightly)
  targetCount: number; // how many players this ability targets
}
```

#### `RoleTemplate`

```typescript
interface RoleTemplate {
  id: string;
  name: string;
  nameKey: string; // i18n key
  order: number; // game flow order
  category: Category; // "basic", "advanced", "custom"
  faction: Faction;
  abilities: Ability[];
}
```

**Note:** Immutable role definition (not per-game-instance).

#### `GameRole`

```typescript
interface GameRole {
  id: string; // unique instance ID per game
  templateId: string; // references RoleTemplate
  name: string;
  nameKey?: string; // i18n key
  order: number; // game flow order
  faction: Faction;
  abilities: Ability[]; // deep copy from template (each gets new id)
}
```

**Key difference from RoleTemplate:** Instance-specific with unique ability IDs.

#### `Player`

```typescript
interface Player {
  id: number; // 1-based player number
  name: string;
  roleId: string | null; // null = unassigned (Dân Làng)
  alive: boolean;
  abilityUsage: Record<string, number>; // ability.id → usage count
}
```

#### `ActionLog`

```typescript
interface ActionLog {
  id: string; // unique action ID
  executionId: number; // groups multi-target actions
  turnAdded: number; // which night/day this action occurred
  sourceId: number; // player who performed ability
  targetId: number; // player affected
  abilityId: string; // ability that was used
  abilityName: string;
  abilityNameKey?: string; // i18n key
  abilityType: AbilityType; // "limited" or "nightly"
  faction: Faction; // faction of source player
}
```

**Key insight:** One ActionLog per target, but grouped by `executionId` for undo purposes.

#### `TurnHistory`

```typescript
interface TurnHistory {
  night: number;
  actionLogs: ActionLog[];
  statusLogs: { playerId: number; toStatus: boolean }[];
  roleLogs: {
    playerId: number;
    fromRoleId: string | null;
    toRoleId: string | null;
  }[];
}
```

Tracks all events in a single turn (night/day cycle).

#### `GameState` (Main Store State)

```typescript
interface GameState {
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
  flippedCards: Record<number, boolean>; // per-player flip state
}
```

---

## 6. Data Flow Architecture

### Skill Execution Flow

```
SkillSheet (Step 1)
  ↓ selectAbility()
  → Role + Ability selected → Check capable players
  ↓
  → [Multiple capable] → SkillSheet (Step 2)
  → [Single capable] → SkillSheet (Step 3)

SkillSheet (Step 2)
  ↓ selectSource()
  → Source player selected
  ↓
  SkillSheet (Step 3)

SkillSheet (Step 3)
  ↓ toggleTarget()
  → Multiple targets selected (up to ability.targetCount)
  ↓
  confirm() / confirmNoTarget()
  ↓
  executeAction() [store action]
  ↓
  GameState updated:
  - players[sourceId].abilityUsage[ability.id]++
  - actionLog += [ActionLog for each target]
  ↓
  PlayerCard re-renders
  - Shows updated ability usage
  - Displays action chips for affected players
```

### Undo Flow

```
PlayerCard (ActionChips) OR PlayerActionSheet
  ↓ onUndoAction() / click X button
  ↓
  undoAction(actionId) [store action]
  ↓
  GameState updated:
  - Find action by ID
  - If last action in executionId → decrement usage
  - Remove actionLog entry
  ↓
  PlayerCard re-renders
  - Updated ability usage
  - Removed action chip
```

### Three-Dot Menu Flow

```
PlayerCard (three-dot icon)
  ↓ onSelect(playerId, e)
  ↓
  PlayerActionSheet opens (playerId set)
  ↓
  Shows:
  - Role + faction
  - Status (alive/dead)
  - All actions on this player
  - Toggle status button
  ↓
  User clicks undo action → undoAction()
  OR User clicks toggle → togglePlayerStatus()
  ↓
  GameState updated + Sheet closes
```

---

## 7. Key Design Patterns

### 1. **Multi-Step Wizard (SkillSheet)**

- Step-by-step guided UX for complex action
- Early bailouts (single capable player skips step 2)
- Persistent state until confirmed or closed

### 2. **Execution Grouping**

- Multi-target actions share `executionId`
- Undo logic checks group size before decrementing usage
- Allows flexible undo semantics

### 3. **Responsive Layouts**

- Mobile (portrait): 1-2 visible chips, hide overflow
- Desktop (landscape): All chips visible
- `md:` breakpoint toggle via Tailwind

### 4. **Faction Styling**

- Centralized `getFactionStyle(faction)` utility
- Applied to borders, backgrounds, text colors
- Consistent across all components

### 5. **i18n Translation Helper**

- `tr(t, nameKey, fallback)` — tries key first, falls back to string
- Supports partial translations without breaking UI

### 6. **Memoized Components**

- `PlayerCard` wrapped in `memo()` to prevent unnecessary re-renders
- Props properly structured for equality checks

---

## 8. Summary Table

| Component              | Responsibility                                 | Key Props                                  | State                                                  |
| ---------------------- | ---------------------------------------------- | ------------------------------------------ | ------------------------------------------------------ |
| **SkillSheet**         | 3-step wizard for executing abilities          | isOpen, onClose                            | WizardState (step, ability, roleId, sourceId, targets) |
| **PlayerCard**         | Display player info, flip card, show abilities | player, role, actions, viewMode, isFlipped | None (pure presentation)                               |
| **ActionChips**        | Show performed actions as clickable chips      | actions, onUndoAction                      | None (sub-component)                                   |
| **PlayerActionSheet**  | Show player actions, toggle status, undo       | playerId, onClose                          | None (reads from store)                                |
| **game-store-actions** | Pure state mutation logic                      | players, actionLog, etc.                   | None (pure functions)                                  |

---

## 9. Unresolved Questions

1. **Selector `useSortedRoles()`**: How does it sort roles? (Template order? Custom logic?)
2. **Selector `usePlayerActionMap()`**: Does it group actions by target or return flat list?
3. **Store integration**: Where is `executeAction` store method defined? (game-store.ts?)
4. **Night count tracking**: How is `nightCount` incremented? (Separate timer/turn management?)
5. **Limited ability reset logic**: Do limited abilities reset between days? (Not visible in code)
