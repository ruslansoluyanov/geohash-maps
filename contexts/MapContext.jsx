import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initMap, updateMapMarker } from '../mapUtils.js';
import { updateLiveGeohash } from '../geohash.js';

// Map state and actions
const MapContext = createContext();

const mapReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MAP_LOADED':
      return { ...state, isMapLoaded: action.payload };
    case 'SET_LIVE_GEOHASH':
      return { ...state, liveGeohash: action.payload };
    case 'SET_MAP_CONTEXT':
      return { ...state, mapContext: action.payload };
    case 'SET_ACTIVE_OVERLAY':
      return { ...state, activeGeohashOverlay: action.payload };
    default:
      return state;
  }
};

const initialState = {
  isMapLoaded: false,
  liveGeohash: null,
  activeGeohashOverlay: null,
  mapContext: (() => {
    try {
      const saved = localStorage.getItem('mapContext');
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        zoom: parsed.zoom || 6,
        screenWidth: parsed.screenWidth || 1280,
        screenHeight: parsed.screenHeight || 800,
        latitude: parsed.latitude !== undefined ? parsed.latitude : 36.5625,
        longitude: parsed.longitude !== undefined ? parsed.longitude : -118.125
      };
    } catch {
      return { 
        zoom: 6, 
        screenWidth: 1280, 
        screenHeight: 800, 
        latitude: 36.5625, 
        longitude: -118.125 
      };
    }
  })()
};

export const MapProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  // Save map context to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('mapContext', JSON.stringify(state.mapContext));
    } catch (error) {
      console.warn('Failed to save map context to localStorage:', error);
    }
  }, [state.mapContext]);

  const handleMapMove = (latitude, longitude, zoom) => {
    const newLiveGeohash = updateLiveGeohash(latitude, longitude);
    dispatch({ type: 'SET_LIVE_GEOHASH', payload: newLiveGeohash });
    
    const newMapContext = { 
      ...state.mapContext, 
      zoom, 
      latitude, 
      longitude 
    };
    dispatch({ type: 'SET_MAP_CONTEXT', payload: newMapContext });

    // Save to localStorage
    try {
      localStorage.setItem('mapContext', JSON.stringify(newMapContext));
    } catch (error) {
      console.warn('Failed to save map context to localStorage:', error);
    }
  };

  const initializeMap = async () => {
    try {
      const initialPosition = (state.mapContext.latitude && state.mapContext.longitude) 
        ? { 
            lat: state.mapContext.latitude, 
            lng: state.mapContext.longitude, 
            zoom: state.mapContext.zoom 
          }
        : undefined;
      
      await initMap(handleMapMove, initialPosition);
      dispatch({ type: 'SET_MAP_LOADED', payload: true });
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  };

  const updateMarker = (latitude, longitude, name) => {
    try {
      updateMapMarker(latitude, longitude, name);
      const newLiveGeohash = updateLiveGeohash(latitude, longitude);
      dispatch({ type: 'SET_LIVE_GEOHASH', payload: newLiveGeohash });
    } catch (error) {
      console.error('Failed to update marker:', error);
    }
  };

  const setActiveOverlay = (overlay) => {
    dispatch({ type: 'SET_ACTIVE_OVERLAY', payload: overlay });
  };

  const value = {
    ...state,
    initializeMap,
    updateMarker,
    setActiveOverlay,
    handleMapMove
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};
