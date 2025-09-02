import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getOptimalPrecision, copyToClipboard, formatPrecisionLabel, formatDistance } from '../utils/geohashUtils.js';

describe('Geohash Utils', () => {
  describe('getOptimalPrecision', () => {
    it('should return correct precision for different zoom levels', () => {
      expect(getOptimalPrecision(1)).toBe(1);
      expect(getOptimalPrecision(5)).toBe(2);
      expect(getOptimalPrecision(8)).toBe(3);
      expect(getOptimalPrecision(11)).toBe(4);
      expect(getOptimalPrecision(14)).toBe(5);
      expect(getOptimalPrecision(16)).toBe(6);
      expect(getOptimalPrecision(18)).toBe(7);
      expect(getOptimalPrecision(20)).toBe(8);
      expect(getOptimalPrecision(25)).toBe(9); // Max precision
    });

    it('should handle edge cases', () => {
      expect(getOptimalPrecision(0)).toBe(1);
      expect(getOptimalPrecision(-1)).toBe(1);
      expect(getOptimalPrecision(100)).toBe(9);
    });
  });

  describe('formatPrecisionLabel', () => {
    it('should format precision labels correctly', () => {
      expect(formatPrecisionLabel(1)).toBe('1 character');
      expect(formatPrecisionLabel(2)).toBe('2 characters');
      expect(formatPrecisionLabel(5)).toBe('5 characters');
      expect(formatPrecisionLabel(9)).toBe('9 characters');
    });
  });

  describe('formatDistance', () => {
    it('should format distances correctly', () => {
      expect(formatDistance(1)).toBe('~5000km');
      expect(formatDistance(2)).toBe('~630km');
      expect(formatDistance(5)).toBe('~2.4km');
      expect(formatDistance(7)).toBe('~152m');
      expect(formatDistance(9)).toBe('~2.4m');
    });

    it('should handle unknown precision', () => {
      expect(formatDistance(15)).toBe('~unknown');
    });
  });

  describe('copyToClipboard', () => {
    let mockButton;

    beforeEach(() => {
      mockButton = {
        innerHTML: '<span>Copy</span>',
      };
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should copy text to clipboard successfully', async () => {
      const text = 'test-geohash';
      
      const result = await copyToClipboard(text);
      
      expect(result).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
    });

    it('should update button content when successful', async () => {
      const text = 'test-geohash';
      const originalContent = mockButton.innerHTML;
      
      const promise = copyToClipboard(text, mockButton);
      
      await promise;
      
      expect(mockButton.innerHTML).toContain('Copied');
      
      // Fast-forward timer
      vi.advanceTimersByTime(2000);
      
      expect(mockButton.innerHTML).toBe(originalContent);
    });

    it('should handle clipboard API errors', async () => {
      navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'));
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = await copyToClipboard('test');
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy to clipboard:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should work without button element', async () => {
      const result = await copyToClipboard('test-text');
      
      expect(result).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test-text');
    });
  });
});
