import { Chess, Move } from 'chess.js';

// Simple piece values for evaluation
const PIECE_VALUES = {
  p: 10,  // pawn
  n: 30,  // knight
  b: 30,  // bishop
  r: 50,  // rook
  q: 90,  // queen
  k: 900  // king
};

// Center squares are worth more in the evaluation
const POSITION_BONUS = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

/**
 * Evaluates a chess position based on material and positional advantages
 */
function evaluateBoard(game: Chess): number {
  // If the game is over, return a high value for the winner
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -10000 : 10000;
  }
  
  // Draw is considered neutral (0)
  if (game.isDraw()) {
    return 0;
  }

  let score = 0;
  const board = game.board();
  
  // Evaluate each piece on the board
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];
      if (square !== null) {
        // Material value
        const pieceValue = PIECE_VALUES[square.type];
        // Add or subtract based on the piece color
        score += square.color === 'w' ? pieceValue : -pieceValue;
        
        // Position bonus
        const posBonus = POSITION_BONUS[i][j];
        score += square.color === 'w' ? posBonus : -posBonus;
      }
    }
  }
  
  return score;
}

/**
 * Minimax algorithm with alpha-beta pruning to find the best move
 */
function minimax(game: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
  // Base case: return evaluation if depth is 0 or game is over
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }
  
  const moves = game.moves({ verbose: true });
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of moves) {
      // Make move, evaluate, and undo
      game.move(move);
      const score = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of moves) {
      // Make move, evaluate, and undo
      game.move(move);
      const score = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minScore;
  }
}

/**
 * Finds the best move for the current position using minimax
 */
export function findBestMove(game: Chess): Move | null {
  // Get all valid moves
  const moves = game.moves({ verbose: true });
  
  // No valid moves
  if (moves.length === 0) return null;
  
  let bestMove: Move | null = null;
  let bestScore = game.turn() === 'w' ? -Infinity : Infinity;
  
  // Use a smaller depth for better performance
  // Increase for stronger play but slower performance
  const searchDepth = 3;
  
  for (const move of moves) {
    // Make move
    game.move(move);
    
    // Evaluate position after the move
    const score = minimax(
      game, 
      searchDepth - 1, 
      -Infinity, 
      Infinity, 
      game.turn() === 'w'
    );
    
    // Undo move
    game.undo();
    
    // Update best move if this is better
    if ((game.turn() === 'w' && score > bestScore) || 
        (game.turn() === 'b' && score < bestScore)) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}