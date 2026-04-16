import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Moon } from "lucide-react";

interface NightTransitionOverlayProps {
  nightCount: number;
  onComplete: () => void;
}

export function NightTransitionOverlay({
  nightCount,
  onComplete,
}: NightTransitionOverlayProps) {
  const { t } = useTranslation();
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const skipTimer = setTimeout(() => setCanSkip(true), 500);
    const autoEnd = setTimeout(onComplete, 2000);
    return () => {
      clearTimeout(skipTimer);
      clearTimeout(autoEnd);
    };
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (canSkip) onComplete();
  }, [canSkip, onComplete]);

  return (
    <div
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center night-overlay"
      style={{
        background: "radial-gradient(ellipse, #1E1B4B 0%, #020203 100%)",
      }}
      onClick={handleSkip}
      role="status"
      aria-live="assertive"
    >
      <Moon size={48} className="text-indigo-400 mb-6 opacity-80" />
      <h2 className="text-5xl font-display font-black uppercase tracking-[0.3em] text-indigo-300">
        {t("game.turn", { count: nightCount })}
      </h2>
      {canSkip && (
        <p className="mt-8 text-xs text-indigo-500/60 uppercase tracking-widest">
          {t("game.tapToSkip", "Chạm để bỏ qua")}
        </p>
      )}
    </div>
  );
}
