import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider } from '../../../hooks/useGame';
import Box from '../Box';
import { Box as BoxType } from '../../../types/game';

// Wrapper for tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GameProvider>{children}</GameProvider>
);

// // Wrapper that starts a game for interactivity tests
// const GameStartedWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const GameStarter = () => {
//     const { dispatch } = useGame();
    
//     useEffect(() => {
//       dispatch({ type: 'START_GAME' });
//       dispatch({ type: 'SELECT_PLAYER_BOX', boxId: 1 }); // Select box 1 so box 2 can be opened
//     }, [dispatch]);
    
//     return <>{children}</>;
//   };

//   return (
//     <GameProvider>
//       <GameStarter />
//     </GameProvider>
//   );
// };

describe('Box', () => {
  const mockClosedBox: BoxType = {
    id: 2,
    value: 50000,
    isOpened: false,
    isPlayerBox: false
  };

  const mockOpenBox: BoxType = {
    id: 2,
    value: 10000,
    isOpened: true,
    isPlayerBox: false
  };

  const mockPlayerBox: BoxType = {
    id: 3,
    value: 100000,
    isOpened: false,
    isPlayerBox: true
  };

  it('should render closed box correctly', () => {
    render(
      <TestWrapper>
        <Box box={mockClosedBox} />
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render opened box correctly', () => {
    render(
      <TestWrapper>
        <Box box={mockOpenBox} />
      </TestWrapper>
    );

    expect(screen.getByText('$10K')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });

  it('should render player box correctly', () => {
    render(
      <TestWrapper>
        <Box box={mockPlayerBox} />
      </TestWrapper>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('YOUR BOX')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const mockOnClick = jest.fn();

    render(
      <TestWrapper>
        <Box box={mockClosedBox} onClick={mockOnClick} isSelectable={true} />
      </TestWrapper>
    );

    const boxElement = screen.getByRole('button');
    fireEvent.click(boxElement);

    expect(mockOnClick).toHaveBeenCalledWith(2);
  });

  it('should handle keyboard events', () => {
    const mockOnClick = jest.fn();

    render(
      <TestWrapper>
        <Box box={mockClosedBox} onClick={mockOnClick} isSelectable={true} />
      </TestWrapper>
    );

    const boxElement = screen.getByRole('button');
    fireEvent.keyDown(boxElement, { key: 'Enter' });

    expect(mockOnClick).toHaveBeenCalledWith(2);

    fireEvent.keyDown(boxElement, { key: ' ' });
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  it('should not be clickable when opened', () => {
    const mockOnClick = jest.fn();

    render(
      <TestWrapper>
        <Box box={mockOpenBox} onClick={mockOnClick} />
      </TestWrapper>
    );

    // Opened boxes should not be buttons
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should apply custom size', () => {
    render(
      <TestWrapper>
        <Box box={mockClosedBox} size={100} />
      </TestWrapper>
    );

    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('width', '100');
    expect(svg).toHaveAttribute('height', '100');
  });

  // These tests focus on simpler functionality without complex game state
  it('should have proper accessibility attributes when explicitly enabled', () => {
    // Test with isSelectable override, which bypasses game state logic
    render(
      <TestWrapper>
        <Box box={mockClosedBox} isSelectable={true} onClick={() => {}} />
      </TestWrapper>
    );

    const boxElement = screen.getByRole('button');
    expect(boxElement).toHaveAttribute('aria-pressed', 'false');
    expect(boxElement).toHaveAttribute('aria-disabled', 'false');
    expect(boxElement).toHaveAttribute('tabIndex', '0'); // Enabled with isSelectable=true
  });

  it('should be disabled when not selectable and game state prevents opening', () => {
    render(
      <TestWrapper>
        <Box box={mockClosedBox} isSelectable={false} />
      </TestWrapper>
    );

    const boxElement = screen.getByRole('button');
    expect(boxElement).toHaveAttribute('tabIndex', '-1');
  });

  it('should show screen reader content for non-available box', () => {
    render(
      <TestWrapper>
        <Box box={mockClosedBox} isSelectable={false} />
      </TestWrapper>
    );

    expect(screen.getByText(/Box 2, not available/)).toBeInTheDocument();
  });

  it('should show proper screen reader content', () => {
    render(
      <TestWrapper>
        <Box box={mockClosedBox} isSelectable={false} />
      </TestWrapper>
    );

    // In the initial game state, boxes are not available
    expect(screen.getByText(/Box 2, not available/)).toBeInTheDocument();
  });

  it('should handle focus states properly', () => {
    render(
      <TestWrapper>
        <Box box={mockClosedBox} isSelectable={true} onClick={() => {}} />
      </TestWrapper>
    );

    const boxElement = screen.getByRole('button');
    boxElement.focus();
    expect(boxElement).toHaveFocus();
  });
});