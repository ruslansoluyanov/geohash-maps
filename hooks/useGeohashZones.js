import { useEffect, useCallback, useRef } from 'react';
import { useMap } from '../contexts/MapContext.jsx';
import { useSettings } from '../contexts/SettingsContext.jsx';
import { showArea, hideArea, showGeohashGrid, updateGeohashGrid } from '../mapUtils.js';
import { encodeGeohash } from '../geohash.js';
import { getOptimalPrecision } from '../utils/geohashUtils.js';
import { useActiveGeohash } from './useActiveGeohash.js';

export const useGeohashZones = () => {
  const { mapContext, liveGeohash, isMapLoaded } = useMap();
  const { showGrid, showZone } = useSettings();
  const activeGeohash = useActiveGeohash();
  
  // Refs to store previous zone geohashes to prevent unnecessary re-renders
  const prevZoneGeohashRef = useRef({
    optimal: null,
    fixed: null
  });
  
  // Ref to track previous active tab for force updates on tab switch
  const prevActiveTabRef = useRef(activeGeohash.tab);
  
  // Ref to track previous showZone state
  const prevShowZoneRef = useRef(showZone);

  // Update grid display
  const updateGrid = useCallback(() => {
    if (!showGrid || !window.currentMap) {
      hideArea('grid');
      return;
    }
    showGeohashGrid(getOptimalPrecision(mapContext.zoom));
  }, [showGrid, mapContext.zoom]);

  // Update zone display with selected precision
  const updateZone = useCallback((currentZoom = null) => {
    if (!showZone || !window.currentMap || !window.L || !isMapLoaded) {
      if (!showZone) {
        hideArea('preview');
      }
      return;
    }

    // Use the active geohash from the centralized hook
    const zoneGeohash = activeGeohash.geohash;
    const zonePrecision = activeGeohash.precision;
    const currentTab = activeGeohash.tab;

    if (!zoneGeohash) {
      return;
    }

    // Check if zone geohash has changed to prevent unnecessary re-renders
    // Also force update if the tab has changed or showZone was just turned on
    const prevZoneGeohash = prevZoneGeohashRef.current[currentTab];
    const prevActiveTab = prevActiveTabRef.current;
    const prevShowZone = prevShowZoneRef.current;
    const tabChanged = currentTab !== prevActiveTab;
    const showZoneJustTurnedOn = !prevShowZone && showZone;
    
    // Always update when showZone just turned on (force update)
    const shouldForceUpdate = tabChanged || showZoneJustTurnedOn;
    
    if (zoneGeohash === prevZoneGeohash && !shouldForceUpdate) {
      return;
    }

    // Update the refs with new values
    prevZoneGeohashRef.current[currentTab] = zoneGeohash;
    prevActiveTabRef.current = currentTab;
    // Note: prevShowZoneRef is updated separately in useEffect

    // Calculate visibility intensity based on precision difference
    let intensity;
    if (currentTab === 'optimal') {
      intensity = 0.6; // Moderate intensity for optimal
    } else {
      const zoom = window.currentMap.getZoom() || mapContext.zoom;
      const optimalPrecision = getOptimalPrecision(zoom);
      const precisionDiff = Math.abs(zonePrecision - optimalPrecision);
      const maxDiff = Math.max(4 - optimalPrecision, optimalPrecision - 1);
      
      intensity = Math.min(1, precisionDiff / maxDiff);
      if (precisionDiff > 2) {
        intensity = Math.min(1, intensity + 0.2);
      }
    }

    // Adjust opacity and weight based on intensity
    const baseOpacity = 0.4;
    const baseWeight = 3;
    const opacity = baseOpacity + (intensity * 0.8);
    const weight = Math.round(baseWeight + (intensity * 20));

    // Small delay to avoid conflicts with other updates
    setTimeout(() => {
      if (window.currentMap && showZone) {
        showArea(zoneGeohash, {
          type: 'zone',
          opacity,
          weight,
          color: '#FF4500'
        });
      }
    }, 20);
  }, [showZone, activeGeohash, mapContext.zoom, liveGeohash, isMapLoaded]);

  // Update grid when zoom or showGrid changes
  useEffect(() => {
    updateGrid();
  }, [updateGrid]);

  // Update zone when relevant properties change
  useEffect(() => {
    if (isMapLoaded) {
      updateZone();
    }
  }, [updateZone, showZone, activeGeohash, mapContext.zoom, isMapLoaded]);

  // Force zone update when active tab changes
  useEffect(() => {
    if (showZone && isMapLoaded && activeGeohash.tab) {
      // Small delay to ensure the tab switch has completed
      setTimeout(() => {
        updateZone();
      }, 10);
    }
  }, [activeGeohash.tab, showZone, isMapLoaded, updateZone]);

  // Force zone update when showZone changes specifically
  useEffect(() => {
    if (isMapLoaded) {
      if (showZone) {
        // When turning on, force an immediate update
        setTimeout(() => {
          updateZone();
        }, 10);
      } else {
        // When turning off, ensure area is hidden
        hideArea('preview');
      }
    }
    
    // Update the ref AFTER processing the change
    prevShowZoneRef.current = showZone;
  }, [showZone, isMapLoaded, updateZone]);

  // Handle map move for grid updates
  useEffect(() => {
    if (showGrid && isMapLoaded) {
      updateGeohashGrid(getOptimalPrecision(mapContext.zoom));
    }
  }, [showGrid, mapContext.zoom, isMapLoaded]);

  return {
    updateGrid,
    updateZone
  };
}
