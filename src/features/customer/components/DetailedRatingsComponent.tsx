import React from 'react';
import StarRatingComponent from '../../reviews/components/StarRatingComponent';
import { BusinessCategory } from '../types';

export interface DetailedRatingsProps {
  overallRating: number;
  detailedRatings: {
    quality: number;
    environment: number;
    service: number;
  };
  businessCategory: BusinessCategory;
  onOverallRatingChange: (rating: number) => void;
  onDetailedRatingChange: (type: 'quality' | 'environment' | 'service', rating: number) => void;
  readonly?: boolean;
  className?: string;
}

const DetailedRatingsComponent: React.FC<DetailedRatingsProps> = ({
  overallRating,
  detailedRatings,
  businessCategory,
  onOverallRatingChange,
  onDetailedRatingChange,
  readonly = false,
  className = '',
}) => {
  // Get category-specific labels
  const getCategoryLabels = (category: BusinessCategory) => {
    switch (category) {
      case BusinessCategory.RESTAURANT:
        return {
          quality: 'Taste/Quality',
          environment: 'Environment',
          service: 'Service',
        };
      case BusinessCategory.HOTEL:
        return {
          quality: 'Room Quality',
          environment: 'Facilities',
          service: 'Service',
        };
      case BusinessCategory.RETAIL:
        return {
          quality: 'Product Quality',
          environment: 'Store Environment',
          service: 'Customer Service',
        };
      case BusinessCategory.SERVICE:
        return {
          quality: 'Service Quality',
          environment: 'Environment',
          service: 'Customer Care',
        };
      case BusinessCategory.ENTERTAINMENT:
        return {
          quality: 'Experience Quality',
          environment: 'Venue/Atmosphere',
          service: 'Staff Service',
        };
      default:
        return {
          quality: 'Quality',
          environment: 'Environment',
          service: 'Service',
        };
    }
  };

  const labels = getCategoryLabels(businessCategory);

  // Auto-suggest detailed ratings based on overall rating
  const handleOverallRatingChange = (rating: number) => {
    onOverallRatingChange(rating);
    
    // Auto-suggest similar values for detailed ratings if they're not set
    if (detailedRatings.quality === 0 && detailedRatings.environment === 0 && detailedRatings.service === 0) {
      // Add slight variation to make it feel more natural
      const variation = 0.5;
      const qualityRating = Math.max(0.5, Math.min(5, rating + (Math.random() - 0.5) * variation));
      const environmentRating = Math.max(0.5, Math.min(5, rating + (Math.random() - 0.5) * variation));
      const serviceRating = Math.max(0.5, Math.min(5, rating + (Math.random() - 0.5) * variation));
      
      onDetailedRatingChange('quality', Math.round(qualityRating * 2) / 2); // Round to nearest 0.5
      onDetailedRatingChange('environment', Math.round(environmentRating * 2) / 2);
      onDetailedRatingChange('service', Math.round(serviceRating * 2) / 2);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Rating */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Overall Rating
        </label>
        <StarRatingComponent
          value={overallRating}
          onChange={handleOverallRatingChange}
          size="large"
          readonly={readonly}
          showText={true}
          allowHalfStars={true}
        />
      </div>

      {/* Detailed Ratings */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Detailed Ratings
        </label>
        
        <div className="space-y-4">
          {/* Quality Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 min-w-[120px]">
              {labels.quality}
            </span>
            <div className="flex-1 ml-4">
              <StarRatingComponent
                value={detailedRatings.quality}
                onChange={(rating) => onDetailedRatingChange('quality', rating)}
                size="medium"
                readonly={readonly}
                showText={false}
                allowHalfStars={true}
              />
            </div>
          </div>

          {/* Environment Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 min-w-[120px]">
              {labels.environment}
            </span>
            <div className="flex-1 ml-4">
              <StarRatingComponent
                value={detailedRatings.environment}
                onChange={(rating) => onDetailedRatingChange('environment', rating)}
                size="medium"
                readonly={readonly}
                showText={false}
                allowHalfStars={true}
              />
            </div>
          </div>

          {/* Service Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 min-w-[120px]">
              {labels.service}
            </span>
            <div className="flex-1 ml-4">
              <StarRatingComponent
                value={detailedRatings.service}
                onChange={(rating) => onDetailedRatingChange('service', rating)}
                size="medium"
                readonly={readonly}
                showText={false}
                allowHalfStars={true}
              />
            </div>
          </div>
        </div>

        {/* Average calculation info */}
        {(detailedRatings.quality > 0 || detailedRatings.environment > 0 || detailedRatings.service > 0) && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">
              Detailed ratings help provide more specific feedback. Your overall rating can be different from the average of detailed ratings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedRatingsComponent;