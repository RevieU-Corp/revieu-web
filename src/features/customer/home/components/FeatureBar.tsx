import React from 'react';
import topRateIcon from '../../../../assets/images/customer/home/topRate.svg';
import nearbyIcon from '../../../../assets/images/customer/home/nearby.svg';
import openNowIcon from '../../../../assets/images/customer/home/openNow.svg';
import streetFoodIcon from '../../../../assets/images/customer/home/streetFood.svg';

export type FeatureType = 'Street Food' | 'Open Now' | 'Top Rated' | 'Nearby';

interface FeatureBarProps {
    activeFeature: FeatureType;
    onFeatureChange: (feature: FeatureType) => void;
    showDistanceSlider: boolean;
    selectedDistance: number;
    onDistanceChange: (distance: number) => void;
}

const FEATURES: { label: FeatureType; icon: string; size: string; top: string }[] = [
    { label: 'Top Rated', icon: topRateIcon, size: 'w-9 h-9', top: 'top-6' },
    { label: 'Nearby', icon: nearbyIcon, size: 'w-[60px] h-[60px]', top: 'top-2' },
    { label: 'Open Now', icon: openNowIcon, size: 'w-[60px] h-[60px]', top: 'top-2' },
    { label: 'Street Food', icon: streetFoodIcon, size: 'w-[60px] h-[60px]', top: 'top-2' },
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
                        className={`relative h-[100px] rounded-[40px] transition-all duration-200 transform active:scale-95 ${
                            activeFeature === feature.label
                                ? 'bg-[#990000] shadow-lg shadow-[#990000]/30'
                                : 'bg-white shadow-[0px_20px_30px_0px_rgba(211,209,216,0.251)]'
                        }`}
                    >
                        <div className={`absolute ${feature.top} left-1/2 -translate-x-1/2 ${feature.size}`}>
                            {activeFeature === feature.label && (
                                <div className="absolute left-1/2 top-1/2 w-[60px] h-[60px] -translate-x-1/2 -translate-y-1/2 rounded-[35px] bg-white" />
                            )}
                            <img
                                src={feature.icon}
                                alt=""
                                aria-hidden="true"
                                className={`relative z-10 block w-full h-full max-w-none object-contain transition-transform ${
                                    activeFeature === feature.label ? 'scale-100' : ''
                                }`}
                            />
                        </div>
                        <span className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-tight leading-none text-center whitespace-nowrap ${
                            activeFeature === feature.label ? 'text-white' : 'text-[#67666D]'
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
