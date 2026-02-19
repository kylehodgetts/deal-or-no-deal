import { GameProvider } from './hooks/useGame';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import MoneyBoard from './components/MoneyBoard';
import './App.css';

function App() {
  return (
    <div className="app">
      <GameProvider>
        <header className="app-header">
          <h1>Deal or No Deal</h1>
          <p>Welcome to the ultimate game of chance!</p>
        </header>
        <main className="app-main">
          <div className="game-container">
            <div className="game-left">
              <GameControls />
              <GameBoard />
            </div>
            <div className="game-right">
              <MoneyBoard />
            </div>
          </div>
        </main>
      </GameProvider>
    </div>
  );
}

export default App;