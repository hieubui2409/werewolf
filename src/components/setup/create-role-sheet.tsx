import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, Trash2, Plus, Check } from "lucide-react";
import { useGameStore } from "../../store/game-store";
import { BottomSheet } from "../common/bottom-sheet";
import { MAX_ABILITIES_PER_ROLE } from "../../data/default-roles";
import type { Faction, Ability } from "../../types/game";
import { uid } from "../../utils/uid";

interface CreateRoleSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const FACTION_OPTIONS: { value: Faction; labelKey: string; color: string }[] = [
  { value: "villager", labelKey: "factions.villager", color: "bg-blue-600" },
  { value: "wolf", labelKey: "factions.wolf", color: "bg-red-600" },
  { value: "third", labelKey: "factions.third", color: "bg-purple-600" },
];

export function CreateRoleSheet({ isOpen, onClose }: CreateRoleSheetProps) {
  const { t } = useTranslation();
  const createCustomRole = useGameStore((s) => s.createCustomRole);
  const playerCount = useGameStore((s) => s.playerCount);
  const existingRoles = useGameStore((s) => s.roles);

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
    const isDuplicate = existingRoles.some(
      (r) => r.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );
    if (isDuplicate)
      errs.push(t("setup.errorDuplicateName", "Tên role đã tồn tại"));
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
      icon={<Sparkles size={20} />}
      fullHeight
    >
      {/* Errors */}
      {errors.length > 0 && (
        <div
          role="alert"
          className="bg-red-900/30 border border-red-700 rounded-lg p-3 mb-4 text-xs text-red-400"
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
          className="text-xs font-bold text-text-secondary uppercase mb-1 block"
        >
          {t("setup.roleName", "Tên Role")}
        </label>
        <input
          id="role-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("setup.roleNamePlaceholder", "VD: Thợ Rèn")}
          className="w-full bg-bg-elevated border border-border-default rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-text-primary"
          required
          aria-required="true"
        />
      </div>

      {/* Faction */}
      <div className="mb-4">
        <p className="text-xs font-bold text-text-secondary uppercase mb-2">
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
                  : "bg-bg-elevated text-text-secondary"
              }`}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Abilities */}
      <div className="mb-4 flex-1">
        <p className="text-xs font-bold text-text-secondary uppercase mb-2">
          {t("setup.abilities", "Kỹ Năng")} ({abilities.length}/
          {MAX_ABILITIES_PER_ROLE})
        </p>
        <div className="space-y-3">
          {abilities.map((ab, i) => (
            <div
              key={ab.id}
              className="bg-bg-elevated rounded-lg p-3 border border-border-default"
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
                  className="flex-1 bg-bg-card border border-border-default rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-text-primary"
                  required
                />
                <button
                  onClick={() => removeAb(ab.id)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 size={14} />
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
                  className="bg-bg-elevated border border-border-default rounded px-2 py-1 text-[10px] font-bold text-text-secondary"
                >
                  {ab.type === "nightly"
                    ? t("ability.night", "Đêm")
                    : t("ability.limited", "Lần")}
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
                    className="w-12 bg-bg-card border border-border-default rounded px-2 py-1 text-[10px] text-center text-text-primary"
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
                  className="w-12 bg-bg-card border border-border-default rounded px-2 py-1 text-[10px] text-center text-text-primary"
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
            <Plus size={12} className="mr-1 inline" />
            {t("setup.addAbility", "Thêm kỹ năng")}
          </button>
        )}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm uppercase rounded-xl shadow-lg transition active:scale-[0.98] mt-auto"
      >
        <Check size={16} className="mr-2 inline" />
        {t("common.save")}
      </button>
    </BottomSheet>
  );
}
