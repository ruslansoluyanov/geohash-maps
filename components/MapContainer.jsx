import React, { useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useMap } from '../contexts/MapContext.jsx';
import { useGeohashZones } from '../hooks/useGeohashZones.js';

const MapContainer = () => {
  const { 
    isMapLoaded, 
    liveGeohash, 
    activeGeohashOverlay, 
    initializeMap 
  } = useMap();

  // Initialize geohash zones management
  useGeohashZones();

  useEffect(() => {
    if (!isMapLoaded) {
      initializeMap();
    }
  }, [isMapLoaded, initializeMap]);

  return (
    <div className="flex-1 relative">
      <div id="map" className="w-full h-full relative" style={{ zIndex: 1 }}></div>
      
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center" style={{ zIndex: 200 }}>
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Geohash overlay info - moved to top right */}
      <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-3" style={{ zIndex: 100 }}>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">Geohash</span>
        </div>
      </div>
      
      {/* Active Geohash Info */}
      {activeGeohashOverlay && (
        <div className="absolute bottom-4 left-4 bg-green-900 text-white rounded-lg shadow-lg p-3" style={{ zIndex: 100 }}>
          <div className="text-center">
            <div className="text-xs opacity-75 mb-1">Showing area</div>
            <div className="font-mono text-lg font-bold">
              {activeGeohashOverlay.geohash}
            </div>
            <div className="text-xs opacity-75">
              {activeGeohashOverlay.precision} characters
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
