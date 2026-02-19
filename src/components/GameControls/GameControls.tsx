import React from 'react';
import { useGame } from '../../hooks/useGame';
import styles from './GameControls.module.css';

export interface GameControlsProps {
  className?: string;
}

const GameControls: React.FC<GameControlsProps> = ({ className = '' }) => {
  const { state, dispatch } = useGame();

  const handleStartGame = () => {
    dispatch({ type: 'START_GAME' });
  };

  const handleResetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const handleDeal = () => {
    if (state.currentOffer !== null) {
      dispatch({ type: 'ACCEPT_DEAL', offer: state.currentOffer });
    }
  };

  const handleNoDeal = () => {
    dispatch({ type: 'REJECT_DEAL' });
  };

  // Don't show controls during certain game states
  if (state.gameStatus === 'selecting-player-box' || state.gameStatus === 'playing') {
    return null;
  }

  return (
    <div className={`${styles.gameControls} ${className}`}>
      {/* Initial game state */}
      {state.gameStatus === 'initial' && (
        <div className={styles.gameControls__section}>
          <h2>Ready to Play?</h2>
          <p>Test your luck in the ultimate game of chance!</p>
          <button
            className={`${styles.gameControls__button} ${styles.gameControls__button_primary}`}
            onClick={handleStartGame}
          >
            Start Game
          </button>
        </div>
      )}

      {/* Banker offer state */}
      {state.gameStatus === 'banker-offer' && state.currentOffer !== null && (
        <div className={styles.gameControls__section}>
          <div className={styles.gameControls__offer}>
            <h2>Banker's Offer</h2>
            <div className={styles.gameControls__offerAmount}>
              ${state.currentOffer.toLocaleString()}
            </div>
            <p className={styles.gameControls__question}>
              Deal or No Deal?
            </p>
            <div className={styles.gameControls__buttons}>
              <button
                className={`${styles.gameControls__button} ${styles.gameControls__button_deal}`}
                onClick={handleDeal}
              >
                DEAL
              </button>
              <button
                className={`${styles.gameControls__button} ${styles.gameControls__button_noDeal}`}
                onClick={handleNoDeal}
              >
                NO DEAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game over state */}
      {state.gameStatus === 'game-over' && (
        <div className={styles.gameControls__section}>
          <div className={styles.gameControls__gameOver}>
            <h2>Game Over!</h2>
            <div className={styles.gameControls__winnings}>
              You won: ${state.finalWinnings?.toLocaleString() || '0'}
            </div>
            <p className={styles.gameControls__result}>
              {state.gameResult === 'deal' 
                ? "You took the banker's deal!" 
                : "No deal! You kept your original box!"
              }
            </p>
            <button
              className={`${styles.gameControls__button} ${styles.gameControls__button_primary}`}
              onClick={handleResetGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;