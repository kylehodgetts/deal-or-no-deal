import React from 'react';
import { useGame } from '../../hooks/useGame';
import Box from '../Box';
import { calculateBankerOffer } from '../../utils/gameLogic';
import styles from './GameBoard.module.css';

export interface GameBoardProps {
  onBoxClick?: (boxId: number) => void;
  className?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ onBoxClick, className = '' }) => {
  const { state, dispatch, getRemainingValues } = useGame();
  
  const handleBoxClick = (boxId: number) => {
    if (onBoxClick) {
      onBoxClick(boxId);
      return;
    }

    // Default game logic
    switch (state.gameStatus) {
      case 'selecting-player-box':
        dispatch({ type: 'SELECT_PLAYER_BOX', boxId });
        break;
        
      case 'playing': {
        dispatch({ type: 'OPEN_BOX', boxId });
        
        // Check if we should show banker offer after this box opens
        const updatedBoxesOpenedThisRound = state.boxesOpenedThisRound + 1;
        if (updatedBoxesOpenedThisRound >= state.boxesToOpenThisRound) {
          // Calculate and show banker offer
          const remainingValues = getRemainingValues();
          
          // Remove the value from the box we just opened
          const openingBox = state.boxes.find(box => box.id === boxId);
          if (openingBox) {
            const finalRemainingValues = remainingValues.filter(val => val !== openingBox.value);
            
            if (finalRemainingValues.length > 0) {
              const offer = calculateBankerOffer(
                finalRemainingValues,
                state.currentRound,
                10 // total rounds
              );
              
              setTimeout(() => {
                dispatch({ type: 'SHOW_BANKER_OFFER', offer });
              }, 1000); // Delay for dramatic effect
            }
          }
        }
        break;
      }
    }
  };

  if (state.boxes.length === 0) {
    return (
      <div className={`${styles.gameBoard} ${styles.gameBoard__empty} ${className}`}>
        <p>Click "Start Game" to begin!</p>
      </div>
    );
  }

  // Organize boxes into a grid layout
  // For 26 boxes, we'll use a flexible grid that works well on different screen sizes
  const organizedBoxes = state.boxes.sort((a, b) => a.id - b.id);

  return (
    <div className={`${styles.gameBoard} ${className}`}>
      <div className={styles.gameBoard__header}>
        <h2>Choose Your Boxes</h2>
        {state.gameStatus === 'selecting-player-box' && (
          <p className={styles.gameBoard__instruction}>
            Select your box to keep until the end
          </p>
        )}
        {state.gameStatus === 'playing' && (
          <div className={styles.gameBoard__roundInfo}>
            <p>Round {state.currentRound}</p>
            <p>
              Open {state.boxesToOpenThisRound - state.boxesOpenedThisRound} more 
              {state.boxesToOpenThisRound - state.boxesOpenedThisRound === 1 ? ' box' : ' boxes'}
            </p>
          </div>
        )}
      </div>

      <div className={styles.gameBoard__grid}>
        {organizedBoxes.map((box) => (
          <div
            key={box.id}
            className={`${styles.gameBoard__boxSlot} ${
              box.isPlayerBox ? styles.gameBoard__boxSlot_player : ''
            }`}
          >
            <Box
              box={box}
              onClick={handleBoxClick}
              isSelectable={state.gameStatus === 'selecting-player-box'}
              size={100}
              className={styles.gameBoard__box}
            />
            {box.isPlayerBox && !box.isOpened && (
              <div className={styles.gameBoard__playerLabel}>
                Your Box
              </div>
            )}
          </div>
        ))}
      </div>

      {state.gameStatus === 'game-over' && state.finalWinnings !== null && (
        <div className={styles.gameBoard__gameOver}>
          <h3>Game Over!</h3>
          <p className={styles.gameBoard__winnings}>
            You won: ${state.finalWinnings.toLocaleString()}
          </p>
          <p>
            Result: {state.gameResult === 'deal' ? 'You took the deal!' : 'No deal - you kept your box!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;