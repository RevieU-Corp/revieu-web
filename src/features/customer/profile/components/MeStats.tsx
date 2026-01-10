import React from 'react';

interface MeStatsProps {
    stats: {
        label: string;
        value: number | string;
    }[];
}

export const MeStats: React.FC<MeStatsProps> = ({ stats }) => {
    return (
        <div className="flex items-center justify-around py-4 mt-2">
            {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                    <span className="text-lg font-black text-gray-900">{stat.value}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                </div>
            ))}
        </div>
    );
};
