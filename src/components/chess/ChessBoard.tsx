import { useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';

interface ChessBoardProps {
  fen: string;
  onPieceDrop: (from: Square, to: Square, piece: string) => boolean;
  orientation?: 'white' | 'black';
  boardWidth?: number;
  disabled?: boolean;
}

function ChessBoard({
  fen,
  onPieceDrop,
  orientation = 'white',
  boardWidth = 400,
  disabled = false
}: ChessBoardProps) {
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ from: Square; to: Square } | null>(null);

  const handlePieceDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square, piece: string) => {
      // Check if it's a pawn promotion move
      const isPawnPromotion = 
        (piece === 'wP' && targetSquare[1] === '8') || 
        (piece === 'bP' && targetSquare[1] === '1');

      if (isPawnPromotion) {
        setPendingMove({ from: sourceSquare, to: targetSquare });
        setShowPromotionDialog(true);
        return false;
      }

      return onPieceDrop(sourceSquare, targetSquare, piece);
    },
    [onPieceDrop]
  );

  return (
    <div className="relative">
      <Chessboard
        position={fen}
        onPieceDrop={handlePieceDrop}
        boardOrientation={orientation}
        boardWidth={boardWidth}
        areArrowsAllowed={true}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
        customDarkSquareStyle={{ backgroundColor: '#779952' }}
        customLightSquareStyle={{ backgroundColor: '#edeed1' }}
        customDropSquareStyle={{ boxShadow: 'inset 0 0 4px 4px #ffeb3b' }}
        animationDuration={200}
      />
    </div>
  );
}

export default ChessBoard;