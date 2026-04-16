import { ErrorBoundary } from "./components/common/error-boundary";
import { SetupScreen } from "./components/setup/setup-screen";
import { GameScreen } from "./components/game/game-screen";
import { PwaUpdateSheet } from "./components/common/pwa-update-sheet";
import { useGameStore } from "./store/game-store";

export default function App() {
  const step = useGameStore((s) => s.step);

  return (
    <ErrorBoundary>
      <div className="w-full min-h-dvh md:min-h-screen max-w-lg md:max-w-none mx-auto bg-bg-app md:border-x md:border-border-default shadow-2xl">
        {step === "setup" ? <SetupScreen /> : <GameScreen />}
      </div>
      <PwaUpdateSheet />
    </ErrorBoundary>
  );
}
