import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Player,
  RoleTemplate,
  GameRole,
  Ability,
  ActionLog,
  TurnHistory,
  TimerSettings,
  CardViewMode,
  Faction,
} from "../types/game";
import { DEFAULT_ROLES } from "../data/default-roles";
import { uid } from "../utils/uid";
import i18n from "../i18n";
import {
  createInitialPlayers,
  createInitialRoles,
  handlePlayerCountChange as calcPlayerCount,
  cleanupPlayerReferences,
  addRoleFromTemplate as calcAddRole,
  createCustomRole as calcCreateCustomRole,
  changeRoleOrder as calcChangeOrder,
  executeAction as calcExecuteAction,
  undoAction as calcUndoAction,
  mergeRoleTemplates,
} from "./game-store-actions";
import { type UndoEntry, pushUndo, popUndo } from "./game-store-undo-history";

interface GameStore {
  step: "setup" | "game";
  playerCount: number;
  players: Player[];
  roleTemplates: RoleTemplate[];
  roles: GameRole[];
  actionLog: ActionLog[];
  statusChangeLog: {
    playerId: number;
    toStatus: boolean;
    timestamp: number;
  }[];
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
  redoStack: UndoEntry[];

  setStep: (step: "setup" | "game") => void;
  handlePlayerCountChange: (newCount: number) => void;
  updatePlayerName: (id: number, name: string) => void;
  togglePlayerStatus: (id: number) => void;
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
    field: keyof Ability,
    value: string | number,
  ) => void;
  deleteAbility: (roleId: string, abilityId: string) => void;
  togglePlayerRole: (playerId: number, targetRoleId: string) => void;
  executeAction: (
    sourceId: number,
    ability: Ability,
    targets: number[],
    roleId: string,
    force?: boolean,
  ) => void;
  undoAction: (actionId: string) => void;
  redoAction: () => void;
  nextNight: () => void;
  resetGame: () => void;
  flipCard: (id: number) => void;
  setCardViewMode: (mode: CardViewMode) => void;
  setTimerSettings: (settings: TimerSettings) => void;
  deleteCustomTemplate: (templateId: string) => void;
}

function getInitialState(): Partial<GameStore> {
  return {
    step: "setup",
    playerCount: 10,
    players: createInitialPlayers(10),
    roleTemplates: [...DEFAULT_ROLES],
    roles: createInitialRoles(),
    actionLog: [],
    statusChangeLog: [],
    roleChangeLog: [],
    gameHistory: [],
    nightCount: 1,
    timerSettings: { debate: 120, judgment: 30, muted: false },
    cardViewMode: "nameFirst",
    flippedCards: {},
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      step: "setup",
      playerCount: 10,
      players: createInitialPlayers(10),
      roleTemplates: [...DEFAULT_ROLES],
      roles: createInitialRoles(),
      actionLog: [],
      statusChangeLog: [],
      roleChangeLog: [],
      gameHistory: [],
      nightCount: 1,
      timerSettings: { debate: 120, judgment: 30, muted: false },
      cardViewMode: "nameFirst",
      flippedCards: {},
      redoStack: [],

      setStep: (step) => set({ step }),

      handlePlayerCountChange: (newCount) =>
        set((s) => {
          const newPlayers = calcPlayerCount(s.players, newCount);
          if (newCount < s.players.length) {
            const removedIds = new Set(
              s.players.slice(newCount).map((p) => p.id),
            );
            const cleaned = cleanupPlayerReferences(
              removedIds,
              s.actionLog,
              s.statusChangeLog,
              s.roleChangeLog,
              s.flippedCards,
            );
            return { playerCount: newCount, players: newPlayers, ...cleaned };
          }
          return { playerCount: newCount, players: newPlayers };
        }),

      updatePlayerName: (id, name) =>
        set((s) => ({
          players: s.players.map((p) => (p.id === id ? { ...p, name } : p)),
        })),

      togglePlayerStatus: (id) =>
        set((s) => {
          const player = s.players.find((p) => p.id === id);
          if (!player) return s;
          const newStatus = !player.alive;
          const newPlayers = s.players.map((p) =>
            p.id === id ? { ...p, alive: newStatus } : p,
          );
          const existingIdx = s.statusChangeLog.findIndex(
            (l) => l.playerId === id,
          );
          const now = Date.now();
          const newLog =
            existingIdx >= 0
              ? s.statusChangeLog.map((l, i) =>
                  i === existingIdx
                    ? { playerId: id, toStatus: newStatus, timestamp: now }
                    : l,
                )
              : [
                  ...s.statusChangeLog,
                  { playerId: id, toStatus: newStatus, timestamp: now },
                ];
          return { players: newPlayers, statusChangeLog: newLog };
        }),

      addRoleFromTemplate: (template) =>
        set((s) => ({ roles: calcAddRole(s.roles, template) })),

      createCustomRole: (draft) =>
        set((s) => {
          const result = calcCreateCustomRole(s.roleTemplates, s.roles, draft);
          return { roleTemplates: result.templates, roles: result.roles };
        }),

      updateRoleName: (id, name) =>
        set((s) => ({
          roles: s.roles.map((r) => (r.id === id ? { ...r, name } : r)),
        })),

      changeRoleOrder: (roleId, newPosition) =>
        set((s) => ({ roles: calcChangeOrder(s.roles, roleId, newPosition) })),

      deleteRole: (id) =>
        set((s) => ({
          roles: s.roles.filter((r) => r.id !== id),
          players: s.players.map((p) =>
            p.roleId === id ? { ...p, roleId: null } : p,
          ),
          roleChangeLog: s.roleChangeLog.filter(
            (l) => l.fromRoleId !== id && l.toRoleId !== id,
          ),
        })),

      addAbility: (roleId) =>
        set((s) => ({
          roles: s.roles.map((r) =>
            r.id === roleId
              ? {
                  ...r,
                  abilities: [
                    ...r.abilities,
                    {
                      id: `ab_${uid()}`,
                      name: i18n.t("setup.defaultAbilityName", "Ability"),
                      type: "nightly" as const,
                      max: 1,
                      targetCount: 1,
                    },
                  ],
                }
              : r,
          ),
        })),

      updateAbility: (roleId, abilityId, field, value) =>
        set((s) => ({
          roles: s.roles.map((r) =>
            r.id === roleId
              ? {
                  ...r,
                  abilities: r.abilities.map((a) =>
                    a.id === abilityId ? { ...a, [field]: value } : a,
                  ),
                }
              : r,
          ),
        })),

      deleteAbility: (roleId, abilityId) =>
        set((s) => ({
          roles: s.roles.map((r) =>
            r.id === roleId
              ? {
                  ...r,
                  abilities: r.abilities.filter((a) => a.id !== abilityId),
                }
              : r,
          ),
        })),

      togglePlayerRole: (playerId, targetRoleId) =>
        set((s) => {
          const player = s.players.find((p) => p.id === playerId);
          if (!player) return s;
          const newRoleId =
            player.roleId === targetRoleId ? null : targetRoleId;
          const existing = s.roleChangeLog.find((l) => l.playerId === playerId);
          const now = Date.now();
          let newLog;
          if (existing) {
            if (existing.fromRoleId === newRoleId)
              newLog = s.roleChangeLog.filter((l) => l.playerId !== playerId);
            else
              newLog = s.roleChangeLog.map((l) =>
                l.playerId === playerId
                  ? { ...l, toRoleId: newRoleId, timestamp: now }
                  : l,
              );
          } else {
            newLog = [
              ...s.roleChangeLog,
              {
                playerId,
                fromRoleId: player.roleId,
                toRoleId: newRoleId,
                timestamp: now,
              },
            ];
          }
          return {
            players: s.players.map((p) =>
              p.id === playerId ? { ...p, roleId: newRoleId } : p,
            ),
            roleChangeLog: newLog,
          };
        }),

      executeAction: (sourceId, ability, targets, roleId, force = false) =>
        set((s) => {
          const role = s.roles.find((r) => r.id === roleId);
          const faction = role?.faction ?? "villager";
          const result = calcExecuteAction(
            s.players,
            s.actionLog,
            sourceId,
            ability,
            targets,
            faction,
            s.nightCount,
            force,
          );
          if (result.blocked) return s;
          return {
            players: result.players,
            actionLog: result.actionLog,
            redoStack: [],
          };
        }),

      undoAction: (actionId) =>
        set((s) => {
          const targetAction = s.actionLog.find((a) => a.id === actionId);
          if (!targetAction) return s;
          const removedActions = s.actionLog.filter(
            (a) => a.executionId === targetAction.executionId,
          );
          if (removedActions.length === 0) return s;

          const result = calcUndoAction(s.players, s.actionLog, actionId);
          if (result.players === s.players) return s;

          const usageDecrements: Record<number, Record<string, number>> = {};
          const src = targetAction.sourceId;
          if (!usageDecrements[src]) usageDecrements[src] = {};
          usageDecrements[src][targetAction.abilityId] = 1;

          const redoEntry: UndoEntry = {
            type: "action_undo",
            actionId,
            executionId: targetAction.executionId,
            removedActions,
            usageDecrements,
          };

          return {
            ...result,
            redoStack: pushUndo(s.redoStack, redoEntry),
          };
        }),

      redoAction: () =>
        set((s) => {
          const { entry, remaining } = popUndo(s.redoStack);
          if (!entry) return s;

          const newActionLog = [...s.actionLog, ...entry.removedActions];
          const newPlayers = s.players.map((p) => {
            const decrements = entry.usageDecrements[p.id];
            if (!decrements) return p;
            const newUsage = { ...p.abilityUsage };
            for (const [abilityId, count] of Object.entries(decrements)) {
              newUsage[abilityId] = (newUsage[abilityId] ?? 0) + count;
            }
            return { ...p, abilityUsage: newUsage };
          });

          return {
            actionLog: newActionLog,
            players: newPlayers,
            redoStack: remaining,
          };
        }),

      nextNight: () =>
        set((s) => {
          const actionsThisTurn = s.actionLog.filter(
            (a) => a.turnAdded === s.nightCount,
          );
          const newHistory: TurnHistory = {
            night: s.nightCount,
            endedAt: Date.now(),
            actionLogs: actionsThisTurn,
            statusLogs: [...s.statusChangeLog],
            roleLogs: [...s.roleChangeLog],
          };
          // Reset nightly ability usage — O(P) with pre-built role map
          const roleById = new Map(s.roles.map((r) => [r.id, r]));
          const newPlayers = s.players.map((p) => {
            if (!p.roleId) return p;
            const role = roleById.get(p.roleId);
            if (!role) return p;
            // BUG-03: Rebuild from scratch to remove stale keys
            const newUsage: Record<string, number> = {};
            for (const ab of role.abilities) {
              newUsage[ab.id] =
                ab.type === "nightly" ? 0 : (p.abilityUsage[ab.id] ?? 0);
            }
            return { ...p, abilityUsage: newUsage };
          });
          return {
            gameHistory: [...s.gameHistory, newHistory],
            nightCount: s.nightCount + 1,
            actionLog: [],
            statusChangeLog: [],
            roleChangeLog: [],
            players: newPlayers,
            redoStack: [],
          };
        }),

      resetGame: () =>
        set((s) => ({
          step: "setup",
          actionLog: [],
          statusChangeLog: [],
          roleChangeLog: [],
          gameHistory: [],
          nightCount: 1,
          undoStack: [],
          redoStack: [],
          players: s.players.map((p) => ({
            ...p,
            roleId: null,
            alive: true,
            abilityUsage: {},
          })),
          roles: createInitialRoles(),
          flippedCards: {},
        })),

      flipCard: (id) =>
        set((s) => {
          const current = s.flippedCards[id];
          if (current) {
            const { [id]: _, ...rest } = s.flippedCards;
            return { flippedCards: rest };
          }
          return { flippedCards: { ...s.flippedCards, [id]: true } };
        }),

      setCardViewMode: (mode) => set({ cardViewMode: mode }),
      setTimerSettings: (settings) => set({ timerSettings: settings }),
      deleteCustomTemplate: (templateId) =>
        set((s) => {
          const orphanRoleIds = s.roles
            .filter((r) => r.templateId === templateId)
            .map((r) => r.id);
          const orphanSet = new Set(orphanRoleIds);
          return {
            roleTemplates: s.roleTemplates.filter((t) => t.id !== templateId),
            roles: s.roles.filter((r) => r.templateId !== templateId),
            players: s.players.map((p) =>
              p.roleId && orphanSet.has(p.roleId) ? { ...p, roleId: null } : p,
            ),
            roleChangeLog: s.roleChangeLog.filter(
              (l) =>
                !orphanSet.has(l.fromRoleId ?? "") &&
                !orphanSet.has(l.toRoleId ?? ""),
            ),
          };
        }),
    }),
    {
      name: "werewolf-game",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        try {
          const state = persisted as Record<string, unknown>;
          if (!state || typeof state !== "object") return getInitialState();
          if (!Array.isArray(state.players)) return getInitialState();
          if (typeof state.nightCount !== "number") return getInitialState();

          if (version === 0 || version === undefined) {
            // v0→v1: convert numeric executionId → string
            const actionLog = state.actionLog as
              | Array<Record<string, unknown>>
              | undefined;
            actionLog?.forEach((entry) => {
              if (typeof entry.executionId === "number") {
                entry.executionId = String(entry.executionId);
              }
            });
            const gameHistory = state.gameHistory as
              | Array<Record<string, unknown>>
              | undefined;
            gameHistory?.forEach((turn) => {
              const logs = turn.actionLogs as
                | Array<Record<string, unknown>>
                | undefined;
              logs?.forEach((entry) => {
                if (typeof entry.executionId === "number") {
                  entry.executionId = String(entry.executionId);
                }
              });
            });
            const now = Date.now();
            const statusLog = state.statusChangeLog as
              | Array<Record<string, unknown>>
              | undefined;
            statusLog?.forEach((e) => {
              if (e.timestamp == null) e.timestamp = now;
            });
            const roleLog = state.roleChangeLog as
              | Array<Record<string, unknown>>
              | undefined;
            roleLog?.forEach((e) => {
              if (e.timestamp == null) e.timestamp = now;
            });
          }
          // v1→v2: roleTemplates now persisted — merge handled in onRehydrateStorage
          return state as unknown as GameStore;
        } catch {
          return getInitialState();
        }
      },
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Zustand rehydration failed:", error);
            const resetKey = "werewolf-reset-guard";
            if (sessionStorage.getItem(resetKey)) {
              console.error("Reset already attempted this session, skipping");
              sessionStorage.removeItem(resetKey);
              return;
            }
            sessionStorage.setItem(resetKey, "1");
            localStorage.removeItem("werewolf-game");
            window.location.reload();
            return;
          }
          // Merge persisted roleTemplates with current defaults
          if (state) {
            const merged = mergeRoleTemplates(
              state.roleTemplates,
              DEFAULT_ROLES,
            );
            useGameStore.setState({ roleTemplates: merged });
          }
        };
      },
      partialize: (state) => ({
        step: state.step,
        playerCount: state.playerCount,
        players: state.players,
        roleTemplates: state.roleTemplates,
        roles: state.roles,
        actionLog: state.actionLog,
        statusChangeLog: state.statusChangeLog,
        roleChangeLog: state.roleChangeLog,
        gameHistory: state.gameHistory.slice(-50),
        nightCount: state.nightCount,
        timerSettings: state.timerSettings,
        cardViewMode: state.cardViewMode,
      }),
    },
  ),
);
