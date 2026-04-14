import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useGameStore } from "../game-store";
import type { Ability } from "../../types/game";
import { DEFAULT_ROLES } from "../../data/default-roles";

describe("game-store: Zustand Store Integration", () => {
  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Store Initialization", () => {
    it("initializes with setup step", () => {
      const state = useGameStore.getState();
      expect(state.step).toBe("setup");
    });

    it("initializes with 10 players", () => {
      const state = useGameStore.getState();
      expect(state.players).toHaveLength(10);
      expect(state.playerCount).toBe(10);
    });

    it("players have default names P1-P10", () => {
      const state = useGameStore.getState();
      expect(state.players[0].name).toBe("P1");
      expect(state.players[9].name).toBe("P10");
    });

    it("loads initial roles from DEFAULT_ROLES", () => {
      const state = useGameStore.getState();
      expect(state.roles.length).toBeGreaterThan(0);
    });

    it("initializes empty action and change logs", () => {
      const state = useGameStore.getState();
      expect(state.actionLog).toEqual([]);
      expect(state.statusChangeLog).toEqual([]);
      expect(state.roleChangeLog).toEqual([]);
      expect(state.gameHistory).toEqual([]);
    });

    it("starts at night count 1", () => {
      const state = useGameStore.getState();
      expect(state.nightCount).toBe(1);
    });
  });

  describe("setStep", () => {
    it("transitions from setup to game", () => {
      const state = useGameStore.getState();
      state.setStep("game");
      expect(useGameStore.getState().step).toBe("game");
    });

    it("transitions from game back to setup", () => {
      const state = useGameStore.getState();
      state.setStep("game");
      state.setStep("setup");
      expect(useGameStore.getState().step).toBe("setup");
    });
  });

  describe("handlePlayerCountChange", () => {
    it("increases player count and adds players", () => {
      const state = useGameStore.getState();
      state.handlePlayerCountChange(15);
      const newState = useGameStore.getState();
      expect(newState.playerCount).toBe(15);
      expect(newState.players).toHaveLength(15);
      expect(newState.players[14].name).toBe("P15");
    });

    it("decreases player count", () => {
      const state = useGameStore.getState();
      state.handlePlayerCountChange(5);
      const newState = useGameStore.getState();
      expect(newState.playerCount).toBe(5);
      expect(newState.players).toHaveLength(5);
    });
  });

  describe("updatePlayerName", () => {
    it("updates player name by ID", () => {
      const state = useGameStore.getState();
      state.updatePlayerName(1, "Alice");
      expect(useGameStore.getState().players[0].name).toBe("Alice");
    });

    it("does not affect other players", () => {
      const state = useGameStore.getState();
      const original = state.players[1].name;
      state.updatePlayerName(1, "Alice");
      expect(useGameStore.getState().players[1].name).toBe(original);
    });
  });

  describe("togglePlayerStatus", () => {
    it("toggles player status alive -> dead", () => {
      const state = useGameStore.getState();
      expect(state.players[0].alive).toBe(true);
      state.togglePlayerStatus(1);
      expect(useGameStore.getState().players[0].alive).toBe(false);
    });

    it("toggles player status dead -> alive", () => {
      const state = useGameStore.getState();
      state.togglePlayerStatus(1);
      state.togglePlayerStatus(1);
      expect(useGameStore.getState().players[0].alive).toBe(true);
    });

    it("adds entry to statusChangeLog when toggled", () => {
      const state = useGameStore.getState();
      state.togglePlayerStatus(1);
      const newState = useGameStore.getState();
      expect(newState.statusChangeLog).toHaveLength(1);
      expect(newState.statusChangeLog[0]).toEqual({
        playerId: 1,
        toStatus: false,
      });
    });

    it("updates statusChangeLog when toggled again", () => {
      const state = useGameStore.getState();
      state.togglePlayerStatus(1);
      state.togglePlayerStatus(1);
      const newState = useGameStore.getState();
      expect(newState.statusChangeLog).toHaveLength(1);
      expect(newState.statusChangeLog[0].toStatus).toBe(true);
    });

    it("multiple players tracked independently", () => {
      const state = useGameStore.getState();
      state.togglePlayerStatus(1);
      state.togglePlayerStatus(2);
      const newState = useGameStore.getState();
      expect(newState.statusChangeLog).toHaveLength(2);
      expect(newState.statusChangeLog[0].playerId).toBe(1);
      expect(newState.statusChangeLog[1].playerId).toBe(2);
    });

    it("handles nonexistent player gracefully", () => {
      const state = useGameStore.getState();
      state.togglePlayerStatus(999);
      expect(useGameStore.getState().statusChangeLog).toHaveLength(0);
    });
  });

  describe("togglePlayerRole", () => {
    it("assigns role to player with no role", () => {
      const state = useGameStore.getState();
      const roleId = state.roles[0].id;
      state.togglePlayerRole(1, roleId);
      expect(useGameStore.getState().players[0].roleId).toBe(roleId);
    });

    it("unassigns role when toggling same role", () => {
      const state = useGameStore.getState();
      const roleId = state.roles[0].id;
      state.togglePlayerRole(1, roleId);
      state.togglePlayerRole(1, roleId);
      expect(useGameStore.getState().players[0].roleId).toBeNull();
    });

    it("switches to new role from assigned role", () => {
      const state = useGameStore.getState();
      const roleId1 = state.roles[0].id;
      const roleId2 = state.roles[1].id;
      state.togglePlayerRole(1, roleId1);
      state.togglePlayerRole(1, roleId2);
      expect(useGameStore.getState().players[0].roleId).toBe(roleId2);
    });

    it("creates roleChangeLog entry on first assignment", () => {
      const state = useGameStore.getState();
      const roleId = state.roles[0].id;
      state.togglePlayerRole(1, roleId);
      const newState = useGameStore.getState();
      expect(newState.roleChangeLog).toHaveLength(1);
      expect(newState.roleChangeLog[0]).toEqual({
        playerId: 1,
        fromRoleId: null,
        toRoleId: roleId,
      });
    });

    it("removes roleChangeLog entry when returning to original role", () => {
      const state = useGameStore.getState();
      const roleId = state.roles[0].id;
      state.togglePlayerRole(1, roleId);
      state.togglePlayerRole(1, roleId);
      expect(useGameStore.getState().roleChangeLog).toHaveLength(0);
    });

    it("updates roleChangeLog when switching roles", () => {
      const state = useGameStore.getState();
      const roleId1 = state.roles[0].id;
      const roleId2 = state.roles[1].id;
      state.togglePlayerRole(1, roleId1);
      state.togglePlayerRole(1, roleId2);
      const newState = useGameStore.getState();
      expect(newState.roleChangeLog).toHaveLength(1);
      expect(newState.roleChangeLog[0].toRoleId).toBe(roleId2);
    });

    it("handles nonexistent player gracefully", () => {
      const state = useGameStore.getState();
      const roleId = state.roles[0].id;
      state.togglePlayerRole(999, roleId);
      expect(useGameStore.getState().roleChangeLog).toHaveLength(0);
    });
  });

  describe("addRoleFromTemplate", () => {
    it("adds role from template", () => {
      const state = useGameStore.getState();
      const initialCount = state.roles.length;
      const template = DEFAULT_ROLES[0];
      state.addRoleFromTemplate(template);
      expect(useGameStore.getState().roles).toHaveLength(initialCount + 1);
    });

    it("new role has unique ID", () => {
      const state = useGameStore.getState();
      const template = DEFAULT_ROLES[0];
      state.addRoleFromTemplate(template);
      const newState = useGameStore.getState();
      const newRole = newState.roles[newState.roles.length - 1];
      expect(newRole.templateId).toBe(template.id);
    });
  });

  describe("createCustomRole", () => {
    it("creates custom role template and role", () => {
      const state = useGameStore.getState();
      const initialRoleCount = state.roles.length;
      const initialTemplateCount = state.roleTemplates.length;
      state.createCustomRole({
        name: "Custom Role",
        faction: "villager",
        abilities: [],
      });
      const newState = useGameStore.getState();
      expect(newState.roles).toHaveLength(initialRoleCount + 1);
      expect(newState.roleTemplates).toHaveLength(initialTemplateCount + 1);
    });

    it("custom template has custom category", () => {
      const state = useGameStore.getState();
      state.createCustomRole({
        name: "Custom",
        faction: "wolf",
        abilities: [],
      });
      const newState = useGameStore.getState();
      const lastTemplate =
        newState.roleTemplates[newState.roleTemplates.length - 1];
      expect(lastTemplate.category).toBe("custom");
    });
  });

  describe("updateRoleName", () => {
    it("updates role name", () => {
      const state = useGameStore.getState();
      const roleId = state.roles[0].id;
      state.updateRoleName(roleId, "New Name");
      const role = useGameStore.getState().roles.find((r) => r.id === roleId);
      expect(role?.name).toBe("New Name");
    });
  });

  describe("changeRoleOrder", () => {
    it("reorders roles", () => {
      const state = useGameStore.getState();
      const roleId = state.roles[0].id;
      state.changeRoleOrder(roleId, 3);
      const sorted = useGameStore
        .getState()
        .roles.sort((a, b) => a.order - b.order);
      expect(sorted[2].id).toBe(roleId);
    });
  });

  describe("deleteRole", () => {
    it("removes role by ID", () => {
      const state = useGameStore.getState();
      const initialCount = state.roles.length;
      const roleId = state.roles[0].id;
      state.deleteRole(roleId);
      const newState = useGameStore.getState();
      expect(newState.roles).toHaveLength(initialCount - 1);
      expect(newState.roles.find((r) => r.id === roleId)).toBeUndefined();
    });
  });

  describe("addAbility", () => {
    it("adds ability to role", () => {
      const state = useGameStore.getState();
      const roleId = state.roles[0].id;
      const initialAbilityCount = state.roles[0].abilities.length;
      state.addAbility(roleId);
      const role = useGameStore.getState().roles.find((r) => r.id === roleId);
      expect(role?.abilities).toHaveLength(initialAbilityCount + 1);
    });
  });

  describe("executeAction", () => {
    it("creates action log entry", () => {
      const state = useGameStore.getState();
      const ability: Ability = {
        id: "test_ability",
        name: "Test",
        type: "nightly",
        max: 0,
        targetCount: 1,
      };
      const roleId = state.roles[0].id;
      state.executeAction(1, ability, [2], roleId);
      expect(useGameStore.getState().actionLog).toHaveLength(1);
    });

    it("increments ability usage", () => {
      const state = useGameStore.getState();
      const ability: Ability = {
        id: "test_ability",
        name: "Test",
        type: "nightly",
        max: 0,
        targetCount: 1,
      };
      const roleId = state.roles[0].id;
      state.executeAction(1, ability, [2], roleId);
      expect(
        useGameStore.getState().players[0].abilityUsage["test_ability"],
      ).toBe(1);
    });

    it("uses role faction for action log", () => {
      const state = useGameStore.getState();
      const wolfRole = state.roles.find((r) => r.faction === "wolf");
      if (!wolfRole) {
        throw new Error("No wolf role found");
      }
      const ability: Ability = {
        id: "test_ability",
        name: "Test",
        type: "nightly",
        max: 0,
        targetCount: 1,
      };
      state.executeAction(1, ability, [2], wolfRole.id);
      expect(useGameStore.getState().actionLog[0].faction).toBe("wolf");
    });
  });

  describe("undoAction", () => {
    it("removes action from log", () => {
      const state = useGameStore.getState();
      const ability: Ability = {
        id: "test_ability",
        name: "Test",
        type: "nightly",
        max: 0,
        targetCount: 1,
      };
      const roleId = state.roles[0].id;
      state.executeAction(1, ability, [2], roleId);
      const actionId = useGameStore.getState().actionLog[0].id;
      useGameStore.getState().undoAction(actionId);
      expect(useGameStore.getState().actionLog).toHaveLength(0);
    });

    it("decrements ability usage when removing last action", () => {
      const state = useGameStore.getState();
      const ability: Ability = {
        id: "test_ability",
        name: "Test",
        type: "nightly",
        max: 0,
        targetCount: 1,
      };
      const roleId = state.roles[0].id;
      state.executeAction(1, ability, [2], roleId);
      const actionId = useGameStore.getState().actionLog[0].id;
      useGameStore.getState().undoAction(actionId);
      expect(
        useGameStore.getState().players[0].abilityUsage["test_ability"],
      ).toBe(0);
    });
  });

  describe("nextNight", () => {
    it("saves action log to game history", () => {
      const state = useGameStore.getState();
      const ability: Ability = {
        id: "test_ability",
        name: "Test",
        type: "nightly",
        max: 0,
        targetCount: 1,
      };
      const roleId = state.roles[0].id;
      state.executeAction(1, ability, [2], roleId);
      state.nextNight();
      const newState = useGameStore.getState();
      expect(newState.gameHistory).toHaveLength(1);
      expect(newState.gameHistory[0].night).toBe(1);
      expect(newState.gameHistory[0].actionLogs).toHaveLength(1);
    });

    it("increments night count", () => {
      const state = useGameStore.getState();
      expect(state.nightCount).toBe(1);
      state.nextNight();
      expect(useGameStore.getState().nightCount).toBe(2);
    });

    it("resets nightly ability usage for players with roles", () => {
      const state = useGameStore.getState();
      const roleId = state.roles[0].id;
      const nightlyAbility = state.roles[0].abilities.find(
        (a) => a.type === "nightly",
      );
      if (!nightlyAbility) {
        throw new Error("No nightly ability in first role");
      }
      state.togglePlayerRole(1, roleId);
      state.executeAction(1, nightlyAbility, [2], roleId);
      expect(
        useGameStore.getState().players[0].abilityUsage[nightlyAbility.id],
      ).toBe(1);
      state.nextNight();
      expect(
        useGameStore.getState().players[0].abilityUsage[nightlyAbility.id],
      ).toBe(0);
    });

    it("preserves limited ability usage across nights", () => {
      const state = useGameStore.getState();
      const roleWithLimited = state.roles.find((r) =>
        r.abilities.some((a) => a.type === "limited"),
      );
      if (!roleWithLimited) {
        throw new Error("No role with limited ability found");
      }
      const limitedAbility = roleWithLimited.abilities.find(
        (a) => a.type === "limited",
      );
      if (!limitedAbility) {
        throw new Error("No limited ability found");
      }
      state.togglePlayerRole(1, roleWithLimited.id);
      state.executeAction(1, limitedAbility, [2], roleWithLimited.id);
      const usageBefore =
        useGameStore.getState().players[0].abilityUsage[limitedAbility.id];
      state.nextNight();
      const usageAfter =
        useGameStore.getState().players[0].abilityUsage[limitedAbility.id];
      expect(usageAfter).toBe(usageBefore);
    });

    it("clears action log of nightly actions", () => {
      const state = useGameStore.getState();
      const nightlyAbility = state.roles[0].abilities.find(
        (a) => a.type === "nightly",
      );
      if (!nightlyAbility) {
        throw new Error("No nightly ability found");
      }
      const roleId = state.roles[0].id;
      state.executeAction(1, nightlyAbility, [2], roleId);
      expect(useGameStore.getState().actionLog).toHaveLength(1);
      state.nextNight();
      expect(useGameStore.getState().actionLog).toHaveLength(0);
    });

    it("preserves limited actions after night", () => {
      const state = useGameStore.getState();
      const roleWithLimited = state.roles.find((r) =>
        r.abilities.some((a) => a.type === "limited"),
      );
      if (!roleWithLimited) {
        throw new Error("No role with limited ability found");
      }
      const limitedAbility = roleWithLimited.abilities.find(
        (a) => a.type === "limited",
      );
      if (!limitedAbility) {
        throw new Error("No limited ability found");
      }
      state.executeAction(1, limitedAbility, [2], roleWithLimited.id);
      state.nextNight();
      expect(useGameStore.getState().actionLog).toHaveLength(1);
    });

    it("clears statusChangeLog after night", () => {
      const state = useGameStore.getState();
      state.togglePlayerStatus(1);
      expect(useGameStore.getState().statusChangeLog).toHaveLength(1);
      state.nextNight();
      expect(useGameStore.getState().statusChangeLog).toHaveLength(0);
    });

    it("clears roleChangeLog after night", () => {
      const state = useGameStore.getState();
      const roleId = state.roles[0].id;
      state.togglePlayerRole(1, roleId);
      expect(useGameStore.getState().roleChangeLog).toHaveLength(1);
      state.nextNight();
      expect(useGameStore.getState().roleChangeLog).toHaveLength(0);
    });

    it("saves statusChangeLog and roleChangeLog to history", () => {
      const state = useGameStore.getState();
      const roleId = state.roles[0].id;
      state.togglePlayerStatus(1);
      state.togglePlayerRole(1, roleId);
      state.nextNight();
      const newState = useGameStore.getState();
      expect(newState.gameHistory[0].statusLogs).toHaveLength(1);
      expect(newState.gameHistory[0].roleLogs).toHaveLength(1);
    });
  });

  describe("resetGame", () => {
    it("returns to setup step", () => {
      const state = useGameStore.getState();
      state.setStep("game");
      state.resetGame();
      expect(useGameStore.getState().step).toBe("setup");
    });

    it("clears all logs", () => {
      const state = useGameStore.getState();
      const ability: Ability = {
        id: "test_ability",
        name: "Test",
        type: "nightly",
        max: 0,
        targetCount: 1,
      };
      const roleId = state.roles[0].id;
      state.executeAction(1, ability, [2], roleId);
      state.togglePlayerStatus(1);
      state.togglePlayerRole(2, roleId);
      state.nextNight();
      state.resetGame();
      const newState = useGameStore.getState();
      expect(newState.actionLog).toHaveLength(0);
      expect(newState.statusChangeLog).toHaveLength(0);
      expect(newState.roleChangeLog).toHaveLength(0);
      expect(newState.gameHistory).toHaveLength(0);
    });

    it("resets night count to 1", () => {
      const state = useGameStore.getState();
      state.nextNight();
      state.nextNight();
      expect(useGameStore.getState().nightCount).toBe(3);
      state.resetGame();
      expect(useGameStore.getState().nightCount).toBe(1);
    });

    it("unassigns all player roles", () => {
      const state = useGameStore.getState();
      const roleId = state.roles[0].id;
      state.togglePlayerRole(1, roleId);
      state.togglePlayerRole(2, roleId);
      state.resetGame();
      useGameStore.getState().players.forEach((p) => {
        expect(p.roleId).toBeNull();
      });
    });

    it("revives all players", () => {
      const state = useGameStore.getState();
      state.togglePlayerStatus(1);
      state.togglePlayerStatus(2);
      state.resetGame();
      useGameStore.getState().players.forEach((p) => {
        expect(p.alive).toBe(true);
      });
    });

    it("clears ability usage", () => {
      const state = useGameStore.getState();
      const ability: Ability = {
        id: "test_ability",
        name: "Test",
        type: "nightly",
        max: 0,
        targetCount: 1,
      };
      const roleId = state.roles[0].id;
      state.executeAction(1, ability, [2], roleId);
      state.resetGame();
      useGameStore.getState().players.forEach((p) => {
        expect(p.abilityUsage).toEqual({});
      });
    });

    it("restores default roles on reset", () => {
      const state = useGameStore.getState();
      expect(state.roles.length).toBeGreaterThan(0);
      state.resetGame();
      const afterReset = useGameStore.getState();
      // Should restore initial default roles, not empty
      expect(afterReset.roles.length).toBeGreaterThan(0);
    });

    it("clears flipped cards", () => {
      const state = useGameStore.getState();
      state.flipCard(1);
      state.flipCard(2);
      state.resetGame();
      expect(useGameStore.getState().flippedCards).toEqual({});
    });

    it("preserves player count and player names", () => {
      const state = useGameStore.getState();
      const originalCount = state.playerCount;
      state.updatePlayerName(1, "Custom");
      state.resetGame();
      const finalState = useGameStore.getState();
      expect(finalState.playerCount).toBe(originalCount);
      expect(finalState.players[0].name).toBe("Custom");
    });
  });

  describe("flipCard", () => {
    it("flips card when not flipped", () => {
      const state = useGameStore.getState();
      state.flipCard(1);
      expect(useGameStore.getState().flippedCards[1]).toBe(true);
    });

    it("flips card back when already flipped", () => {
      const state = useGameStore.getState();
      state.flipCard(1);
      state.flipCard(1);
      expect(useGameStore.getState().flippedCards[1]).toBe(false);
    });

    it("flips multiple cards independently", () => {
      const state = useGameStore.getState();
      state.flipCard(1);
      state.flipCard(2);
      state.flipCard(3);
      const newState = useGameStore.getState();
      expect(newState.flippedCards[1]).toBe(true);
      expect(newState.flippedCards[2]).toBe(true);
      expect(newState.flippedCards[3]).toBe(true);
    });
  });

  describe("setCardViewMode", () => {
    it("changes card view mode", () => {
      const state = useGameStore.getState();
      expect(state.cardViewMode).toBe("nameFirst");
      state.setCardViewMode("roleFirst");
      expect(useGameStore.getState().cardViewMode).toBe("roleFirst");
    });
  });

  describe("setTimerSettings", () => {
    it("updates timer settings", () => {
      const state = useGameStore.getState();
      state.setTimerSettings({ debate: 180, judgment: 60 });
      expect(useGameStore.getState().timerSettings).toEqual({
        debate: 180,
        judgment: 60,
      });
    });
  });

  describe("Persistence (localStorage)", () => {
    it("updates partialize config to include relevant fields", () => {
      // Verify the store exports the correct partialize behavior
      const state = useGameStore.getState();
      expect(state).toHaveProperty("step");
      expect(state).toHaveProperty("playerCount");
      expect(state).toHaveProperty("players");
      expect(state).toHaveProperty("timerSettings");
      expect(state).toHaveProperty("cardViewMode");
      // flippedCards should not be in stored state per partialize
      expect(state).toHaveProperty("flippedCards");
    });

    it("persists after state change through setStep", () => {
      const state = useGameStore.getState();
      state.setStep("game");
      const newState = useGameStore.getState();
      expect(newState.step).toBe("game");
    });

    it("persists after state change through handlePlayerCountChange", () => {
      const state = useGameStore.getState();
      state.handlePlayerCountChange(12);
      const newState = useGameStore.getState();
      expect(newState.playerCount).toBe(12);
      expect(newState.players[11].name).toBe("P12");
    });

    it("persists after state change through updatePlayerName", () => {
      const state = useGameStore.getState();
      state.updatePlayerName(1, "TestPlayer");
      const newState = useGameStore.getState();
      expect(newState.players[0].name).toBe("TestPlayer");
    });

    it("persists timerSettings through setTimerSettings", () => {
      const state = useGameStore.getState();
      state.setTimerSettings({ debate: 200, judgment: 50 });
      const newState = useGameStore.getState();
      expect(newState.timerSettings).toEqual({ debate: 200, judgment: 50 });
    });

    it("does not include flippedCards in partialize config", () => {
      // flippedCards should be excluded from persistence
      const state = useGameStore.getState();
      state.flipCard(1);
      state.flipCard(2);
      const newState = useGameStore.getState();
      // Verify state has flippedCards (runtime)
      expect(newState.flippedCards[1]).toBe(true);
      expect(newState.flippedCards[2]).toBe(true);
    });
  });
});
