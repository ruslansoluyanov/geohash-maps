export const PRECISIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const PRECISION_LABELS = {
  1: '~5000 km',
  2: '~630 km',
  3: '~78 km',
  4: '~20 km',
  5: '~2.4 km',
  6: '~1.2 km',
  7: '~152 m',
  8: '~19 m',
  9: '~2.4 m'
};

export const APPROX_RANGE_KM = {
  1: 5000,
  2: 630,
  3: 78,
  4: 20,
  5: 2.4,
  6: 1.2,
  7: 0.152,
  8: 0.019,
  9: 0.0024
};

export const ZOOM_PRECISION_MAP = [
  { maxZoom: 3, precision: 1 },
  { maxZoom: 6, precision: 2 },
  { maxZoom: 9, precision: 3 },
  { maxZoom: 12, precision: 4 },
  { maxZoom: 15, precision: 5 },
  { maxZoom: 17, precision: 6 },
  { maxZoom: 19, precision: 7 },
  { maxZoom: 21, precision: 8 }
];

export const SCORE_WEIGHTS = {
  high: { precision: 0.9, proximity: 0.1 },
  medium: { precision: 0.5, proximity: 0.5 },
  low: { precision: 0.2, proximity: 0.8 }
};

// Animation and update delays (in milliseconds)
export const DELAYS = {
  ZONE_UPDATE: 20,
  GRID_UPDATE: 10,
  MAP_INIT: 500,
  OVERLAY_ANIMATION: 5000
};
