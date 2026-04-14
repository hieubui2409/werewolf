import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../../store/game-store";
import {
  useRoleMap,
  usePlayerActionMap,
  useSortedPlayers,
} from "../../store/game-store-selectors";
import { TimerBoard } from "./timer-board";
import { PlayerCard } from "./player-card";
import { AssignRoleSheet } from "./assign-role-sheet";
import { SkillSheet } from "./skill-sheet";
import { PlayerActionSheet } from "./player-action-sheet";
import { HistorySheet } from "./history-sheet";
import { NightConfirmSheet } from "./night-confirm-sheet";
import { SettingsSheet } from "./settings-sheet";

type ModalType = "assign" | "skill" | "history" | "night" | "settings" | null;

const EMPTY_ACTIONS: import("../../types/game").ActionLog[] = [];

export function GameScreen() {
  const { t } = useTranslation();
  const nightCount = useGameStore((s) => s.nightCount);
  const timerSettings = useGameStore((s) => s.timerSettings);
  const cardViewMode = useGameStore((s) => s.cardViewMode);
  const flippedCards = useGameStore((s) => s.flippedCards);
  const flipCard = useGameStore((s) => s.flipCard);
  const undoAction = useGameStore((s) => s.undoAction);

  const sortedPlayers = useSortedPlayers();
  const roleMap = useRoleMap();
  const actionMap = usePlayerActionMap();

  const [modal, setModal] = useState<ModalType>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  const openModal = useCallback((m: "history" | "night" | "settings") => {
    setModal(m);
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const handleSelectPlayer = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlayer(id);
  }, []);

  const handleUndoAction = useCallback(
    (actionId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      undoAction(actionId);
    },
    [undoAction],
  );

  return (
    <div className="h-dvh flex flex-col md:flex-row bg-gray-100 dark:bg-slate-950">
      {/* Timer sidebar/bar */}
      <TimerBoard
        settings={timerSettings}
        nightCount={nightCount}
        onOpenModal={openModal}
        onOpenAssign={() => setModal("assign")}
        onOpenSkill={() => setModal("skill")}
      />

      {/* Main player grid */}
      <main className="flex-1 overflow-y-auto min-h-0 p-2 md:p-4 pb-20 md:pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 items-start content-start">
          {sortedPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              role={player.roleId ? roleMap.get(player.roleId) : undefined}
              actions={actionMap.get(player.id) ?? EMPTY_ACTIONS}
              isFlipped={!!flippedCards[player.id]}
              viewMode={cardViewMode}
              onFlip={flipCard}
              onSelect={handleSelectPlayer}
              onUndoAction={handleUndoAction}
            />
          ))}
        </div>
      </main>

      {/* Action buttons — fixed bottom on mobile, sidebar bottom on desktop */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20 md:hidden">
        <button
          onClick={() => setModal("assign")}
          className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black rounded-2xl shadow-[0_5px_15px_rgba(16,185,129,0.4)] active:scale-95 transition uppercase text-xs"
        >
          <i className="fas fa-theater-masks mr-1.5" />
          {t("game.assignRole")}
        </button>
        <button
          onClick={() => setModal("skill")}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl shadow-[0_5px_15px_rgba(99,102,241,0.4)] active:scale-95 transition uppercase text-xs"
        >
          <i className="fas fa-wand-sparkles mr-1.5" />
          {t("game.useSkill")}
        </button>
      </div>

      {/* Sheets — replace strategy: only one open at a time */}
      <AssignRoleSheet isOpen={modal === "assign"} onClose={closeModal} />
      <SkillSheet isOpen={modal === "skill"} onClose={closeModal} />
      <PlayerActionSheet
        playerId={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
      <HistorySheet isOpen={modal === "history"} onClose={closeModal} />
      <NightConfirmSheet isOpen={modal === "night"} onClose={closeModal} />
      <SettingsSheet isOpen={modal === "settings"} onClose={closeModal} />
    </div>
  );
}
