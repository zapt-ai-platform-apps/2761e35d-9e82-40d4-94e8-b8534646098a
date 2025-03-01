import './index.css';
import ChessGame from '@/screens/ChessGame';
import ZaptBadge from '@/components/chess/ZaptBadge';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <ChessGame />
      <ZaptBadge />
    </div>
  );
};

export default App;