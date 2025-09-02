import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Copy } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext.jsx';
import { useMap } from '../contexts/MapContext.jsx';
import { useActiveGeohash } from '../hooks/useActiveGeohash.js';
import { encodeGeohash } from '../geohash.js';
import { copyToClipboard, formatPrecisionLabel, formatDistance } from '../utils/geohashUtils.js';

const FixedTab = () => {
  const { fixedZonePrecision, setFixedZonePrecision } = useSettings();
  const { mapContext, isMapLoaded, liveGeohash } = useMap();
  const activeGeohash = useActiveGeohash();

  // Use the centralized active geohash when the current tab is 'fixed'
  const fixedZoneGeohash = activeGeohash.tab === 'fixed' ? activeGeohash.geohash : '';

  const handlePrecisionChange = (event) => {
    const newPrecision = parseInt(event.target.value);
    setFixedZonePrecision(newPrecision);
  };

  const handleCopy = (event) => {
    const button = event.currentTarget;
    copyToClipboard(fixedZoneGeohash, button);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Current Hash */}
        <div className="space-y-2">
          <div className="bg-gray-50 rounded-lg p-4 relative h-32 flex flex-col justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Current Hash</div>
              <div className="font-mono text-2xl font-bold text-gray-900 mb-1 break-all">
                {fixedZoneGeohash || 'Loading...'}
              </div>
              <div className="text-sm text-gray-600">
                {formatPrecisionLabel(fixedZonePrecision)} ({formatDistance(fixedZonePrecision)})
              </div>
            </div>
            <button
              onClick={handleCopy}
              disabled={!fixedZoneGeohash}
              className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Precision Slider */}
        <div className="space-y-2">
          <div className="bg-gray-50 rounded-lg p-4 h-32 flex flex-col justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-3">Cell Size</div>
              <div className="text-center mb-3">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrecisionLabel(fixedZonePrecision)}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="9"
                value={fixedZonePrecision}
                onChange={handlePrecisionChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1 (~5000km)</span>
                <span>9 (~2.4m)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedTab;
