import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Drama, ChevronUp, ChevronDown } from "lucide-react";
import { useGameStore } from "../../store/game-store";
import { useSortedRoles } from "../../store/game-store-selectors";
import { BottomSheet } from "../common/bottom-sheet";
import { getFactionStyle } from "../../utils/faction-theme";
import { tr } from "../../utils/i18n-helpers";

interface AssignRoleSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssignRoleSheet({ isOpen, onClose }: AssignRoleSheetProps) {
  const { t } = useTranslation();
  const sortedRoles = useSortedRoles();
  const players = useGameStore((s) => s.players);
  const togglePlayerRole = useGameStore((s) => s.togglePlayerRole);
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t("game.assignRole")}
      icon={<Drama size={20} />}
      fullHeight
    >
      <div className="space-y-2">
        {sortedRoles.map((role) => {
          const style = getFactionStyle(role.faction);
          const isExpanded = expandedRoleId === role.id;
          const assignedPlayers = players.filter((p) => p.roleId === role.id);

          return (
            <div
              key={role.id}
              className="rounded-xl border border-border-default overflow-hidden"
            >
              <button
                onClick={() => setExpandedRoleId(isExpanded ? null : role.id)}
                className={`w-full flex items-center justify-between px-4 py-3 ${style.bgLight} transition`}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full ${style.bg} text-white text-xs font-black flex items-center justify-center`}
                  >
                    {role.order}
                  </span>
                  <span className={`font-bold ${style.textBright}`}>
                    {tr(t, role.nameKey, role.name)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {assignedPlayers.length > 0 && (
                    <span
                      className={`text-[10px] font-bold ${style.badge} text-white px-2 py-0.5 rounded-full`}
                    >
                      {assignedPlayers.length}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp size={14} className="text-text-muted" />
                  ) : (
                    <ChevronDown size={14} className="text-text-muted" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="p-3 grid grid-cols-4 gap-2 bg-bg-elevated/50">
                  {players.map((p) => {
                    const isAssigned = p.roleId === role.id;
                    const hasOtherRole =
                      p.roleId !== null && p.roleId !== role.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => togglePlayerRole(p.id, role.id)}
                        disabled={hasOtherRole}
                        className={`py-2 px-1 rounded-lg text-[11px] font-bold text-center transition active:scale-95 ${
                          isAssigned
                            ? `${style.bg} text-white ${style.shadow}`
                            : hasOtherRole
                              ? "bg-bg-elevated text-text-muted opacity-40 cursor-not-allowed"
                              : "bg-bg-card text-text-secondary border border-border-default"
                        }`}
                        aria-pressed={isAssigned}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </BottomSheet>
  );
}
