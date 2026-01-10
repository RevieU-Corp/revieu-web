import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MeOptionItemProps {
    icon: React.ReactNode;
    label: string;
    badge?: string;
    onClick: () => void;
    className?: string;
}

export const MeOptionItem: React.FC<MeOptionItemProps> = ({
    icon,
    label,
    badge,
    onClick,
    className = ""
}) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group ${className}`}
        >
            <div className="flex items-center gap-3">
                <div className="text-gray-500 group-hover:text-gray-900 transition-colors">
                    {icon}
                </div>
                <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                    {label}
                </span>
            </div>

            <div className="flex items-center gap-2">
                {badge && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">
                        {badge}
                    </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
        </button>
    );
};
