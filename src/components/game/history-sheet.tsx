import { useTranslation } from "react-i18next";
import { useGameStore } from "../../store/game-store";
import { BottomSheet } from "../common/bottom-sheet";
import { getFactionStyle } from "../../utils/faction-theme";

interface HistorySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistorySheet({ isOpen, onClose }: HistorySheetProps) {
  const { t } = useTranslation();
  const gameHistory = useGameStore((s) => s.gameHistory);
  const players = useGameStore((s) => s.players);
  const roles = useGameStore((s) => s.roles);

  const playerName = (id: number) =>
    players.find((p) => p.id === id)?.name ?? `#${id}`;
  const roleName = (id: string | null) =>
    id
      ? (roles.find((r) => r.id === id)?.name ?? "?")
      : t("game.villager", "Dân Làng");

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t("game.history", "Lịch Sử")}
      icon="fa-book-open"
      fullHeight
    >
      {gameHistory.length === 0 ? (
        <p className="text-center text-gray-400 dark:text-slate-500 py-8 italic">
          {t("game.noHistory", "Chưa có lịch sử")}
        </p>
      ) : (
        <div className="space-y-4">
          {[...gameHistory].reverse().map((turn) => (
            <section
              key={turn.night}
              aria-label={t("game.turn", { count: turn.night })}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full">
                  {t("game.turn", { count: turn.night })}
                </span>
              </div>
              <ul className="space-y-1 pl-2">
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
                        {action.abilityName}
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
            </section>
          ))}
        </div>
      )}
    </BottomSheet>
  );
}
