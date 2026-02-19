import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('Deal or No Deal - Integration Tests', () => {
  it('should render the complete app with all main components', () => {
    render(<App />);

    // Check main heading
    expect(screen.getByText('Deal or No Deal')).toBeInTheDocument();
    expect(screen.getByText('Welcome to the ultimate game of chance!')).toBeInTheDocument();
    
    // Check start game button is present
    expect(screen.getByText('Start Game')).toBeInTheDocument();

    // Check money board is present
    expect(screen.getByText('Money Amounts')).toBeInTheDocument();
    expect(screen.getByText('Lower Amounts')).toBeInTheDocument();
    expect(screen.getByText('Higher Amounts')).toBeInTheDocument();
  });

  it('should display all money values correctly', () => {
    render(<App />);

    // Check various money values are displayed
    expect(screen.getByText('1p')).toBeInTheDocument();
    expect(screen.getByText('£1M')).toBeInTheDocument();
    expect(screen.getByText('£500K')).toBeInTheDocument();
    expect(screen.getByText('£1')).toBeInTheDocument();
    expect(screen.getByText('£100K')).toBeInTheDocument();
  });

  it('should start the game and show box selection interface', async () => {
    render(<App />);

    // Start the game
    fireEvent.click(screen.getByText('Start Game'));

    // Should show box selection prompt
    await waitFor(() => {
      expect(screen.getByText(/Choose your box/i)).toBeInTheDocument();
    });

    // Should display instruction text
    expect(screen.getByText(/Select your box to keep until the end/i)).toBeInTheDocument();
  });

  it('should have responsive layout with game containers', () => {
    render(<App />);

    // Check that the game containers are rendered
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    
    // Both game controls and money board should be present
    expect(screen.getByText('Start Game')).toBeInTheDocument(); // GameControls
    expect(screen.getByText('Money Amounts')).toBeInTheDocument(); // MoneyBoard
  });

  it('should have proper accessibility structure', () => {
    render(<App />);

    // Check main structural elements
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument(); // main
    expect(screen.getByRole('region', { name: /money amounts/i })).toBeInTheDocument(); // money board
  });
});