import { useState } from "react";

interface Tab {
    id: string;
    label: string;
  }
  
  interface TabProps {
    tabs: Tab[];
    onTabChange?: (tab: string) => void;
    initialTab?: string;
  }
  
  const TabNavigation: React.FC<TabProps> = ({ 
    tabs,
    onTabChange,
    initialTab
  }) => {
    const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.id);
  
    const handleTabClick = (tabId: string) => {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    };
  
    return (
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              px-4 
              py-2 
              rounded-md 
              text-sm 
              font-medium 
              transition-colors
              duration-200
              ${activeTab === tab.id 
                ? 'bg-green-700 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  export default TabNavigation;