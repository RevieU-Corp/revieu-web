
import React, { useState } from 'react';

const FEATURES = [
    { label: 'Coupons', icon: '🎟️' },
    { label: 'Open Now', icon: '⚡' },
    { label: 'Top Rated', icon: '★' },
    { label: 'Budget', icon: '$' },
];

const FeatureBar: React.FC = () => {
    const [active, setActive] = useState('Coupons');

    return (
        <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {FEATURES.map((feature) => (
                <button
                    key={feature.label}
                    onClick={() => setActive(feature.label)}
                    className={`flex-shrink-0 min-w-[105px] p-4 rounded-3xl transition-all duration-300 transform active:scale-95 ${active === feature.label
                            ? 'bg-white shadow-md border border-[#990000]/10'
                            : 'bg-gray-100/50 border border-transparent'
                        }`}
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-[20px] transition-all ${active === feature.label
                                    ? feature.label === 'Top Rated' ? 'bg-[#FFCC00] text-white' : 'bg-[#990000] text-white shadow-sm'
                                    : 'bg-white border border-gray-100'
                                }`}
                        >
                            <span className={active !== feature.label ? 'grayscale opacity-40' : ''}>
                                {feature.icon}
                            </span>
                        </div>
                        <span className={`block text-[13px] font-[800] tracking-tight ${active === feature.label ? 'text-[#1A1A1A]' : 'text-gray-500'
                            }`}>
                            {feature.label}
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default FeatureBar;
