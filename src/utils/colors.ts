// Authentic Deal or No Deal Color Palette

export const COLORS = {
  // Primary Brand Colors
  BRIEFCASE_RED: '#C8102E',     // High amounts, DEAL button, danger elements
  JACKPOT_GOLD: '#E5A93C',      // Gold accents, winnings, success states
  TENSION_BLUE: '#0B3C5D',      // Low amounts, background, suspenseful elements
  BANKERS_BLACK: '#111111',     // Text, banker elements, dramatic contrast
  METALLIC_PLATINUM: '#E0E0E0', // Neutral elements, disabled states
  
  // Extended Palette
  WHITE: '#FFFFFF',
  SHADOW_DARK: '#2c3e50',
  
  // Semantic Colors
  SUCCESS: '#E5A93C',    // Jackpot Gold
  WARNING: '#E5A93C',    // Jackpot Gold  
  DANGER: '#C8102E',     // Briefcase Red
  INFO: '#0B3C5D',       // Tension Blue
  
  // Amount Type Colors
  LOW_AMOUNT: '#0B3C5D',    // Tension Blue for lower amounts
  HIGH_AMOUNT: '#C8102E',   // Briefcase Red for higher amounts
  PLAYER_BOX: '#E5A93C',    // Jackpot Gold for player's box (when revealed)
  ELIMINATED: '#666666',    // Grayed out eliminated amounts
} as const;

// Color utility functions
export const getAmountColor = (value: number, isEliminated: boolean = false): string => {
  if (isEliminated) {
    return COLORS.ELIMINATED;
  }
  
  // Split point for low/high amounts (first 13 are low, last 13 are high)
  const SPLIT_INDEX = 13;
  const sortedValues = [0.01, 1, 5, 10, 50, 100, 250, 500, 750, 1000, 3000, 5000, 10000, 15000, 20000, 35000, 50000, 75000, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 1000000];
  const index = sortedValues.indexOf(value);
  
  return index < SPLIT_INDEX ? COLORS.LOW_AMOUNT : COLORS.HIGH_AMOUNT;
};

export const getButtonColor = (type: 'deal' | 'no-deal' | 'action' | 'start'): string => {
  switch (type) {
    case 'deal':
      return COLORS.BRIEFCASE_RED;
    case 'no-deal':
      return COLORS.TENSION_BLUE;
    case 'action':
    case 'start':
      return COLORS.JACKPOT_GOLD;
    default:
      return COLORS.METALLIC_PLATINUM;
  }
};