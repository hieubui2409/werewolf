import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Wand2, Moon, Crosshair, ArrowLeft, Skull } from "lucide-react";
import { useGameStore } from "../../store/game-store";
import { useSortedRoles } from "../../store/game-store-selectors";
import { BottomSheet } from "../common/bottom-sheet";
import { getFactionStyle } from "../../utils/faction-theme";
import { tr } from "../../utils/i18n-helpers";
import type { Ability } from "../../types/game";

export interface SkillContext {
  ability: Ability;
  roleId: string;
}

interface SkillSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: SkillContext | null;
}

interface WizardState {
  step: 1 | 2 | 3;
  ability: Ability | null;
  roleId: string | null;
  sourceId: number | null;
  targets: number[];
  possibleSources: { id: number; name: string }[];
}

const INITIAL_STATE: WizardState = {
  step: 1,
  ability: null,
  roleId: null,
  sourceId: null,
  targets: [],
  possibleSources: [],
};

export function SkillSheet({
  isOpen,
  onClose,
  initialContext,
}: SkillSheetProps) {
  const { t } = useTranslation();
  const sortedRoles = useSortedRoles();
  const players = useGameStore((s) => s.players);
  const executeAction = useGameStore((s) => s.executeAction);
  const [wizard, setWizard] = useState<WizardState>(INITIAL_STATE);
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);
  // C2: Use ref for players to break dependency loop in selectAbility
  const playersRef = useRef(players);
  playersRef.current = players;

  const handleClose = useCallback(() => {
    setWizard(INITIAL_STATE);
    setExpandedRoleId(null);
    onClose();
  }, [onClose]);

  // C2: selectAbility reads players from ref — stable callback, no player dep
  const selectAbility = useCallback((ability: Ability, roleId: string) => {
    const capable = playersRef.current.filter(
      (p) => p.roleId === roleId && p.alive,
    );
    if (capable.length === 0) return;
    if (capable.length === 1) {
      setWizard({
        step: 3,
        ability,
        roleId,
        sourceId: capable[0].id,
        targets: [],
        possibleSources: [],
      });
    } else {
      setWizard({
        step: 2,
        ability,
        roleId,
        sourceId: null,
        targets: [],
        possibleSources: capable,
      });
    }
  }, []);

  // C2: Auto-select only on open — stable deps prevent wizard reset
  const initialContextRef = useRef(initialContext);
  initialContextRef.current = initialContext;
  useEffect(() => {
    if (isOpen && initialContextRef.current) {
      selectAbility(
        initialContextRef.current.ability,
        initialContextRef.current.roleId,
      );
    }
  }, [isOpen, selectAbility]);

  const selectSource = (sourceId: number) => {
    setWizard((prev) => ({ ...prev, step: 3, sourceId }));
  };

  const toggleTarget = (targetId: number) => {
    if (!wizard.ability) return;
    setWizard((prev) => {
      if (prev.targets.includes(targetId))
        return {
          ...prev,
          targets: prev.targets.filter((id) => id !== targetId),
        };
      if (prev.targets.length < wizard.ability!.targetCount)
        return { ...prev, targets: [...prev.targets, targetId] };
      return prev;
    });
  };

  const confirm = () => {
    if (!wizard.ability || wizard.sourceId === null || !wizard.roleId) return;
    executeAction(
      wizard.sourceId,
      wizard.ability,
      wizard.targets,
      wizard.roleId,
    );
    setWizard(INITIAL_STATE);
    setExpandedRoleId(null);
    onClose();
  };

  const confirmNoTarget = () => {
    if (!wizard.ability || wizard.sourceId === null || !wizard.roleId) return;
    executeAction(wizard.sourceId, wizard.ability, [], wizard.roleId);
    setWizard(INITIAL_STATE);
    setExpandedRoleId(null);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={t("game.useSkill")}
      icon={<Wand2 size={20} />}
      fullHeight
    >
      {/* Step 1: Choose skill */}
      {wizard.step === 1 && (
        <div className="space-y-2 step-enter">
          {sortedRoles.map((role) => {
            if (role.abilities.length === 0) return null;
            const style = getFactionStyle(role.faction);
            const allAssigned = players.filter((p) => p.roleId === role.id);
            const isExpanded = expandedRoleId === role.id;
            return (
              <div
                key={role.id}
                className="rounded-xl border border-border-default overflow-hidden"
              >
                <button
                  onClick={() => setExpandedRoleId(isExpanded ? null : role.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 ${style.bgLight}`}
                  aria-expanded={isExpanded}
                >
                  <span className={`font-bold ${style.textBright}`}>
                    {tr(t, role.nameKey, role.name)}
                  </span>
                  <span className="flex flex-wrap gap-1 items-center">
                    {allAssigned.length > 0 ? (
                      allAssigned.map((p) => (
                        <span
                          key={p.id}
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                            !p.alive
                              ? "line-through bg-slate-700/50 text-text-muted"
                              : "bg-bg-overlay text-text-secondary"
                          }`}
                        >
                          {p.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-text-muted">—</span>
                    )}
                  </span>
                </button>
                {isExpanded && (
                  <div className="p-3 space-y-2 bg-bg-elevated/50">
                    {role.abilities.map((ab) => {
                      const assigned = players.filter(
                        (p) => p.roleId === role.id,
                      );
                      const allExhausted =
                        ab.type === "limited" &&
                        assigned.length > 0 &&
                        assigned.every(
                          (p) => (p.abilityUsage[ab.id] || 0) >= ab.max,
                        );
                      return (
                        <button
                          key={ab.id}
                          onClick={() =>
                            !allExhausted && selectAbility(ab, role.id)
                          }
                          disabled={allExhausted}
                          className={`w-full text-left px-3 py-2 rounded-lg border transition active:scale-[0.98] ${allExhausted ? "opacity-40 cursor-not-allowed bg-bg-elevated border-border-default" : "bg-bg-card border-border-default hover:bg-bg-elevated"}`}
                        >
                          <span
                            className={`font-bold text-sm ${allExhausted ? "text-text-muted line-through" : "text-text-primary"}`}
                          >
                            {tr(t, ab.nameKey, ab.name)}
                          </span>
                          <span className="ml-2 text-[10px] text-text-muted">
                            {ab.type === "nightly" ? (
                              <Moon size={10} />
                            ) : (
                              `${ab.max}x`
                            )}{" "}
                            <Crosshair size={10} className="ml-1" />{" "}
                            {ab.targetCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Step 2: Choose source */}
      {wizard.step === 2 && (
        <div className="step-enter">
          <button
            onClick={() => setWizard(INITIAL_STATE)}
            className="mb-3 text-sm text-indigo-500 font-bold"
          >
            <ArrowLeft size={12} className="mr-1 inline" /> {t("common.back")}
          </button>
          <p className="text-sm text-text-muted mb-3">
            {t("game.chooseSource", "Chọn người thực hiện")}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {wizard.possibleSources.map((p) => (
              <button
                key={p.id}
                onClick={() => selectSource(p.id)}
                className="py-3 bg-bg-card border border-border-default rounded-xl font-bold text-sm text-center transition active:scale-95 text-text-primary"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Choose targets */}
      {wizard.step === 3 && wizard.ability && (
        <div className="flex flex-col flex-1 step-enter">
          <button
            onClick={() =>
              setWizard((prev) => ({
                ...prev,
                step: prev.possibleSources.length > 1 ? 2 : 1,
                targets: [],
              }))
            }
            className="mb-3 text-sm text-indigo-500 font-bold"
          >
            <ArrowLeft size={12} className="mr-1 inline" /> {t("common.back")}
          </button>
          <p className="text-sm text-text-muted mb-3">
            {players.find((p) => p.id === wizard.sourceId)?.name} —{" "}
            <strong>
              {tr(t, wizard.ability.nameKey, wizard.ability.name)}
            </strong>{" "}
            ({wizard.targets.length}/{wizard.ability.targetCount})
          </p>
          <div className="grid grid-cols-4 gap-2 flex-1 content-start">
            {players.map((p) => {
              const isSelected = wizard.targets.includes(p.id);
              const isDead = !p.alive;
              return (
                <button
                  key={p.id}
                  onClick={() => toggleTarget(p.id)}
                  className={`py-2 rounded-lg text-[11px] font-bold text-center transition active:scale-95 ${isSelected ? "bg-indigo-600 text-white shadow-lg" : isDead ? "bg-bg-card text-text-muted border border-border-default opacity-50 italic" : "bg-bg-card text-text-secondary border border-border-default"}`}
                  aria-selected={isSelected}
                  aria-label={`${p.name}${isDead ? ` (${t("game.dead")})` : ""}`}
                >
                  {isDead && (
                    <Skull size={10} className="inline mr-0.5 text-red-500" />
                  )}
                  {p.name}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 mt-4 pt-3 border-t border-border-default">
            <button
              onClick={confirmNoTarget}
              className="flex-1 py-3 bg-bg-elevated text-text-secondary font-bold rounded-xl transition active:scale-95"
            >
              {t("game.skip", "Bỏ qua")}
            </button>
            <button
              onClick={confirm}
              disabled={wizard.targets.length === 0}
              className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl transition active:scale-95 disabled:opacity-40"
            >
              {t("common.confirm")} ({wizard.targets.length})
            </button>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
