import React from 'react';
import { Icons } from './Icons';

interface NavCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  colorClass?: string;
}

export const NavCard: React.FC<NavCardProps> = ({
  icon,
  title,
  subtitle,
  onClick,
  colorClass = "text-brand-red"
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full bg-white p-5 rounded-[24px] border border-gray-100 text-left hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-all group relative overflow-hidden h-full flex flex-col justify-between min-h-[140px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#990000]"
  >
    {/* Decorative Background */}
    <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-red/5 transition-colors"></div>

    <div className="flex justify-between items-start z-10">
      <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 22 })}
      </div>
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-300 shadow-sm border border-gray-100 group-hover:text-brand-red group-hover:border-brand-red/20 transition-colors" aria-hidden="true">
        <Icons.ChevronRight size={16} />
      </div>
    </div>

    <div className="z-10 mt-4">
      <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">{title}</h3>
      <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
    </div>
  </button>
);
