interface ChessControlsProps {
  onReset: () => void;
  onSwitchSides: () => void;
  playerColor: 'white' | 'black';
  moveHistory: string[];
}

const ChessControls = ({ onReset, onSwitchSides, playerColor, moveHistory }: ChessControlsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer transition-colors"
          onClick={onReset}
        >
          New Game
        </button>
        <button 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded cursor-pointer transition-colors"
          onClick={onSwitchSides}
        >
          Switch Sides
        </button>
      </div>
      
      <div className="mt-2">
        <p className="font-semibold">You are playing as: <span className="capitalize">{playerColor}</span></p>
      </div>
      
      <div className="mt-4">
        <h3 className="font-bold text-lg mb-2">Move History</h3>
        <div className="bg-gray-50 p-3 rounded-md h-56 overflow-y-auto">
          {moveHistory.length === 0 ? (
            <p className="text-gray-500 italic">No moves yet</p>
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {moveHistory.map((move, index) => (
                <div key={index} className={`p-1 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                  {index % 2 === 0 ? (
                    <span><b>{Math.floor(index/2) + 1}.</b> {move}</span>
                  ) : (
                    <span>{move}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessControls;