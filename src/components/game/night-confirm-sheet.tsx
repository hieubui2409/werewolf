import { useTranslation } from "react-i18next";
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
    <BottomSheet isOpen={isOpen} onClose={onClose} icon="fa-moon">
      <div aria-label={t("game.endTurn", { count: nightCount })}>
        <p className="text-center text-xl font-black text-gray-800 dark:text-white mb-6">
          {t("game.endTurn", { count: nightCount })}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-bold rounded-xl transition active:scale-95"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleConfirm}
            autoFocus
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition active:scale-95"
          >
            <i className="fas fa-moon mr-2" />
            {t("common.confirm")}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
