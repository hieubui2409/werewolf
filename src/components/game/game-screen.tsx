import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Drama, Wand2 } from "lucide-react";
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
import type { SkillContext } from "./skill-sheet";
import { PlayerActionSheet } from "./player-action-sheet";
import { HistorySheet } from "./history-sheet";
import { NightConfirmSheet } from "./night-confirm-sheet";
import { SettingsSheet } from "./settings-sheet";
import { NightTransitionOverlay } from "./night-transition-overlay";
import type { Ability } from "../../types/game";

type ModalType = "assign" | "skill" | "history" | "night" | "settings" | null;

const EMPTY_ACTIONS: import("../../types/game").ActionLog[] = [];

function isTypingContext(e: KeyboardEvent): boolean {
  const t = e.target as HTMLElement;
  if (!t) return false;
  const tag = t.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (t.isContentEditable) return true;
  if (t.getAttribute("role") === "textbox") return true;
  return false;
}

export function GameScreen() {
  const { t } = useTranslation();
  const nightCount = useGameStore((s) => s.nightCount);
  const timerSettings = useGameStore((s) => s.timerSettings);
  const cardViewMode = useGameStore((s) => s.cardViewMode);
  const flippedCards = useGameStore((s) => s.flippedCards);
  const flipCard = useGameStore((s) => s.flipCard);
  const undoAction = useGameStore((s) => s.undoAction);
  const redoAction = useGameStore((s) => s.redoAction);
  const actionLog = useGameStore((s) => s.actionLog);
  const redoStack = useGameStore((s) => s.redoStack);

  const sortedPlayers = useSortedPlayers();
  const roleMap = useRoleMap();
  const actionMap = usePlayerActionMap();

  const timerStartRef = useRef<
    ((seconds: number, type: "debate" | "judgment") => void) | null
  >(null);

  const [modal, setModal] = useState<ModalType>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [skillContext, setSkillContext] = useState<SkillContext | null>(null);
  const [nightOverlay, setNightOverlay] = useState(false);

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

  const handleUseSkill = useCallback(
    (roleId: string, ability: Ability, e: React.MouseEvent) => {
      e.stopPropagation();
      setSkillContext({ ability, roleId });
      setModal("skill");
    },
    [],
  );

  const closeSkillSheet = useCallback(() => {
    setModal(null);
    setSkillContext(null);
  }, []);

  const openAssign = useCallback(() => setModal("assign"), []);
  const openSkillFresh = useCallback(() => {
    setSkillContext(null);
    setModal("skill");
  }, []);

  const closePlayerSheet = useCallback(() => setSelectedPlayer(null), []);
  const handlePlayerSheetSkill = useCallback(
    (roleId: string, ability: Ability) => {
      setSelectedPlayer(null);
      setSkillContext({ ability, roleId });
      setModal("skill");
    },
    [],
  );

  // U6: Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const hasUI = modal || selectedPlayer !== null;
        if (modal) setModal(null);
        if (selectedPlayer !== null) setSelectedPlayer(null);
        if (hasUI) e.stopImmediatePropagation();
        return;
      }
      if (isTypingContext(e)) return;

      // Ctrl+Z / Ctrl+Shift+Z undo/redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          if (redoStack.length > 0) redoAction();
        } else {
          if (actionLog.length > 0) {
            const lastAction = actionLog[actionLog.length - 1];
            undoAction(lastAction.id);
          }
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case "n":
          if (!modal) setModal("night");
          break;
        case "h":
          setModal((prev) => (prev === "history" ? null : "history"));
          break;
        case "s":
          setModal((prev) => (prev === "settings" ? null : "settings"));
          break;
        case "d":
          if (!modal) timerStartRef.current?.(timerSettings.debate, "debate");
          break;
        case "j":
          if (!modal)
            timerStartRef.current?.(timerSettings.judgment, "judgment");
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    modal,
    selectedPlayer,
    actionLog,
    redoStack,
    undoAction,
    redoAction,
    timerSettings,
  ]);

  // ANIM6: Show overlay after night confirm
  const handleNightOverlayComplete = useCallback(
    () => setNightOverlay(false),
    [],
  );

  // Listen for nightCount changes to trigger overlay
  const prevNight = useRef(nightCount);
  useEffect(() => {
    if (nightCount > prevNight.current) {
      setNightOverlay(true);
    }
    prevNight.current = nightCount;
  }, [nightCount]);

  return (
    <div
      className={`h-dvh flex flex-col md:flex-row bg-bg-app ${nightCount > 0 ? "night-atmosphere" : ""}`}
    >
      {/* Timer sidebar/bar */}
      <TimerBoard
        settings={timerSettings}
        nightCount={nightCount}
        onOpenModal={openModal}
        onOpenAssign={openAssign}
        onOpenSkill={openSkillFresh}
        timerStartRef={timerStartRef}
      />

      {/* Main player grid */}
      <main className="flex-1 overflow-y-auto min-h-0 p-2 md:p-4 pb-20 md:pb-4">
        <div className="grid grid-cols-2 landscape:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 content-start">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className="card-enter h-full"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <PlayerCard
                player={player}
                role={player.roleId ? roleMap.get(player.roleId) : undefined}
                actions={actionMap.get(player.id) ?? EMPTY_ACTIONS}
                isFlipped={!!flippedCards[player.id]}
                viewMode={cardViewMode}
                onFlip={flipCard}
                onSelect={handleSelectPlayer}
                onUndoAction={handleUndoAction}
                onUseSkill={handleUseSkill}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Fixed action buttons — mobile only */}
      <div className="fixed bottom-4 right-4 z-20 md:hidden flex flex-col items-center gap-2">
        <button
          onClick={openAssign}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-elevated flex items-center justify-center active:scale-95 transition"
          aria-label={t("game.assignRole")}
        >
          <Drama size={20} />
        </button>
        <button
          onClick={openSkillFresh}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-elevated flex items-center justify-center active:scale-95 transition"
          aria-label={t("game.useSkill")}
        >
          <Wand2 size={20} />
        </button>
      </div>

      {/* Night transition overlay */}
      {nightOverlay && (
        <NightTransitionOverlay
          nightCount={nightCount}
          onComplete={handleNightOverlayComplete}
        />
      )}

      {/* H8: Lazy mount — only render open sheets */}
      {modal === "assign" && <AssignRoleSheet isOpen onClose={closeModal} />}
      {modal === "skill" && (
        <SkillSheet
          isOpen
          onClose={closeSkillSheet}
          initialContext={skillContext}
        />
      )}
      {selectedPlayer !== null && (
        <PlayerActionSheet
          playerId={selectedPlayer}
          onClose={closePlayerSheet}
          onUseSkill={handlePlayerSheetSkill}
        />
      )}
      {modal === "history" && <HistorySheet isOpen onClose={closeModal} />}
      {modal === "night" && <NightConfirmSheet isOpen onClose={closeModal} />}
      {modal === "settings" && <SettingsSheet isOpen onClose={closeModal} />}
    </div>
  );
}
