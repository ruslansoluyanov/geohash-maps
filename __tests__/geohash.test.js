import { describe, it, expect, beforeEach } from 'vitest';
import { encodeGeohash, decodeGeohash, updateLiveGeohash } from '../geohash.js';

describe('Geohash Functions', () => {
  describe('encodeGeohash', () => {
    it('should encode coordinates to geohash correctly', () => {
      // Test known coordinates
      const lat = 42.6;
      const lng = -5.6;
      const precision = 5;
      
      const result = encodeGeohash(lat, lng, precision);
      
      expect(result).toBe('ezs42');
      expect(result.length).toBe(precision);
    });

    it('should handle different precisions', () => {
      const lat = 36.5625;
      const lng = -118.125;
      
      const result1 = encodeGeohash(lat, lng, 1);
      const result3 = encodeGeohash(lat, lng, 3);
      const result6 = encodeGeohash(lat, lng, 6);
      
      expect(result1.length).toBe(1);
      expect(result3.length).toBe(3);
      expect(result6.length).toBe(6);
      expect(result6.startsWith(result3)).toBe(true);
      expect(result3.startsWith(result1)).toBe(true);
    });

    it('should handle edge cases', () => {
      // Test extremes
      expect(() => encodeGeohash(90, 180, 5)).not.toThrow();
      expect(() => encodeGeohash(-90, -180, 5)).not.toThrow();
      expect(() => encodeGeohash(0, 0, 5)).not.toThrow();
    });
  });

  describe('decodeGeohash', () => {
    it('should decode geohash to coordinates correctly', () => {
      const geohash = 'ezs42';
      const result = decodeGeohash(geohash);
      
      expect(result.lat[0]).toBeCloseTo(42.6, 1);
      expect(result.lng[0]).toBeCloseTo(-5.6, 1);
      expect(result.bounds).toBeDefined();
      expect(result.bounds.length).toBe(2);
    });

    it('should decode single character geohash', () => {
      const geohash = '9';
      const result = decodeGeohash(geohash);
      
      expect(result.lat[0]).toBeDefined();
      expect(result.lng[0]).toBeDefined();
      expect(result.bounds).toBeDefined();
    });

    it('should handle precision correctly', () => {
      const geohash3 = 'ezs';
      const geohash6 = 'ezs424';
      
      const result3 = decodeGeohash(geohash3);
      const result6 = decodeGeohash(geohash6);
      
      // Higher precision should have smaller bounds
      const range3_lat = result3.lat[1][1] - result3.lat[1][0];
      const range6_lat = result6.lat[1][1] - result6.lat[1][0];
      
      expect(range6_lat).toBeLessThan(range3_lat);
    });
  });

  describe('updateLiveGeohash', () => {
    it('should generate geohashes for all precisions', () => {
      const lat = 36.5625;
      const lng = -118.125;
      
      const result = updateLiveGeohash(lat, lng);
      
      expect(result.center.lat).toBe(lat);
      expect(result.center.lng).toBe(lng);
      expect(result.geohashes).toBeDefined();
      expect(result.precision).toBeDefined();
      
      // Check all precisions 1-9
      for (let i = 1; i <= 9; i++) {
        expect(result.geohashes[i]).toBeDefined();
        expect(result.geohashes[i].length).toBe(i);
        expect(result.precision[i]).toBeDefined();
      }
    });

    it('should maintain hierarchy in geohashes', () => {
      const lat = 42.6;
      const lng = -5.6;
      
      const result = updateLiveGeohash(lat, lng);
      
      // Each precision should start with the previous one
      for (let i = 2; i <= 9; i++) {
        expect(result.geohashes[i].startsWith(result.geohashes[i-1])).toBe(true);
      }
    });
  });

  describe('Round-trip encoding/decoding', () => {
    it('should maintain accuracy through encode/decode cycle', () => {
      const originalLat = 42.6;
      const originalLng = -5.6;
      const precision = 7;
      
      const encoded = encodeGeohash(originalLat, originalLng, precision);
      const decoded = decodeGeohash(encoded);
      
      // Should be within reasonable tolerance for the precision
      expect(decoded.lat[0]).toBeCloseTo(originalLat, 2);
      expect(decoded.lng[0]).toBeCloseTo(originalLng, 2);
    });
  });
});
