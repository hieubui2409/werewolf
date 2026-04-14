import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../../store/game-store";
import { BottomSheet } from "../common/bottom-sheet";
import { MAX_ABILITIES_PER_ROLE } from "../../data/default-roles";
import type { Faction, Ability } from "../../types/game";

interface CreateRoleSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const FACTION_OPTIONS: { value: Faction; label: string; color: string }[] = [
  { value: "villager", label: "Dân", color: "bg-blue-600" },
  { value: "wolf", label: "Sói", color: "bg-red-600" },
  { value: "third", label: "Phe 3", color: "bg-purple-600" },
];

function uid(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function CreateRoleSheet({ isOpen, onClose }: CreateRoleSheetProps) {
  const { t } = useTranslation();
  const createCustomRole = useGameStore((s) => s.createCustomRole);
  const playerCount = useGameStore((s) => s.playerCount);

  const [name, setName] = useState("");
  const [faction, setFaction] = useState<Faction>("villager");
  const [abilities, setAbilities] = useState<Ability[]>([
    { id: uid(), name: "", type: "nightly", max: 1, targetCount: 1 },
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!name.trim())
      errs.push(t("setup.errorNameRequired", "Tên role không được trống"));
    if (abilities.length === 0)
      errs.push(t("setup.errorNeedAbility", "Cần ít nhất 1 kỹ năng"));
    if (abilities.length > MAX_ABILITIES_PER_ROLE)
      errs.push(t("setup.errorMaxAbilities", "Tối đa 5 kỹ năng"));
    abilities.forEach((ab, i) => {
      if (!ab.name.trim()) errs.push(`Kỹ năng ${i + 1}: tên trống`);
      if (ab.targetCount > playerCount)
        errs.push(`Kỹ năng ${i + 1}: target > số người chơi`);
    });
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    createCustomRole({ name: name.trim(), faction, abilities });
    // Reset form
    setName("");
    setFaction("villager");
    setAbilities([
      { id: uid(), name: "", type: "nightly", max: 1, targetCount: 1 },
    ]);
    setErrors([]);
    onClose();
  };

  const addAbilityRow = () => {
    if (abilities.length >= MAX_ABILITIES_PER_ROLE) return;
    setAbilities([
      ...abilities,
      { id: uid(), name: "", type: "nightly", max: 1, targetCount: 1 },
    ]);
  };

  const updateAb = (
    id: string,
    field: keyof Ability,
    value: string | number,
  ) => {
    setAbilities(
      abilities.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );
  };

  const removeAb = (id: string) => {
    setAbilities(abilities.filter((a) => a.id !== id));
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t("setup.createCustomRole")}
      icon="fa-wand-magic-sparkles"
      fullHeight
    >
      {/* Errors */}
      {errors.length > 0 && (
        <div
          role="alert"
          className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-3 mb-4 text-xs text-red-700 dark:text-red-300"
        >
          {errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}

      {/* Name */}
      <div className="mb-4">
        <label
          htmlFor="role-name"
          className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase mb-1 block"
        >
          {t("setup.roleName", "Tên Role")}
        </label>
        <input
          id="role-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("setup.roleNamePlaceholder", "VD: Thợ Rèn")}
          className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 dark:text-white"
          required
          aria-required="true"
        />
      </div>

      {/* Faction */}
      <div className="mb-4">
        <p className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase mb-2">
          {t("setup.faction", "Phe")}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {FACTION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFaction(opt.value)}
              className={`py-2 rounded-lg font-bold text-sm transition ${
                faction === opt.value
                  ? `${opt.color} text-white shadow-lg`
                  : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Abilities */}
      <div className="mb-4 flex-1">
        <p className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase mb-2">
          {t("setup.abilities", "Kỹ Năng")} ({abilities.length}/
          {MAX_ABILITIES_PER_ROLE})
        </p>
        <div className="space-y-3">
          {abilities.map((ab, i) => (
            <div
              key={ab.id}
              className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-gray-400 w-4">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={ab.name}
                  onChange={(e) => updateAb(ab.id, "name", e.target.value)}
                  placeholder={t("setup.abilityNamePlaceholder", "Tên kỹ năng")}
                  className="flex-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-white"
                  required
                />
                <button
                  onClick={() => removeAb(ab.id)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <i className="fas fa-trash-alt text-xs" />
                </button>
              </div>
              <div className="flex gap-2 ml-6">
                <button
                  onClick={() =>
                    updateAb(
                      ab.id,
                      "type",
                      ab.type === "nightly" ? "limited" : "nightly",
                    )
                  }
                  className="bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-2 py-1 text-[10px] font-bold text-gray-700 dark:text-slate-300"
                >
                  {ab.type === "nightly" ? "Đêm" : "Lần"}
                </button>
                {ab.type === "limited" && (
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={ab.max}
                    onChange={(e) =>
                      updateAb(ab.id, "max", parseInt(e.target.value) || 1)
                    }
                    className="w-12 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-2 py-1 text-[10px] text-center text-gray-900 dark:text-white"
                  />
                )}
                <input
                  type="number"
                  min={1}
                  max={playerCount}
                  value={ab.targetCount}
                  onChange={(e) =>
                    updateAb(
                      ab.id,
                      "targetCount",
                      parseInt(e.target.value) || 1,
                    )
                  }
                  className="w-12 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-2 py-1 text-[10px] text-center text-gray-900 dark:text-white"
                  aria-label="Target count"
                />
              </div>
            </div>
          ))}
        </div>
        {abilities.length < MAX_ABILITIES_PER_ROLE && (
          <button
            onClick={addAbilityRow}
            className="mt-2 text-xs text-indigo-500 font-bold hover:underline"
          >
            <i className="fas fa-plus mr-1" />
            {t("setup.addAbility", "Thêm kỹ năng")}
          </button>
        )}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm uppercase rounded-xl shadow-lg transition active:scale-[0.98] mt-auto"
      >
        <i className="fas fa-check mr-2" />
        {t("common.save")}
      </button>
    </BottomSheet>
  );
}
