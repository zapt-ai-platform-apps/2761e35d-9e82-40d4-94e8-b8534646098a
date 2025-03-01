import { useState, useEffect, useCallback } from 'react';
import ChessBoard from '@/components/chess/ChessBoard';
import GameControls from '@/components/chess/GameControls';
import GameInfo from '@/components/chess/GameInfo';
import useChessGame from '@/hooks/useChessGame';
import { Square } from 'chess.js';

function ChessGame() {
  const { 
    fen, 
    makeMove, 
    reset, 
    undo, 
    status, 
    capturedPieces, 
    moveHistory, 
    isThinking 
  } = useChessGame();
  
  const [boardSize, setBoardSize] = useState(500);

  // Handle responsive board sizing
  useEffect(() => {
    const handleResize = () => {
      // Get the window width, subtract padding
      const maxWidth = Math.min(window.innerWidth - 32, 500);
      setBoardSize(maxWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePieceDrop = useCallback((from: Square, to: Square, piece: string) => {
    // Only allow white pieces to move (player is white)
    if (piece.charAt(0) !== 'w' || status.turn !== 'w' || status.isGameOver) {
      return false;
    }

    // Try to make the move
    const result = makeMove(from, to);
    return result.success;
  }, [makeMove, status]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Chess vs Computer</h1>
      
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="flex flex-col items-center">
          <ChessBoard 
            fen={fen} 
            onPieceDrop={handlePieceDrop} 
            boardWidth={boardSize}
            disabled={status.isGameOver || status.turn === 'b'}
          />
          
          <GameControls
            onReset={reset}
            onUndo={undo}
            canUndo={moveHistory.length >= 2}
            isGameOver={status.isGameOver}
          />
        </div>
        
        <GameInfo
          status={status}
          capturedPieces={capturedPieces}
          moveHistory={moveHistory}
          isThinking={isThinking}
        />
      </div>
      
      <div className="mt-6 text-center text-gray-600">
        <p className="text-sm">You play as white. Make your move by dragging and dropping pieces.</p>
        <p className="text-sm mt-1">The computer will respond automatically.</p>
      </div>
    </div>
  );
}

export default ChessGame;