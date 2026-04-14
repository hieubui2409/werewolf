import { useTranslation } from "react-i18next";
import { useGameStore } from "../../store/game-store";

export function PlayerConfig() {
  const { t } = useTranslation();
  const playerCount = useGameStore((s) => s.playerCount);
  const players = useGameStore((s) => s.players);
  const handlePlayerCountChange = useGameStore(
    (s) => s.handlePlayerCountChange,
  );
  const updatePlayerName = useGameStore((s) => s.updatePlayerName);

  return (
    <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700">
      {/* Player count slider */}
      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="player-count"
          className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide"
        >
          {t("setup.playerCount")}
        </label>
        <span className="bg-indigo-600 text-white text-sm font-black px-3 py-1 rounded-full min-w-[2.5rem] text-center">
          {playerCount}
        </span>
      </div>
      <input
        id="player-count"
        type="range"
        min={4}
        max={30}
        value={playerCount}
        onChange={(e) => handlePlayerCountChange(parseInt(e.target.value))}
        className="w-full accent-indigo-600 mb-4"
        aria-valuetext={`${playerCount} ${t("setup.playerCount")}`}
      />

      {/* Player names grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {players.map((p) => (
          <input
            key={p.id}
            type="text"
            value={p.name}
            onChange={(e) => updatePlayerName(p.id, e.target.value)}
            className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            aria-label={`${t("setup.playerCount")} ${p.id}`}
          />
        ))}
      </div>
    </div>
  );
}
