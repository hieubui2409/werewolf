import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useTimer } from "../../hooks/use-timer";
import type { TimerSettings } from "../../types/game";

interface TimerBoardProps {
  settings: TimerSettings;
  nightCount: number;
  onOpenModal: (modal: "history" | "night" | "settings") => void;
  onOpenAssign: () => void;
  onOpenSkill: () => void;
}

export const TimerBoard = memo(function TimerBoard({
  settings,
  nightCount,
  onOpenModal,
  onOpenAssign,
  onOpenSkill,
}: TimerBoardProps) {
  const { t } = useTranslation();
  const { timer, start, togglePause, stop } = useTimer();

  return (
    <>
      {/* Fullscreen timer overlay */}
      {timer.active && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
          role="status"
          aria-live="polite"
        >
          <h2
            className={`text-2xl font-black uppercase tracking-widest mb-10 ${timer.type === "debate" ? "text-orange-400" : "text-red-400"}`}
          >
            {timer.type === "debate"
              ? t("game.debate", "Tranh Luận")
              : t("game.judgment", "Phán Quyết")}
          </h2>
          <div
            className={`text-[120px] font-black font-['Bungee'] timer-glow-pulse mb-16 leading-none ${timer.type === "debate" ? "text-orange-500" : "text-red-600"}`}
          >
            {Math.floor(timer.value / 60)
              .toString()
              .padStart(2, "0")}
            :{(timer.value % 60).toString().padStart(2, "0")}
          </div>
          <div className="flex gap-6 w-full max-w-sm">
            <button
              onClick={togglePause}
              className="flex-1 py-5 bg-slate-800 border-2 border-slate-600 rounded-[2rem] text-3xl shadow-xl flex items-center justify-center active:scale-95 transition"
              aria-label={timer.paused ? "Resume" : "Pause"}
            >
              <i
                className={`fas ${timer.paused ? "fa-play text-emerald-400" : "fa-pause text-amber-400"}`}
              />
            </button>
            <button
              onClick={stop}
              className="flex-1 py-5 bg-red-900 border-2 border-red-600 rounded-[2rem] text-3xl shadow-xl flex items-center justify-center active:scale-95 transition"
              aria-label="Stop"
            >
              <i className="fas fa-stop text-red-300" />
            </button>
          </div>
        </div>
      )}

      {/* Top bar / sidebar bar */}
      <div className="bg-white dark:bg-slate-900 p-2 border-b-2 border-gray-200 dark:border-slate-800 flex md:flex-col justify-between items-center z-10 shadow-sm shrink-0 md:rounded-none mx-2 mt-2 md:mx-0 md:mt-0 md:border-b-0 md:border-r-2 md:p-4 rounded-b-2xl">
        {/* Timer row: portrait=sides via contents, landscape=top row side-by-side */}
        <div className="contents md:flex md:flex-col md:gap-2 md:w-full md:mb-2">
          {/* Debate timer */}
          <div className="flex flex-col items-center flex-1">
            <button
              onClick={() => start(settings.debate, "debate")}
              className="py-2 px-4 md:w-full rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-1 bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-lg active:scale-95 transition"
            >
              <i className="fas fa-play" /> {t("game.debate")}
            </button>
          </div>
          {/* Judgment timer */}
          <div className="flex flex-col items-center flex-1 order-last md:order-none">
            <button
              onClick={() => start(settings.judgment, "judgment")}
              className="py-2 px-4 md:w-full rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-1 bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg active:scale-95 transition"
            >
              <i className="fas fa-play" /> {t("game.judgment")}
            </button>
          </div>
        </div>

        {/* Center buttons */}
        <div className="flex flex-col md:flex-col items-center gap-1 md:gap-3 border-x-2 md:border-x-0 md:border-y-2 border-gray-200 dark:border-slate-800 px-4 md:px-0 md:py-3">
          {/* Turn indicator: landscape only — above history with divider */}
          <div className="hidden md:flex md:flex-col items-center w-full">
            <div className="text-xs font-black text-indigo-500 uppercase tracking-wide">
              {t("game.turn", { count: nightCount })}
            </div>
            <div className="w-8 h-0.5 bg-gray-200 dark:bg-slate-700 rounded-full mt-2" />
          </div>
          <div className="flex md:flex-col items-center gap-4">
            <button
              onClick={() => onOpenModal("history")}
              className="flex flex-col items-center text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white transition"
              aria-label={t("game.history")}
            >
              <i className="fas fa-book-open text-lg md:mb-0.5" />
              <span className="hidden md:block text-[8px] font-bold uppercase tracking-wider">
                {t("game.history")}
              </span>
            </button>
            <button
              onClick={() => onOpenModal("night")}
              className="flex flex-col items-center text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition"
              aria-label={t("game.nextNight")}
            >
              <i className="fas fa-moon text-lg md:mb-0.5" />
              <span className="hidden md:block text-[8px] font-bold uppercase tracking-wider">
                {t("game.nextNight")}
              </span>
            </button>
            <button
              onClick={() => onOpenModal("settings")}
              className="flex flex-col items-center text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white transition"
              aria-label={t("settings.title")}
            >
              <i className="fas fa-cog text-lg md:mb-0.5" />
              <span className="hidden md:block text-[8px] font-bold uppercase tracking-wider">
                {t("settings.title")}
              </span>
            </button>
          </div>
          {/* Turn indicator: portrait only */}
          <div className="md:hidden text-center">
            <div className="text-[10px] font-black text-indigo-500 uppercase">
              {t("game.turn", { count: nightCount })}
            </div>
          </div>
        </div>

        {/* Action buttons: landscape sidebar only */}
        <div className="hidden md:flex md:flex-col gap-2 w-full mt-2">
          <button
            onClick={onOpenAssign}
            className="w-full py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black rounded-xl shadow-lg active:scale-95 transition uppercase text-[10px] flex items-center justify-center gap-1"
          >
            <i className="fas fa-theater-masks" />
            {t("game.assignRole")}
          </button>
          <button
            onClick={onOpenSkill}
            className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl shadow-lg active:scale-95 transition uppercase text-[10px] flex items-center justify-center gap-1"
          >
            <i className="fas fa-wand-sparkles" />
            {t("game.useSkill")}
          </button>
        </div>
      </div>
    </>
  );
});
