
import React from 'react';
import { Activity } from '../../shared/types';

interface FeaturedSectionProps {
    activities: Activity[];
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ activities }) => {
    return (
        <div className="flex overflow-x-auto space-x-4 pb-6 -mx-4 px-4 snap-x scrollbar-hide">
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className="flex-shrink-0 w-[240px] rounded-[30px] overflow-hidden relative border border-black/5 snap-center group shadow-sm"
                >
                    <div className="aspect-[3/4] w-full relative bg-gray-900">
                        <img
                            src={activity.image}
                            alt={activity.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        <div className="absolute top-4 left-4">
                            {activity.tag && (
                                <span className="px-3 py-1.5 bg-[#990000] text-[9px] font-black text-white rounded-lg uppercase tracking-widest shadow-lg">
                                    {activity.tag}
                                </span>
                            )}
                        </div>

                        <div className="absolute bottom-5 left-5 right-5 text-white">
                            <p className="text-[9px] font-[900] text-[#FFCC00] uppercase tracking-widest mb-1.5 leading-none">
                                {activity.location}
                            </p>
                            <h3 className="text-[20px] font-[900] leading-tight tracking-tight mb-3">{activity.title}</h3>

                            <div className="flex items-center space-x-4 opacity-80">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest">Savings</span>
                                    <span className="text-[13px] font-black text-white">20% Off</span>
                                </div>
                                <div className="w-[1px] h-4 bg-white/20" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest">Walk</span>
                                    <span className="text-[13px] font-black text-white">4 min</span>
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
