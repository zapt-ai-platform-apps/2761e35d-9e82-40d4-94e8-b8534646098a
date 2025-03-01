import React from 'react';
import { ChessPieceType, ChessColor } from '@/models/chess';

interface ChessPieceProps {
  type: ChessPieceType;
  color: ChessColor;
}

const pieceUnicode: Record<ChessColor, Record<ChessPieceType, string>> = {
  w: {
    p: '♙',
    n: '♘',
    b: '♗',
    r: '♖',
    q: '♕',
    k: '♔'
  },
  b: {
    p: '♟',
    n: '♞',
    b: '♝',
    r: '♜',
    q: '♛',
    k: '♚'
  }
};

const ChessPiece: React.FC<ChessPieceProps> = ({ type, color }) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <span className={`text-4xl ${color === 'w' ? 'text-white drop-shadow-md' : 'text-black drop-shadow-md'}`}>
        {pieceUnicode[color][type]}
      </span>
    </div>
  );
};

export default ChessPiece;