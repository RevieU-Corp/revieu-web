import React from 'react';
import { Icons } from './Icons';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  isDestructive?: boolean;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  badge,
  isDestructive
}) => (
  <div className="flex items-center justify-between p-4 px-5 bg-white active:bg-gray-50 transition-colors cursor-pointer group hover:bg-gray-50/80">
    <div className="flex items-center gap-3.5">
      <div className={`p-2 rounded-full transition-colors ${
        isDestructive
          ? 'bg-red-50 text-red-500'
          : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-brand-red group-hover:shadow-sm'
      }`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
      </div>
      <span className={`text-[15px] font-medium tracking-tight ${
        isDestructive ? 'text-red-500' : 'text-gray-900'
      }`}>
        {label}
      </span>
    </div>
    <div className="flex items-center gap-2">
      {badge && (
        <span className="text-[10px] bg-brand-red text-white px-2 py-0.5 rounded-full font-bold shadow-sm shadow-brand-red/20">
          {badge}
        </span>
      )}
      <Icons.ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400" />
    </div>
  </div>
);
