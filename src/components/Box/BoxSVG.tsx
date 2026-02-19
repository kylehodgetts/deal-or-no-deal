import React from 'react';
import styles from './BoxSVG.module.css';

export interface BoxSVGProps {
  isOpen: boolean;
  boxNumber: number;
  value?: number;
  isPlayerBox?: boolean;
  isHovered?: boolean;
  isDisabled?: boolean;
  isWinner?: boolean;
  size?: number;
  className?: string;
}

const BoxSVG: React.FC<BoxSVGProps> = ({
  isOpen,
  boxNumber,
  value,
  isPlayerBox = false,
  isHovered = false,
  isDisabled = false,
  isWinner = false,
  size = 120,
  className = ''
}) => {
  const formatValue = (val: number): string => {
    if (val < 1) {
      return `${Math.round(val * 100)}¢`;
    } else if (val >= 1000000) {
      const millions = val / 1000000;
      return `$${millions % 1 === 0 ? millions.toString() : millions.toFixed(1)}M`;
    } else if (val >= 1000) {
      const thousands = val / 1000;
      return `$${thousands % 1 === 0 ? thousands.toString() : thousands.toFixed(1)}K`;
    } else {
      return `$${val.toFixed(val % 1 === 0 ? 0 : 2)}`;
    }
  };

  const getClassNames = () => {
    const classNames = [styles['box-svg']];
    
    if (isOpen) {
      classNames.push(styles['box-svg--open']);
    } else {
      classNames.push(styles['box-svg--closed']);
    }
    
    if (isPlayerBox) {
      classNames.push(styles['box-svg--player']);
    }
    
    if (isDisabled) {
      classNames.push(styles['box-svg--disabled']);
    }
    
    if (isWinner) {
      classNames.push(styles['box-svg--winner']);
    }
    
    if (className) {
      classNames.push(className);
    }
    
    return classNames.join(' ');
  };

  if (isOpen && value !== undefined) {
    // Open box showing money value
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className={getClassNames()}
        role="img"
        aria-label={`Opened box ${boxNumber} containing ${formatValue(value)}`}
      >
        {/* Background */}
        <rect
          width="118"
          height="118"
          x="1"
          y="1"
          rx="8"
          fill="#2c3e50"
          stroke="#34495e"
          strokeWidth="2"
        />
        
        {/* Inner glow */}
        <rect
          width="110"
          height="110"
          x="5"
          y="5"
          rx="6"
          fill="url(#openGradient)"
          opacity="0.9"
        />
        
        {/* Money value background */}
        <rect
          width="100"
          height="40"
          x="10"
          y="40"
          rx="4"
          fill="#f8f9fa"
          stroke="#dee2e6"
          strokeWidth="1"
        />
        
        {/* Money value text */}
        <text
          x="60"
          y="65"
          textAnchor="middle"
          fontSize={value >= 100000 ? "14" : "16"}
          fontWeight="bold"
          fill="#2c3e50"
          fontFamily="Arial, sans-serif"
        >
          {formatValue(value)}
        </text>
        
        {/* Box number (small) */}
        <text
          x="60"
          y="100"
          textAnchor="middle"
          fontSize="10"
          fill="#6c757d"
          fontFamily="Arial, sans-serif"
        >
          #{boxNumber}
        </text>
        
        {/* Gradients */}
        <defs>
          <linearGradient id="openGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ecdc4" />
            <stop offset="100%" stopColor="#45b7b8" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Closed box
  const boxColor = isPlayerBox ? '#e74c3c' : '#3498db';
  const boxColorHover = isPlayerBox ? '#c0392b' : '#2980b9';
  const currentBoxColor = isHovered ? boxColorHover : boxColor;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={getClassNames()}
      role="img"
      aria-label={`${isPlayerBox ? 'Your ' : ''}Box ${boxNumber}${isPlayerBox ? ' (your selected box)' : ''}`}
    >
      {/* Shadow */}
      <ellipse
        cx="60"
        cy="115"
        rx="50"
        ry="8"
        fill="#2c3e50"
        opacity="0.3"
      />
      
      {/* Main box body */}
      <rect
        width="90"
        height="90"
        x="15"
        y="15"
        rx="8"
        fill={`url(#boxGradient-${isPlayerBox ? 'player' : 'normal'})`}
        stroke={currentBoxColor}
        strokeWidth="3"
        filter="url(#boxShadow)"
      />
      
      {/* Box lid lines */}
      <line
        x1="25"
        y1="35"
        x2="95"
        y2="35"
        stroke={currentBoxColor}
        strokeWidth="2"
        opacity="0.7"
      />
      
      <line
        x1="25"
        y1="40"
        x2="95"
        y2="40"
        stroke={currentBoxColor}
        strokeWidth="1"
        opacity="0.5"
      />
      
      {/* Box number */}
      <text
        x="60"
        y="70"
        textAnchor="middle"
        fontSize="24"
        fontWeight="bold"
        fill="white"
        fontFamily="Arial, sans-serif"
        filter="url(#textShadow)"
      >
        {boxNumber}
      </text>
      
      {/* Player box indicator */}
      {isPlayerBox && (
        <text
          x="60"
          y="88"
          textAnchor="middle"
          fontSize="10"
          fill="white"
          fontFamily="Arial, sans-serif"
          opacity="0.8"
        >
          YOUR BOX
        </text>
      )}
      
      {/* Highlight effect for hover */}
      {isHovered && (
        <rect
          width="90"
          height="90"
          x="15"
          y="15"
          rx="8"
          fill="white"
          opacity="0.2"
          pointerEvents="none"
        />
      )}
      
      {/* Definitions */}
      <defs>
        {/* Normal box gradient */}
        <linearGradient id="boxGradient-normal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#74b9ff" />
          <stop offset="100%" stopColor="#0984e3" />
        </linearGradient>
        
        {/* Player box gradient */}
        <linearGradient id="boxGradient-player" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fd79a8" />
          <stop offset="100%" stopColor="#e84393" />
        </linearGradient>
        
        {/* Box shadow */}
        <filter id="boxShadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#2c3e50" floodOpacity="0.3"/>
        </filter>
        
        {/* Text shadow */}
        <filter id="textShadow">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#2c3e50" floodOpacity="0.5"/>
        </filter>
      </defs>
    </svg>
  );
};

export default BoxSVG;