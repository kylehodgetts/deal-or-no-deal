// Original US Deal or No Deal money values (26 cases)
export const MONEY_VALUES = [
  0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750,
  1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000,
  300000, 400000, 500000, 750000, 1000000
] as const;

// Helper function to format money values for display
export const formatMoney = (value: number): string => {
  if (value < 1) {
    return `${Math.round(value * 100)}¢`;
  } else if (value >= 1000000) {
    const millions = value / 1000000;
    return `$${millions % 1 === 0 ? millions.toString() : millions.toFixed(1)}M`;
  } else if (value >= 1000) {
    const thousands = value / 1000;
    return `$${thousands % 1 === 0 ? thousands.toString() : thousands.toFixed(1)}K`;
  } else {
    return `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`;
  }
};

// Banker offer calculation algorithm
// Returns offer as a percentage of the average remaining value
export const calculateBankerOffer = (
  remainingValues: number[],
  round: number,
  totalRounds: number = 10
): number => {
  if (remainingValues.length === 0) return 0;
  
  const average = remainingValues.reduce((sum, val) => sum + val, 0) / remainingValues.length;
  
  // Base offer is 85-90% of average, depending on how far into the game we are
  const gameProgress = round / totalRounds;
  const basePercentage = 0.85 + (gameProgress * 0.05); // 85% early, 90% late
  
  // Apply psychological adjustments based on remaining high values
  const highValueThreshold = 100000;
  const highValues = remainingValues.filter(val => val >= highValueThreshold);
  const highValueRatio = highValues.length / remainingValues.length;
  
  // Reduce offer if many high values remain (banker wants you to take risk)
  const riskAdjustment = 1 - (highValueRatio * 0.15);
  
  // Round offer to nearest dollar
  return Math.round(average * basePercentage * riskAdjustment);
};

// Shuffle array utility for randomizing box assignments
export const shuffleArray = <T>(array: readonly T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};