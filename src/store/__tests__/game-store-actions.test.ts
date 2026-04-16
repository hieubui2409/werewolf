import { describe, it, expect, beforeEach } from "vitest";
import {
  createInitialPlayers,
  handlePlayerCountChange,
  addRoleFromTemplate,
  createCustomRole,
  changeRoleOrder,
  executeAction,
  undoAction,
} from "../game-store-actions";
import type {
  Player,
  RoleTemplate,
  GameRole,
  Ability,
  ActionLog,
} from "../../types/game";

describe("game-store-actions: Pure Functions", () => {
  describe("createInitialPlayers", () => {
    it("creates correct number of players", () => {
      expect(createInitialPlayers(5)).toHaveLength(5);
      expect(createInitialPlayers(10)).toHaveLength(10);
      expect(createInitialPlayers(0)).toHaveLength(0);
    });

    it("assigns sequential IDs starting from 1", () => {
      const players = createInitialPlayers(3);
      expect(players[0].id).toBe(1);
      expect(players[1].id).toBe(2);
      expect(players[2].id).toBe(3);
    });

    it("assigns default names P1, P2, etc.", () => {
      const players = createInitialPlayers(3);
      expect(players[0].name).toBe("P1");
      expect(players[1].name).toBe("P2");
      expect(players[2].name).toBe("P3");
    });

    it("all players start unassigned (roleId = null)", () => {
      const players = createInitialPlayers(5);
      players.forEach((p) => {
        expect(p.roleId).toBeNull();
      });
    });

    it("all players start alive", () => {
      const players = createInitialPlayers(5);
      players.forEach((p) => {
        expect(p.alive).toBe(true);
      });
    });

    it("all players have empty abilityUsage", () => {
      const players = createInitialPlayers(3);
      players.forEach((p) => {
        expect(p.abilityUsage).toEqual({});
      });
    });
  });

  describe("handlePlayerCountChange", () => {
    let players: Player[];

    beforeEach(() => {
      players = createInitialPlayers(5);
    });

    it("adds new players when count increases", () => {
      const result = handlePlayerCountChange(players, 8);
      expect(result).toHaveLength(8);
      expect(result[5].id).toBe(6);
      expect(result[6].id).toBe(7);
      expect(result[7].id).toBe(8);
    });

    it("new players have correct names P6, P7, etc.", () => {
      const result = handlePlayerCountChange(players, 7);
      expect(result[5].name).toBe("P6");
      expect(result[6].name).toBe("P7");
    });

    it("new players inherit defaults (alive, no role)", () => {
      const result = handlePlayerCountChange(players, 6);
      expect(result[5].alive).toBe(true);
      expect(result[5].roleId).toBeNull();
      expect(result[5].abilityUsage).toEqual({});
    });

    it("shrinks list when count decreases", () => {
      const result = handlePlayerCountChange(players, 3);
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(1);
      expect(result[2].id).toBe(3);
    });

    it("preserves existing players when shrinking", () => {
      const modified = players.map((p) =>
        p.id === 1 ? { ...p, name: "Custom" } : p,
      );
      const result = handlePlayerCountChange(modified, 3);
      expect(result[0].name).toBe("Custom");
    });

    it("no-op when count equals current length", () => {
      const result = handlePlayerCountChange(players, 5);
      expect(result).toEqual(players);
    });
  });

  describe("addRoleFromTemplate", () => {
    let roles: GameRole[];
    let template: RoleTemplate;

    beforeEach(() => {
      roles = [];
      template = {
        id: "t_wolf",
        name: "Wolf",
        nameKey: "roles.wolf",
        order: 1,
        category: "basic",
        faction: "wolf",
        abilities: [
          {
            id: "a_bite",
            name: "Bite",
            type: "nightly",
            max: 0,
            targetCount: 1,
          },
        ],
      };
    });

    it("adds a new role to empty array", () => {
      const result = addRoleFromTemplate(roles, template);
      expect(result).toHaveLength(1);
    });

    it("new role has unique instance ID", () => {
      const result = addRoleFromTemplate(roles, template);
      expect(result[0].id).toBeTruthy();
      expect(result[0].id).not.toBe(template.id);
    });

    it("copies template properties to role", () => {
      const result = addRoleFromTemplate(roles, template);
      expect(result[0].templateId).toBe(template.id);
      expect(result[0].name).toBe("Wolf");
      expect(result[0].order).toBe(1);
      expect(result[0].faction).toBe("wolf");
    });

    it("deep copies abilities with new IDs", () => {
      const result = addRoleFromTemplate(roles, template);
      expect(result[0].abilities).toHaveLength(1);
      expect(result[0].abilities[0].name).toBe("Bite");
      expect(result[0].abilities[0].id).not.toBe("a_bite");
    });

    it("preserves previous roles", () => {
      const role1 = addRoleFromTemplate([], template);
      const role2 = addRoleFromTemplate(role1, {
        ...template,
        id: "t_seer",
        name: "Seer",
      });
      expect(role2).toHaveLength(2);
      expect(role2[0].id).toBe(role1[0].id);
    });

    it("abilities have unique IDs across calls", () => {
      const result1 = addRoleFromTemplate([], template);
      const result2 = addRoleFromTemplate(result1, template);
      expect(result1[0].abilities[0].id).not.toBe(result2[1].abilities[0].id);
    });
  });

  describe("createCustomRole", () => {
    let templates: RoleTemplate[];
    let roles: GameRole[];

    beforeEach(() => {
      templates = [];
      roles = [];
    });

    it("creates new template and role", () => {
      const result = createCustomRole(templates, roles, {
        name: "Custom",
        faction: "villager",
        abilities: [
          {
            id: "tmp_a1",
            name: "Power",
            type: "limited",
            max: 2,
            targetCount: 1,
          },
        ],
      });
      expect(result.templates).toHaveLength(1);
      expect(result.roles).toHaveLength(1);
    });

    it("template has custom category", () => {
      const result = createCustomRole(templates, roles, {
        name: "Custom",
        faction: "villager",
        abilities: [],
      });
      expect(result.templates[0].category).toBe("custom");
    });

    it("template ID starts with 'c_'", () => {
      const result = createCustomRole(templates, roles, {
        name: "Custom",
        faction: "third",
        abilities: [],
      });
      expect(result.templates[0].id).toMatch(/^c_/);
    });

    it("preserves existing templates and roles", () => {
      const existing = {
        id: "existing",
        name: "Existing",
        nameKey: "roles.existing",
        order: 1,
        category: "basic" as const,
        faction: "villager" as const,
        abilities: [],
      };
      const result = createCustomRole([existing], [], {
        name: "Custom",
        faction: "villager",
        abilities: [],
      });
      expect(result.templates).toHaveLength(2);
      expect(result.templates[0]).toEqual(existing);
    });

    it("copies abilities from draft with new IDs", () => {
      const abilities: Ability[] = [
        {
          id: "draft_a1",
          name: "Test",
          type: "nightly",
          max: 0,
          targetCount: 1,
        },
      ];
      const result = createCustomRole(templates, roles, {
        name: "Custom",
        faction: "villager",
        abilities,
      });
      expect(result.roles[0].abilities).toHaveLength(1);
      expect(result.roles[0].abilities[0].name).toBe("Test");
      expect(result.roles[0].abilities[0].id).not.toBe("draft_a1");
    });
  });

  describe("changeRoleOrder", () => {
    let roles: GameRole[];

    beforeEach(() => {
      roles = [
        {
          id: "r1",
          templateId: "t1",
          name: "Role 1",
          order: 1,
          faction: "villager",
          abilities: [],
        },
        {
          id: "r2",
          templateId: "t2",
          name: "Role 2",
          order: 2,
          faction: "villager",
          abilities: [],
        },
        {
          id: "r3",
          templateId: "t3",
          name: "Role 3",
          order: 3,
          faction: "villager",
          abilities: [],
        },
      ];
    });

    it("returns same array if role not found", () => {
      const result = changeRoleOrder(roles, "nonexistent", 2);
      expect(result).toEqual(roles);
    });

    it("returns same array if already at target position", () => {
      const result = changeRoleOrder(roles, "r1", 1);
      expect(result).toEqual(roles);
    });

    it("moves role from position 1 to position 3", () => {
      const result = changeRoleOrder(roles, "r1", 3);
      const sorted = result.sort((a, b) => a.order - b.order);
      expect(sorted[2].id).toBe("r1");
    });

    it("reassigns order values 1, 2, 3 after move", () => {
      const result = changeRoleOrder(roles, "r1", 3);
      const sorted = result.sort((a, b) => a.order - b.order);
      sorted.forEach((r, i) => {
        expect(r.order).toBe(i + 1);
      });
    });

    it("moves role from position 3 to position 1", () => {
      const result = changeRoleOrder(roles, "r3", 1);
      const sorted = result.sort((a, b) => a.order - b.order);
      expect(sorted[0].id).toBe("r3");
    });

    it("handles moving to middle position", () => {
      const result = changeRoleOrder(roles, "r1", 2);
      const sorted = result.sort((a, b) => a.order - b.order);
      expect(sorted[1].id).toBe("r1");
    });
  });

  describe("executeAction", () => {
    let players: Player[];
    let actionLog: any[];
    let ability: Ability;

    beforeEach(() => {
      players = createInitialPlayers(5);
      actionLog = [];
      ability = {
        id: "a_bite",
        name: "Bite",
        type: "nightly",
        max: 0,
        targetCount: 1,
      };
    });

    it("increments ability usage for source player", () => {
      const result = executeAction(
        players,
        actionLog,
        1,
        ability,
        [2],
        "wolf",
        1,
      );
      expect(result.players[0].abilityUsage["a_bite"]).toBe(1);
    });

    it("creates action log entries for each target", () => {
      const result = executeAction(
        players,
        actionLog,
        1,
        ability,
        [2, 3],
        "wolf",
        1,
      );
      expect(result.actionLog).toHaveLength(2);
      expect(result.actionLog[0].targetId).toBe(2);
      expect(result.actionLog[1].targetId).toBe(3);
    });

    it("all actions in same execution have same executionId", () => {
      const result = executeAction(
        players,
        actionLog,
        1,
        ability,
        [2, 3, 4],
        "wolf",
        1,
      );
      const execId = result.actionLog[0].executionId;
      result.actionLog.forEach((a) => {
        expect(a.executionId).toBe(execId);
      });
    });

    it("sets actionLog fields correctly", () => {
      const result = executeAction(
        players,
        actionLog,
        1,
        ability,
        [2],
        "wolf",
        3,
      );
      expect(result.actionLog[0].sourceId).toBe(1);
      expect(result.actionLog[0].targetId).toBe(2);
      expect(result.actionLog[0].abilityId).toBe("a_bite");
      expect(result.actionLog[0].abilityName).toBe("Bite");
      expect(result.actionLog[0].abilityType).toBe("nightly");
      expect(result.actionLog[0].faction).toBe("wolf");
      expect(result.actionLog[0].turnAdded).toBe(3);
    });

    it("multiple executions increment usage separately", () => {
      // Use a limited ability with max > 1 to allow multiple uses
      const limitedAbility = { ...ability, type: "limited" as const, max: 3 };
      let result = executeAction(
        players,
        actionLog,
        1,
        limitedAbility,
        [2],
        "wolf",
        1,
      );
      result = executeAction(
        result.players,
        result.actionLog,
        1,
        limitedAbility,
        [3],
        "wolf",
        1,
      );
      expect(result.players[0].abilityUsage["a_bite"]).toBe(2);
    });

    it("preserves previous ability usage", () => {
      const player = createInitialPlayers(1)[0];
      player.abilityUsage["a_old"] = 5;
      const result = executeAction([player], [], 1, ability, [2], "wolf", 1);
      expect(result.players[0].abilityUsage["a_old"]).toBe(5);
      expect(result.players[0].abilityUsage["a_bite"]).toBe(1);
    });

    it("appends to existing action log", () => {
      const existing: ActionLog[] = [
        {
          id: "old",
          executionId: "exec_old",
          turnAdded: 1,
          sourceId: 2,
          targetId: 3,
          abilityId: "a_old",
          abilityName: "Old",
          abilityType: "nightly" as const,
          faction: "villager" as const,
          timestamp: Date.now(),
        },
      ];
      const result = executeAction(
        players,
        existing,
        1,
        ability,
        [4],
        "wolf",
        1,
      );
      expect(result.actionLog).toHaveLength(2);
      expect(result.actionLog[0].id).toBe("old");
    });
  });

  describe("undoAction", () => {
    let players: Player[];
    let actionLog: any[];

    beforeEach(() => {
      players = createInitialPlayers(3);
      const ability = {
        id: "a_bite",
        name: "Bite",
        type: "limited" as const,
        max: 3,
        targetCount: 1,
      };
      // First execution with target [2]
      let result = executeAction(players, [], 1, ability, [2], "wolf", 1);
      players = result.players;
      actionLog = result.actionLog;
      // Second execution with target [3]
      result = executeAction(players, actionLog, 1, ability, [3], "wolf", 1);
      players = result.players;
      actionLog = result.actionLog;
    });

    it("removes action from log", () => {
      const actionId = actionLog[0].id;
      const result = undoAction(players, actionLog, actionId);
      expect(result.actionLog).toHaveLength(1);
      expect(result.actionLog[0].id).not.toBe(actionId);
    });

    it("does not decrement usage until last action in group removed", () => {
      const actionId = actionLog[1].id;
      const result = undoAction(players, actionLog, actionId);
      expect(result.players[0].abilityUsage["a_bite"]).toBe(1);
    });

    it("decrements usage when removing last action of execution", () => {
      const actionId = actionLog[0].id;
      let result = undoAction(players, actionLog, actionId);
      result = undoAction(
        result.players,
        result.actionLog,
        result.actionLog[0].id,
      );
      expect(result.players[0].abilityUsage["a_bite"]).toBe(0);
    });

    it("handles nonexistent action gracefully", () => {
      const result = undoAction(players, actionLog, "nonexistent");
      expect(result.players).toEqual(players);
      expect(result.actionLog).toEqual(actionLog);
    });

    it("does not modify other players", () => {
      const actionId = actionLog[0].id;
      const result = undoAction(players, actionLog, actionId);
      expect(result.players[1]).toEqual(players[1]);
      expect(result.players[2]).toEqual(players[2]);
    });

    it("removes all actions from single execution group", () => {
      const execId = actionLog[0].executionId;
      const actionsInGroup = actionLog.filter((a) => a.executionId === execId);
      let result = { players, actionLog };
      actionsInGroup.forEach((a) => {
        result = undoAction(result.players, result.actionLog, a.id);
      });
      // After removing first execution group, should have 1 action left (from second execution)
      expect(result.actionLog).toHaveLength(1);
      // Ability usage should be 1 (only second execution remains)
      expect(result.players[0].abilityUsage["a_bite"]).toBe(1);
    });
  });
});
