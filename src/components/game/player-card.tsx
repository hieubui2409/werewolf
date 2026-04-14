import { memo } from "react";
import type {
  Player,
  GameRole,
  ActionLog,
  CardViewMode,
} from "../../types/game";
import { getFactionStyle } from "../../utils/faction-theme";

interface PlayerCardProps {
  player: Player;
  role: GameRole | undefined;
  actions: ActionLog[];
  isFlipped: boolean;
  viewMode: CardViewMode;
  onFlip: (id: number) => void;
  onSelect: (id: number, e: React.MouseEvent) => void;
  onUndoAction: (actionId: string, e: React.MouseEvent) => void;
}

function ActionChips({
  actions,
  onUndoAction,
}: {
  actions: ActionLog[];
  onUndoAction: (id: string, e: React.MouseEvent) => void;
}) {
  if (actions.length === 0) return null;
  return (
    <div
      className="mt-auto flex flex-wrap gap-1 w-full"
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map((action) => {
        const col = getFactionStyle(action.faction);
        return (
          <button
            key={action.id}
            onClick={(e) => onUndoAction(action.id, e)}
            className={`text-[9px] px-2 py-1 rounded-md border-b-2 flex items-center gap-1 w-full justify-between ${col.bgLight} ${col.borderSolid} text-white shadow-sm`}
            aria-label={`Undo ${action.abilityName}`}
          >
            <span className="flex items-center gap-1 truncate">
              {action.abilityType === "limited" && (
                <i className="fas fa-lock text-[8px] opacity-70" />
              )}
              <span className="truncate font-bold tracking-wide">
                {action.abilityName}
              </span>
            </span>
            <i className="fas fa-times opacity-50" />
          </button>
        );
      })}
    </div>
  );
}

export const PlayerCard = memo(function PlayerCard({
  player,
  role,
  actions,
  isFlipped,
  viewMode,
  onFlip,
  onSelect,
  onUndoAction,
}: PlayerCardProps) {
  const isVillager = player.roleId === null;
  const roleName = isVillager ? "Dân Làng" : role?.name || "Dân Làng";
  const abilities = role?.abilities || [];
  const faction = player.alive
    ? isVillager
      ? "villager"
      : role?.faction || "villager"
    : "dead";
  const col = getFactionStyle(faction);

  // "both" mode — combined view, no flip
  if (viewMode === "both") {
    return (
      <div className="w-full">
        <div
          className={`w-full p-3 flex flex-col rounded-2xl relative border-l-4 border ${col.borderSolid} bg-white dark:bg-slate-900 shadow-sm`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="bg-gray-200 dark:bg-black/30 text-gray-700 dark:text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0">
              {player.id}
            </span>
            <div
              className={`text-[11px] font-black uppercase tracking-widest truncate ml-2 text-right flex-1 ${col.text}`}
            >
              {roleName}
            </div>
            <button
              onClick={(e) => onSelect(player.id, e)}
              className="text-gray-400 dark:text-white/50 hover:text-gray-600 dark:hover:text-white ml-2 p-1"
              aria-label="Player options"
            >
              <i className="fas fa-ellipsis-v" />
            </button>
          </div>
          <div
            className={`font-black text-lg text-gray-900 dark:text-white truncate px-1 text-center mb-3 ${!player.alive ? "line-through opacity-50" : ""}`}
          >
            {player.name}
          </div>
          {!isVillager && abilities.length > 0 && (
            <div className="space-y-1.5 mb-3">
              {abilities.map((ab) => {
                const used = player.abilityUsage[ab.id] || 0;
                return (
                  <div
                    key={ab.id}
                    className="text-[9px] font-bold border-b-2 border-gray-200 dark:border-white/20 rounded-lg bg-gray-50 dark:bg-white/10 py-1 px-1.5 flex justify-between items-center text-gray-700 dark:text-white"
                  >
                    <span className="truncate max-w-[70%]">{ab.name}</span>
                    <span className="bg-gray-200 dark:bg-black/30 px-1 rounded">
                      {ab.type === "limited" ? (
                        `${used}/${ab.max}`
                      ) : (
                        <i className="fas fa-moon text-[7px]" />
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <ActionChips actions={actions} onUndoAction={onUndoAction} />
        </div>
      </div>
    );
  }

  // Name face (front)
  const nameFace = (
    <div
      className={`flip-face p-3 bg-white dark:bg-slate-900 border-l-4 ${col.borderSolid} border border-gray-200 dark:border-slate-700 rounded-xl`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm bg-gray-200 dark:bg-black/30 text-gray-700 dark:text-white">
          {player.id}
        </span>
        {!player.alive && <i className="fas fa-skull text-red-400 text-xl" />}
      </div>
      <div className="text-center mt-auto mb-auto">
        <div
          className={`font-black text-xl truncate px-1 text-gray-900 dark:text-white ${!player.alive ? "line-through opacity-50" : ""}`}
        >
          {player.name}
        </div>
      </div>
      <ActionChips actions={actions} onUndoAction={onUndoAction} />
      <button
        onClick={(e) => onSelect(player.id, e)}
        className="absolute top-2 right-2 text-gray-400 dark:text-white/50 hover:text-gray-600 dark:hover:text-white p-2"
        aria-label="Player options"
      >
        <i className="fas fa-ellipsis-v" />
      </button>
    </div>
  );

  // Role face (back)
  const roleFace = (
    <div
      className={`flip-face flip-back p-2 ${col.bgLight} border-l-4 ${col.borderSolid} border border-gray-200 dark:border-slate-700 rounded-xl`}
    >
      <div className="flex justify-between items-start">
        <span className="bg-gray-200 dark:bg-black/30 text-gray-600 dark:text-white/80 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
          {player.id}
        </span>
        <button
          onClick={(e) => onSelect(player.id, e)}
          className="text-gray-400 dark:text-white/50 hover:text-gray-600 dark:hover:text-white p-1 -mt-1"
          aria-label="Player options"
        >
          <i className="fas fa-ellipsis-v" />
        </button>
      </div>
      <div className="text-center mt-1 mb-2">
        <div
          className={`font-black text-[15px] truncate px-1 uppercase tracking-widest ${col.textBright}`}
        >
          {roleName}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center text-center overflow-y-auto hide-scrollbar space-y-1.5">
        {isVillager ? (
          <span className="text-[11px] text-gray-400 dark:text-white/50 italic font-bold">
            Không kỹ năng
          </span>
        ) : (
          abilities.map((ab) => {
            const used = player.abilityUsage[ab.id] || 0;
            const isDisabled = ab.type === "limited" && used >= ab.max;
            return (
              <div
                key={ab.id}
                className={`text-[10px] border-b-2 rounded-lg py-1 px-1.5 flex justify-between items-center font-bold ${isDisabled ? "bg-gray-200/50 dark:bg-black/40 border-gray-300 dark:border-black/50 text-gray-400 dark:text-white/40" : "bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/20 text-gray-700 dark:text-white"}`}
              >
                <span className="truncate max-w-[65%]">{ab.name}</span>
                <span className="opacity-90 bg-gray-200 dark:bg-black/30 px-1 rounded">
                  {ab.type === "limited" ? (
                    `${used}/${ab.max}`
                  ) : (
                    <i className="fas fa-moon text-[8px]" />
                  )}
                </span>
              </div>
            );
          })
        )}
      </div>
      <ActionChips actions={actions} onUndoAction={onUndoAction} />
    </div>
  );

  return (
    <div
      className={`flip-container w-full h-36 cursor-pointer ${isFlipped ? "flipped" : ""}`}
      onClick={() => onFlip(player.id)}
      role="button"
      aria-label={`${player.name} - ${roleName}`}
      aria-expanded={isFlipped}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFlip(player.id);
        }
      }}
    >
      <div className="flip-inner shadow-lg rounded-xl">
        {nameFace}
        {roleFace}
      </div>
    </div>
  );
});
