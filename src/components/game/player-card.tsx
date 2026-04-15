import { memo } from "react";
import { useTranslation } from "react-i18next";
import type {
  Player,
  GameRole,
  ActionLog,
  CardViewMode,
  Ability,
} from "../../types/game";
import { getFactionStyle } from "../../utils/faction-theme";
import { tr } from "../../utils/i18n-helpers";

interface PlayerCardProps {
  player: Player;
  role: GameRole | undefined;
  actions: ActionLog[];
  isFlipped: boolean;
  viewMode: CardViewMode;
  onFlip: (id: number) => void;
  onSelect: (id: number, e: React.MouseEvent) => void;
  onUndoAction: (actionId: string, e: React.MouseEvent) => void;
  onUseSkill: (roleId: string, ability: Ability, e: React.MouseEvent) => void;
}

function DeathWatermark() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <i className="fas fa-skull-crossbones text-red-500/25 text-6xl" />
    </div>
  );
}

const MAX_VISIBLE_CHIPS = 2;

function ActionChips({
  actions,
  onUndoAction,
}: {
  actions: ActionLog[];
  onUndoAction: (id: string, e: React.MouseEvent) => void;
}) {
  const { t } = useTranslation();
  if (actions.length === 0) return null;

  const hasOverflow = actions.length > MAX_VISIBLE_CHIPS;

  return (
    <div
      className="mt-auto pt-2 flex flex-wrap md:justify-center gap-1 w-full"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Landscape: show all */}
      <div className="hidden md:contents">
        {actions.map((action) => {
          const col = getFactionStyle(action.faction);
          const name = tr(t, action.abilityNameKey, action.abilityName);
          return (
            <button
              key={action.id}
              onClick={(e) => onUndoAction(action.id, e)}
              className={`text-[9px] px-2 py-1 rounded-md border-b-2 flex items-center gap-1 md:w-auto justify-between ${col.bgLight} ${col.borderSolid} text-white shadow-sm`}
            >
              <span className="flex items-center gap-1 truncate">
                {action.abilityType === "limited" && (
                  <i className="fas fa-lock text-[8px] opacity-70" />
                )}
                <span className="truncate font-bold tracking-wide">{name}</span>
              </span>
              <i className="fas fa-times opacity-50" />
            </button>
          );
        })}
      </div>

      {/* Portrait: max chips, last one faded if overflow */}
      <div className="contents md:hidden">
        {actions.slice(0, MAX_VISIBLE_CHIPS).map((action, idx) => {
          const col = getFactionStyle(action.faction);
          const name = tr(t, action.abilityNameKey, action.abilityName);
          const isLast = hasOverflow && idx === MAX_VISIBLE_CHIPS - 1;
          return (
            <button
              key={action.id}
              onClick={(e) => onUndoAction(action.id, e)}
              className={`text-[9px] px-2 py-1 rounded-md border-b-2 flex items-center gap-1 w-full justify-between ${col.bgLight} ${col.borderSolid} text-white shadow-sm ${isLast ? "opacity-40" : ""}`}
            >
              <span className="flex items-center gap-1 truncate">
                {action.abilityType === "limited" && (
                  <i className="fas fa-lock text-[8px] opacity-70" />
                )}
                <span className="truncate font-bold tracking-wide">{name}</span>
              </span>
              <i className="fas fa-times opacity-50" />
            </button>
          );
        })}
        {hasOverflow && (
          <div className="text-[9px] text-white/30 font-bold w-full text-center">
            +{actions.length - MAX_VISIBLE_CHIPS}
          </div>
        )}
      </div>
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
  onUseSkill,
}: PlayerCardProps) {
  const { t } = useTranslation();
  const isVillager = player.roleId === null;
  const villagerLabel = t("game.villager", "Dân Làng");
  const roleName = isVillager
    ? villagerLabel
    : tr(t, role?.nameKey, role?.name || villagerLabel);
  const abilities = role?.abilities || [];
  const faction = isVillager ? "villager" : role?.faction || "villager";
  const col = getFactionStyle(faction);

  // "both" mode — combined view, no flip
  if (viewMode === "both") {
    return (
      <div className="w-full h-44">
        <div
          className={`w-full h-full p-3 flex flex-col rounded-2xl relative border-l-4 border ${col.borderSolid} bg-white dark:bg-slate-900 shadow-sm overflow-y-auto hide-scrollbar card-pattern-${faction} ${!player.alive ? "dead-card" : ""}`}
        >
          {!player.alive && <DeathWatermark />}
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
          <div className="font-black text-lg text-gray-900 dark:text-white truncate px-1 text-center mb-5">
            {player.name}
          </div>
          {!isVillager && abilities.length > 0 && (
            <div
              className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-1 mb-3"
              onClick={(e) => e.stopPropagation()}
            >
              {abilities.map((ab) => {
                const used = player.abilityUsage[ab.id] || 0;
                const exhausted = ab.type === "limited" && used >= ab.max;
                return (
                  <button
                    key={ab.id}
                    onClick={(e) =>
                      !exhausted && role && onUseSkill(role.id, ab, e)
                    }
                    disabled={exhausted}
                    className={`text-[9px] font-bold border border-dashed rounded-lg py-1 px-1.5 flex justify-between md:justify-center items-center gap-1 w-full md:w-auto transition active:scale-95 ${exhausted ? "border-gray-300 dark:border-white/15 text-gray-400 dark:text-white/40 cursor-not-allowed" : "border-gray-400 dark:border-white/30 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10"}`}
                  >
                    <span className="truncate max-w-[70%]">
                      {tr(t, ab.nameKey, ab.name)}
                    </span>
                    <span className="bg-gray-200 dark:bg-black/30 px-1 rounded">
                      {ab.type === "limited" ? (
                        `${used}/${ab.max}`
                      ) : (
                        <i className="fas fa-moon text-[7px]" />
                      )}
                    </span>
                  </button>
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
      className={`flip-face p-3 bg-white dark:bg-slate-900 border-l-4 ${col.borderSolid} border border-gray-200 dark:border-slate-700 rounded-xl card-pattern-mixed`}
    >
      {!player.alive && <DeathWatermark />}
      <div className="flex justify-between items-start mb-2">
        <span className="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm bg-gray-200 dark:bg-black/30 text-gray-700 dark:text-white">
          {player.id}
        </span>
      </div>
      <div className="text-center mt-auto mb-auto">
        <div className="font-black text-xl truncate px-1 text-gray-900 dark:text-white">
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
      className={`flip-face flip-back p-2 ${col.bgLight} border-l-4 ${col.borderSolid} border border-gray-200 dark:border-slate-700 rounded-xl card-pattern-${faction}`}
    >
      {!player.alive && <DeathWatermark />}
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
      <div className="text-center mt-1 mb-4">
        <div
          className={`font-black text-[15px] truncate px-1 uppercase tracking-widest ${col.textBright}`}
        >
          {roleName}
        </div>
      </div>
      <div
        className="flex-1 flex flex-col md:flex-row md:flex-wrap md:justify-center justify-start text-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        {isVillager ? (
          <span className="text-[11px] text-gray-400 dark:text-white/50 italic font-bold">
            {t("game.noAbility", "Không kỹ năng")}
          </span>
        ) : (
          abilities.map((ab) => {
            const used = player.abilityUsage[ab.id] || 0;
            const isDisabled = ab.type === "limited" && used >= ab.max;
            return (
              <button
                key={ab.id}
                onClick={(e) =>
                  !isDisabled && role && onUseSkill(role.id, ab, e)
                }
                disabled={isDisabled}
                className={`text-[10px] border border-dashed rounded-lg py-1 px-1.5 flex justify-between md:justify-center items-center gap-1 font-bold w-full md:w-auto transition active:scale-95 ${isDisabled ? "bg-transparent border-gray-300 dark:border-white/20 text-gray-400 dark:text-white/40 cursor-not-allowed" : "bg-transparent border-gray-500 dark:border-white/40 text-gray-800 dark:text-white hover:bg-white/10"}`}
              >
                <span className="truncate max-w-[65%]">
                  {tr(t, ab.nameKey, ab.name)}
                </span>
                <span className="opacity-90 bg-gray-200 dark:bg-black/30 px-1 rounded">
                  {ab.type === "limited" ? (
                    `${used}/${ab.max}`
                  ) : (
                    <i className="fas fa-moon text-[8px]" />
                  )}
                </span>
              </button>
            );
          })
        )}
      </div>
      <ActionChips actions={actions} onUndoAction={onUndoAction} />
    </div>
  );

  // XOR: roleFirst inverts the flip state
  const showFlipped = viewMode === "roleFirst" ? !isFlipped : isFlipped;

  return (
    <div
      className={`flip-container w-full h-44 cursor-pointer ${showFlipped ? "flipped" : ""} ${!player.alive ? "dead-card" : ""}`}
      onClick={() => onFlip(player.id)}
      role="button"
      aria-label={`${player.name} - ${roleName}`}
      aria-expanded={showFlipped}
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
