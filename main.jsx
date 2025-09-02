import React from 'react';
import { MapProvider } from './contexts/MapContext.jsx';
import { SettingsProvider } from './contexts/SettingsContext.jsx';
import { GeocodingProvider } from './contexts/GeocodingContext.jsx';
import MapContainer from './components/MapContainer.jsx';
import BottomSheet from './components/BottomSheet.jsx';

const GeohashGenerator = () => {
  return (
    <MapProvider>
      <SettingsProvider>
        <GeocodingProvider>
          <div className="h-screen flex overflow-hidden bg-gray-50">
            <MapContainer />
            <BottomSheet />
          </div>
        </GeocodingProvider>
      </SettingsProvider>
    </MapProvider>
  );
};

export default GeohashGenerator;
