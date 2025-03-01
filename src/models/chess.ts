import { Chess, Move } from 'chess.js';

/**
 * @typedef {Object} ChessMoveResult
 * @property {boolean} success If the move was successful
 * @property {string | null} error Error message if move failed
 * @property {Move | null} move The move object if successful
 */
export interface ChessMoveResult {
  success: boolean;
  error: string | null;
  move: Move | null;
}

/**
 * @typedef {Object} GameStatus
 * @property {boolean} isCheck If the current player is in check
 * @property {boolean} isCheckmate If the current player is in checkmate
 * @property {boolean} isDraw If the game is a draw
 * @property {boolean} isGameOver If the game is over
 * @property {string} turn Current turn ('w' or 'b')
 */
export interface GameStatus {
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  turn: 'w' | 'b';
}

/**
 * @typedef {Object} ChessGameState
 * @property {Chess} game The chess.js game instance
 * @property {GameStatus} status Current game status
 * @property {string[]} moveHistory Array of moves in SAN notation
 * @property {string} fen Current board position in FEN notation
 */
export interface ChessGameState {
  game: Chess;
  status: GameStatus;
  moveHistory: string[];
  fen: string;
}

/**
 * @typedef {Object} CapturedPieces
 * @property {string[]} white Pieces captured by white
 * @property {string[]} black Pieces captured by black
 */
export interface CapturedPieces {
  white: string[];
  black: string[];
}

/**
 * Get the current game status from a chess instance
 */
export function getGameStatus(chess: Chess): GameStatus {
  return {
    isCheck: chess.isCheck(),
    isCheckmate: chess.isCheckmate(),
    isDraw: chess.isDraw(),
    isGameOver: chess.isGameOver(),
    turn: chess.turn()
  };
}

/**
 * Calculate captured pieces based on the current board position
 */
export function calculateCapturedPieces(chess: Chess): CapturedPieces {
  const fen = chess.fen();
  const piecesInFen = fen.split(' ')[0];
  
  // Count pieces on the board
  const pieceCounts = {
    p: 0, n: 0, b: 0, r: 0, q: 0, k: 0,
    P: 0, N: 0, B: 0, R: 0, Q: 0, K: 0
  };
  
  // Standard starting counts
  const startingCounts = {
    p: 8, n: 2, b: 2, r: 2, q: 1, k: 1,
    P: 8, N: 2, B: 2, R: 2, Q: 1, K: 1
  };
  
  // Count pieces on the board
  for (const char of piecesInFen) {
    if (pieceCounts.hasOwnProperty(char)) {
      pieceCounts[char as keyof typeof pieceCounts]++;
    }
  }
  
  // Calculate captured pieces
  const capturedByWhite = [];
  const capturedByBlack = [];
  
  for (const piece of ['p', 'n', 'b', 'r', 'q']) {
    const blackCaptured = startingCounts[piece] - pieceCounts[piece];
    for (let i = 0; i < blackCaptured; i++) {
      capturedByWhite.push(piece);
    }
    
    const whiteCaptured = startingCounts[piece.toUpperCase()] - pieceCounts[piece.toUpperCase()];
    for (let i = 0; i < whiteCaptured; i++) {
      capturedByBlack.push(piece.toUpperCase());
    }
  }
  
  return {
    white: capturedByWhite,
    black: capturedByBlack
  };
}

/**
 * Convert FEN piece notation to unicode chess symbols
 */
export function pieceToUnicode(piece: string): string {
  const pieceMap: Record<string, string> = {
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙'
  };
  return pieceMap[piece] || piece;
}