interface GameStatusProps {
  status: string;
  isThinking: boolean;
}

const GameStatus = ({ status, isThinking }: GameStatusProps) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Game Status</h2>
      <div className="p-3 bg-gray-50 rounded-md">
        {isThinking ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div>
            <p>Computer is thinking...</p>
          </div>
        ) : (
          <p>{status}</p>
        )}
      </div>
    </div>
  );
};

export default GameStatus;