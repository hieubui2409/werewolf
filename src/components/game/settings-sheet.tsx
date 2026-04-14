import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const toggleTheme = () => {
    const next = document.documentElement.classList.toggle("dark");
    localStorage.setItem("werewolf-theme", next ? "dark" : "light");
    setIsDark(next);
  };

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
      icon="fa-cog"
      fullHeight
    >
      <div className="space-y-6">
        {/* Card View Mode */}
        <div>
          <label className="text-sm font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2 block">
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
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
                }`}
              >
                {t(m.labelKey, m.value)}
              </button>
            ))}
          </div>
        </div>

        {/* Timer Settings */}
        <div>
          <label className="text-sm font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2 block">
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
          <label className="text-sm font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2 block">
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

        {/* Theme Toggle */}
        <div>
          <label className="text-sm font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2 block">
            {t("settings.theme")}
          </label>
          <div
            role="radiogroup"
            aria-label={t("settings.theme")}
            className="flex gap-2"
          >
            <button
              role="radio"
              aria-checked={isDark}
              onClick={() => {
                if (!isDark) toggleTheme();
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition active:scale-95 ${
                isDark
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
              }`}
            >
              <i className="fas fa-moon mr-1" /> {t("settings.dark")}
            </button>
            <button
              role="radio"
              aria-checked={!isDark}
              onClick={() => {
                if (isDark) toggleTheme();
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition active:scale-95 ${
                !isDark
                  ? "bg-amber-500 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
              }`}
            >
              <i className="fas fa-sun mr-1" /> {t("settings.light")}
            </button>
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="text-sm font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2 block">
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
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
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
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Reset */}
        <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition active:scale-95 uppercase"
              aria-describedby="reset-warning"
            >
              <i className="fas fa-trash mr-2" />
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
                  className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-bold rounded-xl transition active:scale-95"
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
