import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../../store/game-store";

interface PlayerInputProps {
  id: number;
  name: string;
  onNameChange: (id: number, name: string) => void;
}

const PlayerInput = memo(function PlayerInput({
  id,
  name,
  onNameChange,
}: PlayerInputProps) {
  return (
    <input
      type="text"
      value={name}
      onChange={(e) => onNameChange(id, e.target.value)}
      className="bg-bg-elevated border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      aria-label={`Player ${id}`}
    />
  );
});

export function PlayerConfig() {
  const { t } = useTranslation();
  const playerCount = useGameStore((s) => s.playerCount);
  const players = useGameStore((s) => s.players);
  const handlePlayerCountChange = useGameStore(
    (s) => s.handlePlayerCountChange,
  );
  const updatePlayerName = useGameStore((s) => s.updatePlayerName);

  const onNameChange = useCallback(
    (id: number, name: string) => updatePlayerName(id, name),
    [updatePlayerName],
  );

  return (
    <div className="bg-bg-elevated rounded-2xl p-4 border border-border-default">
      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="player-count"
          className="text-sm font-bold text-text-secondary uppercase tracking-wide"
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {players.map((p) => (
          <PlayerInput
            key={p.id}
            id={p.id}
            name={p.name}
            onNameChange={onNameChange}
          />
        ))}
      </div>
    </div>
  );
}
