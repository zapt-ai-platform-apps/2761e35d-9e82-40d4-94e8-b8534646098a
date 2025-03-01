import './index.css';
import ChessGame from './features/chess';
import ZaptBadge from './components/ZaptBadge';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold mb-4">Chess Game</h1>
      <p className="text-lg mb-6">Play against the computer!</p>
      
      <ChessGame />
      
      <ZaptBadge />
    </div>
  );
};

export default App;