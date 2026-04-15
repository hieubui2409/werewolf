import { useTranslation } from "react-i18next";
import { useGameStore } from "../../store/game-store";
import { usePlayerActionMap } from "../../store/game-store-selectors";
import { BottomSheet } from "../common/bottom-sheet";
import { getFactionStyle } from "../../utils/faction-theme";
import { tr } from "../../utils/i18n-helpers";
import type { Ability } from "../../types/game";

interface PlayerActionSheetProps {
  playerId: number | null;
  onClose: () => void;
  onUseSkill: (roleId: string, ability: Ability) => void;
}

export function PlayerActionSheet({
  playerId,
  onClose,
  onUseSkill,
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
  const abilities = role?.abilities || [];
  const actions = actionMap.get(playerId) || [];
  const faction = role?.faction || "villager";
  const col = getFactionStyle(faction);

  return (
    <BottomSheet isOpen onClose={onClose} title={player.name} icon="fa-user">
      <div className="py-3">
        {/* Role & Status header */}
        <div className="text-center mb-4">
          <p
            className={`text-lg font-black uppercase tracking-widest mb-1 ${col.text}`}
          >
            {role ? tr(t, role.nameKey, role.name) : t("game.villager")}
          </p>
          <p
            className={`text-xs font-bold uppercase tracking-wider ${player.alive ? "text-emerald-500" : "text-red-500"}`}
          >
            {player.alive ? t("game.alive") : t("game.dead")}
          </p>
        </div>

        {/* Owned Skills — compact chips */}
        {abilities.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 text-center">
              {t("game.skills", "Kỹ năng")}
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {abilities.map((ab) => {
                const used = player.abilityUsage[ab.id] || 0;
                const exhausted = ab.type === "limited" && used >= ab.max;
                return (
                  <button
                    key={ab.id}
                    onClick={() =>
                      !exhausted && role && onUseSkill(role.id, ab)
                    }
                    disabled={exhausted}
                    className={`text-[11px] font-bold border border-dashed rounded-lg py-1.5 px-2.5 flex items-center gap-1.5 transition active:scale-95 ${exhausted ? "border-gray-300 dark:border-white/15 text-gray-400 dark:text-white/40 cursor-not-allowed" : `${col.borderSolid} ${col.text} hover:bg-gray-100 dark:hover:bg-white/10`}`}
                  >
                    <span className="truncate">
                      {tr(t, ab.nameKey, ab.name)}
                    </span>
                    <span className="bg-gray-200 dark:bg-black/30 px-1 rounded text-[10px]">
                      {ab.type === "limited" ? (
                        `${used}/${ab.max}`
                      ) : (
                        <i className="fas fa-moon text-[8px]" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Used Skills — compact chips with undo */}
        {actions.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 text-center">
              {t("game.usedSkills", "Đã sử dụng")}
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {actions.map((action) => {
                const acol = getFactionStyle(action.faction);
                const name = tr(t, action.abilityNameKey, action.abilityName);
                const source = players.find((p) => p.id === action.sourceId);
                return (
                  <button
                    key={action.id}
                    onClick={() => undoAction(action.id)}
                    className={`text-[11px] px-2.5 py-1.5 rounded-lg border-b-2 flex items-center gap-1.5 ${acol.bgLight} ${acol.borderSolid} text-white shadow-sm transition active:scale-95`}
                  >
                    {action.abilityType === "limited" && (
                      <i className="fas fa-lock text-[9px] opacity-70" />
                    )}
                    <span className="font-bold tracking-wide truncate">
                      {name}
                    </span>
                    {source && (
                      <span className="opacity-50 text-[9px]">
                        {source.name}
                      </span>
                    )}
                    <i className="fas fa-times opacity-50 text-[9px]" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Kill/Revive button */}
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
