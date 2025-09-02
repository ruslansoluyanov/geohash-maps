import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapProvider, useMap } from '../../contexts/MapContext.jsx';

// Test component to access context
const TestComponent = () => {
  const { 
    isMapLoaded, 
    liveGeohash, 
    mapContext, 
    initializeMap, 
    updateMarker 
  } = useMap();

  return (
    <div>
      <div data-testid="map-loaded">{isMapLoaded ? 'true' : 'false'}</div>
      <div data-testid="live-geohash">{JSON.stringify(liveGeohash)}</div>
      <div data-testid="map-context">{JSON.stringify(mapContext)}</div>
      <button onClick={initializeMap} data-testid="init-map">
        Initialize Map
      </button>
      <button 
        onClick={() => updateMarker(40.7128, -74.0060, 'Test Location')} 
        data-testid="update-marker"
      >
        Update Marker
      </button>
    </div>
  );
};

describe('MapContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide default context values', () => {
    render(
      <MapProvider>
        <TestComponent />
      </MapProvider>
    );

    expect(screen.getByTestId('map-loaded')).toHaveTextContent('false');
    expect(screen.getByTestId('live-geohash')).toHaveTextContent('null');
  });

  it('should load map context from localStorage', () => {
    const savedContext = {
      zoom: 10,
      latitude: 40.7128,
      longitude: -74.0060,
      screenWidth: 1920,
      screenHeight: 1080
    };

    localStorage.setItem('mapContext', JSON.stringify(savedContext));

    render(
      <MapProvider>
        <TestComponent />
      </MapProvider>
    );

    const mapContext = JSON.parse(screen.getByTestId('map-context').textContent);
    expect(mapContext.zoom).toBe(10);
    expect(mapContext.latitude).toBe(40.7128);
    expect(mapContext.longitude).toBe(-74.0060);
  });

  it('should use default values when localStorage is invalid', () => {
    localStorage.setItem('mapContext', 'invalid-json');

    render(
      <MapProvider>
        <TestComponent />
      </MapProvider>
    );

    const mapContext = JSON.parse(screen.getByTestId('map-context').textContent);
    expect(mapContext.zoom).toBe(6);
    expect(mapContext.latitude).toBe(36.5625);
    expect(mapContext.longitude).toBe(-118.125);
  });

  it('should initialize map when button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MapProvider>
        <TestComponent />
      </MapProvider>
    );

    const initButton = screen.getByTestId('init-map');
    await user.click(initButton);

    // Map should be loaded (mocked)
    await waitFor(() => {
      expect(screen.getByTestId('map-loaded')).toHaveTextContent('true');
    });
  });

  it('should update marker and live geohash', async () => {
    const user = userEvent.setup();

    render(
      <MapProvider>
        <TestComponent />
      </MapProvider>
    );

    const updateButton = screen.getByTestId('update-marker');
    await user.click(updateButton);

    await waitFor(() => {
      const liveGeohashText = screen.getByTestId('live-geohash').textContent;
      expect(liveGeohashText).not.toBe('null');
      
      const liveGeohash = JSON.parse(liveGeohashText);
      expect(liveGeohash.center.lat).toBe(40.7128);
      expect(liveGeohash.center.lng).toBe(-74.0060);
    });
  });

  it('should save map context to localStorage when updated', async () => {
    const user = userEvent.setup();

    render(
      <MapProvider>
        <TestComponent />
      </MapProvider>
    );

    const updateButton = screen.getByTestId('update-marker');
    await user.click(updateButton);

    await waitFor(() => {
      const savedContext = localStorage.getItem('mapContext');
      expect(savedContext).toBeTruthy();
      
      const parsed = JSON.parse(savedContext);
      expect(parsed.latitude).toBe(40.7128);
      expect(parsed.longitude).toBe(-74.0060);
    });
  });

  it('should handle localStorage save errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Mock localStorage.setItem to throw error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error('Storage quota exceeded');
    });

    render(
      <MapProvider>
        <TestComponent />
      </MapProvider>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to save map context to localStorage:',
      expect.any(Error)
    );

    // Restore
    localStorage.setItem = originalSetItem;
    consoleSpy.mockRestore();
  });

  it('should throw error when useMap is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useMap must be used within a MapProvider');

    consoleSpy.mockRestore();
  });
});
