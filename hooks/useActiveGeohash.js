import { useMemo } from 'react';
import { useSettings } from '../contexts/SettingsContext.jsx';
import { useMap } from '../contexts/MapContext.jsx';
import { getOptimalPrecision } from '../utils/geohashUtils.js';
import { encodeGeohash } from '../geohash.js';

/**
 * Hook that returns the currently active geohash based on the selected tab
 * This ensures that the zone display and tab content show the same geohash
 */
export const useActiveGeohash = () => {
  const { activeTab, fixedZonePrecision } = useSettings();
  const { liveGeohash, mapContext, isMapLoaded } = useMap();

  const activeGeohash = useMemo(() => {
    if (!isMapLoaded || !liveGeohash) {
      return {
        geohash: '',
        precision: 0,
        tab: activeTab
      };
    }

    if (activeTab === 'optimal') {
      const optimalPrecision = getOptimalPrecision(mapContext.zoom);
      const geohash = liveGeohash.geohashes[optimalPrecision] || '';
      
      return {
        geohash,
        precision: optimalPrecision,
        tab: 'optimal'
      };
    } else if (activeTab === 'fixed') {
      // Calculate fixed geohash using the same logic as FixedTab
      const fixedGeohash = encodeGeohash(
        liveGeohash.center.lat, 
        liveGeohash.center.lng, 
        fixedZonePrecision
      );
      
      return {
        geohash: fixedGeohash,
        precision: fixedZonePrecision,
        tab: 'fixed'
      };
    }

    return {
      geohash: '',
      precision: 0,
      tab: activeTab
    };
  }, [activeTab, fixedZonePrecision, liveGeohash, mapContext.zoom, isMapLoaded]);

  return activeGeohash;
};
