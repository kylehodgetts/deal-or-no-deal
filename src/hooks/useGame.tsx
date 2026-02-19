import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { GameState, GameAction, GameContextType, Box } from '../types/game';
import { MONEY_VALUES, shuffleArray } from '../utils/gameLogic';

// Initial game state
const initialGameState: GameState = {
  boxes: [],
  playerBoxId: null,
  currentRound: 0,
  gameStatus: 'initial',
  currentOffer: null,
  boxesToOpenThisRound: 0,
  boxesOpenedThisRound: 0,
  finalWinnings: null,
  gameResult: null
};

// Rounds structure: number of boxes to open per round
const ROUND_STRUCTURE = [6, 5, 4, 3, 2, 1, 1, 1, 1]; // Traditional Deal or No Deal structure

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      // Shuffle money values and assign to boxes
      const shuffledValues = shuffleArray(MONEY_VALUES);
      const boxes: Box[] = Array.from({ length: 26 }, (_, index) => ({
        id: index + 1,
        value: shuffledValues[index],
        isOpened: false,
        isPlayerBox: false
      }));

      return {
        ...initialGameState,
        boxes,
        gameStatus: 'selecting-player-box',
        currentRound: 1,
        boxesToOpenThisRound: ROUND_STRUCTURE[0]
      };
    }

    case 'SELECT_PLAYER_BOX': {
      if (state.gameStatus !== 'selecting-player-box') return state;

      const updatedBoxes = state.boxes.map(box =>
        box.id === action.boxId ? { ...box, isPlayerBox: true } : box
      );

      return {
        ...state,
        boxes: updatedBoxes,
        playerBoxId: action.boxId,
        gameStatus: 'playing',
        boxesOpenedThisRound: 0
      };
    }

    case 'OPEN_BOX': {
      if (state.gameStatus !== 'playing') return state;
      
      const box = state.boxes.find(b => b.id === action.boxId);
      if (!box || box.isOpened || box.isPlayerBox) return state;

      const updatedBoxes = state.boxes.map(box =>
        box.id === action.boxId ? { ...box, isOpened: true } : box
      );

      const boxesOpenedThisRound = state.boxesOpenedThisRound + 1;
      
      // Check if round is complete
      if (boxesOpenedThisRound >= state.boxesToOpenThisRound) {
        // Check if game should end (only 1 box left)
        const remainingClosedBoxes = updatedBoxes.filter(b => !b.isOpened && !b.isPlayerBox);
        
        if (remainingClosedBoxes.length === 0) {
          // Game over - open player's box
          const playerBox = updatedBoxes.find(b => b.isPlayerBox);
          const finalWinnings = playerBox?.value || 0;
          
          return {
            ...state,
            boxes: updatedBoxes,
            gameStatus: 'game-over',
            finalWinnings,
            gameResult: 'no-deal',
            boxesOpenedThisRound
          };
        } else {
          // Round complete, show banker offer
          return {
            ...state,
            boxes: updatedBoxes,
            gameStatus: 'banker-offer',
            boxesOpenedThisRound
          };
        }
      }

      // Continue round
      return {
        ...state,
        boxes: updatedBoxes,
        boxesOpenedThisRound
      };
    }

    case 'SHOW_BANKER_OFFER': {
      if (state.gameStatus !== 'banker-offer') return state;

      return {
        ...state,
        currentOffer: action.offer
      };
    }

    case 'ACCEPT_DEAL': {
      if (state.gameStatus !== 'banker-offer') return state;

      return {
        ...state,
        gameStatus: 'game-over',
        finalWinnings: action.offer,
        gameResult: 'deal'
      };
    }

    case 'REJECT_DEAL': {
      if (state.gameStatus !== 'banker-offer') return state;

      const nextRound = state.currentRound + 1;
      const nextBoxesToOpen = ROUND_STRUCTURE[nextRound - 1] || 1;

      return {
        ...state,
        gameStatus: 'playing',
        currentRound: nextRound,
        boxesToOpenThisRound: nextBoxesToOpen,
        boxesOpenedThisRound: 0,
        currentOffer: null
      };
    }

    case 'END_GAME': {
      return {
        ...state,
        gameStatus: 'game-over',
        finalWinnings: action.winnings,
        gameResult: action.result
      };
    }

    case 'RESET_GAME': {
      return initialGameState;
    }

    default:
      return state;
  }
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Helper functions
  const getRemainingValues = useCallback((): number[] => {
    return state.boxes
      .filter(box => !box.isOpened && !box.isPlayerBox)
      .map(box => box.value);
  }, [state.boxes]);

  const getOpenedValues = useCallback((): number[] => {
    return state.boxes
      .filter(box => box.isOpened)
      .map(box => box.value)
      .sort((a, b) => a - b);
  }, [state.boxes]);

  const canOpenBox = useCallback((boxId: number): boolean => {
    const box = state.boxes.find(b => b.id === boxId);
    return !!(
      box && 
      state.gameStatus === 'playing' && 
      !box.isOpened && 
      !box.isPlayerBox &&
      state.boxesOpenedThisRound < state.boxesToOpenThisRound
    );
  }, [state]);

  const value: GameContextType = {
    state,
    dispatch,
    getRemainingValues,
    getOpenedValues,
    canOpenBox
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Hook to use game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};