import React from 'react';
import { useGame } from '../../hooks/useGame';
import { MONEY_VALUES, formatMoney } from '../../utils/gameLogic';
import { getAmountColor } from '../../utils/colors';
import styles from './MoneyBoard.module.css';

export interface MoneyBoardProps {
  className?: string;
}

const MoneyBoard: React.FC<MoneyBoardProps> = ({ className }) => {
  const { state, getOpenedValues } = useGame();

  // Split money values into two columns for display
  const midPoint = Math.ceil(MONEY_VALUES.length / 2);
  const leftColumn = MONEY_VALUES.slice(0, midPoint);
  const rightColumn = MONEY_VALUES.slice(midPoint);

  const getAmountStatus = (value: number) => {
    // Check if this value has been eliminated (box opened)
    const openedValues = getOpenedValues();
    const isEliminated = openedValues.includes(value);
    
    if (isEliminated) {
      return 'eliminated';
    }

    // Only reveal player box value when game is over
    // During gameplay, player box value should remain hidden for suspense
    if (state.gameStatus === 'game-over' && state.playerBoxId !== null) {
      const playerBox = state.boxes.find(box => box.id === state.playerBoxId);
      if (playerBox && playerBox.value === value) {
        return 'playerBox';
      }
    }

    // Otherwise it's still remaining in play (including hidden player box value)
    return 'remaining';
  };

  const renderColumn = (values: number[], title: string) => (
    <div className={styles.column}>
      <div className={styles.columnTitle}>{title}</div>
      {values.map(value => {
        const status = getAmountStatus(value);
        const amountColor = getAmountColor(value, status === 'eliminated');
        
        return (
          <div
            key={value}
            className={`${styles.amount} ${styles[status]}`}
            style={{ 
              color: status === 'playerBox' ? '#E5A93C' : amountColor,
              borderColor: status === 'playerBox' ? '#E5A93C' : amountColor 
            }}
            data-testid={`money-${value}`}
            aria-label={`${formatMoney(value)} - ${status === 'eliminated' ? 'eliminated' : status === 'playerBox' ? 'your box' : 'still in play'}`}
          >
            {formatMoney(value)}
          </div>
        );
      })}
    </div>
  );

  const combinedClassName = className 
    ? `${styles.moneyBoard} ${className}` 
    : styles.moneyBoard;

  return (
    <div className={combinedClassName} role="region" aria-label="Money amounts board">
      <h2 className={styles.title}>Money Amounts</h2>
      <div className={styles.amounts}>
        {renderColumn(leftColumn, 'Lower Amounts')}
        {renderColumn(rightColumn, 'Higher Amounts')}
      </div>
    </div>
  );
};

export default MoneyBoard;