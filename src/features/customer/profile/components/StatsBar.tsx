import React from 'react';
import { UserStats } from '../types';

interface StatsBarProps {
  stats: UserStats;
}

const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <div className="flex justify-between items-center py-4 px-2 mx-1 border-t border-b border-gray-50">
      <div className="flex flex-col items-center group cursor-pointer">
        <span className="text-[19px] font-bold text-gray-900 group-hover:text-brand-red transition-colors">{stats.totalReviews}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Reviews</span>
      </div>
      
      <div className="flex flex-col items-center group cursor-pointer">
        <span className="text-[19px] font-bold text-gray-900 group-hover:text-brand-red transition-colors">{stats.photosUploaded}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Photos</span>
      </div>
      
      <div className="flex flex-col items-center group cursor-pointer">
        <span className="text-[19px] font-bold text-gray-900 group-hover:text-brand-red transition-colors">{stats.views}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Views</span>
      </div>
    </div>
  );
};

export default StatsBar;