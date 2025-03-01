import React, { useState, useEffect } from 'react';
import ChessBoard from '@/components/ChessBoard';
import PromotionDialog from '@/components/ChessBoard/PromotionDialog';
import { createChessGame, ChessMove, ChessColor } from '@/models/chess';

// Difficulty levels for AI
type Difficulty = 'easy' | 'medium' | 'hard';

const ChessGame: React.FC = () => {
  const [game] = useState(createChessGame);
  const [board, setBoard] = useState(game.getBoard());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [turn, setTurn] = useState<ChessColor>(game.getTurn());
  const [aiPlaying, setAiPlaying] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [promotionMove, setPromotionMove] = useState<{ from: string; to: string } | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  
  // Update the board when the game state changes
  const updateBoard = () => {
    setBoard(game.getBoard());
    setTurn(game.getTurn());
    setGameOver(game.isGameOver());
    
    // Update move history
    const history = game.getMoveHistory();
    setMoveHistory(history.map((move, i) => {
      const moveNumber = Math.floor(i / 2) + 1;
      const notation = move.san;
      return i % 2 === 0 ? `${moveNumber}. ${notation}` : notation;
    }));
  };
  
  // Check if a move is a pawn promotion
  const isPawnPromotion = (from: string, to: string): boolean => {
    const piece = board.flat().find(s => s.square === from)?.piece;
    return (
      piece?.type === 'p' && 
      ((piece.color === 'w' && to[1] === '8') || 
       (piece.color === 'b' && to[1] === '1'))
    );
  };
  
  // Handle square clicks
  const handleSquareClick = (square: string) => {
    if (gameOver || (aiPlaying && turn === 'b')) return;
    
    // If a square is already selected, try to make a move
    if (selectedSquare) {
      // Check if this is a pawn promotion
      if (isPawnPromotion(selectedSquare, square)) {
        setPromotionMove({ from: selectedSquare, to: square });
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }
      
      const moveSucceeded = game.makeMove({
        from: selectedSquare,
        to: square,
        promotion: 'q' // Auto-promote to queen for non-dialog moves
      });
      
      if (moveSucceeded) {
        updateBoard();
        setSelectedSquare(null);
        setValidMoves([]);
        
        // If AI is playing, make AI move
        if (aiPlaying && !game.isGameOver()) {
          setTimeout(makeAiMove, 500);
        }
      } else if (square === selectedSquare) {
        // Deselect if clicking the same square
        setSelectedSquare(null);
        setValidMoves([]);
      } else {
        // Try selecting the new square if it has a piece of the current player
        trySelectSquare(square);
      }
    } else {
      trySelectSquare(square);
    }
  };
  
  // Handle promotion selection
  const handlePromotion = (piece: string) => {
    if (!promotionMove) return;
    
    const moveSucceeded = game.makeMove({
      from: promotionMove.from,
      to: promotionMove.to,
      promotion: piece
    });
    
    if (moveSucceeded) {
      updateBoard();
      setPromotionMove(null);
      
      // If AI is playing, make AI move
      if (aiPlaying && !game.isGameOver()) {
        setTimeout(makeAiMove, 500);
      }
    }
  };
  
  // Try to select a square
  const trySelectSquare = (square: string) => {
    const squarePiece = board.flat().find(s => s.square === square)?.piece;
    
    if (squarePiece && squarePiece.color === turn) {
      setSelectedSquare(square);
      setValidMoves(game.getValidMoves(square));
    }
  };
  
  // Make an AI move
  const makeAiMove = () => {
    let move: ChessMove | null;
    
    switch (difficulty) {
      case 'easy':
        move = game.makeRandomMove();
        break;
      case 'medium':
        move = game.makeSmartMove();
        break;
      case 'hard':
        move = game.makeAdvancedMove();
        break;
      default:
        move = game.makeRandomMove();
    }
    
    if (move) {
      updateBoard();
    }
  };
  
  // Reset the game
  const resetGame = () => {
    game.resetGame();
    updateBoard();
    setSelectedSquare(null);
    setValidMoves([]);
    setPromotionMove(null);
    setMoveHistory([]);
  };
  
  // Toggle AI opponent
  const toggleAi = () => {
    setAiPlaying(!aiPlaying);
    if (!aiPlaying && turn === 'b') {
      setTimeout(makeAiMove, 500);
    }
  };
  
  // Change AI difficulty
  const changeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };
  
  // Undo last move (both player and AI when playing against AI)
  const undoMove = () => {
    if (aiPlaying && turn === 'w') {
      game.undo(); // Undo AI move
      game.undo(); // Undo player move
    } else {
      game.undo(); // Just undo last move
    }
    updateBoard();
    setSelectedSquare(null);
    setValidMoves([]);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Jeu d'Échecs</h1>
      
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        <button
          onClick={resetGame}
          className="px-3 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
        >
          Nouvelle Partie
        </button>
        
        <button
          onClick={undoMove}
          className="px-3 py-2 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600 transition-colors"
          disabled={moveHistory.length === 0}
        >
          Annuler Coup
        </button>
        
        <button
          onClick={toggleAi}
          className={`px-3 py-2 ${aiPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded cursor-pointer transition-colors`}
        >
          {aiPlaying ? 'Jouer contre un Humain' : 'Jouer contre l\'Ordinateur'}
        </button>
        
        {aiPlaying && (
          <div className="flex items-center gap-2">
            <span>Difficulté:</span>
            <select
              value={difficulty}
              onChange={(e) => changeDifficulty(e.target.value as Difficulty)}
              className="px-2 py-1 border rounded cursor-pointer box-border"
            >
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="hard">Difficile</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <div className="text-xl">
          {gameOver ? (
            <div className="text-center">
              {game.isCheckmate() ? (
                <span className="font-bold text-red-600">
                  Échec et mat! {turn === 'w' ? 'Les noirs' : 'Les blancs'} gagnent!
                </span>
              ) : game.isDraw() ? (
                <span className="font-bold text-orange-600">
                  Partie nulle!
                </span>
              ) : (
                <span className="font-bold">Partie terminée!</span>
              )}
            </div>
          ) : (
            <div className="text-center">
              <span className={`font-bold px-3 py-1 rounded ${turn === 'w' ? 'text-white bg-black' : 'text-black bg-white border border-black'}`}>
                Tour des {turn === 'w' ? 'blancs' : 'noirs'}
              </span>
              {game.isCheck() && <span className="text-red-600 ml-2">Échec!</span>}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center md:items-start w-full">
        <div className="flex justify-center w-full md:w-auto">
          <ChessBoard
            board={board}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            onSquareClick={handleSquareClick}
          />
        </div>
        
        <div className="w-full md:w-64 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3 border-b pb-2">Historique des coups</h2>
          <div className="h-64 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {moveHistory.map((move, i) => (
                <div 
                  key={i} 
                  className={`px-2 py-1 ${i % 2 === 0 ? 'font-medium' : ''}`}
                >
                  {move}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {promotionMove && (
        <PromotionDialog 
          color={turn} 
          onSelect={handlePromotion} 
        />
      )}
      
      <div className="mt-8 text-sm text-center">
        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500">
          Made on ZAPT
        </a>
      </div>
    </div>
  );
};

export default ChessGame;