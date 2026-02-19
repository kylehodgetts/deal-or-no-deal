import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoneyBoard from '../MoneyBoard';
import { GameProvider } from '../../../hooks/useGame';
import { MONEY_VALUES } from '../../../utils/gameLogic';

// Create a test wrapper that provides game context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GameProvider>{children}</GameProvider>
);

describe('MoneyBoard', () => {
  it('should render all money values', () => {
    render(
      <TestWrapper>
        <MoneyBoard />
      </TestWrapper>
    );

    // Check that all money values are displayed
    MONEY_VALUES.forEach(value => {
      expect(screen.getByTestId(`money-${value}`)).toBeInTheDocument();
    });

    expect(screen.getByText('Money Amounts')).toBeInTheDocument();
    expect(screen.getByText('Lower Amounts')).toBeInTheDocument();
    expect(screen.getByText('Higher Amounts')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <MoneyBoard />
      </TestWrapper>
    );

    const moneyBoard = screen.getByRole('region', { name: 'Money amounts board' });
    expect(moneyBoard).toBeInTheDocument();

    // Check aria-labels on money amounts
    MONEY_VALUES.forEach(value => {
      const element = screen.getByTestId(`money-${value}`);
      expect(element).toHaveAttribute('aria-label');
    });
  });

  it('should apply custom className', () => {
    const customClass = 'custom-money-board';
    const { container } = render(
      <TestWrapper>
        <MoneyBoard className={customClass} />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass(customClass);
  });

  it('should render amounts in two columns', () => {
    render(
      <TestWrapper>
        <MoneyBoard />
      </TestWrapper>
    );

    expect(screen.getByText('Lower Amounts')).toBeInTheDocument();
    expect(screen.getByText('Higher Amounts')).toBeInTheDocument();
  });

  it('should show remaining amounts initially', () => {
    render(
      <TestWrapper>
        <MoneyBoard />
      </TestWrapper>
    );

    // All amounts should have "still in play" in their aria-label initially
    MONEY_VALUES.forEach(value => {
      const element = screen.getByTestId(`money-${value}`);
      expect(element).toHaveAttribute('aria-label', expect.stringContaining('still in play'));
    });
  });

  it('should display formatted money values', () => {
    render(
      <TestWrapper>
        <MoneyBoard />
      </TestWrapper>
    );

    // Check some sample formatted values are displayed (as shown in the formatMoney function)
    expect(screen.getByText('1¢')).toBeInTheDocument();
    expect(screen.getByText('$1M')).toBeInTheDocument(); // 1,000,000 is formatted as $1M
    expect(screen.getByText('$500K')).toBeInTheDocument(); // 500,000 is formatted as $500K
  });
});