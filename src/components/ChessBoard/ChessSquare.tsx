import React from 'react';
import ChessPiece from '@/components/ChessPiece';
import { ChessPiece as ChessPieceType } from '@/models/chess';

interface ChessSquareProps {
  square: string;
  piece: ChessPieceType | null;
  isSelected: boolean;
  isValidMove: boolean;
  isDark: boolean;
  onClick: () => void;
}

const ChessSquare: React.FC<ChessSquareProps> = ({ 
  square, 
  piece, 
  isSelected, 
  isValidMove, 
  isDark, 
  onClick 
}) => {
  const squareColor = isDark ? 'bg-emerald-800' : 'bg-emerald-200';
  const selectionClass = isSelected ? 'ring-4 ring-yellow-400' : '';
  const validMoveClass = isValidMove && !isSelected ? 'after:absolute after:w-4 after:h-4 after:rounded-full after:bg-green-500/50 after:content-[""] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2' : '';
  
  return (
    <div 
      className={`relative w-full h-full ${squareColor} ${selectionClass} cursor-pointer transition-all hover:opacity-90`}
      onClick={onClick}
      data-square={square}
    >
      {piece && <ChessPiece type={piece.type} color={piece.color} />}
      <div className={validMoveClass} />
    </div>
  );
};

export default ChessSquare;