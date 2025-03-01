import { GameStatus, CapturedPieces, pieceToUnicode } from '@/models/chess';

interface GameInfoProps {
  status: GameStatus;
  capturedPieces: CapturedPieces;
  moveHistory: string[];
  isThinking: boolean;
}

function GameInfo({ status, capturedPieces, moveHistory, isThinking }: GameInfoProps) {
  const getStatusMessage = () => {
    if (status.isCheckmate) return 'Checkmate!';
    if (status.isDraw) return 'Draw!';
    if (status.isCheck) return 'Check!';
    if (status.isGameOver) return 'Game Over!';
    return status.turn === 'w' ? 'Your Turn' : 'Computer Thinking...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full md:w-80">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Game Status</h2>
        <div className="flex items-center">
          <div 
            className={`w-3 h-3 rounded-full mr-2 ${
              status.turn === 'w' ? 'bg-white border border-gray-400' : 'bg-black'
            }`}
          ></div>
          <p className="font-medium">
            {isThinking ? (
              <span className="flex items-center">
                Computer thinking
                <span className="ml-2 flex">
                  <span className="animate-bounce mx-0.5 delay-0">.</span>
                  <span className="animate-bounce mx-0.5 delay-100">.</span>
                  <span className="animate-bounce mx-0.5 delay-200">.</span>
                </span>
              </span>
            ) : (
              getStatusMessage()
            )}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-1">Captured Pieces</h3>
        <div className="flex justify-between">
          <div>
            <h4 className="text-sm font-medium">By You</h4>
            <div className="text-xl">
              {capturedPieces.white.map((piece, i) => (
                <span key={i} className="mr-1">{pieceToUnicode(piece)}</span>
              ))}
              {capturedPieces.white.length === 0 && <span className="text-gray-400 text-sm">None</span>}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">By Computer</h4>
            <div className="text-xl">
              {capturedPieces.black.map((piece, i) => (
                <span key={i} className="mr-1">{pieceToUnicode(piece)}</span>
              ))}
              {capturedPieces.black.length === 0 && <span className="text-gray-400 text-sm">None</span>}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-1">Move History</h3>
        <div className="h-36 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
          {moveHistory.length > 0 ? (
            <div className="grid grid-cols-2 gap-1">
              {moveHistory.map((move, i) => (
                <div 
                  key={i} 
                  className={`text-sm p-1 ${i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                >
                  {Math.floor(i / 2) + 1}{i % 2 === 0 ? '.' : '...'} {move}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No moves yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameInfo;