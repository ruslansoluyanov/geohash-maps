import React from 'react';
import { render } from '@testing-library/react';
import { MapProvider } from '../../../contexts/MapContext.jsx';
import { SettingsProvider } from '../../../contexts/SettingsContext.jsx';
import { GeocodingProvider } from '../../../contexts/GeocodingContext.jsx';

// Custom render function with all providers
export const renderWithProviders = (ui, options = {}) => {
  const AllProviders = ({ children }) => {
    return (
      <MapProvider>
        <SettingsProvider>
          <GeocodingProvider>
            {children}
          </GeocodingProvider>
        </SettingsProvider>
      </MapProvider>
    );
  };

  return render(ui, { wrapper: AllProviders, ...options });
};

// Mock data generators
export const createMockGeohash = () => ({
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
});

export const createMockSearchResult = () => ({
  address: 'Test Address, Test City',
  coordinates: {
    latitude: 40.7128,
    longitude: -74.0060,
  },
  geohash: '9q500',
  source: 'test',
});

// Wait for async operations
export const waitFor = (callback, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkCondition = () => {
      try {
        const result = callback();
        if (result) {
          resolve(result);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for condition'));
        } else {
          setTimeout(checkCondition, 10);
        }
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
        } else {
          setTimeout(checkCondition, 10);
        }
      }
    };
    
    checkCondition();
  });
};
