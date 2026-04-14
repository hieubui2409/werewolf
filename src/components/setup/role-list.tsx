import { useTranslation } from "react-i18next";
import { useGameStore } from "../../store/game-store";
import { useSortedRoles } from "../../store/game-store-selectors";
import { getFactionStyle } from "../../utils/faction-theme";
import { MAX_ABILITIES_PER_ROLE } from "../../data/default-roles";
import type { SelectorConfig } from "../common/selector-modal";

interface RoleListProps {
  onOpenSelector: (config: SelectorConfig) => void;
}

export function RoleList({ onOpenSelector }: RoleListProps) {
  const { t } = useTranslation();
  const sortedRoles = useSortedRoles();
  const updateRoleName = useGameStore((s) => s.updateRoleName);
  const deleteRole = useGameStore((s) => s.deleteRole);
  const addAbility = useGameStore((s) => s.addAbility);
  const updateAbility = useGameStore((s) => s.updateAbility);
  const deleteAbility = useGameStore((s) => s.deleteAbility);

  return (
    <div className="space-y-3">
      {sortedRoles.map((role) => {
        const style = getFactionStyle(role.faction);
        return (
          <article
            key={role.id}
            aria-label={role.name}
            className={`relative bg-gray-50 dark:bg-slate-800/80 rounded-xl p-3 border-l-4 ${style.borderSolid} border border-gray-200 dark:border-slate-700`}
          >
            {/* Delete role button */}
            <button
              onClick={() => deleteRole(role.id)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-700 transition z-10"
              aria-label={`${t("common.delete")} ${role.name}`}
            >
              <i className="fas fa-times text-[10px]" />
            </button>

            {/* Role header */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() =>
                  onOpenSelector({
                    type: "order",
                    roleId: role.id,
                    abilityId: null,
                    currentValue: role.order,
                  })
                }
                className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0 hover:bg-indigo-700 transition"
                aria-label={`Order ${role.order}`}
              >
                {role.order}
              </button>
              <input
                type="text"
                value={role.name}
                onChange={(e) => updateRoleName(role.id, e.target.value)}
                className={`flex-1 bg-transparent border-b border-gray-300 dark:border-slate-600 px-1 py-0.5 text-sm font-bold ${style.text} focus:outline-none focus:border-indigo-500`}
                aria-label={`Role name`}
              />
            </div>

            {/* Abilities */}
            <div className="space-y-1.5 ml-10">
              {role.abilities.map((ab) => (
                <div
                  key={ab.id}
                  className="flex items-center gap-1.5 flex-wrap"
                >
                  <input
                    type="text"
                    value={ab.name}
                    onChange={(e) =>
                      updateAbility(role.id, ab.id, "name", e.target.value)
                    }
                    className="flex-1 min-w-[80px] bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-2 py-1 text-[11px] text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() =>
                      onOpenSelector({
                        type: "skillType",
                        roleId: role.id,
                        abilityId: ab.id,
                        currentValue: ab.type,
                      })
                    }
                    className="bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-2 py-1 text-[9px] font-bold text-gray-700 dark:text-slate-300"
                  >
                    {ab.type === "nightly"
                      ? t("setup.nightly", "Đêm")
                      : t("setup.limited", "Lần")}
                  </button>
                  {ab.type === "limited" && (
                    <button
                      onClick={() =>
                        onOpenSelector({
                          type: "max",
                          roleId: role.id,
                          abilityId: ab.id,
                          currentValue: ab.max,
                        })
                      }
                      className="bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-2 py-1 text-[9px] font-bold text-gray-700 dark:text-slate-300"
                    >
                      x{ab.max}
                    </button>
                  )}
                  <button
                    onClick={() =>
                      onOpenSelector({
                        type: "targetCount",
                        roleId: role.id,
                        abilityId: ab.id,
                        currentValue: ab.targetCount,
                      })
                    }
                    className="bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-2 py-1 text-[9px] font-bold text-gray-700 dark:text-slate-300"
                  >
                    <i className="fas fa-crosshairs mr-0.5" />
                    {ab.targetCount}
                  </button>
                  <button
                    onClick={() => deleteAbility(role.id, ab.id)}
                    className="text-red-400 hover:text-red-600 text-xs p-1"
                    aria-label={`${t("common.delete")} ${ab.name}`}
                  >
                    <i className="fas fa-trash-alt text-[10px]" />
                  </button>
                </div>
              ))}
              {role.abilities.length < MAX_ABILITIES_PER_ROLE && (
                <button
                  onClick={() => addAbility(role.id)}
                  className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold hover:underline"
                >
                  <i className="fas fa-plus mr-1" />
                  {t("setup.addAbility", "Thêm kỹ năng")}
                </button>
              )}
            </div>
          </article>
        );
      })}

      {sortedRoles.length === 0 && (
        <p className="text-center text-gray-400 dark:text-slate-500 text-sm py-8 italic">
          {t("setup.noRoles", "Chưa có vai trò nào. Mở Thư Viện để thêm.")}
        </p>
      )}
    </div>
  );
}
