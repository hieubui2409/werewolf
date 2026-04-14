import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../../store/game-store";
import { useSortedRoles } from "../../store/game-store-selectors";
import { BottomSheet } from "../common/bottom-sheet";
import { getFactionStyle } from "../../utils/faction-theme";
import type { Ability } from "../../types/game";

interface SkillSheetProps {
  isOpen: boolean;
  onClose: () => void;
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

export function SkillSheet({ isOpen, onClose }: SkillSheetProps) {
  const { t } = useTranslation();
  const sortedRoles = useSortedRoles();
  const players = useGameStore((s) => s.players);
  const executeAction = useGameStore((s) => s.executeAction);
  const [wizard, setWizard] = useState<WizardState>(INITIAL_STATE);
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setWizard(INITIAL_STATE);
    setExpandedRoleId(null);
    onClose();
  }, [onClose]);

  const selectAbility = (ability: Ability, roleId: string) => {
    const capable = players.filter((p) => p.roleId === roleId && p.alive);
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
  };

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
      icon="fa-wand-sparkles"
      fullHeight
    >
      {/* Step 1: Choose skill */}
      {wizard.step === 1 && (
        <div className="space-y-2">
          {sortedRoles.map((role) => {
            if (role.abilities.length === 0) return null;
            const style = getFactionStyle(role.faction);
            const assigned = players.filter(
              (p) => p.roleId === role.id && p.alive,
            );
            const isExpanded = expandedRoleId === role.id;
            return (
              <div
                key={role.id}
                className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedRoleId(isExpanded ? null : role.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 ${style.bgLight}`}
                  aria-expanded={isExpanded}
                >
                  <span className={`font-bold ${style.textBright}`}>
                    {role.name}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500">
                    {assigned.map((p) => p.name).join(", ") || "—"}
                  </span>
                </button>
                {isExpanded && (
                  <div className="p-3 space-y-2 bg-gray-50 dark:bg-slate-800/50">
                    {role.abilities.map((ab) => (
                      <button
                        key={ab.id}
                        onClick={() => selectAbility(ab, role.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition active:scale-[0.98] bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600`}
                      >
                        <span className="font-bold text-sm text-gray-800 dark:text-white">
                          {ab.name}
                        </span>
                        <span className="ml-2 text-[10px] text-gray-400 dark:text-slate-400">
                          {ab.type === "nightly" ? (
                            <i className="fas fa-moon" />
                          ) : (
                            `${ab.max}x`
                          )}{" "}
                          <i className="fas fa-crosshairs ml-1" />{" "}
                          {ab.targetCount}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Step 2: Choose source */}
      {wizard.step === 2 && (
        <div>
          <button
            onClick={() => setWizard(INITIAL_STATE)}
            className="mb-3 text-sm text-indigo-500 font-bold"
          >
            <i className="fas fa-arrow-left mr-1" /> {t("common.back")}
          </button>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">
            {t("game.chooseSource", "Chọn người thực hiện")}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {wizard.possibleSources.map((p) => (
              <button
                key={p.id}
                onClick={() => selectSource(p.id)}
                className="py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl font-bold text-sm text-center transition active:scale-95 text-gray-800 dark:text-white"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Choose targets */}
      {wizard.step === 3 && wizard.ability && (
        <div className="flex flex-col flex-1">
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
            <i className="fas fa-arrow-left mr-1" /> {t("common.back")}
          </button>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">
            {players.find((p) => p.id === wizard.sourceId)?.name} —{" "}
            <strong>{wizard.ability.name}</strong> ({wizard.targets.length}/
            {wizard.ability.targetCount})
          </p>
          <div className="grid grid-cols-4 gap-2 flex-1 content-start">
            {players.map((p) => {
              const isSelected = wizard.targets.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleTarget(p.id)}
                  className={`py-2 rounded-lg text-[11px] font-bold text-center transition active:scale-95 ${isSelected ? "bg-indigo-600 text-white shadow-lg" : "bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-600"}`}
                  aria-selected={isSelected}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 mt-4 pt-3 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={confirmNoTarget}
              className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-bold rounded-xl transition active:scale-95"
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
