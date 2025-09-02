import React, { createContext, useContext } from 'react';
import { useLocalStorageState } from '../hooks.js';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [showGrid, setShowGrid] = useLocalStorageState('showGrid', false);
  const [showZone, setShowZone] = useLocalStorageState('showZone', true);
  const [activeTab, setActiveTab] = useLocalStorageState('activeTab', 'optimal');
  const [bottomSheetHeight, setBottomSheetHeight] = useLocalStorageState('bottomSheetHeight', 300);
  const [fixedZonePrecision, setFixedZonePrecision] = useLocalStorageState('fixedZonePrecision', 7);
  const [showSettings, setShowSettings] = useLocalStorageState('showSettings', false);

  const value = {
    showGrid,
    setShowGrid,
    showZone,
    setShowZone,
    activeTab,
    setActiveTab,
    bottomSheetHeight,
    setBottomSheetHeight,
    fixedZonePrecision,
    setFixedZonePrecision,
    showSettings,
    setShowSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
