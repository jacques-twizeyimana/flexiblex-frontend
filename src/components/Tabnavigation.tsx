/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';

interface TabProps {
  onTabChange?: (tab: string) => void;
  initialTab?: string;
}

const TabNavigation: React.FC<TabProps> = ({ 
  onTabChange,
  initialTab = 'Department'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    'Department',
    'Work shift',
    'Leave duration',
    'Users'
  ];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`
            px-4 
            py-2 
            rounded-md 
            text-sm 
            font-medium 
            transition-colors
            duration-200
            ${activeTab === tab 
              ? 'bg-green-700 text-white shadow-sm' 
              : 'text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

// Example usage with content
const PageWithTabs = () => {
  const [currentTab, setCurrentTab] = useState('Department');

  const renderContent = () => {
    switch (currentTab) {
      case 'Department':
        return <div>Department content</div>;
      case 'Work shift':
        return <div>Work shift content</div>;
      case 'Leave duration':
        return <div>Leave duration content</div>;
      case 'Users':
        return <div>Users content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="pb-4 space-y-4">
      <TabNavigation 
        onTabChange={setCurrentTab}
        initialTab="Department"
      />
      {/* <div className="mt-4">
        {renderContent()}
      </div> */}
    </div>
  );
};

export default PageWithTabs;