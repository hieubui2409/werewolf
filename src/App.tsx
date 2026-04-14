import { ErrorBoundary } from "./components/common/error-boundary";
import { SetupScreen } from "./components/setup/setup-screen";
import { GameScreen } from "./components/game/game-screen";
import { useGameStore } from "./store/game-store";

export default function App() {
  const step = useGameStore((s) => s.step);

  return (
    <ErrorBoundary>
      <div className="w-full min-h-dvh md:min-h-screen max-w-lg md:max-w-none mx-auto bg-gray-50 dark:bg-slate-900 md:border-x md:border-gray-200 dark:md:border-slate-800 shadow-2xl">
        {step === "setup" ? <SetupScreen /> : <GameScreen />}
      </div>
    </ErrorBoundary>
  );
}
