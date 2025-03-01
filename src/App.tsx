import React from 'react';
import ChessGame from './screens/ChessGame';
import './index.css';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <ChessGame />
    </div>
  );
};

export default App;