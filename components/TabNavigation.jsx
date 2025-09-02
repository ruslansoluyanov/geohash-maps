import React from 'react';
import { useSettings } from '../contexts/SettingsContext.jsx';

const TabNavigation = () => {
  const { activeTab, setActiveTab } = useSettings();

  const tabs = [
    { id: 'optimal', label: 'Optimal' },
    { id: 'fixed', label: 'Fixed' },
    { id: 'search', label: 'Search' }
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === tab.id 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
