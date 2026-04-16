import { memo, useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Skull, Lock, X, MoreVertical, Moon } from "lucide-react";
import type {
  Player,
  GameRole,
  ActionLog,
  CardViewMode,
  Ability,
} from "../../types/game";
import { getFactionStyle } from "../../utils/faction-theme";
import { tr } from "../../utils/i18n-helpers";

const FACTION_EMOJI: Record<string, string> = {
  wolf: "🐺",
  villager: "🛡",
  third: "👁",
};

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
      <Skull size={64} className="text-red-900/30" />
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
              aria-label={`${t("game.undo", "Hoàn tác")} ${name}`}
              className={`chip-appear text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 md:w-auto justify-between ${col.bgLight} ${col.borderSolid} border text-text-primary shadow-sm`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
              <span className="flex items-center gap-1 truncate">
                {action.abilityType === "limited" && (
                  <Lock size={8} className="opacity-70" />
                )}
                <span className="truncate font-semibold">{name}</span>
              </span>
              <X size={10} className="opacity-50" />
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
              aria-label={`${t("game.undo", "Hoàn tác")} ${name}`}
              className={`chip-appear text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 w-full justify-between ${col.bgLight} ${col.borderSolid} border text-text-primary shadow-sm ${isLast ? "opacity-40" : ""}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
              <span className="flex items-center gap-1 truncate">
                {action.abilityType === "limited" && (
                  <Lock size={8} className="opacity-70" />
                )}
                <span className="truncate font-semibold">{name}</span>
              </span>
              <X size={10} className="opacity-50" />
            </button>
          );
        })}
        {hasOverflow && (
          <div className="text-[9px] text-text-muted font-bold w-full text-center">
            +{actions.length - MAX_VISIBLE_CHIPS}
          </div>
        )}
      </div>
    </div>
  );
}

function AbilityButton({
  ab,
  used,
  exhausted,
  role,
  onUseSkill,
}: {
  ab: Ability;
  used: number;
  exhausted: boolean;
  role: GameRole;
  onUseSkill: (roleId: string, ability: Ability, e: React.MouseEvent) => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      onClick={(e) => !exhausted && onUseSkill(role.id, ab, e)}
      disabled={exhausted}
      className={`text-[10px] border border-dashed rounded-lg py-1 px-1.5 flex justify-between md:justify-center items-center gap-1 font-bold w-full md:w-auto transition active:scale-95 ${exhausted ? "border-border-default text-text-muted cursor-not-allowed" : "border-text-secondary text-text-primary hover:bg-bg-elevated"}`}
    >
      <span className="truncate max-w-[65%]">{tr(t, ab.nameKey, ab.name)}</span>
      <span className="bg-bg-elevated px-1 rounded">
        {ab.type === "limited" ? `${used}/${ab.max}` : <Moon size={8} />}
      </span>
    </button>
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

  const deadName = !player.alive ? "line-through opacity-60" : "";

  // ANIM7/ANIM8: Death/revive animation
  const [animClass, setAnimClass] = useState("");
  const prevAlive = useRef(player.alive);
  useEffect(() => {
    if (prevAlive.current && !player.alive) setAnimClass("death-anim");
    else if (!prevAlive.current && player.alive) setAnimClass("revive-anim");
    prevAlive.current = player.alive;
  }, [player.alive]);
  const handleAnimEnd = useCallback(() => setAnimClass(""), []);
  const deadClass = !player.alive && !animClass ? "dead-card" : "";

  // "both" mode — combined view, no flip
  if (viewMode === "both") {
    return (
      <div className="w-full min-h-[170px] md:min-h-[180px] lg:min-h-[190px]">
        <div
          className={`w-full h-full p-3 flex flex-col rounded-2xl relative border ${col.border} bg-bg-card shadow-card overflow-y-auto hide-scrollbar card-pattern-${faction} hover:${col.glow} transition-shadow ${deadClass} ${animClass}`}
          onAnimationEnd={handleAnimEnd}
        >
          {!player.alive && <DeathWatermark />}
          <div className="flex justify-between items-center mb-2">
            <span className="bg-bg-elevated text-text-primary w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0">
              {player.id}
            </span>
            <div
              className={`text-[11px] font-black uppercase tracking-widest truncate ml-2 text-right flex-1 ${col.text}`}
            >
              {roleName}
            </div>
            <button
              onClick={(e) => onSelect(player.id, e)}
              className="text-text-muted hover:text-text-primary ml-2 p-1"
              aria-label="Player options"
            >
              <MoreVertical size={14} />
            </button>
          </div>
          <div
            className={`font-black text-lg text-text-primary truncate px-1 text-center mb-5 ${deadName}`}
          >
            {player.name}
          </div>
          {!isVillager && abilities.length > 0 && role && (
            <div
              className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-1 mb-3"
              onClick={(e) => e.stopPropagation()}
            >
              {abilities.map((ab) => {
                const used = player.abilityUsage[ab.id] || 0;
                const exhausted = ab.type === "limited" && used >= ab.max;
                return (
                  <AbilityButton
                    key={ab.id}
                    ab={ab}
                    used={used}
                    exhausted={exhausted}
                    role={role}
                    onUseSkill={onUseSkill}
                  />
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
      className={`flip-face p-3 bg-bg-card border ${col.border} rounded-xl card-pattern-mixed`}
    >
      {!player.alive && <DeathWatermark />}
      <div className="flex justify-between items-start mb-2">
        <span className="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm bg-bg-elevated text-text-primary">
          {player.id}
        </span>
      </div>
      <div className="text-center mt-auto mb-auto">
        <div
          className={`font-black text-xl truncate px-1 text-text-primary ${deadName}`}
        >
          {player.name}
        </div>
        {player.roleId && (
          <div
            className={`text-[8px] font-bold uppercase tracking-wider mt-1 ${col.text}`}
          >
            {FACTION_EMOJI[faction]} {t(`factions.${faction}`)}
          </div>
        )}
      </div>
      <ActionChips actions={actions} onUndoAction={onUndoAction} />
      <button
        onClick={(e) => onSelect(player.id, e)}
        className="absolute top-2 right-2 text-text-muted hover:text-text-primary p-2"
        aria-label="Player options"
      >
        <MoreVertical size={14} />
      </button>
    </div>
  );

  // Role face (back)
  const roleFace = (
    <div
      className={`flip-face flip-back p-2 ${col.bgLight} border ${col.border} rounded-xl card-pattern-${faction}`}
    >
      {!player.alive && <DeathWatermark />}
      <div className="flex justify-between items-start">
        <span className="bg-bg-elevated text-text-secondary w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
          {player.id}
        </span>
        <button
          onClick={(e) => onSelect(player.id, e)}
          className="text-text-muted hover:text-text-primary p-1 -mt-1"
          aria-label="Player options"
        >
          <MoreVertical size={14} />
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
          <span className="text-[11px] text-text-muted italic font-bold">
            {t("game.noAbility", "Không kỹ năng")}
          </span>
        ) : (
          role &&
          abilities.map((ab) => {
            const used = player.abilityUsage[ab.id] || 0;
            const isDisabled = ab.type === "limited" && used >= ab.max;
            return (
              <AbilityButton
                key={ab.id}
                ab={ab}
                used={used}
                exhausted={isDisabled}
                role={role}
                onUseSkill={onUseSkill}
              />
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
      className={`flip-container w-full min-h-[170px] md:min-h-[180px] lg:min-h-[190px] cursor-pointer ${showFlipped ? "flipped" : ""} ${deadClass} ${animClass}`}
      onAnimationEnd={handleAnimEnd}
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
      <div
        className={`flip-inner shadow-card rounded-xl hover:${col.glow} transition-shadow`}
      >
        {nameFace}
        {roleFace}
      </div>
    </div>
  );
});
