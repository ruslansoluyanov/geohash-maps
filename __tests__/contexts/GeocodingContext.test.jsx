import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { GeocodingProvider, useGeocoding } from '../../contexts/GeocodingContext.jsx';

// Mock searchAddress
vi.mock('../../searchUtils.js', () => ({
  searchAddress: vi.fn(),
}));

import { searchAddress } from '../../searchUtils.js';

// Test component to access context
const TestComponent = () => {
  const { 
    address, 
    isLoading, 
    result, 
    error, 
    setAddress, 
    clearError, 
    performSearch 
  } = useGeocoding();

  return (
    <div>
      <div data-testid="address">{address}</div>
      <div data-testid="is-loading">{isLoading ? 'true' : 'false'}</div>
      <div data-testid="result">{JSON.stringify(result)}</div>
      <div data-testid="error">{error}</div>
      
      <input 
        data-testid="address-input"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={clearError} data-testid="clear-error">
        Clear Error
      </button>
      <button onClick={() => performSearch()} data-testid="search">
        Search
      </button>
    </div>
  );
};

describe('GeocodingContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchAddress.mockClear();
  });

  it('should provide default context values', () => {
    render(
      <GeocodingProvider>
        <TestComponent />
      </GeocodingProvider>
    );

    expect(screen.getByTestId('address')).toHaveTextContent('');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('result')).toHaveTextContent('null');
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('should update address', async () => {
    render(
      <GeocodingProvider>
        <TestComponent />
      </GeocodingProvider>
    );

    const input = screen.getByTestId('address-input');
    fireEvent.change(input, { target: { value: 'New York' } });

    expect(screen.getByTestId('address')).toHaveTextContent('New York');
  });

  it('should clear error', async () => {
    render(
      <GeocodingProvider>
        <TestComponent />
      </GeocodingProvider>
    );

    // Trigger an error first
    const searchButton = screen.getByTestId('search');
    fireEvent.click(searchButton);

    expect(screen.getByTestId('error')).toHaveTextContent('Please enter an address');

    // Clear the error
    const clearButton = screen.getByTestId('clear-error');
    fireEvent.click(clearButton);

    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('should show error for empty address search', async () => {
    render(
      <GeocodingProvider>
        <TestComponent />
      </GeocodingProvider>
    );

    const searchButton = screen.getByTestId('search');
    fireEvent.click(searchButton);

    expect(screen.getByTestId('error')).toHaveTextContent('Please enter an address');
  });

  it('should perform successful search', async () => {
    const mockResult = {
      lat: 40.7128,
      lng: -74.0060,
      name: 'New York, NY, USA',
      source: 'test'
    };

    searchAddress.mockResolvedValueOnce(mockResult);

    render(
      <GeocodingProvider>
        <TestComponent />
      </GeocodingProvider>
    );

    // Set address
    const input = screen.getByTestId('address-input');
    fireEvent.change(input, { target: { value: 'New York' } });

    // Perform search
    const searchButton = screen.getByTestId('search');
    fireEvent.click(searchButton);

    // Check loading state
    expect(screen.getByTestId('is-loading')).toHaveTextContent('true');

    // Wait for result
    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });

    const resultText = screen.getByTestId('result').textContent;
    const result = JSON.parse(resultText);

    expect(result.address).toBe('New York, NY, USA');
    expect(result.coordinates.latitude).toBe(40.7128);
    expect(result.coordinates.longitude).toBe(-74.0060);
    expect(result.geohash).toBeDefined();
    expect(result.source).toBe('test');
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('should handle search errors', async () => {
    const errorMessage = 'Address not found';

    searchAddress.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <GeocodingProvider>
        <TestComponent />
      </GeocodingProvider>
    );

    // Set address
    const input = screen.getByTestId('address-input');
    fireEvent.change(input, { target: { value: 'Invalid Address' } });

    // Perform search
    const searchButton = screen.getByTestId('search');
    fireEvent.click(searchButton);

    // Wait for error
    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
    expect(screen.getByTestId('result')).toHaveTextContent('null');
  });

  it('should call updateMarker when provided', async () => {
    const mockUpdateMarker = vi.fn();
    const mockResult = {
      lat: 40.7128,
      lng: -74.0060,
      name: 'New York, NY, USA',
      source: 'test'
    };

    searchAddress.mockResolvedValueOnce(mockResult);

    const TestComponentWithMarker = () => {
      const { performSearch, setAddress } = useGeocoding();
      
      return (
        <div>
          <input 
            data-testid="address-input"
            onChange={(e) => setAddress(e.target.value)}
          />
          <button 
            onClick={() => performSearch(mockUpdateMarker)} 
            data-testid="search"
          >
            Search
          </button>
        </div>
      );
    };

    render(
      <GeocodingProvider>
        <TestComponentWithMarker />
      </GeocodingProvider>
    );

    // Set address and search
    const input = screen.getByTestId('address-input');
    fireEvent.change(input, { target: { value: 'New York' } });

    const searchButton = screen.getByTestId('search');
    fireEvent.click(searchButton);

    // Wait for completion
    await waitFor(() => {
      expect(mockUpdateMarker).toHaveBeenCalledWith(
        40.7128,
        -74.0060,
        'New York, NY, USA'
      );
    });
  });

  it('should throw error when useGeocoding is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useGeocoding must be used within a GeocodingProvider');

    consoleSpy.mockRestore();
  });
});
