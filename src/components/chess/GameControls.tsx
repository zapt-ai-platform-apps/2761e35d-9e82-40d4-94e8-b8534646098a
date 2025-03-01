interface GameControlsProps {
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  isGameOver: boolean;
}

function GameControls({ onReset, onUndo, canUndo, isGameOver }: GameControlsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center my-4">
      <button
        onClick={onReset}
        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        New Game
      </button>
      
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`cursor-pointer ${
          canUndo ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 cursor-not-allowed'
        } text-white font-medium py-2 px-4 rounded flex items-center`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Undo Move
      </button>
      
      {isGameOver && (
        <div className="ml-2 py-2 px-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Game Over. Start a new game!
        </div>
      )}
    </div>
  );
}

export default GameControls;