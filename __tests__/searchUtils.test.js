import { describe, it, expect, beforeEach, vi } from 'vitest';
import { searchAddress } from '../searchUtils.js';

// Mock fetch
global.fetch = vi.fn();

describe('Search Utils', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('searchAddress', () => {
    it('should throw error for empty address', async () => {
      await expect(searchAddress('')).rejects.toThrow('Please enter an address');
      await expect(searchAddress('   ')).rejects.toThrow('Please enter an address');
    });

    it('should search using geocode.maps.co successfully', async () => {
      const mockResponse = [{
        lat: '40.7128',
        lon: '-74.0060',
        display_name: 'New York, NY, USA'
      }];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await searchAddress('New York');

      expect(result).toEqual({
        lat: 40.7128,
        lng: -74.0060,
        name: 'New York, NY, USA',
        source: 'geocode.maps.co'
      });
    });

    it('should fallback to photon.komoot.io when geocode fails', async () => {
      // First API fails
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      // Second API succeeds
      const mockPhotonResponse = {
        features: [{
          geometry: {
            coordinates: [-74.0060, 40.7128]
          },
          properties: {
            name: 'New York'
          }
        }]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPhotonResponse)
      });

      const result = await searchAddress('New York');

      expect(result).toEqual({
        lat: 40.7128,
        lng: -74.0060,
        name: 'New York',
        source: 'photon.komoot.io'
      });
    });

    it('should use local database when APIs fail', async () => {
      // Both APIs fail
      fetch.mockResolvedValue({
        ok: false,
      });

      const result = await searchAddress('moscow');

      expect(result).toEqual({
        lat: 55.7558,
        lng: 37.6176,
        name: 'Moscow, Russia',
        source: 'local database'
      });
    });

    it('should find partial matches in local database', async () => {
      // APIs fail
      fetch.mockResolvedValue({
        ok: false,
      });

      const result = await searchAddress('red');

      expect(result.name).toContain('Red Square');
      expect(result.source).toBe('local database');
    });

    it('should handle network errors gracefully', async () => {
      // Both APIs throw network errors
      fetch.mockRejectedValue(new Error('Network error'));

      const result = await searchAddress('london');

      expect(result).toEqual({
        lat: 51.5074,
        lng: -0.1278,
        name: 'London, UK',
        source: 'local database'
      });
    });

    it('should throw error when no results found', async () => {
      // APIs fail
      fetch.mockResolvedValue({
        ok: false,
      });

      await expect(searchAddress('nonexistent-place-xyz'))
        .rejects.toThrow('Address not found. Try a city name or landmark');
    });

    it('should handle empty API responses', async () => {
      // First API returns empty array
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });

      // Second API returns empty features
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ features: [] })
      });

      const result = await searchAddress('paris');

      expect(result).toEqual({
        lat: 48.8566,
        lng: 2.3522,
        name: 'Paris, France',
        source: 'local database'
      });
    });

    it('should trim whitespace from search query', async () => {
      const mockResponse = [{
        lat: '40.7128',
        lon: '-74.0060',
        display_name: 'New York, NY, USA'
      }];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await searchAddress('  New York  ');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('New York'))
      );
    });
  });
});
