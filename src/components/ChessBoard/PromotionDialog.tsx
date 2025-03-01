import React from 'react';
import { ChessColor } from '@/models/chess';

interface PromotionDialogProps {
  color: ChessColor;
  onSelect: (piece: string) => void;
}

const PromotionDialog: React.FC<PromotionDialogProps> = ({ color, onSelect }) => {
  const pieces = ['q', 'r', 'n', 'b']; // Queen, Rook, Knight, Bishop
  const pieceSymbols: Record<string, string> = {
    q: color === 'w' ? '♕' : '♛',
    r: color === 'w' ? '♖' : '♜',
    n: color === 'w' ? '♘' : '♞',
    b: color === 'w' ? '♗' : '♝'
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-center">Choisissez une pièce pour la promotion</h3>
        <div className="flex gap-4">
          {pieces.map(piece => (
            <button
              key={piece}
              onClick={() => onSelect(piece)}
              className="w-16 h-16 flex items-center justify-center text-4xl border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
            >
              <span className={color === 'w' ? 'text-black' : 'text-black'}>
                {pieceSymbols[piece]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionDialog;