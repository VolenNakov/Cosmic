import React from 'react';
import { Satellite } from 'lucide-react';
import { Tab, TabItem } from '../types';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  tabs: TabItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, tabs }) => {
  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Satellite className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-sm font-bold">DeepSpace Compress AI</h1>
            <p className="text-xs text-slate-400">Data Compression</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-blue-500/10 text-blue-400' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}; 