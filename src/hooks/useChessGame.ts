import { useState, useCallback, useEffect } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { ChessMoveResult, GameStatus, getGameStatus, calculateCapturedPieces, CapturedPieces } from '@/models/chess';

interface UseChessGameResult {
  fen: string;
  makeMove: (from: Square, to: Square, promotion?: string) => ChessMoveResult;
  reset: () => void;
  undo: () => void;
  status: GameStatus;
  capturedPieces: CapturedPieces;
  moveHistory: string[];
  aiMove: () => void;
  isThinking: boolean;
}

/**
 * Custom hook to manage a chess game with AI opponent
 */
function useChessGame(): UseChessGameResult {
  const [chess] = useState<Chess>(new Chess());
  const [fen, setFen] = useState<string>(chess.fen());
  const [status, setStatus] = useState<GameStatus>(getGameStatus(chess));
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({ white: [], black: [] });
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Update game state after moves
  const updateGameState = useCallback(() => {
    setFen(chess.fen());
    setStatus(getGameStatus(chess));
    setMoveHistory(chess.history());
    setCapturedPieces(calculateCapturedPieces(chess));
  }, [chess]);

  // Make a move
  const makeMove = useCallback((from: Square, to: Square, promotion?: string): ChessMoveResult => {
    try {
      const moveObj = {
        from,
        to,
        promotion: promotion || undefined,
      };
      
      const move = chess.move(moveObj);
      updateGameState();
      return { success: true, error: null, move };
    } catch (e) {
      console.error('Invalid move:', e);
      return { success: false, error: (e as Error).message, move: null };
    }
  }, [chess, updateGameState]);

  // Reset the game
  const reset = useCallback(() => {
    chess.reset();
    updateGameState();
  }, [chess, updateGameState]);

  // Undo the last move (both player and AI)
  const undo = useCallback(() => {
    // Undo twice to undo both player and AI moves
    chess.undo();
    chess.undo();
    updateGameState();
  }, [chess, updateGameState]);

  // AI Move logic
  const aiMove = useCallback(() => {
    if (chess.isGameOver() || status.turn !== 'b') return;
    
    setIsThinking(true);
    
    // Simulate AI thinking with a timeout
    setTimeout(() => {
      const possibleMoves = chess.moves({ verbose: true });
      if (possibleMoves.length > 0) {
        // Simple AI: pick a random legal move with a slight preference for captures
        const captureMoves = possibleMoves.filter(move => move.flags.includes('c'));
        const movePool = [...possibleMoves, ...captureMoves]; // Add capture moves twice to increase probability
        const randomMove = movePool[Math.floor(Math.random() * movePool.length)];
        
        chess.move(randomMove);
        updateGameState();
      }
      setIsThinking(false);
    }, 500);
  }, [chess, status.turn, updateGameState]);

  // Automatically make AI move when it's black's turn
  useEffect(() => {
    if (status.turn === 'b' && !status.isGameOver) {
      aiMove();
    }
  }, [status.turn, status.isGameOver, aiMove]);

  // Initialize game state
  useEffect(() => {
    updateGameState();
  }, [updateGameState]);

  return {
    fen,
    makeMove,
    reset,
    undo,
    status,
    capturedPieces,
    moveHistory,
    aiMove,
    isThinking
  };
}

export default useChessGame;