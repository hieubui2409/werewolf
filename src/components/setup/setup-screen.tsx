import { useState } from "react";
import { useTranslation } from "react-i18next";
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
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="w-10" />
        <h1 className="text-2xl font-black font-['Bungee'] uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          <i className="fas fa-moon mr-2 opacity-80" />
          {t("setup.title")}
        </h1>
        <button
          onClick={() => setShowSettings(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          aria-label={t("settings.title")}
        >
          <i className="fas fa-cog text-lg" />
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
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-slate-400">
              {t("setup.roles")} ({roles.length})
            </h2>
            <button
              onClick={() => setShowLibrary(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition active:scale-95"
            >
              <i className="fas fa-book mr-1" />
              {t("setup.library")}
            </button>
          </div>
          <RoleList onOpenSelector={setActiveSelector} />
        </div>
      </div>

      {/* Start Game Button */}
      <div className="max-w-5xl mx-auto px-4 mt-4">
        <button
          onClick={handleStartGame}
          disabled={roles.length === 0}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-lg uppercase tracking-widest rounded-xl shadow-lg transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i className="fas fa-play mr-2" />
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
