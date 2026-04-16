import { useTranslation } from "react-i18next";
import { BookOpen, PlusCircle, Check, Trash2 } from "lucide-react";
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
  const deleteCustomTemplate = useGameStore((s) => s.deleteCustomTemplate);

  const customTemplates = roleTemplates.filter((r) => r.category === "custom");

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t("setup.library")}
      icon={<BookOpen size={20} />}
      fullHeight
    >
      {/* Create custom role button */}
      <button
        onClick={onCreateCustom}
        className="w-full mb-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-wide rounded-xl transition active:scale-[0.98]"
      >
        <PlusCircle size={16} className="mr-2 inline" />
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
                        : "bg-bg-card border-border-default hover:bg-bg-elevated"
                    }`}
                    aria-pressed={isAdded}
                  >
                    <span className={`font-bold text-sm ${style.text}`}>
                      {t(tpl.nameKey, tpl.name)}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {tpl.abilities.length > 0
                        ? `${tpl.abilities.length} ${t("ability.skill", "skill")}`
                        : t("ability.passive", "passive")}
                      {isAdded && (
                        <Check
                          size={12}
                          className="ml-2 text-emerald-400 inline"
                        />
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
                <div key={tpl.id} className="flex items-center gap-1.5">
                  <button
                    onClick={() => addRoleFromTemplate(tpl)}
                    className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-lg border transition ${
                      isAdded
                        ? `${style.bgLight} ${style.border} opacity-60`
                        : "bg-bg-card border-border-default"
                    }`}
                  >
                    <span className={`font-bold text-sm ${style.text}`}>
                      {tpl.name}
                    </span>
                    {isAdded && (
                      <Check size={12} className="text-emerald-400" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          t("setup.confirmDeleteRole", "Delete?").replace(
                            "{{name}}",
                            tpl.name,
                          ),
                        )
                      ) {
                        deleteCustomTemplate(tpl.id);
                      }
                    }}
                    className="w-8 h-8 rounded-lg bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-800/50 transition shrink-0"
                    aria-label={`${t("common.delete")} ${tpl.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
