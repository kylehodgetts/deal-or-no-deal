import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { GameProvider, useGame } from '../useGame';
import { MONEY_VALUES } from '../../utils/gameLogic';

// Wrapper component for testing
const GameWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GameProvider>{children}</GameProvider>
);

describe('useGame', () => {
  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useGame(), { wrapper: GameWrapper });

      expect(result.current.state.boxes).toHaveLength(0);
      expect(result.current.state.playerBoxId).toBeNull();
      expect(result.current.state.currentRound).toBe(0);
      expect(result.current.state.gameStatus).toBe('initial');
      expect(result.current.state.currentOffer).toBeNull();
      expect(result.current.state.finalWinnings).toBeNull();
      expect(result.current.state.gameResult).toBeNull();
    });

    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useGame());
      }).toThrow('useGame must be used within a GameProvider');
    });
  });

  describe('game flow', () => {
    it('should start game correctly', () => {
      const { result } = renderHook(() => useGame(), { wrapper: GameWrapper });

      act(() => {
        result.current.dispatch({ type: 'START_GAME' });
      });

      expect(result.current.state.boxes).toHaveLength(26);
      expect(result.current.state.gameStatus).toBe('selecting-player-box');
      expect(result.current.state.currentRound).toBe(1);
      expect(result.current.state.boxesToOpenThisRound).toBe(6);
      
      // All boxes should have unique values from MONEY_VALUES
      const boxValues = result.current.state.boxes.map(box => box.value);
      expect(boxValues.sort()).toEqual([...MONEY_VALUES].sort());
    });

    it('should select player box correctly', () => {
      const { result } = renderHook(() => useGame(), { wrapper: GameWrapper });

      act(() => {
        result.current.dispatch({ type: 'START_GAME' });
        result.current.dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 5 });
      });

      expect(result.current.state.playerBoxId).toBe(5);
      expect(result.current.state.gameStatus).toBe('playing');
      expect(result.current.state.boxesOpenedThisRound).toBe(0);

      const playerBox = result.current.state.boxes.find(box => box.id === 5);
      expect(playerBox?.isPlayerBox).toBe(true);
    });

    it('should open boxes correctly', () => {
      const { result } = renderHook(() => useGame(), { wrapper: GameWrapper });

      act(() => {
        result.current.dispatch({ type: 'START_GAME' });
        result.current.dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        result.current.dispatch({ type: 'OPEN_BOX', boxId: 2 });
      });

      const box2 = result.current.state.boxes.find(box => box.id === 2);
      expect(box2?.isOpened).toBe(true);
      expect(result.current.state.boxesOpenedThisRound).toBe(1);
    });

    it('should transition to banker offer after round completion', () => {
      const { result } = renderHook(() => useGame(), { wrapper: GameWrapper });

      act(() => {
        result.current.dispatch({ type: 'START_GAME' });
        result.current.dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        
        // Open 6 boxes (first round)
        for (let i = 2; i <= 7; i++) {
          result.current.dispatch({ type: 'OPEN_BOX', boxId: i });
        }
      });

      expect(result.current.state.boxesOpenedThisRound).toBe(6);
      expect(result.current.state.gameStatus).toBe('banker-offer');
    });

    it('should handle deal acceptance', () => {
      const { result } = renderHook(() => useGame(), { wrapper: GameWrapper });

      act(() => {
        result.current.dispatch({ type: 'START_GAME' });
        result.current.dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        
        // Complete first round
        for (let i = 2; i <= 7; i++) {
          result.current.dispatch({ type: 'OPEN_BOX', boxId: i });
        }
        
        result.current.dispatch({ type: 'SHOW_BANKER_OFFER', offer: 50000 });
        result.current.dispatch({ type: 'ACCEPT_DEAL', offer: 50000 });
      });

      expect(result.current.state.gameStatus).toBe('game-over');
      expect(result.current.state.finalWinnings).toBe(50000);
      expect(result.current.state.gameResult).toBe('deal');
    });

    it('should handle deal rejection and continue game', () => {
      const { result } = renderHook(() => useGame(), { wrapper: GameWrapper });

      act(() => {
        result.current.dispatch({ type: 'START_GAME' });
        result.current.dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        
        // Complete first round
        for (let i = 2; i <= 7; i++) {
          result.current.dispatch({ type: 'OPEN_BOX', boxId: i });
        }
        
        result.current.dispatch({ type: 'SHOW_BANKER_OFFER', offer: 50000 });
        result.current.dispatch({ type: 'REJECT_DEAL' });
      });

      expect(result.current.state.gameStatus).toBe('playing');
      expect(result.current.state.currentRound).toBe(2);
      expect(result.current.state.boxesToOpenThisRound).toBe(5); // Second round
      expect(result.current.state.boxesOpenedThisRound).toBe(0);
      expect(result.current.state.currentOffer).toBeNull();
    });

    it('should reset game correctly', () => {
      const { result } = renderHook(() => useGame(), { wrapper: GameWrapper });

      act(() => {
        result.current.dispatch({ type: 'START_GAME' });
        result.current.dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        result.current.dispatch({ type: 'RESET_GAME' });
      });

      expect(result.current.state.boxes).toHaveLength(0);
      expect(result.current.state.playerBoxId).toBeNull();
      expect(result.current.state.gameStatus).toBe('initial');
    });
  });

  describe('helper functions', () => {
    it('should correctly identify remaining values', () => {
      const { result } = renderHook(() => useGame(), { wrapper: GameWrapper });

      act(() => {
        result.current.dispatch({ type: 'START_GAME' });
        result.current.dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        result.current.dispatch({ type: 'OPEN_BOX', boxId: 2 });
      });

      const remainingValues = result.current.getRemainingValues();
      const openedValues = result.current.getOpenedValues();
      
      expect(remainingValues).toHaveLength(24); // 26 total - 1 player - 1 opened
      expect(openedValues).toHaveLength(1);
      expect(remainingValues.every(val => MONEY_VALUES.includes(val as any))).toBe(true);
    });

    it('should correctly determine if box can be opened', () => {
      const { result } = renderHook(() => useGame(), { wrapper: GameWrapper });

      act(() => {
        result.current.dispatch({ type: 'START_GAME' });
        result.current.dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
      });

      expect(result.current.canOpenBox(2)).toBe(true); // Unopened, not player box
      expect(result.current.canOpenBox(1)).toBe(false); // Player box
      
      act(() => {
        result.current.dispatch({ type: 'OPEN_BOX', boxId: 2 });
      });
      
      expect(result.current.canOpenBox(2)).toBe(false); // Already opened
    });
  });

  describe('edge cases', () => {
    it('should not allow opening player box', () => {
      const { result } = renderHook(() => useGame(), { wrapper: GameWrapper });

      act(() => {
        result.current.dispatch({ type: 'START_GAME' });
        result.current.dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        result.current.dispatch({ type: 'OPEN_BOX', boxId: 1 });
      });

      const playerBox = result.current.state.boxes.find(box => box.id === 1);
      expect(playerBox?.isOpened).toBe(false);
    });

    it('should not allow opening box twice', () => {
      const { result } = renderHook(() => useGame(), { wrapper: GameWrapper });

      act(() => {
        result.current.dispatch({ type: 'START_GAME' });
        result.current.dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        result.current.dispatch({ type: 'OPEN_BOX', boxId: 2 });
        result.current.dispatch({ type: 'OPEN_BOX', boxId: 2 });
      });

      expect(result.current.state.boxesOpenedThisRound).toBe(1);
    });

    it('should handle actions in wrong game state', () => {
      const { result } = renderHook(() => useGame(), { wrapper: GameWrapper });

      // Try to select box without starting game
      act(() => {
        result.current.dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
      });

      expect(result.current.state.playerBoxId).toBeNull();
      expect(result.current.state.gameStatus).toBe('initial');
    });
  });
});