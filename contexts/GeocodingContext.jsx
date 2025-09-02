import React, { createContext, useContext, useReducer } from 'react';
import { searchAddress } from '../searchUtils.js';
import { encodeGeohash } from '../geohash.js';

const GeocodingContext = createContext();

const geocodingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_RESULT':
      return { ...state, result: action.payload, error: '', isLoading: false };
    case 'SET_ADDRESS':
      return { ...state, address: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: '' };
    default:
      return state;
  }
};

const initialState = {
  address: '',
  isLoading: false,
  result: null,
  error: ''
};

export const GeocodingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(geocodingReducer, initialState);

  const setAddress = (address) => {
    dispatch({ type: 'SET_ADDRESS', payload: address });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const performSearch = async (updateMarker) => {
    if (!state.address.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Please enter an address' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const locationData = await searchAddress(state.address);
      const geohash = encodeGeohash(locationData.lat, locationData.lng, 6);

      const resultData = {
        address: locationData.name,
        coordinates: { 
          latitude: locationData.lat, 
          longitude: locationData.lng 
        },
        geohash,
        source: locationData.source
      };

      dispatch({ type: 'SET_RESULT', payload: resultData });

      // Update map marker if function provided
      if (updateMarker) {
        updateMarker(locationData.lat, locationData.lng, locationData.name);
      }

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const value = {
    ...state,
    setAddress,
    clearError,
    performSearch
  };

  return (
    <GeocodingContext.Provider value={value}>
      {children}
    </GeocodingContext.Provider>
  );
};

export const useGeocoding = () => {
  const context = useContext(GeocodingContext);
  if (!context) {
    throw new Error('useGeocoding must be used within a GeocodingProvider');
  }
  return context;
};
