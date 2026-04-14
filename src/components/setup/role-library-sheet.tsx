import { useTranslation } from "react-i18next";
import { useGameStore } from "../../store/game-store";
import { BottomSheet } from "../common/bottom-sheet";
import { getFactionStyle } from "../../utils/faction-theme";
import type { Faction, Category } from "../../types/game";

interface RoleLibrarySheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCustom: () => void;
}

const GROUPS: {
  category: Category;
  faction: Faction;
  labelKey: string;
  color: string;
}[] = [
  {
    category: "basic",
    faction: "villager",
    labelKey: "library.basicVillager",
    color: "text-blue-400",
  },
  {
    category: "basic",
    faction: "wolf",
    labelKey: "library.basicWolf",
    color: "text-red-400",
  },
  {
    category: "advanced",
    faction: "villager",
    labelKey: "library.advancedVillager",
    color: "text-blue-300",
  },
  {
    category: "advanced",
    faction: "wolf",
    labelKey: "library.advancedWolf",
    color: "text-red-300",
  },
  {
    category: "advanced",
    faction: "third",
    labelKey: "library.thirdParty",
    color: "text-purple-400",
  },
];

export function RoleLibrarySheet({
  isOpen,
  onClose,
  onCreateCustom,
}: RoleLibrarySheetProps) {
  const { t } = useTranslation();
  const roleTemplates = useGameStore((s) => s.roleTemplates);
  const roles = useGameStore((s) => s.roles);
  const addRoleFromTemplate = useGameStore((s) => s.addRoleFromTemplate);

  const customTemplates = roleTemplates.filter((r) => r.category === "custom");

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t("setup.library")}
      icon="fa-book"
      fullHeight
    >
      {/* Create custom role button */}
      <button
        onClick={onCreateCustom}
        className="w-full mb-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-wide rounded-xl transition active:scale-[0.98]"
      >
        <i className="fas fa-plus-circle mr-2" />
        {t("setup.createCustomRole")}
      </button>

      {/* Role groups */}
      {GROUPS.map(({ category, faction, labelKey, color }) => {
        const list = roleTemplates.filter(
          (r) => r.category === category && r.faction === faction,
        );
        if (list.length === 0) return null;
        return (
          <div key={`${category}-${faction}`} className="mb-4">
            <h4
              className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${color}`}
            >
              {t(labelKey)}
            </h4>
            <div className="space-y-1.5">
              {list.map((tpl) => {
                const isAdded = roles.some((r) => r.templateId === tpl.id);
                const style = getFactionStyle(tpl.faction);
                return (
                  <button
                    key={tpl.id}
                    onClick={() => addRoleFromTemplate(tpl)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition active:scale-[0.98] ${
                      isAdded
                        ? `${style.bgLight} ${style.border} opacity-60`
                        : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-750"
                    }`}
                    aria-pressed={isAdded}
                  >
                    <span className={`font-bold text-sm ${style.text}`}>
                      {t(tpl.nameKey, tpl.name)}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">
                      {tpl.abilities.length > 0
                        ? `${tpl.abilities.length} skill`
                        : "passive"}
                      {isAdded && (
                        <i className="fas fa-check ml-2 text-emerald-400" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Custom roles section */}
      {customTemplates.length > 0 && (
        <div className="mb-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 text-amber-400">
            {t("library.custom")}
          </h4>
          <div className="space-y-1.5">
            {customTemplates.map((tpl) => {
              const isAdded = roles.some((r) => r.templateId === tpl.id);
              const style = getFactionStyle(tpl.faction);
              return (
                <button
                  key={tpl.id}
                  onClick={() => addRoleFromTemplate(tpl)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition ${
                    isAdded
                      ? `${style.bgLight} ${style.border} opacity-60`
                      : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                  }`}
                >
                  <span className={`font-bold text-sm ${style.text}`}>
                    {tpl.name}
                  </span>
                  {isAdded && (
                    <i className="fas fa-check text-emerald-400 text-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
