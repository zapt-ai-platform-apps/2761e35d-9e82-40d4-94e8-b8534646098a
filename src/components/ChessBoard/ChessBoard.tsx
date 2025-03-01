import React from 'react';
import ChessSquare from './ChessSquare';
import { ChessBoard as ChessBoardType } from '@/models/chess';

interface ChessBoardProps {
  board: ChessBoardType;
  selectedSquare: string | null;
  validMoves: string[];
  onSquareClick: (square: string) => void;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ 
  board, 
  selectedSquare, 
  validMoves, 
  onSquareClick 
}) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  return (
    <div className="relative">
      {/* File labels (top) */}
      <div className="flex justify-around w-full absolute -top-6 left-0 right-0">
        {files.map(file => (
          <div key={file} className="w-6 text-center font-medium">{file}</div>
        ))}
      </div>
      
      {/* Board with rank labels */}
      <div className="flex">
        {/* Rank labels (left) */}
        <div className="flex flex-col justify-around mr-2">
          {ranks.map(rank => (
            <div key={rank} className="h-8 text-center flex items-center font-medium">{rank}</div>
          ))}
        </div>
        
        {/* Chess board */}
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full aspect-square border-2 border-black shadow-lg" style={{ maxWidth: 'min(calc(100vw - 4rem), 640px)' }}>
          {board.map((row, rowIndex) => (
            row.map((square, colIndex) => {
              const isDark = (rowIndex + colIndex) % 2 === 1;
              return (
                <ChessSquare
                  key={square.square}
                  square={square.square}
                  piece={square.piece}
                  isSelected={selectedSquare === square.square}
                  isValidMove={validMoves.includes(square.square)}
                  isDark={isDark}
                  onClick={() => onSquareClick(square.square)}
                />
              );
            })
          ))}
        </div>
        
        {/* Rank labels (right) */}
        <div className="flex flex-col justify-around ml-2">
          {ranks.map(rank => (
            <div key={rank} className="h-8 text-center flex items-center font-medium">{rank}</div>
          ))}
        </div>
      </div>
      
      {/* File labels (bottom) */}
      <div className="flex justify-around w-full absolute -bottom-6 left-0 right-0">
        {files.map(file => (
          <div key={file} className="w-6 text-center font-medium">{file}</div>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;