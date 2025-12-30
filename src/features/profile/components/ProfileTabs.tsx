import React from 'react';
import { Grid, Bookmark } from 'lucide-react';
import { ProfileTab } from '../types';

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="sticky top-[52px] bg-white z-20 border-b border-gray-200 mt-2">
      <div className="flex">
        <button
          onClick={() => onTabChange('reviews')}
          className={`flex-1 py-3 flex justify-center items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'reviews' 
              ? 'border-gray-900 text-gray-900' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Grid className="w-4 h-4" />
          My Reviews
        </button>
        <button
          onClick={() => onTabChange('saved')}
          className={`flex-1 py-3 flex justify-center items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'saved' 
              ? 'border-gray-900 text-gray-900' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved
        </button>
      </div>
    </div>
  );
};