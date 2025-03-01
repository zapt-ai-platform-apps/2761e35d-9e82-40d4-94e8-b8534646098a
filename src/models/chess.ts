import { Chess } from 'chess.js';

export interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
}

export type ChessPieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type ChessColor = 'w' | 'b';

export interface ChessPiece {
  type: ChessPieceType;
  color: ChessColor;
}

export interface Square {
  square: string;
  piece: ChessPiece | null;
}

export type ChessBoard = Square[][];

export function createChessGame() {
  const chess = new Chess();
  
  return {
    getBoard: (): ChessBoard => {
      const board: ChessBoard = [];
      for (let i = 0; i < 8; i++) {
        board[i] = [];
        for (let j = 0; j < 8; j++) {
          const file = String.fromCharCode(97 + j);
          const rank = 8 - i;
          const square = `${file}${rank}`;
          const piece = chess.get(square);
          board[i][j] = {
            square,
            piece: piece ? { type: piece.type as ChessPieceType, color: piece.color as ChessColor } : null
          };
        }
      }
      return board;
    },
    
    makeMove: (move: ChessMove): boolean => {
      try {
        chess.move(move);
        return true;
      } catch (e) {
        return false;
      }
    },
    
    undo: (): void => {
      chess.undo();
    },
    
    getValidMoves: (square: string): string[] => {
      const moves = chess.moves({ square, verbose: true });
      return moves.map(move => move.to);
    },
    
    isGameOver: (): boolean => {
      return chess.isGameOver();
    },
    
    isCheck: (): boolean => {
      return chess.isCheck();
    },
    
    isCheckmate: (): boolean => {
      return chess.isCheckmate();
    },
    
    isDraw: (): boolean => {
      return chess.isDraw();
    },
    
    getTurn: (): ChessColor => {
      return chess.turn() as ChessColor;
    },
    
    getFen: (): string => {
      return chess.fen();
    },
    
    getMoveHistory: () => {
      return chess.history({ verbose: true });
    },
    
    resetGame: () => {
      chess.reset();
    },
    
    // Add a simple AI that picks a random valid move
    makeRandomMove: (): ChessMove | null => {
      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * moves.length);
      const move = moves[randomIndex];
      
      chess.move(move);
      
      return {
        from: move.from,
        to: move.to,
        promotion: move.promotion,
      };
    },
    
    // Add a slightly smarter AI that tries to capture pieces when possible
    makeSmartMove: (): ChessMove | null => {
      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) return null;
      
      // First priority: capturing moves
      const capturingMoves = moves.filter(move => move.flags.includes('c'));
      if (capturingMoves.length > 0) {
        const randomCapture = capturingMoves[Math.floor(Math.random() * capturingMoves.length)];
        chess.move(randomCapture);
        return {
          from: randomCapture.from,
          to: randomCapture.to,
          promotion: randomCapture.promotion,
        };
      }
      
      // Otherwise, make a random move
      const randomIndex = Math.floor(Math.random() * moves.length);
      const move = moves[randomIndex];
      
      chess.move(move);
      
      return {
        from: move.from,
        to: move.to,
        promotion: move.promotion,
      };
    },
    
    // Add a more advanced AI that evaluates board position
    makeAdvancedMove: (): ChessMove | null => {
      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) return null;
      
      // Evaluate each move and select the best one
      let bestScore = -Infinity;
      let bestMove = moves[0];
      
      for (const move of moves) {
        chess.move(move);
        const score = evaluatePosition(chess);
        chess.undo();
        
        // Negative because we're evaluating from the opponent's perspective
        if (-score > bestScore) {
          bestScore = -score;
          bestMove = move;
        }
      }
      
      chess.move(bestMove);
      
      return {
        from: bestMove.from,
        to: bestMove.to,
        promotion: bestMove.promotion,
      };
    }
  };
}

// Simple position evaluation function
function evaluatePosition(chess: Chess): number {
  if (chess.isCheckmate()) return -Infinity; // Being checkmated is worst
  if (chess.isDraw()) return 0; // Draws are neutral
  
  // Material values
  const pieceValues: Record<ChessPieceType, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0 // King isn't counted for material
  };
  
  let score = 0;
  
  // Calculate material advantage
  const board = chess.board();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = pieceValues[piece.type as ChessPieceType];
        if (piece.color === chess.turn()) {
          score += value;
        } else {
          score -= value;
        }
      }
    }
  }
  
  // Add bonus for checking the opponent
  if (chess.isCheck()) score += 0.5;
  
  return score;
}

export type ChessGame = ReturnType<typeof createChessGame>;