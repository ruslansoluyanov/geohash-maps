import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useActiveGeohash } from '../../hooks/useActiveGeohash.js';
import { useSettings } from '../../contexts/SettingsContext.jsx';
import { useMap } from '../../contexts/MapContext.jsx';

// Mock the contexts
vi.mock('../../contexts/SettingsContext.jsx');
vi.mock('../../contexts/MapContext.jsx');
vi.mock('../../utils/geohashUtils.js');
vi.mock('../../geohash.js');

describe('useActiveGeohash', () => {
  const mockUseSettings = vi.mocked(useSettings);
  const mockUseMap = vi.mocked(useMap);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty geohash when map is not loaded', () => {
    mockUseSettings.mockReturnValue({
      activeTab: 'optimal',
      fixedZonePrecision: 6
    });
    
    mockUseMap.mockReturnValue({
      isMapLoaded: false,
      liveGeohash: null,
      mapContext: { zoom: 10 }
    });

    const { result } = renderHook(() => useActiveGeohash());

    expect(result.current).toEqual({
      geohash: '',
      precision: 0,
      tab: 'optimal'
    });
  });

  it('should return optimal geohash when optimal tab is active', () => {
    mockUseSettings.mockReturnValue({
      activeTab: 'optimal',
      fixedZonePrecision: 6
    });
    
    mockUseMap.mockReturnValue({
      isMapLoaded: true,
      liveGeohash: {
        geohashes: {
          5: 'dr5ru'
        },
        center: { lat: 40.7128, lng: -74.0060 }
      },
      mapContext: { zoom: 10 }
    });

    // Mock getOptimalPrecision to return 5
    vi.doMock('../../utils/geohashUtils.js', () => ({
      getOptimalPrecision: () => 5
    }));

    const { result } = renderHook(() => useActiveGeohash());

    expect(result.current.tab).toBe('optimal');
    expect(result.current.precision).toBe(5);
    expect(result.current.geohash).toBe('dr5ru');
  });

  it('should return fixed geohash when fixed tab is active', () => {
    mockUseSettings.mockReturnValue({
      activeTab: 'fixed',
      fixedZonePrecision: 6
    });
    
    mockUseMap.mockReturnValue({
      isMapLoaded: true,
      liveGeohash: {
        geohashes: {
          5: 'dr5ru'
        },
        center: { lat: 40.7128, lng: -74.0060 }
      },
      mapContext: { zoom: 10 }
    });

    // Mock encodeGeohash
    vi.doMock('../../geohash.js', () => ({
      encodeGeohash: (lat, lng, precision) => `fixed-${precision}`
    }));

    const { result } = renderHook(() => useActiveGeohash());

    expect(result.current.tab).toBe('fixed');
    expect(result.current.precision).toBe(6);
    expect(result.current.geohash).toBe('fixed-6');
  });
});
