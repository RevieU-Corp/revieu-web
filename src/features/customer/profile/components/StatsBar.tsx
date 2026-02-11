import React from 'react';
import { MessageSquare, Users } from 'lucide-react';
import { UserStats } from '../types';

interface StatsBarProps {
  stats: UserStats;
}

const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const metricButtons = [
    {
      key: 'reviews',
      label: 'REVIEWS',
      value: stats.totalReviews,
      icon: MessageSquare,
      surfaceClass:
        'from-[#990000] via-[#B20000] to-[#7A0000] text-white shadow-[0_14px_26px_-14px_rgba(153,0,0,0.85)]',
      glowClass: 'bg-[#FFCC00]/35',
    },
    {
      key: 'following',
      label: 'FOLLOWING',
      value: stats.following,
      icon: Users,
      surfaceClass:
        'from-[#1F2937] via-[#111827] to-[#0B1220] text-white shadow-[0_14px_28px_-14px_rgba(15,23,42,0.8)]',
      glowClass: 'bg-[#7DD3FC]/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mt-1">
      {metricButtons.map((metric) => {
        const Icon = metric.icon;

        return (
          <button
            key={metric.key}
            type="button"
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/30 ${metric.surfaceClass}`}
          >
            <div className={`pointer-events-none absolute -top-8 -right-6 h-20 w-20 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125 ${metric.glowClass}`} />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">{metric.label}</div>
                <div className="mt-1 text-[25px] font-black leading-none tracking-tight text-white">{metric.value}</div>
              </div>
              <div className="rounded-xl border border-white/25 bg-white/15 p-2.5 backdrop-blur-sm transition-colors group-hover:bg-white/25">
                <Icon size={16} className="text-white" />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-4 bottom-2 h-px bg-gradient-to-r from-white/0 via-white/45 to-white/0 opacity-70" />
          </button>
        );
      })}
    </div>
  );
};

export default StatsBar;
