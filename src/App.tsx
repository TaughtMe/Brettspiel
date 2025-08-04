// src/App.tsx

import { Board } from './components/Board';
import { useGameStore } from './state/gameStore';

function App() {
  // KORREKTUR: Greife auf jeden Wert einzeln zu, um Endlosschleifen zu vermeiden.
  const undoLastMove = useGameStore((state) => state.undoLastMove);
  const history = useGameStore((state) => state.history);

  return (
    <main className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white p-4 gap-8">
      <Board />

      <button
        onClick={undoLastMove}
        disabled={history.length === 0}
        className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Rückgängig
      </button>
    </main>
  );
}

export default App;