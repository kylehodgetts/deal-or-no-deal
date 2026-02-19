import React, { useEffect } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider, useGame } from '../../../hooks/useGame';
import GameControls from '../GameControls';

// Wrapper for tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GameProvider>{children}</GameProvider>
);

describe('GameControls', () => {
  it('should render start game button in initial state', () => {
    render(
      <TestWrapper>
        <GameControls />
      </TestWrapper>
    );

    expect(screen.getByText('Ready to Play?')).toBeInTheDocument();
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  it('should start game when start button clicked', () => {
    const GameControlsWithState: React.FC = () => {
      const { state } = useGame();
      
      return (
        <div>
          <GameControls />
          <div data-testid="game-status">{state.gameStatus}</div>
        </div>
      );
    };

    render(
      <TestWrapper>
        <GameControlsWithState />
      </TestWrapper>
    );

    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);

    expect(screen.getByTestId('game-status')).toHaveTextContent('selecting-player-box');
  });

  it('should not render during player selection phase', () => {
    const GameInPlayerSelectionPhase: React.FC = () => {
      const { dispatch } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
      }, [dispatch]);
      
      return <GameControls />;
    };

    const { container } = render(
      <TestWrapper>
        <GameInPlayerSelectionPhase />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should not render during playing phase', () => {
    const GameInPlayingPhase: React.FC = () => {
      const { dispatch } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
        dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
      }, [dispatch]);
      
      return <GameControls />;
    };

    const { container } = render(
      <TestWrapper>
        <GameInPlayingPhase />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render banker offer controls when offer is made', () => {
    const GameWithBankerOffer: React.FC = () => {
      const { dispatch } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
        dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        // Complete first round by opening 6 boxes
        for (let i = 2; i <= 7; i++) {
          dispatch({ type: 'OPEN_BOX', boxId: i });
        }
        dispatch({ type: 'SHOW_BANKER_OFFER', offer: 50000 });
      }, [dispatch]);
      
      return <GameControls />;
    };

    render(
      <TestWrapper>
        <GameWithBankerOffer />
      </TestWrapper>
    );

    expect(screen.getByText("Banker's Offer")).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('Deal or No Deal?')).toBeInTheDocument();
    expect(screen.getByText('DEAL')).toBeInTheDocument();
    expect(screen.getByText('NO DEAL')).toBeInTheDocument();
  });

  it('should handle deal acceptance', () => {
    const GameWithBankerOffer: React.FC = () => {
      const { dispatch, state } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
        dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        // Complete first round by opening 6 boxes
        for (let i = 2; i <= 7; i++) {
          dispatch({ type: 'OPEN_BOX', boxId: i });
        }
        dispatch({ type: 'SHOW_BANKER_OFFER', offer: 50000 });
      }, [dispatch]);
      
      return (
        <div>
          <GameControls />
          <div data-testid="game-status">{state.gameStatus}</div>
          <div data-testid="final-winnings">{state.finalWinnings}</div>
        </div>
      );
    };

    render(
      <TestWrapper>
        <GameWithBankerOffer />
      </TestWrapper>
    );

    const dealButton = screen.getByText('DEAL');
    fireEvent.click(dealButton);

    expect(screen.getByTestId('game-status')).toHaveTextContent('game-over');
    expect(screen.getByTestId('final-winnings')).toHaveTextContent('50000');
  });

  it('should handle deal rejection', () => {
    const GameWithBankerOffer: React.FC = () => {
      const { dispatch, state } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
        dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        // Complete first round by opening 6 boxes
        for (let i = 2; i <= 7; i++) {
          dispatch({ type: 'OPEN_BOX', boxId: i });
        }
        dispatch({ type: 'SHOW_BANKER_OFFER', offer: 50000 });
      }, [dispatch]);
      
      return (
        <div>
          <GameControls />
          <div data-testid="game-status">{state.gameStatus}</div>
          <div data-testid="current-round">{state.currentRound}</div>
        </div>
      );
    };

    render(
      <TestWrapper>
        <GameWithBankerOffer />
      </TestWrapper>
    );

    const noDealButton = screen.getByText('NO DEAL');
    fireEvent.click(noDealButton);

    expect(screen.getByTestId('game-status')).toHaveTextContent('playing');
    expect(screen.getByTestId('current-round')).toHaveTextContent('2');
  });

  it('should render game over state', () => {
    const GameOverState: React.FC = () => {
      const { dispatch } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
        dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        dispatch({ type: 'END_GAME', winnings: 75000, result: 'no-deal' });
      }, [dispatch]);
      
      return <GameControls />;
    };

    render(
      <TestWrapper>
        <GameOverState />
      </TestWrapper>
    );

    expect(screen.getByText('Game Over!')).toBeInTheDocument();
    expect(screen.getByText('You won: $75,000')).toBeInTheDocument();
    expect(screen.getByText('No deal! You kept your original box!')).toBeInTheDocument();
    expect(screen.getByText('Play Again')).toBeInTheDocument();
  });

  it('should reset game when play again button clicked', () => {
    const GameOverWithReset: React.FC = () => {
      const { dispatch, state } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
        dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        dispatch({ type: 'END_GAME', winnings: 75000, result: 'deal' });
      }, [dispatch]);
      
      return (
        <div>
          <GameControls />
          <div data-testid="game-status">{state.gameStatus}</div>
        </div>
      );
    };

    render(
      <TestWrapper>
        <GameOverWithReset />
      </TestWrapper>
    );

    // First ensure we're in game over state
    expect(screen.getByText('Game Over!')).toBeInTheDocument();
    
    const playAgainButton = screen.getByText('Play Again');
    fireEvent.click(playAgainButton);

    expect(screen.getByTestId('game-status')).toHaveTextContent('initial');
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <TestWrapper>
        <GameControls className="custom-controls" />
      </TestWrapper>
    );

    const gameControls = container.firstChild as HTMLElement;
    expect(gameControls).toHaveClass('custom-controls');
  });
});