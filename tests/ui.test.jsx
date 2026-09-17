import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Btn, Badge, ProgressBar } from '../src/components/ui';

describe('UI Components', () => {
  describe('Btn component', () => {
    it('renders with children', () => {
      render(<Btn>Click Me</Btn>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Btn onClick={handleClick}>Click Me</Btn>);
      fireEvent.click(screen.getByRole('button', { name: /click me/i }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
      const handleClick = vi.fn();
      render(<Btn disabled onClick={handleClick}>Click Me</Btn>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Badge component', () => {
    it('renders label', () => {
      render(<Badge label="Active" />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  describe('ProgressBar component', () => {
    it('renders with correct width based on value', () => {
      const { container } = render(<ProgressBar value={50} max={100} />);
      // We look for the inner div which represents the progress
      const progressDiv = container.firstChild.firstChild;
      expect(progressDiv.style.width).toBe('50%');
    });
  });
});
