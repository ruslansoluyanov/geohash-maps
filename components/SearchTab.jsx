import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useGeocoding } from '../contexts/GeocodingContext.jsx';
import { useMap } from '../contexts/MapContext.jsx';
import { copyToClipboard } from '../utils/geohashUtils.js';

const SearchTab = () => {
  const { 
    address, 
    isLoading, 
    result, 
    error, 
    setAddress, 
    performSearch 
  } = useGeocoding();
  
  const { updateMarker } = useMap();

  const handleSearch = () => {
    performSearch(updateMarker);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCopy = (event) => {
    const button = event.currentTarget;
    copyToClipboard(result.geohash, button);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address Search
        </label>
        <div className="space-y-3">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter address..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !address.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-2">Found address:</div>
          <div className="font-medium text-gray-900 mb-2">{result.address}</div>
          <div className="font-mono text-lg font-bold text-gray-900 mb-2">
            {result.geohash}
          </div>
          <div className="text-sm text-gray-600 mb-3">
            6 characters (~1.2km)
          </div>
          <div className="text-xs text-gray-500 mb-3">
            Source: {result.source}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            title="Copy to clipboard"
          >
            📋
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchTab;
