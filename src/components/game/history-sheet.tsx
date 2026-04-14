import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../../store/game-store";
import { BottomSheet } from "../common/bottom-sheet";
import { getFactionStyle } from "../../utils/faction-theme";
import { tr } from "../../utils/i18n-helpers";

interface HistorySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  const playerName = (id: number) =>
    players.find((p) => p.id === id)?.name ?? `#${id}`;
  const roleName = (id: string | null) => {
    if (!id) return t("game.villager", "Dân Làng");
    const r = roles.find((role) => role.id === id);
    return r ? tr(t, r.nameKey, r.name) : "?";
  };

  const hasCurrentData =
    actionLog.length > 0 ||
    statusChangeLog.length > 0 ||
    roleChangeLog.length > 0;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t("game.history")}
      icon="fa-book-open"
      fullHeight
    >
      {/* Current turn — live actions with undo */}
      <section aria-label={t("game.turn", { count: nightCount })}>
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full">
            {t("game.turn", { count: nightCount })}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">
            — Current
          </span>
        </div>
        {!hasCurrentData ? (
          <p className="text-sm text-gray-400 dark:text-slate-500 italic pl-2 mb-4">
            {t("game.noHistory")}
          </p>
        ) : (
          <ul className="space-y-1.5 pl-2 mb-4">
            {actionLog.map((action) => {
              const col = getFactionStyle(action.faction);
              return (
                <li
                  key={action.id}
                  className="text-sm flex items-center gap-1.5"
                >
                  <button
                    onClick={() => undoAction(action.id)}
                    className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-200 dark:hover:bg-red-800/60 transition"
                    aria-label={`Undo ${tr(t, action.abilityNameKey, action.abilityName)}`}
                  >
                    <i className="fas fa-undo text-[8px]" />
                  </button>
                  <span className="font-bold text-gray-700 dark:text-slate-300">
                    {playerName(action.sourceId)}
                  </span>
                  <i className="fas fa-arrow-right text-[8px] text-gray-400" />
                  <span className={`font-black ${col.textBright}`}>
                    {tr(t, action.abilityNameKey, action.abilityName)}
                  </span>
                  {action.targetId !== action.sourceId && (
                    <>
                      <i className="fas fa-arrow-right text-[8px] text-gray-400" />
                      <span className="font-bold text-gray-700 dark:text-slate-300">
                        {playerName(action.targetId)}
                      </span>
                    </>
                  )}
                </li>
              );
            })}
            {roleChangeLog.map((log, i) => (
              <li
                key={`role-${i}`}
                className="text-sm text-amber-500 dark:text-amber-400"
              >
                <i className="fas fa-exchange-alt mr-1 text-[10px]" />
                <span className="font-bold">
                  {playerName(log.playerId)}
                </span>{" "}
                {roleName(log.fromRoleId)} → {roleName(log.toRoleId)}
              </li>
            ))}
            {statusChangeLog.map((log, i) => (
              <li
                key={`status-${i}`}
                className={`text-sm font-bold ${log.toStatus ? "text-emerald-500" : "text-red-500"}`}
              >
                <i
                  className={`fas ${log.toStatus ? "fa-heart" : "fa-skull"} mr-1 text-[10px]`}
                />
                {playerName(log.playerId)} —{" "}
                {log.toStatus ? t("game.alive") : t("game.dead")}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Past turns — collapsed, read-only */}
      {gameHistory.length > 0 && (
        <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
          <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2">
            Past Turns
          </p>
          <div className="space-y-2">
            {[...gameHistory].reverse().map((turn) => {
              const isExpanded = expandedTurn === turn.night;
              const totalActions =
                turn.actionLogs.length +
                turn.statusLogs.length +
                turn.roleLogs.length;
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
                    <span className="text-xs font-black text-indigo-500">
                      {t("game.turn", { count: turn.night })}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">
                      {totalActions} actions{" "}
                      <i
                        className={`fas fa-chevron-${isExpanded ? "up" : "down"} ml-1`}
                      />
                    </span>
                  </button>
                  {isExpanded && (
                    <ul className="space-y-1 p-3 bg-white dark:bg-slate-900">
                      {turn.actionLogs.map((action) => {
                        const col = getFactionStyle(action.faction);
                        return (
                          <li
                            key={action.id}
                            className="text-sm flex items-center gap-1.5"
                          >
                            <span className="font-bold text-gray-700 dark:text-slate-300">
                              {playerName(action.sourceId)}
                            </span>
                            <i className="fas fa-arrow-right text-[8px] text-gray-400" />
                            <span className={`font-black ${col.textBright}`}>
                              {tr(t, action.abilityNameKey, action.abilityName)}
                            </span>
                            {action.targetId !== action.sourceId && (
                              <>
                                <i className="fas fa-arrow-right text-[8px] text-gray-400" />
                                <span className="font-bold text-gray-700 dark:text-slate-300">
                                  {playerName(action.targetId)}
                                </span>
                              </>
                            )}
                          </li>
                        );
                      })}
                      {turn.roleLogs.map((log, i) => (
                        <li
                          key={`role-${i}`}
                          className="text-sm text-amber-500 dark:text-amber-400"
                        >
                          <i className="fas fa-exchange-alt mr-1 text-[10px]" />
                          <span className="font-bold">
                            {playerName(log.playerId)}
                          </span>{" "}
                          {roleName(log.fromRoleId)} → {roleName(log.toRoleId)}
                        </li>
                      ))}
                      {turn.statusLogs.map((log, i) => (
                        <li
                          key={`status-${i}`}
                          className={`text-sm font-bold ${log.toStatus ? "text-emerald-500" : "text-red-500"}`}
                        >
                          <i
                            className={`fas ${log.toStatus ? "fa-heart" : "fa-skull"} mr-1 text-[10px]`}
                          />
                          {playerName(log.playerId)} —{" "}
                          {log.toStatus ? t("game.alive") : t("game.dead")}
                        </li>
                      ))}
                    </ul>
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
