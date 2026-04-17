import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Moon, Settings, BookOpen, Play, AlertTriangle } from "lucide-react";
import { useGameStore } from "../../store/game-store";
import { PlayerConfig } from "./player-config";
import { RoleList } from "./role-list";
import { RoleLibrarySheet } from "./role-library-sheet";
import { CreateRoleSheet } from "./create-role-sheet";
import { SettingsSheet } from "../game/settings-sheet";
import { SelectorModal, type SelectorConfig } from "../common/selector-modal";

export function SetupScreen() {
  const { t } = useTranslation();
  const roles = useGameStore((s) => s.roles);
  const playerCount = useGameStore((s) => s.playerCount);
  const setStep = useGameStore((s) => s.setStep);
  const changeRoleOrder = useGameStore((s) => s.changeRoleOrder);
  const updateAbility = useGameStore((s) => s.updateAbility);

  const [showLibrary, setShowLibrary] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSelector, setActiveSelector] = useState<SelectorConfig | null>(
    null,
  );

  const handleSelectorSelect = (value: number | string) => {
    if (!activeSelector) return;
    const { type, roleId, abilityId } = activeSelector;
    if (type === "order") changeRoleOrder(roleId, value as number);
    else if (abilityId)
      updateAbility(
        roleId,
        abilityId,
        type === "skillType" ? "type" : type,
        value,
      );
    setActiveSelector(null);
  };

  const handleStartGame = () => {
    if (roles.length === 0) return;
    setStep("game");
  };

  return (
    <main className="min-h-screen bg-bg-app text-text-primary pb-8">
      {/* Header */}
      <div className="bg-bg-card border-b border-border-default p-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="w-10" />
        <h1 className="text-2xl font-black font-display uppercase tracking-wide text-indigo-400">
          <Moon size={20} className="mr-2 opacity-80 inline" />
          {t("setup.title")}
        </h1>
        <button
          onClick={() => setShowSettings(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:bg-bg-elevated transition"
          aria-label={t("settings.title")}
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Content — responsive 2-panel on tablet */}
      <div className="max-w-5xl mx-auto p-4 md:grid md:grid-cols-2 md:gap-6">
        {/* Left: Player Config */}
        <div className="mb-6 md:mb-0">
          <PlayerConfig />
        </div>

        {/* Right: Roles */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-text-secondary">
              {t("setup.roles")} ({roles.length})
            </h2>
            <button
              onClick={() => setShowLibrary(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition active:scale-95"
            >
              <BookOpen size={12} className="mr-1 inline" />
              {t("setup.library")}
            </button>
          </div>
          <RoleList onOpenSelector={setActiveSelector} />
        </div>
      </div>

      {/* Progress + Warning */}
      <div className="max-w-5xl mx-auto px-4 mt-4">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div
            className={`flex items-center gap-1 text-xs font-bold ${playerCount > 0 ? "text-emerald-400" : "text-text-muted"}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${playerCount > 0 ? "bg-emerald-400" : "bg-text-muted"}`}
            />
            {playerCount} {t("setup.playerCount")}
          </div>
          <div className="w-6 h-0.5 bg-border-default rounded-full" />
          <div
            className={`flex items-center gap-1 text-xs font-bold ${roles.length > 0 ? "text-emerald-400" : "text-text-muted"}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${roles.length > 0 ? "bg-emerald-400" : "bg-text-muted"}`}
            />
            {roles.length} {t("setup.roles")}
          </div>
          <div className="w-6 h-0.5 bg-border-default rounded-full" />
          <div
            className={`flex items-center gap-1 text-xs font-bold ${roles.length > 0 ? "text-indigo-400" : "text-text-muted"}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${roles.length > 0 ? "bg-indigo-400" : "bg-text-muted"}`}
            />
            Go!
          </div>
        </div>

        {/* Role count warning */}
        {roles.length > 0 && roles.length < playerCount && (
          <div className="flex items-center gap-2 bg-amber-900/20 border border-amber-500/30 rounded-lg px-3 py-2 mb-3">
            <AlertTriangle size={14} className="text-amber-400 shrink-0" />
            <p className="text-[11px] text-amber-400 font-bold">
              {roles.length} {t("setup.roles")} / {playerCount}{" "}
              {t("setup.playerCount")} —{" "}
              {t("setup.willBeVillager", {
                count: Math.abs(playerCount - roles.length),
              })}
            </p>
          </div>
        )}

        <button
          onClick={handleStartGame}
          disabled={roles.length === 0}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-lg uppercase tracking-widest rounded-xl shadow-lg transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play size={16} className="mr-2 inline" />
          {t("setup.startGame")}
        </button>
      </div>

      {/* Modals */}
      <RoleLibrarySheet
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onCreateCustom={() => {
          setShowLibrary(false);
          setShowCreateRole(true);
        }}
      />
      <CreateRoleSheet
        isOpen={showCreateRole}
        onClose={() => setShowCreateRole(false)}
      />
      <SettingsSheet
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      {activeSelector && (
        <SelectorModal
          selector={activeSelector}
          rolesCount={roles.length}
          playerCount={playerCount}
          onClose={() => setActiveSelector(null)}
          onSelect={handleSelectorSelect}
        />
      )}
    </main>
  );
}
