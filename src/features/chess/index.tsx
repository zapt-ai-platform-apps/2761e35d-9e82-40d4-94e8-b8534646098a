import { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { findBestMove } from '../../services/chess-ai';
import ChessControls from './components/ChessControls';
import GameStatus from './components/GameStatus';

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [currentPosition, setCurrentPosition] = useState(game.fen());
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [isThinking, setIsThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState('');
  
  const updateGameStatus = useCallback(() => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setGameStatus(game.turn() === 'w' ? 'Black wins by checkmate!' : 'White wins by checkmate!');
      } else if (game.isDraw()) {
        setGameStatus('Game ended in a draw!');
      } else if (game.isStalemate()) {
        setGameStatus('Game ended in stalemate!');
      } else if (game.isThreefoldRepetition()) {
        setGameStatus('Game ended by threefold repetition!');
      } else if (game.isInsufficientMaterial()) {
        setGameStatus('Game ended due to insufficient material!');
      }
    } else if (game.isCheck()) {
      setGameStatus(`${game.turn() === 'w' ? 'White' : 'Black'} is in check`);
    } else {
      setGameStatus(`${game.turn() === 'w' ? 'White' : 'Black'} to move`);
    }
  }, [game]);
  
  const computerMove = useCallback(async () => {
    if (game.isGameOver() || 
        (game.turn() === 'w' && playerColor === 'white') || 
        (game.turn() === 'b' && playerColor === 'black')) {
      return;
    }
    
    setIsThinking(true);
    
    try {
      // Small delay to give a more natural feeling
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const bestMove = findBestMove(game);
      if (bestMove) {
        const newGame = new Chess(game.fen());
        newGame.move(bestMove);
        
        setGame(newGame);
        setCurrentPosition(newGame.fen());
        setMoveHistory(prev => [...prev, bestMove.san || `${bestMove.from}-${bestMove.to}`]);
        updateGameStatus();
      }
    } catch (error) {
      console.error('Error making computer move:', error);
    } finally {
      setIsThinking(false);
    }
  }, [game, playerColor, updateGameStatus]);

  // Make computer move when it's the computer's turn
  useEffect(() => {
    if ((game.turn() === 'w' && playerColor === 'black') || 
        (game.turn() === 'b' && playerColor === 'white')) {
      computerMove();
    }
  }, [game, computerMove, playerColor]);
  
  // Update game status whenever the position changes
  useEffect(() => {
    updateGameStatus();
  }, [currentPosition, updateGameStatus]);

  const onDrop = (sourceSquare: string, targetSquare: string): boolean => {
    // Don't allow moves when it's the computer's turn or when thinking
    if (isThinking || 
        (game.turn() === 'w' && playerColor === 'black') || 
        (game.turn() === 'b' && playerColor === 'white')) {
      return false;
    }
    
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to queen for simplicity
      });
      
      if (move === null) return false;
      
      setCurrentPosition(game.fen());
      setMoveHistory(prev => [...prev, move.san]);
      updateGameStatus();
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setCurrentPosition(newGame.fen());
    setMoveHistory([]);
    updateGameStatus();
  };

  const switchSides = () => {
    setPlayerColor(prev => prev === 'white' ? 'black' : 'white');
    resetGame();
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full max-w-6xl">
      <div className="w-full md:w-2/3 max-w-[600px]">
        <div className="aspect-square w-full">
          <Chessboard 
            position={currentPosition} 
            onPieceDrop={onDrop} 
            boardOrientation={playerColor}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
            }}
          />
        </div>
      </div>
      
      <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md">
        <GameStatus status={gameStatus} isThinking={isThinking} />
        <ChessControls 
          onReset={resetGame} 
          onSwitchSides={switchSides} 
          playerColor={playerColor}
          moveHistory={moveHistory}
        />
      </div>
    </div>
  );
};

export default ChessGame;