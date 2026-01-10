import React, { useState, useCallback, useMemo } from 'react';
import { Star } from 'lucide-react';

// ============================================================================
// STAR RATING COMPONENT
// ============================================================================

export interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'small' | 'medium' | 'large' | 'compact';
  readonly?: boolean;
  showText?: boolean;
  maxRating?: number;
  allowHalfStars?: boolean;
  xiaomiStyle?: boolean;
  className?: string;
}

export const StarRatingComponent: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 'medium',
  readonly = false,
  showText = true,
  maxRating = 5,
  allowHalfStars = true,
  xiaomiStyle = false,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  // Size configurations
  const sizeConfig = useMemo(() => {
    const configs = {
      small: { starSize: 'w-4 h-4', textSize: 'text-sm', spacing: 'space-x-1' },
      medium: { starSize: 'w-5 h-5', textSize: 'text-base', spacing: 'space-x-1' },
      large: { starSize: 'w-6 h-6', textSize: 'text-lg', spacing: 'space-x-2' },
      compact: { starSize: 'w-3 h-3', textSize: 'text-xs', spacing: 'space-x-0.5' },
    };
    return configs[size];
  }, [size]);

  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleStarClick = useCallback((rating: number) => {
    if (!readonly) {
      onChange(rating);
    }
  }, [readonly, onChange]);

  const handleStarHover = useCallback((rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  }, [readonly]);

  const handleMouseLeave = useCallback(() => {
    if (!readonly) {
      setHoverValue(null);
    }
  }, [readonly]);

  const getStarColor = (starIndex: number, currentValue: number) => {
    if (xiaomiStyle && currentValue >= 3) {
      return starIndex <= currentValue ? 'text-[#FFD700]' : 'text-gray-300';
    }
    return starIndex <= currentValue ? 'text-[#FFD700]' : 'text-gray-300';
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= displayValue;
      const isHalfFilled = allowHalfStars && i - 0.5 === displayValue;
      
      stars.push(
        <button
          key={i}
          type="button"
          className={`${sizeConfig.starSize} transition-all duration-200 ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } ${getStarColor(i, displayValue)}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          disabled={readonly}
        >
          <Star
            className={`w-full h-full ${
              isFilled || isHalfFilled ? 'fill-current' : ''
            }`}
          />
        </button>
      );
    }
    return stars;
  };

  return (
    <div className={`flex items-center ${sizeConfig.spacing} ${className}`} onMouseLeave={handleMouseLeave}>
      <div className={`flex items-center ${sizeConfig.spacing}`}>
        {renderStars()}
      </div>
      {showText && (
        <span className={`ml-2 font-medium text-gray-700 ${sizeConfig.textSize}`}>
          {displayValue.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// ============================================================================
// DETAILED RATINGS COMPONENT
// ============================================================================

export interface DetailedRatingsProps {
  ratings: {
    quality: number;
    environment: number;
    service: number;
  };
  onChange: (type: 'quality' | 'environment' | 'service', rating: number) => void;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const DetailedRatingsComponent: React.FC<DetailedRatingsProps> = ({
  ratings,
  onChange,
  readonly = false,
  size = 'medium',
  className = '',
}) => {
  const ratingLabels = {
    quality: 'Quality',
    environment: 'Environment', 
    service: 'Service',
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {Object.entries(ratings).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 w-20">
            {ratingLabels[key as keyof typeof ratingLabels]}
          </span>
          <div className="flex-1 ml-3">
            <StarRatingComponent
              value={value}
              onChange={(rating) => onChange(key as 'quality' | 'environment' | 'service', rating)}
              size={size}
              readonly={readonly}
              showText={false}
              maxRating={5}
              allowHalfStars={true}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// COMBINED RATING COMPONENT
// ============================================================================

export interface CombinedRatingProps {
  overallRating: number;
  detailedRatings: {
    quality: number;
    environment: number;
    service: number;
  };
  onOverallRatingChange: (rating: number) => void;
  onDetailedRatingChange: (type: 'quality' | 'environment' | 'service', rating: number) => void;
  readonly?: boolean;
  showDetailedRatings?: boolean;
  className?: string;
}

export const CombinedRatingComponent: React.FC<CombinedRatingProps> = ({
  overallRating,
  detailedRatings,
  onOverallRatingChange,
  onDetailedRatingChange,
  readonly = false,
  showDetailedRatings = true,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Rating */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-1 h-5 bg-gradient-to-b from-[#990000] to-[#FFD700] rounded-full"></div>
          <label className="text-sm font-medium text-gray-700">Overall Rating</label>
        </div>
        <div className="flex items-center justify-center py-2">
          <StarRatingComponent
            value={overallRating}
            onChange={onOverallRatingChange}
            size="large"
            readonly={readonly}
            showText={true}
            xiaomiStyle={true}
          />
        </div>
      </div>

      {/* Detailed Ratings */}
      {showDetailedRatings && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-1 h-5 bg-gradient-to-b from-[#990000] to-[#FFD700] rounded-full"></div>
            <label className="text-sm font-medium text-gray-700">Detailed Ratings</label>
          </div>
          <DetailedRatingsComponent
            ratings={detailedRatings}
            onChange={onDetailedRatingChange}
            readonly={readonly}
            size="medium"
          />
        </div>
      )}
    </div>
  );
};