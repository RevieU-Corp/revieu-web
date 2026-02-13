import React from 'react';
import { Activity } from '../../shared/types';

interface FeaturedSectionProps {
    activities: Activity[];
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ activities }) => {
    return (
        <div className="flex overflow-x-auto space-x-3 pb-4 -mx-4 px-4 snap-x scrollbar-hide">
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className="flex-shrink-0 w-[160px] rounded-[24px] overflow-hidden relative border border-black/5 snap-center group shadow-sm"
                >
                    <div className="aspect-[3/4] w-full relative bg-gray-900">
                        <img
                            src={activity.image}
                            alt={activity.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        <div className="absolute top-3 left-3">
                            {activity.tag && (
                                <span className="px-2 py-1 bg-[#990000] text-[8px] font-black text-white rounded-lg uppercase tracking-widest shadow-lg">
                                    {activity.tag}
                                </span>
                            )}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                            <p className="text-[8px] font-[900] text-[#FFCC00] uppercase tracking-widest mb-1 leading-none">
                                {activity.location}
                            </p>
                            <h3 className="text-[16px] font-[900] leading-tight tracking-tight mb-2">{activity.title}</h3>

                            <div className="flex items-center space-x-3 opacity-80">
                                <div className="flex flex-col">
                                    <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest">Savings</span>
                                    <span className="text-[11px] font-black text-white">20% Off</span>
                                </div>
                                <div className="w-[1px] h-3 bg-white/20" />
                                <div className="flex flex-col">
                                    <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest">Walk</span>
                                    <span className="text-[11px] font-black text-white">4 min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeaturedSection;
