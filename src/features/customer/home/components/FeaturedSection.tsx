import React from 'react';
import { Activity } from '../../shared/types';

interface FeaturedSectionProps {
    activities: Activity[];
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ activities }) => {
    return (
        <div className="flex overflow-x-auto space-x-3 pb-4 -mx-4 px-4 snap-x scrollbar-hide">
            {activities.map((activity) => (
                <div key={activity.id} className="flex-shrink-0 w-[160px] snap-center">
                    <div className="relative w-[160px] h-[160px]">
                        <div className="w-[160px] h-[160px] rounded-[24px] overflow-hidden relative bg-gray-900 group shadow-sm">
                            <img
                                src={activity.image}
                                alt={activity.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                            />

                            <div className="absolute top-3 left-3">
                                {activity.tag && (
                                    <span className="w-[81px] h-[26px] inline-flex items-center justify-center bg-[#BC2323CC] text-[8px] font-black text-white rounded-[60px] uppercase tracking-widest shadow-lg">
                                        {activity.tag}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="absolute top-[134px] left-[10px] translate-y-1/2 w-[99px] h-[24px] opacity-100 rounded-[112px] bg-white shadow-[0px_5px_20px_0px_#FE724C33] flex items-center justify-center px-2">
                            <p className="text-[10px] font-[600] text-[#000000] leading-[100%] tracking-[0] uppercase">
                                {activity.location}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 ml-[10px] w-[140px] flex flex-col gap-[9px]">
                        <h3 className="font-['Sofia_Pro'] font-semibold text-[14px] leading-[100%] tracking-[0] text-[#000000] truncate">
                            {activity.title}
                        </h3>
                        <div className="flex items-center font-['Roboto'] font-medium text-[12px] leading-[100%] tracking-[0] text-[#9796A1]">
                            <span>20% Off</span>
                            <span className="mx-[8px]">|</span>
                            <span>4 min</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeaturedSection;
