import React from 'react';

export type FeatureType = 'Street Food' | 'Open Now' | 'Top Rated' | 'Nearby';

interface FeatureBarProps {
    activeFeature: FeatureType;
    onFeatureChange: (feature: FeatureType) => void;
    showDistanceSlider: boolean;
    selectedDistance: number;
    onDistanceChange: (distance: number) => void;
}

const FEATURES: { label: FeatureType; icon: string }[] = [
    { label: 'Top Rated', icon: '★' },
    { label: 'Street Food', icon: '🌮' },
    { label: 'Open Now', icon: '⚡' },
    { label: 'Nearby', icon: '📍' },
];

const DISTANCE_OPTIONS = [1, 3, 5, 10];

const FeatureBar: React.FC<FeatureBarProps> = ({ 
    activeFeature, 
    onFeatureChange,
    showDistanceSlider,
    selectedDistance,
    onDistanceChange
}) => {
    return (
        <div>
            <div className="grid grid-cols-4 gap-2 -mx-4 px-4 pb-2">
                {FEATURES.map((feature) => (
                    <button
                        key={feature.label}
                        onClick={() => onFeatureChange(feature.label)}
                        className={`h-[70px] rounded-2xl transition-all duration-200 transform active:scale-95 flex flex-col items-center justify-center gap-1 ${
                            activeFeature === feature.label
                                ? 'bg-[#990000] shadow-lg shadow-[#990000]/30'
                                : 'bg-gray-100/80 border border-gray-200'
                        }`}
                    >
                        <div className={`text-[22px] transition-all ${
                            activeFeature === feature.label ? '' : 'grayscale opacity-50'
                        }`}>
                            {feature.icon}
                        </div>
                        <span className={`text-[9px] font-[800] tracking-tight leading-none text-center ${
                            activeFeature === feature.label ? 'text-white' : 'text-gray-600'
                        }`}>
                            {feature.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Distance Slider - Only show when Nearby is active */}
            {showDistanceSlider && (
                <div className="mt-3 -mx-4 px-4 pb-2 animate-in slide-in-from-top duration-200">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-[800] text-gray-700 uppercase tracking-widest">Distance</span>
                            <span className="text-[13px] font-[900] text-[#990000]">{selectedDistance} mi</span>
                        </div>
                        <div className="flex gap-2">
                            {DISTANCE_OPTIONS.map((distance) => (
                                <button
                                    key={distance}
                                    onClick={() => onDistanceChange(distance)}
                                    className={`flex-1 py-2 rounded-xl text-[11px] font-[800] transition-all ${
                                        selectedDistance === distance
                                            ? 'bg-[#990000] text-white shadow-md'
                                            : 'bg-white text-gray-600 border border-gray-200'
                                    }`}
                                >
                                    {distance} mi
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeatureBar;
