import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Settings, Trash2, Volume2, VolumeX } from "lucide-react";
import { useGameStore } from "../../store/game-store";
import { BottomSheet } from "../common/bottom-sheet";
import type { CardViewMode } from "../../types/game";

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const VIEW_MODES: { value: CardViewMode; labelKey: string }[] = [
  { value: "nameFirst", labelKey: "settings.nameFirst" },
  { value: "roleFirst", labelKey: "settings.roleFirst" },
  { value: "both", labelKey: "settings.bothView" },
];

export function SettingsSheet({ isOpen, onClose }: SettingsSheetProps) {
  const { t, i18n } = useTranslation();
  const cardViewMode = useGameStore((s) => s.cardViewMode);
  const timerSettings = useGameStore((s) => s.timerSettings);
  const setCardViewMode = useGameStore((s) => s.setCardViewMode);
  const setTimerSettings = useGameStore((s) => s.setTimerSettings);
  const resetGame = useGameStore((s) => s.resetGame);
  const [showReset, setShowReset] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleReset = () => {
    resetGame();
    setShowReset(false);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t("settings.title", "Cài Đặt")}
      icon={<Settings size={20} />}
      fullHeight
    >
      <div className="space-y-6">
        {/* Card View Mode */}
        <div>
          <label className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 block">
            {t("settings.cardView")}
          </label>
          <div
            role="radiogroup"
            aria-label={t("settings.cardView")}
            className="flex gap-2"
          >
            {VIEW_MODES.map((m) => (
              <button
                key={m.value}
                role="radio"
                aria-checked={cardViewMode === m.value}
                onClick={() => setCardViewMode(m.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition active:scale-95 ${
                  cardViewMode === m.value
                    ? "bg-cta text-white shadow-lg"
                    : "bg-bg-elevated text-text-secondary"
                }`}
              >
                {t(m.labelKey, m.value)}
              </button>
            ))}
          </div>
        </div>

        {/* Timer Settings */}
        <div>
          <label className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 block">
            {t("settings.debateTime")}:{" "}
            <span className="text-indigo-500">{timerSettings.debate}s</span>
          </label>
          <input
            type="range"
            min={10}
            max={300}
            step={10}
            value={timerSettings.debate}
            onChange={(e) =>
              setTimerSettings({
                ...timerSettings,
                debate: Number(e.target.value),
              })
            }
            aria-label={t("settings.debateTime")}
            aria-valuetext={`${timerSettings.debate} seconds`}
            className="w-full accent-indigo-600"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 block">
            {t("settings.judgmentTime")}:{" "}
            <span className="text-red-500">{timerSettings.judgment}s</span>
          </label>
          <input
            type="range"
            min={10}
            max={120}
            step={5}
            value={timerSettings.judgment}
            onChange={(e) =>
              setTimerSettings({
                ...timerSettings,
                judgment: Number(e.target.value),
              })
            }
            aria-label={t("settings.judgmentTime")}
            aria-valuetext={`${timerSettings.judgment} seconds`}
            className="w-full accent-red-600"
          />
        </div>

        {/* Mute Sounds */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">
            {t("settings.muteSounds")}
          </label>
          <button
            onClick={() =>
              setTimerSettings({
                ...timerSettings,
                muted: !timerSettings.muted,
              })
            }
            className={`w-12 h-7 rounded-full transition-colors relative ${
              timerSettings.muted ? "bg-red-600" : "bg-bg-elevated"
            }`}
            role="switch"
            aria-checked={timerSettings.muted}
            aria-label={t("settings.muteSounds")}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
                timerSettings.muted ? "translate-x-5" : "translate-x-0"
              }`}
            >
              {timerSettings.muted ? (
                <VolumeX size={12} className="text-red-600" />
              ) : (
                <Volume2 size={12} className="text-text-muted" />
              )}
            </span>
          </button>
        </div>

        {/* Language */}
        <div>
          <label className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 block">
            {t("settings.language")}
          </label>
          <div
            role="radiogroup"
            aria-label={t("settings.language")}
            className="flex gap-2"
          >
            <button
              role="radio"
              aria-checked={i18n.language === "vi"}
              onClick={() => changeLanguage("vi")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition active:scale-95 ${
                i18n.language === "vi"
                  ? "bg-cta text-white shadow-lg"
                  : "bg-bg-elevated text-text-secondary"
              }`}
            >
              Tiếng Việt
            </button>
            <button
              role="radio"
              aria-checked={i18n.language === "en"}
              onClick={() => changeLanguage("en")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition active:scale-95 ${
                i18n.language === "en"
                  ? "bg-cta text-white shadow-lg"
                  : "bg-bg-elevated text-text-secondary"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Reset */}
        <div className="pt-4 border-t border-border-default">
          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition active:scale-95 uppercase"
              aria-describedby="reset-warning"
            >
              <Trash2 size={16} className="mr-2 inline" />
              {t("settings.resetGame")}
            </button>
          ) : (
            <div role="alertdialog" aria-label={t("settings.resetGame")}>
              <p
                id="reset-warning"
                className="text-sm text-red-500 font-bold text-center mb-3"
              >
                {t("settings.resetWarning", "Toàn bộ dữ liệu game sẽ bị xoá!")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 py-3 bg-bg-elevated text-text-secondary font-bold rounded-xl transition active:scale-95"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 bg-red-600 text-white font-black rounded-xl transition active:scale-95"
                >
                  {t("common.confirm")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
