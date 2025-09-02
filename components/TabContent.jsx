import React from 'react';
import { useSettings } from '../contexts/SettingsContext.jsx';
import OptimalTab from './OptimalTab.jsx';
import FixedTab from './FixedTab.jsx';
import SearchTab from './SearchTab.jsx';

const TabContent = () => {
  const { activeTab } = useSettings();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'optimal':
        return <OptimalTab />;
      case 'fixed':
        return <FixedTab />;
      case 'search':
        return <SearchTab />;
      default:
        return <OptimalTab />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {renderTabContent()}
    </div>
  );
};

export default TabContent;
