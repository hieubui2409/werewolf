import { memo, useEffect, type MutableRefObject } from "react";
import { useTranslation } from "react-i18next";
import {
  Play,
  Pause,
  Square,
  MessageSquare,
  Gavel,
  BookOpen,
  Moon,
  Settings,
  Drama,
  Wand2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useTimer } from "../../hooks/use-timer";
import { useGameStore } from "../../store/game-store";
import type { TimerSettings } from "../../types/game";

interface TimerBoardProps {
  settings: TimerSettings;
  nightCount: number;
  onOpenModal: (modal: "history" | "night" | "settings") => void;
  onOpenAssign: () => void;
  onOpenSkill: () => void;
  timerStartRef?: MutableRefObject<
    ((seconds: number, type: "debate" | "judgment") => void) | null
  >;
}

export const TimerBoard = memo(function TimerBoard({
  settings,
  nightCount,
  onOpenModal,
  onOpenAssign,
  onOpenSkill,
  timerStartRef,
}: TimerBoardProps) {
  const { t } = useTranslation();
  const { timer, start, togglePause, stop } = useTimer();
  const muted = useGameStore((s) => s.timerSettings.muted);
  const setTimerSettings = useGameStore((s) => s.setTimerSettings);
  const toggleMute = () => setTimerSettings({ ...settings, muted: !muted });

  useEffect(() => {
    if (!timer.active) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        stop();
      }
    };
    document.addEventListener("keydown", handleEscape, { capture: true });
    return () =>
      document.removeEventListener("keydown", handleEscape, { capture: true });
  }, [timer.active, stop]);

  useEffect(() => {
    if (timerStartRef) timerStartRef.current = start;
    return () => {
      if (timerStartRef) timerStartRef.current = null;
    };
  }, [start, timerStartRef]);

  return (
    <>
      {/* Fullscreen timer overlay */}
      {timer.active && (
        <div
          className={`fixed inset-0 z-[100] bg-bg-app/95 backdrop-blur-md flex flex-col items-center justify-center p-6 ${timer.finished ? "timer-flash" : ""}`}
          role="status"
          aria-live="polite"
        >
          <h2
            className={`text-2xl font-display font-black uppercase tracking-widest mb-10 ${timer.type === "debate" ? "text-orange-400" : "text-red-400"}`}
          >
            {timer.type === "debate"
              ? t("game.debate", "Tranh Luận")
              : t("game.judgment", "Phán Quyết")}
          </h2>
          <div
            className={`text-[120px] font-display font-black mb-16 leading-none ${timer.type === "debate" ? "text-orange-500" : "text-red-600"} ${timer.value > 30 ? "timer-glow-calm" : timer.value > 10 ? "timer-glow-warn" : "timer-glow-critical"}`}
          >
            {Math.floor(timer.value / 60)
              .toString()
              .padStart(2, "0")}
            :{(timer.value % 60).toString().padStart(2, "0")}
          </div>
          <div className="flex gap-4 w-full max-w-md">
            <button
              onClick={togglePause}
              className="flex-1 py-5 bg-bg-elevated border-2 border-border-default rounded-[2rem] shadow-xl flex items-center justify-center active:scale-95 transition"
              aria-label={timer.paused ? t("common.resume") : t("common.pause")}
            >
              {timer.paused ? (
                <Play className="text-emerald-400" size={28} />
              ) : (
                <Pause className="text-amber-400" size={28} />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="py-5 px-6 bg-bg-elevated border-2 border-border-default rounded-[2rem] shadow-xl flex items-center justify-center active:scale-95 transition"
              aria-label={muted ? t("game.unmute") : t("game.mute")}
            >
              {muted ? (
                <VolumeX className="text-text-muted" size={24} />
              ) : (
                <Volume2 className="text-indigo-400" size={24} />
              )}
            </button>
            <button
              onClick={stop}
              className="flex-1 py-5 bg-red-900 border-2 border-red-600 rounded-[2rem] shadow-xl flex items-center justify-center active:scale-95 transition"
              aria-label={t("common.stop")}
            >
              <Square className="text-red-300" size={28} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile: icon row + turn footer */}
      <div className="md:hidden bg-bg-card border-b border-border-default shadow-sm shrink-0 z-10">
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          <button
            onClick={() => start(settings.debate, "debate")}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-orange-400 hover:text-orange-300 hover:bg-bg-elevated active:scale-95 transition"
            aria-label={t("game.debate")}
          >
            <MessageSquare size={18} />
          </button>
          <button
            onClick={() => start(settings.judgment, "judgment")}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-bg-elevated active:scale-95 transition"
            aria-label={t("game.judgment")}
          >
            <Gavel size={18} />
          </button>
          <button
            onClick={() => onOpenModal("night")}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-emerald-400 hover:text-emerald-300 hover:bg-bg-elevated active:scale-95 transition"
            aria-label={t("game.nextNight")}
          >
            <Moon size={18} />
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">
              {nightCount}
            </span>
          </button>
          <button
            onClick={() => onOpenModal("history")}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-bg-elevated active:scale-95 transition"
            aria-label={t("game.history")}
          >
            <BookOpen size={18} />
          </button>
          <button
            onClick={() => onOpenModal("settings")}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-indigo-400 hover:text-indigo-300 hover:bg-bg-elevated active:scale-95 transition"
            aria-label={t("settings.title")}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Desktop: sidebar — 3 groups: top (timers), middle (nav), bottom (actions) */}
      <div className="hidden md:flex md:flex-col justify-between bg-bg-card border-r-2 border-border-default p-4 z-10 shadow-sm shrink-0">
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={() => start(settings.debate, "debate")}
            className="py-2 px-4 w-full rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-1 bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-lg active:scale-95 transition"
          >
            <MessageSquare size={14} /> {t("game.debate")}
          </button>
          <button
            onClick={() => start(settings.judgment, "judgment")}
            className="py-2 px-4 w-full rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-1 bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg active:scale-95 transition"
          >
            <Gavel size={14} /> {t("game.judgment")}
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 py-3">
          <div className="px-3 py-1 bg-indigo-600/20 rounded-full border border-indigo-500/30">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-wide whitespace-nowrap">
              {t("game.turn", { count: nightCount })}
            </span>
          </div>
          <div className="w-8 h-0.5 bg-bg-elevated rounded-full" />
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => onOpenModal("history")}
              className="flex flex-col items-center text-text-muted hover:text-text-primary transition"
              aria-label={t("game.history")}
            >
              <BookOpen size={20} className="mb-0.5" />
              <span className="text-[8px] font-bold uppercase tracking-wider">
                {t("game.history")}
              </span>
            </button>
            <button
              onClick={() => onOpenModal("night")}
              className="flex flex-col items-center text-emerald-400 hover:text-emerald-300 transition"
              aria-label={t("game.nextNight")}
            >
              <Moon size={20} className="mb-0.5" />
              <span className="text-[8px] font-bold uppercase tracking-wider">
                {t("game.nextNight")}
              </span>
            </button>
            <button
              onClick={() => onOpenModal("settings")}
              className="flex flex-col items-center text-text-muted hover:text-text-primary transition"
              aria-label={t("settings.title")}
            >
              <Settings size={20} className="mb-0.5" />
              <span className="text-[8px] font-bold uppercase tracking-wider">
                {t("settings.title")}
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={onOpenAssign}
            className="w-full py-2 px-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black rounded-xl shadow-lg active:scale-95 transition uppercase text-[10px] flex items-center justify-center gap-1"
          >
            <Drama size={14} />
            {t("game.assignRole")}
          </button>
          <button
            onClick={onOpenSkill}
            className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl shadow-lg active:scale-95 transition uppercase text-[10px] flex items-center justify-center gap-1"
          >
            <Wand2 size={14} />
            {t("game.useSkill")}
          </button>
        </div>
      </div>
    </>
  );
});
