import { useTranslation } from "react-i18next";
import { useGameStore } from "../../store/game-store";
import { usePlayerActionMap } from "../../store/game-store-selectors";
import { BottomSheet } from "../common/bottom-sheet";
import { getFactionStyle } from "../../utils/faction-theme";
import { tr } from "../../utils/i18n-helpers";

interface PlayerActionSheetProps {
  playerId: number | null;
  onClose: () => void;
}

export function PlayerActionSheet({
  playerId,
  onClose,
}: PlayerActionSheetProps) {
  const { t } = useTranslation();
  const players = useGameStore((s) => s.players);
  const roles = useGameStore((s) => s.roles);
  const togglePlayerStatus = useGameStore((s) => s.togglePlayerStatus);
  const undoAction = useGameStore((s) => s.undoAction);
  const actionMap = usePlayerActionMap();

  if (playerId === null) return null;
  const player = players.find((p) => p.id === playerId);
  if (!player) return null;

  const role = player.roleId ? roles.find((r) => r.id === player.roleId) : null;
  const actions = actionMap.get(playerId) || [];

  return (
    <BottomSheet isOpen onClose={onClose} title={player.name} icon="fa-user">
      <div className="text-center py-4">
        <p
          className={`text-sm font-black uppercase tracking-widest mb-2 ${getFactionStyle(role?.faction || "villager").text}`}
        >
          {role?.name || t("game.villager", "Dân Làng")}
        </p>
        <p
          className={`text-lg font-black uppercase tracking-widest ${actions.length > 0 ? "mb-4" : "mb-6"} ${player.alive ? "text-emerald-500" : "text-red-500"}`}
          aria-live="polite"
        >
          {player.alive ? t("game.alive") : t("game.dead")}
        </p>

        {actions.length > 0 && (
          <div className="space-y-1.5 mb-4">
            {actions.map((action) => {
              const col = getFactionStyle(action.faction);
              const name = tr(t, action.abilityNameKey, action.abilityName);
              const source = players.find((p) => p.id === action.sourceId);
              return (
                <button
                  key={action.id}
                  onClick={() => undoAction(action.id)}
                  className={`w-full px-3 py-2 rounded-xl border-b-2 flex items-center justify-between ${col.bgLight} ${col.borderSolid} text-white shadow-sm`}
                >
                  <span className="flex items-center gap-2 text-xs">
                    {action.abilityType === "limited" && (
                      <i className="fas fa-lock text-[10px] opacity-70" />
                    )}
                    <span className="font-bold tracking-wide">{name}</span>
                    {source && (
                      <span className="opacity-50 text-[10px]">
                        ({source.name})
                      </span>
                    )}
                  </span>
                  <i className="fas fa-times opacity-50 text-xs" />
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={() => {
            togglePlayerStatus(player.id);
            onClose();
          }}
          className={`w-full py-4 rounded-xl font-black text-lg uppercase transition active:scale-95 ${
            player.alive
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <i className={`fas ${player.alive ? "fa-skull" : "fa-heart"} mr-2`} />
          {player.alive ? t("game.kill", "Giết") : t("game.revive", "Hồi sinh")}
        </button>
      </div>
    </BottomSheet>
  );
}
