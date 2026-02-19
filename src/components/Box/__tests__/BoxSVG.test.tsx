import { render, screen } from '@testing-library/react';
import BoxSVG from '../BoxSVG';

describe('BoxSVG', () => {
  describe('closed box', () => {
    it('should render closed box with correct number', () => {
      render(
        <BoxSVG 
          isOpen={false} 
          boxNumber={5} 
        />
      );

      const box = screen.getByRole('img');
      expect(box).toHaveAttribute('aria-label', 'Box 5');
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should render player box with special styling', () => {
      render(
        <BoxSVG 
          isOpen={false} 
          boxNumber={10} 
          isPlayerBox={true}
        />
      );

      const box = screen.getByRole('img');
      expect(box).toHaveAttribute('aria-label', 'Your Box 10 (your selected box)');
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('YOUR BOX')).toBeInTheDocument();
    });

    it('should apply hover effects', () => {
      render(
        <BoxSVG 
          isOpen={false} 
          boxNumber={3} 
          isHovered={true}
        />
      );

      const box = screen.getByRole('img');
      expect(box).toBeInTheDocument();
    });

    it('should apply custom size', () => {
      render(
        <BoxSVG 
          isOpen={false} 
          boxNumber={1} 
          size={100}
        />
      );

      const box = screen.getByRole('img');
      expect(box).toHaveAttribute('width', '100');
      expect(box).toHaveAttribute('height', '100');
    });
  });

  describe('open box', () => {
    it('should render open box with money value', () => {
      render(
        <BoxSVG 
          isOpen={true} 
          boxNumber={7} 
          value={50000}
        />
      );

      const box = screen.getByRole('img');
      expect(box).toHaveAttribute('aria-label', 'Opened box 7 containing $50K');
      expect(screen.getByText('$50K')).toBeInTheDocument();
      expect(screen.getByText('#7')).toBeInTheDocument();
    });

    it('should format different money values correctly', () => {
      const testCases = [
        { value: 0.01, expected: '1¢' },
        { value: 0.25, expected: '25¢' },
        { value: 100, expected: '$100' },
        { value: 1000, expected: '$1K' },
        { value: 25000, expected: '$25K' },
        { value: 1000000, expected: '$1M' },
        { value: 2500000, expected: '$2.5M' }
      ];

      testCases.forEach(({ value, expected }, index) => {
        const { unmount } = render(
          <BoxSVG 
            isOpen={true} 
            boxNumber={index + 1} 
            value={value}
          />
        );

        expect(screen.getByText(expected)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels for closed boxes', () => {
      render(
        <BoxSVG 
          isOpen={false} 
          boxNumber={15} 
        />
      );

      const box = screen.getByRole('img');
      expect(box).toHaveAttribute('aria-label', 'Box 15');
    });

    it('should have proper ARIA labels for open boxes', () => {
      render(
        <BoxSVG 
          isOpen={true} 
          boxNumber={20} 
          value={75000}
        />
      );

      const box = screen.getByRole('img');
      expect(box).toHaveAttribute('aria-label', 'Opened box 20 containing $75K');
    });

    it('should have proper ARIA labels for player boxes', () => {
      render(
        <BoxSVG 
          isOpen={false} 
          boxNumber={8} 
          isPlayerBox={true}
        />
      );

      const box = screen.getByRole('img');
      expect(box).toHaveAttribute('aria-label', 'Your Box 8 (your selected box)');
    });
  });

  describe('component rendering', () => {
    it('should render with proper structure for closed box', () => {
      render(
        <BoxSVG 
          isOpen={false} 
          boxNumber={1} 
          className="custom-class"
        />
      );

      const box = screen.getByRole('img');
      expect(box).toBeInTheDocument();
      expect(box).toHaveAttribute('width', '120');
      expect(box).toHaveAttribute('height', '120');
    });

    it('should render with proper structure for open box', () => {
      render(
        <BoxSVG 
          isOpen={true} 
          boxNumber={1} 
          value={100}
        />
      );

      const box = screen.getByRole('img');
      expect(box).toBeInTheDocument();
      expect(box).toHaveAttribute('viewBox', '0 0 120 120');
    });

    it('should apply custom className', () => {
      render(
        <BoxSVG 
          isOpen={false} 
          boxNumber={1} 
          className="custom-test-class"
        />
      );

      const box = screen.getByRole('img');
      expect(box).toHaveClass('custom-test-class');
    });

    it('should render different states properly', () => {
      const { rerender } = render(
        <BoxSVG 
          isOpen={false} 
          boxNumber={1} 
          isPlayerBox={false}
        />
      );

      let box = screen.getByRole('img');
      expect(box).toBeInTheDocument();

      // Test player box
      rerender(
        <BoxSVG 
          isOpen={false} 
          boxNumber={1} 
          isPlayerBox={true}
        />
      );

      box = screen.getByRole('img');
      expect(box).toBeInTheDocument();
      
      // Test disabled state
      rerender(
        <BoxSVG 
          isOpen={false} 
          boxNumber={1} 
          isDisabled={true}
        />
      );

      box = screen.getByRole('img');
      expect(box).toBeInTheDocument();
    });
  });
});