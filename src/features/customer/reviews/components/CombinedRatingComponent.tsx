import React, { useState } from 'react';
import { BusinessCategory, CombinedRatingProps } from '../types';
import { default as StarRatingComponent } from './StarRatingComponent';

const CombinedRatingComponent: React.FC<CombinedRatingProps> = ({
  overallRating,
  detailedRatings,
  businessCategory = BusinessCategory.RESTAURANT,
  onOverallRatingChange,
  onDetailedRatingChange,
  readonly = false,
  className = '',
}) => {
  const [starEffect, setStarEffect] = useState<{ [key: string]: boolean }>({});

  // Get category-specific labels
  const getCategoryLabels = (category: BusinessCategory) => {
    switch (category) {
      case BusinessCategory.RESTAURANT:
        return {
          quality: 'Taste',
          environment: 'Environment',
          service: 'Service',
          value: 'Price',
        };
      case BusinessCategory.HOTEL:
        return {
          quality: 'Room',
          environment: 'Facilities',
          service: 'Service',
          value: 'Value',
        };
      case BusinessCategory.RETAIL:
        return {
          quality: 'Product',
          environment: 'Store',
          service: 'Service',
          value: 'Value',
        };
      case BusinessCategory.SERVICE:
        return {
          quality: 'Quality',
          environment: 'Environment',
          service: 'Care',
          value: 'Value',
        };
      case BusinessCategory.ENTERTAINMENT:
        return {
          quality: 'Experience',
          environment: 'Venue',
          service: 'Staff',
          value: 'Value',
        };
      default:
        return {
          quality: 'Quality',
          environment: 'Environment',
          service: 'Service',
          value: 'Value',
        };
    }
  };

  const labels = getCategoryLabels(businessCategory);

  // Handle star effect for 5-star ratings
  const triggerStarEffect = (key: string) => {
    setStarEffect(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setStarEffect(prev => ({ ...prev, [key]: false }));
    }, 1000);
  };

  // Auto-suggest detailed ratings based on overall rating
  const handleOverallRatingChange = (rating: number) => {
    onOverallRatingChange(rating);

    // Trigger star effect for 5-star rating
    if (rating === 5) {
      triggerStarEffect('overall');
    }

    // Auto-suggest similar values for detailed ratings if they're not set
    if (
      detailedRatings.quality === 0 &&
      detailedRatings.environment === 0 &&
      detailedRatings.service === 0 &&
      detailedRatings.value === 0
    ) {
      const variation = 0.5;
      const qualityRating = Math.max(0.5, Math.min(5, rating + (Math.random() - 0.5) * variation));
      const environmentRating = Math.max(0.5, Math.min(5, rating + (Math.random() - 0.5) * variation));
      const serviceRating = Math.max(0.5, Math.min(5, rating + (Math.random() - 0.5) * variation));
      const valueRating = Math.max(0.5, Math.min(5, rating + (Math.random() - 0.5) * variation));

      onDetailedRatingChange('quality', Math.round(qualityRating * 2) / 2);
      onDetailedRatingChange('environment', Math.round(environmentRating * 2) / 2);
      onDetailedRatingChange('service', Math.round(serviceRating * 2) / 2);
      onDetailedRatingChange('value', Math.round(valueRating * 2) / 2);
    }
  };

  const handleDetailedRatingChange = (type: 'quality' | 'environment' | 'service' | 'value', rating: number) => {
    onDetailedRatingChange(type, rating);

    // Trigger star effect for 5-star rating
    if (rating === 5) {
      triggerStarEffect(type);
    }
  };

  return (
    <div className={`space-y-0 ${className}`}>
      {/* Overall Rating - 1/5 of space */}
      <div className="h-16 flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-gradient-to-b from-[#990000] to-[#FFD700] rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Overall</span>
        </div>

        <div className={`relative ${starEffect.overall ? 'animate-pulse' : ''}`}>
          <StarRatingComponent
            value={overallRating}
            onChange={handleOverallRatingChange}
            size="compact"
            readonly={readonly}
            showText={false}
            allowHalfStars={true}
            xiaomiStyle={true}
          />

          {/* Star effect overlay */}
          {starEffect.overall && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] opacity-30 rounded-lg animate-ping"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-[#FF6B35] font-bold animate-bounce">✨</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Ratings - 3/4 of space */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-1 h-5 bg-gradient-to-b from-[#990000] to-[#FFD700] rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Rate Details</span>
        </div>

        <div className="space-y-6">
          {/* Quality Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {labels.quality}
              </span>
              <span className="text-xs text-gray-400">
                {detailedRatings.quality > 0 ? `${detailedRatings.quality}/5` : ''}
              </span>
            </div>
            <div className={`relative ${starEffect.quality ? 'animate-pulse' : ''}`}>
              <StarRatingComponent
                value={detailedRatings.quality}
                onChange={(rating) => handleDetailedRatingChange('quality', rating)}
                size="medium"
                readonly={readonly}
                showText={false}
                allowHalfStars={true}
                xiaomiStyle={true}
              />

              {/* Star effect overlay */}
              {starEffect.quality && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] opacity-30 rounded-lg animate-ping"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-[#FF6B35] font-bold animate-bounce">✨</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Environment Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {labels.environment}
              </span>
              <span className="text-xs text-gray-400">
                {detailedRatings.environment > 0 ? `${detailedRatings.environment}/5` : ''}
              </span>
            </div>
            <div className={`relative ${starEffect.environment ? 'animate-pulse' : ''}`}>
              <StarRatingComponent
                value={detailedRatings.environment}
                onChange={(rating) => handleDetailedRatingChange('environment', rating)}
                size="medium"
                readonly={readonly}
                showText={false}
                allowHalfStars={true}
                xiaomiStyle={true}
              />

              {/* Star effect overlay */}
              {starEffect.environment && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] opacity-30 rounded-lg animate-ping"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-[#FF6B35] font-bold animate-bounce">✨</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Service Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {labels.service}
              </span>
              <span className="text-xs text-gray-400">
                {detailedRatings.service > 0 ? `${detailedRatings.service}/5` : ''}
              </span>
            </div>
            <div className={`relative ${starEffect.service ? 'animate-pulse' : ''}`}>
              <StarRatingComponent
                value={detailedRatings.service}
                onChange={(rating) => handleDetailedRatingChange('service', rating)}
                size="medium"
                readonly={readonly}
                showText={false}
                allowHalfStars={true}
                xiaomiStyle={true}
              />

              {/* Star effect overlay */}
              {starEffect.service && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] opacity-30 rounded-lg animate-ping"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-[#FF6B35] font-bold animate-bounce">✨</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Value Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {labels.value}
              </span>
              <span className="text-xs text-gray-400">
                {detailedRatings.value > 0 ? `${detailedRatings.value}/5` : ''}
              </span>
            </div>
            <div className={`relative ${starEffect.value ? 'animate-pulse' : ''}`}>
              <StarRatingComponent
                value={detailedRatings.value}
                onChange={(rating) => handleDetailedRatingChange('value', rating)}
                size="medium"
                readonly={readonly}
                showText={false}
                allowHalfStars={true}
                xiaomiStyle={true}
              />

              {starEffect.value && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] opacity-30 rounded-lg animate-ping"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-[#FF6B35] font-bold animate-bounce">✨</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Helpful tip */}
        {overallRating > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 leading-relaxed">
              💡 Detailed ratings help others understand your experience better
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedRatingComponent;
