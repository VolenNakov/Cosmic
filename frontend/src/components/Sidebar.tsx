import React from 'react';
import { SidebarProps } from '../types';

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors
                ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}; 