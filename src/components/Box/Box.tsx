import React, { useState } from 'react';
import BoxSVG from './BoxSVG';
import { Box as BoxType } from '../../types/game';
import { useGame } from '../../hooks/useGame';
import styles from './Box.module.css';

export interface BoxProps {
  box: BoxType;
  onClick?: (boxId: number) => void;
  isSelectable?: boolean;
  size?: number;
  className?: string;
}

const Box: React.FC<BoxProps> = ({
  box,
  onClick,
  isSelectable = false,
  size = 120,
  className = ''
}) => {
  const { canOpenBox } = useGame();
  const [isHovered, setIsHovered] = useState(false);

  const isClickable = !box.isOpened && onClick && (isSelectable || canOpenBox(box.id));
  const isDisabled = !isClickable;

  const handleClick = () => {
    if (isClickable) {
      onClick(box.id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isClickable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleClick();
    }
  };

  if (box.isOpened) {
    // Opened boxes are not interactive
    return (
      <div className={`${styles.box} ${className}`}>
        <BoxSVG
          isOpen={true}
          boxNumber={box.id}
          value={box.value}
          isPlayerBox={box.isPlayerBox}
          size={size}
        />
        
        <span className="sr-only">
          Box {box.id} opened, contains {box.value}
        </span>
      </div>
    );
  }

  // Interactive (closed) boxes
  return (
    <div
      className={`${styles.box} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isClickable ? 0 : -1}
      role="button"
      aria-pressed={box.isOpened}
      aria-disabled={isDisabled}
    >
      <BoxSVG
        isOpen={false}
        boxNumber={box.id}
        isPlayerBox={box.isPlayerBox}
        isHovered={isHovered}
        isDisabled={isDisabled}
        size={size}
      />
      
      {/* Accessibility: Screen reader content */}
      <span className="sr-only">
        Box {box.id}, {isClickable ? 'clickable' : 'not available'}
      </span>
    </div>
  );
};

export default Box;