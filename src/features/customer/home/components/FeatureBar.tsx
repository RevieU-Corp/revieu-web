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

const FEATURES: { label: FeatureType; icon: string }[] = [
    { label: 'Top Rated', icon: topRateIcon },
    { label: 'Nearby', icon: nearbyIcon },
    { label: 'Open Now', icon: openNowIcon },
    { label: 'Street Food', icon: streetFoodIcon },
];

const DISTANCE_OPTIONS = [1, 3, 5, 10];

const FeatureBar: React.FC<FeatureBarProps> = ({
    activeFeature,
    onFeatureChange,
    showDistanceSlider,
    selectedDistance,
    onDistanceChange,
}) => {
    return (
        <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {FEATURES.map((feature) => {
                    const active = activeFeature === feature.label;
                    return (
                        <button
                            key={feature.label}
                            type="button"
                            onClick={() => onFeatureChange(feature.label)}
                            className={`flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-sm font-bold transition hover:-translate-y-0.5 sm:min-h-32 ${
                                active
                                    ? 'border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-700'
                            }`}
                        >
                            <img src={feature.icon} alt="" aria-hidden="true" className="h-12 w-12 object-contain" />
                            {feature.label}
                        </button>
                    );
                })}
            </div>

            {showDistanceSlider && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Distance</span>
                        <span className="text-sm font-black text-brand-600">{selectedDistance} mi</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {DISTANCE_OPTIONS.map((distance) => (
                            <button
                                key={distance}
                                type="button"
                                onClick={() => onDistanceChange(distance)}
                                className={`rounded-xl py-2 text-xs font-bold transition ${
                                    selectedDistance === distance
                                        ? 'bg-brand-600 text-white shadow-md'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-200'
                                }`}
                            >
                                {distance} mi
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeatureBar;
