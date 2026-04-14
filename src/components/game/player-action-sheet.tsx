import { useTranslation } from "react-i18next";
import { useGameStore } from "../../store/game-store";
import { BottomSheet } from "../common/bottom-sheet";

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

  if (playerId === null) return null;
  const player = players.find((p) => p.id === playerId);
  if (!player) return null;

  const role = player.roleId ? roles.find((r) => r.id === player.roleId) : null;

  return (
    <BottomSheet isOpen onClose={onClose} title={player.name} icon="fa-user">
      <div className="text-center py-4">
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">
          {role?.name || "Dân Làng"}
        </p>
        <p
          className={`text-lg font-black uppercase tracking-widest mb-6 ${player.alive ? "text-emerald-500" : "text-red-500"}`}
          aria-live="polite"
        >
          {player.alive ? t("game.alive") : t("game.dead")}
        </p>
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
