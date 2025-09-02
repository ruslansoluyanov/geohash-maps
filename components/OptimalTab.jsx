import React from 'react';
import { Copy } from 'lucide-react';
import { useMap } from '../contexts/MapContext.jsx';
import { useActiveGeohash } from '../hooks/useActiveGeohash.js';
import { getOptimalPrecision, copyToClipboard, formatPrecisionLabel } from '../utils/geohashUtils.js';

const OptimalTab = () => {
  const { liveGeohash, mapContext } = useMap();
  const activeGeohash = useActiveGeohash();

  if (!liveGeohash) {
    return (
      <div className="space-y-4">
        <div className="text-center text-gray-500">
          Loading geohash data...
        </div>
      </div>
    );
  }

  // Use centralized geohash when on optimal tab, fallback to local calculation
  const currentGeohash = activeGeohash.tab === 'optimal' && activeGeohash.geohash 
    ? activeGeohash.geohash 
    : (() => {
        const optimalPrecision = getOptimalPrecision(mapContext.zoom);
        return liveGeohash.geohashes[optimalPrecision];
      })();
      
  const optimalPrecision = getOptimalPrecision(mapContext.zoom);
  const precisionLabel = liveGeohash.precision[optimalPrecision];

  const handleCopy = (event) => {
    const button = event.currentTarget;
    copyToClipboard(currentGeohash, button);
  };

  return (
    <div className="space-y-4">
      <div className="w-full">
        <div className="bg-gray-50 rounded-lg p-4 relative h-32 flex flex-col justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Current Hash</div>
            <div className="font-mono text-2xl font-bold text-gray-900 mb-1">
              {currentGeohash}
            </div>
            <div className="text-sm text-gray-600">
              {formatPrecisionLabel(optimalPrecision)} ({precisionLabel})
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptimalTab;
