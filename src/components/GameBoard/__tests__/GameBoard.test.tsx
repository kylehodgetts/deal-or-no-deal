import React, { useEffect } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider, useGame } from '../../../hooks/useGame';
import GameBoard from '../GameBoard';

// Wrapper for tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GameProvider>{children}</GameProvider>
);

describe('GameBoard', () => {
  it('should render empty state when no game started', () => {
    render(
      <TestWrapper>
        <GameBoard />
      </TestWrapper>
    );

    expect(screen.getByText('Click "Start Game" to begin!')).toBeInTheDocument();
  });

  it('should render boxes when game is started', () => {
    const GameWithBoxes: React.FC = () => {
      const { dispatch } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
      }, [dispatch]);
      
      return <GameBoard />;
    };

    render(
      <TestWrapper>
        <GameWithBoxes />
      </TestWrapper>
    );

    expect(screen.getByText('Choose Your Boxes')).toBeInTheDocument();
    expect(screen.getByText('Select your box to keep until the end')).toBeInTheDocument();
    
    // Should have 26 boxes
    const boxes = screen.getAllByRole('img');
    expect(boxes).toHaveLength(26);
  });

  it('should handle box selection during player selection phase', () => {
    const mockOnBoxClick = jest.fn();
    
    const GameWithBoxes: React.FC = () => {
      const { dispatch } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
      }, [dispatch]);
      
      return <GameBoard onBoxClick={mockOnBoxClick} />;
    };

    render(
      <TestWrapper>
        <GameWithBoxes />
      </TestWrapper>
    );

    // Click on first box
    const boxes = screen.getAllByRole('button');
    fireEvent.click(boxes[0]);

    expect(mockOnBoxClick).toHaveBeenCalledWith(1);
  });

  it('should show round information when playing', () => {
    const GameInPlayingState: React.FC = () => {
      const { dispatch } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
        dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
      }, [dispatch]);
      
      return <GameBoard />;
    };

    render(
      <TestWrapper>
        <GameInPlayingState />
      </TestWrapper>
    );

    expect(screen.getByText('Round 1')).toBeInTheDocument();
    expect(screen.getByText(/Open \d+ more/)).toBeInTheDocument();
  });

  it('should highlight player box', () => {
    const GameWithPlayerBox: React.FC = () => {
      const { dispatch } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
        dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 5 });
      }, [dispatch]);
      
      return <GameBoard />;
    };

    render(
      <TestWrapper>
        <GameWithPlayerBox />
      </TestWrapper>
    );

    expect(screen.getByText('YOUR BOX')).toBeInTheDocument();
    expect(screen.getByText('Your Box')).toBeInTheDocument(); // Player label
  });

  it('should show game over state', () => {
    const GameOverState: React.FC = () => {
      const { dispatch } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
        dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 });
        dispatch({ type: 'END_GAME', winnings: 50000, result: 'deal' });
      }, [dispatch]);
      
      return <GameBoard />;
    };

    render(
      <TestWrapper>
        <GameOverState />
      </TestWrapper>
    );

    expect(screen.getByText('Game Over!')).toBeInTheDocument();
    expect(screen.getByText('You won: $50,000')).toBeInTheDocument();
    expect(screen.getByText('Result: You took the deal!')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <TestWrapper>
        <GameBoard className="custom-game-board" />
      </TestWrapper>
    );

    const gameBoard = container.firstChild as HTMLElement;
    expect(gameBoard).toHaveClass('custom-game-board');
  });

  it('should render responsive grid layout', () => {
    const GameWithBoxes: React.FC = () => {
      const { dispatch } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
      }, [dispatch]);
      
      return <GameBoard />;
    };

    render(
      <TestWrapper>
        <GameWithBoxes />
      </TestWrapper>
    );

    // Check that all 26 boxes are present via their SVG role
    const boxes = screen.getAllByRole('img');
    expect(boxes).toHaveLength(26);
    
    // Check that box buttons exist
    const boxButtons = screen.getAllByRole('button');
    expect(boxButtons).toHaveLength(26);
  });

  it('should handle custom click handler', () => {
    const customClickHandler = jest.fn();
    
    const GameWithBoxes: React.FC = () => {
      const { dispatch } = useGame();
      
      useEffect(() => {
        dispatch({ type: 'START_GAME' });
      }, [dispatch]);
      
      return <GameBoard onBoxClick={customClickHandler} />;
    };

    render(
      <TestWrapper>
        <GameWithBoxes />
      </TestWrapper>
    );

    const firstBox = screen.getAllByRole('button')[0];
    fireEvent.click(firstBox);

    expect(customClickHandler).toHaveBeenCalledWith(1);
  });
});