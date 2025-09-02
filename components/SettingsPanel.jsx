import React, { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext.jsx';
import { useMap } from '../contexts/MapContext.jsx';
import { hideArea } from '../mapUtils.js';

const SettingsPanel = () => {
  const { 
    showGrid, 
    setShowGrid, 
    showZone, 
    setShowZone, 
    showSettings, 
    setShowSettings 
  } = useSettings();
  
  const { mapContext } = useMap();
  const settingsRef = useRef(null);

  // Close settings when map moves or zooms
  useEffect(() => {
    if (showSettings) {
      setShowSettings(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapContext.latitude, mapContext.longitude, mapContext.zoom]);

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSettings, setShowSettings]);

  const handleGridToggle = (enabled) => {
    setShowGrid(enabled);
    if (!enabled) {
      hideArea('grid');
    }
  };

  const handleZoneToggle = (enabled) => {
    setShowZone(enabled);
    if (!enabled) {
      hideArea('preview');
    }
  };

  return (
    <div className="px-6 py-4 border-b border-gray-200 relative" ref={settingsRef}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Geohash</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-colors ${
            showSettings 
              ? 'bg-blue-100 text-blue-600' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          aria-label="Toggle settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </button>
      </div>

      {/* Settings Panel Overlay */}
      {showSettings && (
        <div className="absolute top-full right-6 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showGrid"
                checked={showGrid}
                onChange={(e) => handleGridToggle(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="showGrid" className="text-sm font-medium text-gray-700 cursor-pointer">
                Geohash Grid
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showZone"
                checked={showZone}
                onChange={(e) => handleZoneToggle(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="showZone" className="text-sm font-medium text-gray-700 cursor-pointer">
                Highlight Geohash Cell
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
