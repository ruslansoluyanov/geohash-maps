import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import OptimalTab from '../../components/OptimalTab.jsx';

// Mock contexts
vi.mock('../../contexts/MapContext.jsx', () => ({
  useMap: vi.fn(),
}));

// Mock utils
vi.mock('../../utils/geohashUtils.js', () => ({
  getOptimalPrecision: vi.fn((zoom) => Math.min(Math.max(Math.floor(zoom / 3), 1), 9)),
  copyToClipboard: vi.fn(() => Promise.resolve(true)),
  formatPrecisionLabel: vi.fn((precision) => `${precision} character${precision === 1 ? '' : 's'}`),
}));

import { useMap } from '../../contexts/MapContext.jsx';
import { copyToClipboard } from '../../utils/geohashUtils.js';

describe('OptimalTab', () => {
  const mockLiveGeohash = {
    center: { lat: 36.5625, lng: -118.125 },
    geohashes: {
      1: '9',
      2: '9q',
      3: '9q5',
      4: '9q50',
      5: '9q500',
      6: '9q5000',
      7: '9q50000',
      8: '9q500000',
      9: '9q5000000',
    },
    precision: {
      1: '~5000 km',
      2: '~630 km',
      3: '~78 km',
      4: '~20 km',
      5: '~2.4 km',
      6: '~1.2 km',
      7: '~152 m',
      8: '~19 m',
      9: '~2.4 m',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock for useMap
    useMap.mockReturnValue({
      liveGeohash: mockLiveGeohash,
      mapContext: { zoom: 6 },
    });
  });

  it('should show loading state when no geohash data', () => {
    useMap.mockReturnValue({
      liveGeohash: null,
      mapContext: { zoom: 6 },
    });

    render(<OptimalTab />);

    expect(screen.getByText('Loading geohash data...')).toBeInTheDocument();
  });

  it('should display geohash data correctly', () => {
    render(<OptimalTab />);

    expect(screen.getByText('9q')).toBeInTheDocument();
    expect(screen.getByText('Current Hash')).toBeInTheDocument();
  });

  it('should call copyToClipboard when copy button is clicked', () => {
    render(<OptimalTab />);

    const copyButton = screen.getByTitle('Copy to clipboard');
    copyButton.click();

    expect(copyToClipboard).toHaveBeenCalled();
  });

  it('should have proper styling classes', () => {
    render(<OptimalTab />);

    const tabElement = screen.getByText('9q').closest('div');
    expect(tabElement).toHaveClass('font-mono');
  });
});
