import { 
  MONEY_VALUES, 
  formatMoney, 
  calculateBankerOffer, 
  shuffleArray 
} from '../gameLogic';

describe('gameLogic', () => {
  describe('MONEY_VALUES', () => {
    it('should have 26 unique values', () => {
      expect(MONEY_VALUES).toHaveLength(26);
      expect(new Set(MONEY_VALUES).size).toBe(26);
    });

    it('should be sorted in ascending order', () => {
      const sorted = [...MONEY_VALUES].sort((a, b) => a - b);
      expect(MONEY_VALUES).toEqual(sorted);
    });

    it('should include expected boundary values', () => {
      expect(MONEY_VALUES).toContain(0.01);
      expect(MONEY_VALUES).toContain(1000000);
    });
  });

  describe('formatMoney', () => {
    it('should format pence correctly', () => {
      expect(formatMoney(0.01)).toBe('1p');
      expect(formatMoney(0.25)).toBe('25p');
    });

    it('should format regular pounds', () => {
      expect(formatMoney(100)).toBe('£100');
      expect(formatMoney(500.5)).toBe('£500.50');
    });

    it('should format thousands', () => {
      expect(formatMoney(1000)).toBe('£1K');
      expect(formatMoney(25000)).toBe('£25K');
    });

    it('should format millions', () => {
      expect(formatMoney(1000000)).toBe('£1M');
      expect(formatMoney(2500000)).toBe('£2.5M');
    });
  });

  describe('calculateBankerOffer', () => {
    it('should return 0 for empty array', () => {
      expect(calculateBankerOffer([], 1)).toBe(0);
    });

    it('should return reasonable offer for typical values', () => {
      const values = [100, 500, 1000, 5000];
      const offer = calculateBankerOffer(values, 1, 10);
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      // Offer should be between 70-95% of average
      expect(offer).toBeGreaterThan(average * 0.7);
      expect(offer).toBeLessThan(average * 0.95);
    });

    it('should offer less when high values remain', () => {
      const highValues = [500000, 750000, 1000000];
      const lowValues = [100, 500, 1000];
      
      const highOffer = calculateBankerOffer(highValues, 1, 10);
      const lowOffer = calculateBankerOffer(lowValues, 1, 10);
      
      const highAverage = highValues.reduce((sum, val) => sum + val, 0) / highValues.length;
      const lowAverage = lowValues.reduce((sum, val) => sum + val, 0) / lowValues.length;
      
      // High value offer should be proportionally lower
      expect(highOffer / highAverage).toBeLessThan(lowOffer / lowAverage);
    });

    it('should offer more later in the game', () => {
      const values = [1000, 5000, 10000];
      const earlyOffer = calculateBankerOffer(values, 1, 10);
      const lateOffer = calculateBankerOffer(values, 9, 10);
      
      expect(lateOffer).toBeGreaterThan(earlyOffer);
    });
  });

  describe('shuffleArray', () => {
    it('should return array with same elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      
      expect(shuffled).toHaveLength(original.length);
      expect(shuffled.sort()).toEqual(original.sort());
    });

    it('should not modify original array', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      shuffleArray(original);
      
      expect(original).toEqual(originalCopy);
    });

    it('should produce different results (statistical test)', () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = Array(100).fill(null).map(() => 
        shuffleArray(original).join(',')
      );
      
      // Should have multiple unique arrangements
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBeGreaterThan(10);
    });
  });
});