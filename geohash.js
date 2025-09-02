// geohash.js - Business logic for geohash encoding/decoding
import { PRECISIONS, PRECISION_LABELS } from './constants.js';

export const decodeGeohash = (geohash) => {
  const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';
  let latRange = [-90, 90];
  let lngRange = [-180, 180];
  let even = true;

  for (let i = 0; i < geohash.length; i++) {
    const char = geohash[i];
    const idx = base32.indexOf(char);

    for (let bit = 4; bit >= 0; bit--) {
      const bitValue = (idx >> bit) & 1;

      if (even) {
        const mid = (lngRange[0] + lngRange[1]) / 2;
        if (bitValue === 1) {
          lngRange[0] = mid;
        } else {
          lngRange[1] = mid;
        }
      } else {
        const mid = (latRange[0] + latRange[1]) / 2;
        if (bitValue === 1) {
          latRange[0] = mid;
        } else {
          latRange[1] = mid;
        }
      }
      even = !even;
    }
  }

  return {
    lat: [(latRange[0] + latRange[1]) / 2, latRange],
    lng: [(lngRange[0] + lngRange[1]) / 2, lngRange],
    bounds: [
      [latRange[0], lngRange[0]],
      [latRange[1], lngRange[1]]
    ]
  };
};

export const encodeGeohash = (lat, lng, precision = 6) => {
  const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';
  let latRange = [-90, 90];
  let lngRange = [-180, 180];
  let geohash = '';
  let bits = 0;
  let bit = 0;
  let even = true;

  while (geohash.length < precision) {
    if (even) {
      const mid = (lngRange[0] + lngRange[1]) / 2;
      if (lng >= mid) {
        bit = (bit << 1) + 1;
        lngRange[0] = mid;
      } else {
        bit = bit << 1;
        lngRange[1] = mid;
      }
    } else {
      const mid = (latRange[0] + latRange[1]) / 2;
      if (lat >= mid) {
        bit = (bit << 1) + 1;
        latRange[0] = mid;
      } else {
        bit = bit << 1;
        latRange[1] = mid;
      }
    }

    even = !even;
    bits++;

    if (bits === 5) {
      geohash += base32[bit];
      bits = 0;
      bit = 0;
    }
  }

  return geohash;
};

export const updateLiveGeohash = (lat, lng) => {
  const allGeohashes = {};

  PRECISIONS.forEach(precision => {
    allGeohashes[precision] = encodeGeohash(lat, lng, precision);
  });

  return {
    center: { lat, lng },
    geohashes: allGeohashes,
    precision: PRECISION_LABELS
  };
};


