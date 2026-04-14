import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useTimer } from "../../hooks/use-timer";
import type { TimerSettings } from "../../types/game";

interface TimerBoardProps {
  settings: TimerSettings;
  nightCount: number;
  onOpenModal: (modal: "history" | "night" | "settings") => void;
}

export const TimerBoard = memo(function TimerBoard({
  settings,
  nightCount,
  onOpenModal,
}: TimerBoardProps) {
  const { t } = useTranslation();
  const { timer, start, togglePause, stop } = useTimer();

  return (
    <>
      {/* Fullscreen timer overlay */}
      {timer.active && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
          role="timer"
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
      <div className="bg-white dark:bg-slate-900 p-3 border-b-2 border-gray-200 dark:border-slate-800 flex md:flex-col justify-between items-center z-10 shadow-sm shrink-0 md:rounded-none rounded-b-3xl mx-2 mt-2 md:mx-0 md:mt-0 md:border-b-0 md:border-r-2 md:p-4">
        {/* Debate timer */}
        <div className="flex flex-col items-center flex-1 md:mb-4">
          <div className="text-xl font-black font-['Bungee'] text-gray-700 dark:text-slate-300">
            {settings.debate}s
          </div>
          <button
            onClick={() => start(settings.debate, "debate")}
            className="mt-1 text-[10px] px-3 py-1 rounded-full font-black uppercase bg-gradient-to-b from-orange-500 to-orange-700 text-white shadow-lg active:scale-95 transition"
          >
            <i className="fas fa-play mr-1" /> {t("game.debate", "Luận")}
          </button>
        </div>

        {/* Center buttons */}
        <div className="flex md:flex-col items-center gap-6 md:gap-4 border-x-2 md:border-x-0 md:border-y-2 border-gray-200 dark:border-slate-800 px-6 md:px-0 md:py-4">
          <button
            onClick={() => onOpenModal("history")}
            className="flex flex-col items-center text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white transition"
            aria-label={t("game.history", "Lịch Sử")}
          >
            <i className="fas fa-book-open text-xl mb-1" />
            <span className="text-[9px] font-bold uppercase tracking-wider">
              {t("game.history", "Lịch Sử")}
            </span>
          </button>
          {/* Turn indicator */}
          <div className="text-center">
            <div className="text-xs font-black text-indigo-500 uppercase">
              {t("game.turn", { count: nightCount })}
            </div>
          </div>
          <button
            onClick={() => onOpenModal("night")}
            className="flex flex-col items-center text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition"
            aria-label={t("game.nextNight", "Qua Đêm")}
          >
            <i className="fas fa-moon text-xl mb-1" />
            <span className="text-[9px] font-bold uppercase tracking-wider">
              {t("game.nextNight", "Qua Đêm")}
            </span>
          </button>
          <button
            onClick={() => onOpenModal("settings")}
            className="flex flex-col items-center text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white transition"
            aria-label={t("settings.title", "Cài Đặt")}
          >
            <i className="fas fa-cog text-xl mb-1" />
            <span className="text-[9px] font-bold uppercase tracking-wider">
              {t("settings.title", "Cài Đặt")}
            </span>
          </button>
        </div>

        {/* Judgment timer */}
        <div className="flex flex-col items-center flex-1 md:mt-4">
          <div className="text-xl font-black font-['Bungee'] text-gray-700 dark:text-slate-300">
            {settings.judgment}s
          </div>
          <button
            onClick={() => start(settings.judgment, "judgment")}
            className="mt-1 text-[10px] px-3 py-1 rounded-full font-black uppercase bg-gradient-to-b from-red-600 to-red-800 text-white shadow-lg active:scale-95 transition"
          >
            <i className="fas fa-play mr-1" /> {t("game.judgmentBtn", "Treo")}
          </button>
        </div>
      </div>
    </>
  );
});
