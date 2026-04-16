import { useTranslation } from "react-i18next";
import { Moon } from "lucide-react";
import { useGameStore } from "../../store/game-store";
import { BottomSheet } from "../common/bottom-sheet";
import { playSound } from "../../utils/sounds";

interface NightConfirmSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NightConfirmSheet({ isOpen, onClose }: NightConfirmSheetProps) {
  const { t } = useTranslation();
  const nightCount = useGameStore((s) => s.nightCount);
  const nextNight = useGameStore((s) => s.nextNight);

  const handleConfirm = () => {
    playSound("night");
    nextNight();
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} icon={<Moon size={20} />}>
      <div aria-label={t("game.endTurn", { count: nightCount })}>
        <p className="text-center text-xl font-black text-text-primary mb-6">
          {t("game.endTurn", { count: nightCount })}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-bg-elevated text-text-secondary font-bold rounded-xl transition active:scale-95"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleConfirm}
            autoFocus
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition active:scale-95"
          >
            <Moon size={16} className="mr-2 inline" />
            {t("common.confirm")}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
