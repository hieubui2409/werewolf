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
} from "./game-store-actions";

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
  ) => void;
  undoAction: (actionId: string) => void;
  nextNight: () => void;
  resetGame: () => void;
  flipCard: (id: number) => void;
  setCardViewMode: (mode: CardViewMode) => void;
  setTimerSettings: (settings: TimerSettings) => void;
  deleteCustomTemplate: (templateId: string) => void;
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
      timerSettings: { debate: 120, judgment: 30 },
      cardViewMode: "nameFirst",
      flippedCards: {},

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
                      name: "Ability",
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

      executeAction: (sourceId, ability, targets, roleId) =>
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
          );
          if (result.blocked) return s;
          return { players: result.players, actionLog: result.actionLog };
        }),

      undoAction: (actionId) =>
        set((s) => calcUndoAction(s.players, s.actionLog, actionId)),

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
            const newUsage = { ...p.abilityUsage };
            for (const ab of role.abilities) {
              if (ab.type === "nightly") newUsage[ab.id] = 0;
            }
            return { ...p, abilityUsage: newUsage };
          });
          return {
            gameHistory: [...s.gameHistory, newHistory],
            nightCount: s.nightCount + 1,
            actionLog: s.actionLog.filter((a) => a.abilityType === "limited"),
            statusChangeLog: [],
            roleChangeLog: [],
            players: newPlayers,
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
        set((s) => ({
          roleTemplates: s.roleTemplates.filter((t) => t.id !== templateId),
        })),
    }),
    {
      name: "werewolf-game",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
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
          // v0→v1: backfill missing timestamps
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
        return state as unknown as GameStore;
      },
      onRehydrateStorage: () => {
        return (_state, error) => {
          if (error) {
            console.error("Zustand rehydration failed:", error);
            const reset = confirm(
              "Dữ liệu game bị lỗi. Reset để tiếp tục?\n\n(OK = Reset, Cancel = Giữ nguyên)",
            );
            if (reset) {
              localStorage.removeItem("werewolf-game");
              window.location.reload();
            }
          }
        };
      },
      partialize: (state) => ({
        step: state.step,
        playerCount: state.playerCount,
        players: state.players,
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
