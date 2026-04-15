import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../../store/game-store";
import { BottomSheet } from "../common/bottom-sheet";
import { getFactionStyle } from "../../utils/faction-theme";
import { tr } from "../../utils/i18n-helpers";
import type { ActionLog } from "../../types/game";

interface HistorySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

type HistoryRow =
  | { kind: "action"; data: ActionLog; ts: number }
  | {
      kind: "status";
      data: { playerId: number; toStatus: boolean; timestamp: number };
      ts: number;
    }
  | {
      kind: "role";
      data: {
        playerId: number;
        fromRoleId: string | null;
        toRoleId: string | null;
        timestamp: number;
      };
      ts: number;
    };

export function HistorySheet({ isOpen, onClose }: HistorySheetProps) {
  const { t } = useTranslation();
  const gameHistory = useGameStore((s) => s.gameHistory);
  const actionLog = useGameStore((s) => s.actionLog);
  const statusChangeLog = useGameStore((s) => s.statusChangeLog);
  const roleChangeLog = useGameStore((s) => s.roleChangeLog);
  const players = useGameStore((s) => s.players);
  const roles = useGameStore((s) => s.roles);
  const nightCount = useGameStore((s) => s.nightCount);
  const undoAction = useGameStore((s) => s.undoAction);

  const [expandedTurn, setExpandedTurn] = useState<number | null>(null);

  const fmt = (ts: number) => {
    if (!ts) return "";
    const d = new Date(ts);
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    const ss = d.getSeconds().toString().padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const fmtDate = (ts: number) => {
    if (!ts) return "";
    const d = new Date(ts);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
  };

  const pName = (id: number) =>
    players.find((p) => p.id === id)?.name ?? `#${id}`;
  const rName = (id: string | null) => {
    if (!id) return t("game.villager", "Dân Làng");
    const r = roles.find((role) => role.id === id);
    return r ? tr(t, r.nameKey, r.name) : "?";
  };

  // Merge current turn logs into sorted rows
  const buildCurrentRows = (): HistoryRow[] => {
    const rows: HistoryRow[] = [
      ...actionLog.map((a) => ({
        kind: "action" as const,
        data: a,
        ts: a.timestamp,
      })),
      ...statusChangeLog.map((s) => ({
        kind: "status" as const,
        data: s,
        ts: s.timestamp,
      })),
      ...roleChangeLog.map((r) => ({
        kind: "role" as const,
        data: r,
        ts: r.timestamp,
      })),
    ];
    return rows.sort((a, b) => a.ts - b.ts);
  };

  // Merge past turn logs into sorted rows
  const buildPastRows = (turn: (typeof gameHistory)[0]): HistoryRow[] => {
    const rows: HistoryRow[] = [
      ...turn.actionLogs.map((a) => ({
        kind: "action" as const,
        data: a,
        ts: a.timestamp,
      })),
      ...turn.statusLogs.map((s) => ({
        kind: "status" as const,
        data: s,
        ts: s.timestamp,
      })),
      ...turn.roleLogs.map((r) => ({
        kind: "role" as const,
        data: r,
        ts: r.timestamp,
      })),
    ];
    return rows.sort((a, b) => a.ts - b.ts);
  };

  const currentRows = buildCurrentRows();

  const renderRow = (row: HistoryRow, canUndo: boolean) => {
    if (row.kind === "action") {
      const action = row.data;
      const col = getFactionStyle(action.faction);
      return (
        <tr
          key={action.id}
          className="border-b border-gray-100 dark:border-slate-800 last:border-0"
        >
          {/* Time */}
          <td className="py-1.5 pr-2 text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap align-middle">
            {fmt(action.timestamp)}
          </td>
          {/* Event */}
          <td className="py-1.5 pr-2 align-middle">
            <div className="flex items-center flex-wrap text-xs">
              <span className="font-bold text-gray-700 dark:text-slate-300">
                {pName(action.sourceId)}
              </span>
              <span className="text-[7px] text-gray-400 mx-2">
                <i className="fas fa-arrow-right" />
              </span>
              <span className={`font-black ${col.textBright}`}>
                {tr(t, action.abilityNameKey, action.abilityName)}
              </span>
              {action.targetId !== action.sourceId && (
                <>
                  <span className="text-[7px] text-gray-400 px-1.5">
                    <i className="fas fa-arrow-right" />
                  </span>
                  <span className="font-bold text-gray-700 dark:text-slate-300">
                    {pName(action.targetId)}
                  </span>
                </>
              )}
            </div>
          </td>
          {/* Undo */}
          {canUndo && (
            <td className="py-1.5 align-middle text-right">
              <button
                onClick={() => undoAction(action.id)}
                className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 inline-flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800/60 transition"
                aria-label="Undo"
              >
                <i className="fas fa-undo text-[7px]" />
              </button>
            </td>
          )}
        </tr>
      );
    }

    if (row.kind === "status") {
      const log = row.data;
      const color = log.toStatus ? "text-emerald-500" : "text-red-500";
      return (
        <tr
          key={`s-${log.playerId}-${log.timestamp}`}
          className="border-b border-gray-100 dark:border-slate-800 last:border-0"
        >
          <td className="py-1.5 pr-2 text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap align-middle">
            {fmt(log.timestamp)}
          </td>
          <td
            className={`py-1.5 pr-2 text-xs font-bold align-middle ${color}`}
            colSpan={canUndo ? 1 : undefined}
          >
            <i
              className={`fas ${log.toStatus ? "fa-heart" : "fa-skull"} mr-2 text-[9px]`}
            />
            {pName(log.playerId)} —{" "}
            {log.toStatus ? t("game.alive") : t("game.dead")}
          </td>
          {canUndo && <td className="py-1.5" />}
        </tr>
      );
    }

    // role
    const log = row.data;
    return (
      <tr
        key={`r-${log.playerId}-${log.timestamp}`}
        className="border-b border-gray-100 dark:border-slate-800 last:border-0"
      >
        <td className="py-1.5 pr-2 text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap align-middle">
          {fmt(log.timestamp)}
        </td>
        <td
          className="py-1.5 pr-2 text-xs text-amber-500 dark:text-amber-400 font-bold align-middle"
          colSpan={canUndo ? 1 : undefined}
        >
          <i className="fas fa-exchange-alt mr-2 text-[9px]" />
          {pName(log.playerId)} {rName(log.fromRoleId)} → {rName(log.toRoleId)}
        </td>
        {canUndo && <td className="py-1.5" />}
      </tr>
    );
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t("game.history")}
      icon="fa-book-open"
      fullHeight
    >
      {/* Current turn */}
      <section aria-label={t("game.turn", { count: nightCount })}>
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full">
            {t("game.turn", { count: nightCount })}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">
            — Current
          </span>
        </div>
        {currentRows.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-slate-500 italic pl-2 mb-4">
            {t("game.noHistory")}
          </p>
        ) : (
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left">
              <tbody>{currentRows.map((row) => renderRow(row, true))}</tbody>
            </table>
          </div>
        )}
      </section>

      {/* Past turns */}
      {gameHistory.length > 0 && (
        <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
          <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2">
            Past Turns
          </p>
          <div className="space-y-2">
            {[...gameHistory].reverse().map((turn) => {
              const isExpanded = expandedTurn === turn.night;
              const rows = buildPastRows(turn);
              return (
                <div
                  key={turn.night}
                  className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedTurn(isExpanded ? null : turn.night)
                    }
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-slate-800/50"
                    aria-expanded={isExpanded}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-black text-indigo-500">
                        {t("game.turn", { count: turn.night })}
                      </span>
                      {turn.endedAt && (
                        <span className="text-[10px] text-gray-400 dark:text-slate-500">
                          {fmtDate(turn.endedAt)} {fmt(turn.endedAt)}
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">
                      {rows.length} actions{" "}
                      <i
                        className={`fas fa-chevron-${isExpanded ? "up" : "down"} ml-1`}
                      />
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="overflow-x-auto p-3 bg-white dark:bg-slate-900">
                      <table className="w-full text-left">
                        <tbody>
                          {rows.map((row) => renderRow(row, false))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
