import React from 'react';
import { Activity } from '../../shared/types';

interface FeaturedSectionProps {
    activities: Activity[];
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ activities }) => {
    if (activities.length === 0) {
        return <p className="py-8 text-sm text-slate-500">No discounts available right now.</p>;
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {activities.map((activity) => (
                <article key={activity.id} className="min-w-0">
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-900 shadow-sm">
                        <img
                            src={activity.image}
                            alt={activity.title}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        {activity.tag && (
                            <span className="absolute left-3 top-3 rounded-full bg-brand-600/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                                {activity.tag}
                            </span>
                        )}
                        <span className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                            {activity.location}
                        </span>
                    </div>
                    <h3 className="mt-3 truncate text-sm font-bold text-slate-900">{activity.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">20% Off · 4 min</p>
                </article>
            ))}
        </div>
    );
};

export default FeaturedSection;
