import React, { useState, useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext.jsx';
import SettingsPanel from './SettingsPanel.jsx';
import TabNavigation from './TabNavigation.jsx';
import TabContent from './TabContent.jsx';

const BottomSheet = () => {
  const { bottomSheetHeight, setBottomSheetHeight } = useSettings();
  const [isDragging, setIsDragging] = useState(false);

  // Bottom sheet drag handlers
  const handleSheetDragStart = useCallback((e) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleSheetDragMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newHeight = window.innerHeight - e.clientY;
    const minHeight = 100;
    const maxHeight = window.innerHeight * 0.8;
    
    if (newHeight >= minHeight && newHeight <= maxHeight) {
      setBottomSheetHeight(newHeight);
    }
  }, [isDragging, setBottomSheetHeight]);

  const handleSheetDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div 
      className="fixed bottom-[5%] left-4 right-4 md:left-auto md:right-4 md:mx-0 md:w-1/4 lg:w-1/3 bg-white shadow-2xl rounded-3xl border border-gray-200 z-[100] transition-all duration-300 ease-out"
      style={{ 
        height: `${bottomSheetHeight}px`,
        maxHeight: '80vh'
      }}
    >
      {/* Drag Handle */}
      <div 
        className="w-full h-6 flex items-center justify-center cursor-grab active:cursor-grabbing md:hidden"
        onMouseDown={handleSheetDragStart}
        onMouseMove={handleSheetDragMove}
        onMouseUp={handleSheetDragEnd}
        onMouseLeave={handleSheetDragEnd}
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* Header with Settings */}
      <SettingsPanel />

      {/* Tabs */}
      <TabNavigation />

      {/* Tab Content */}
      <TabContent />
    </div>
  );
};

export default BottomSheet;
