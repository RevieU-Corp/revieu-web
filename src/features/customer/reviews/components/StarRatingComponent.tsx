import React, { useState, useCallback, useMemo } from 'react';
import { Star } from 'lucide-react';

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

const StarRatingComponent: React.FC<StarRatingProps> = ({
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
    switch (size) {
      case 'compact':
        return {
          starSize: 'w-4 h-4',
          gap: 'gap-0.5',
          padding: 'p-0.5',
          textSize: 'text-xs',
        };
      case 'small':
        return {
          starSize: 'w-5 h-5',
          gap: 'gap-1',
          padding: 'p-0.5',
          textSize: 'text-xs',
        };
      case 'large':
        return {
          starSize: 'w-10 h-10',
          gap: 'gap-3',
          padding: 'p-2',
          textSize: 'text-lg',
        };
      default: // medium
        return {
          starSize: 'w-7 h-7',
          gap: 'gap-1.5',
          padding: 'p-1',
          textSize: 'text-sm',
        };
    }
  }, [size]);

  // Get star colors based on rating and Xiaomi style
  const getStarColors = useCallback((starIndex: number, currentValue: number) => {
    const isActive = currentValue >= starIndex;
    const isHalfActive = currentValue >= starIndex - 0.5 && currentValue < starIndex;
    
    if (!isActive && !isHalfActive) {
      return xiaomiStyle 
        ? 'text-gray-200 hover:text-gray-300' 
        : 'text-gray-300';
    }

    if (xiaomiStyle) {
      // Xiaomi style: Different colors for different ratings
      if (currentValue >= 4.5) {
        // 4.5-5 stars: Vibrant gold with gradient effect
        return 'text-[#FFD700] drop-shadow-sm';
      } else if (currentValue >= 3) {
        // 3-4.4 stars: Warm yellow-orange
        return 'text-[#FFA500]';
      } else {
        // Below 3 stars: Standard yellow
        return 'text-[#F4B400]';
      }
    } else {
      // Standard style
      return 'text-[#F4B400]';
    }
  }, [xiaomiStyle]);

  // Get fill colors
  const getFillColors = useCallback((starIndex: number, currentValue: number) => {
    const isActive = currentValue >= starIndex;
    const isHalfActive = currentValue >= starIndex - 0.5 && currentValue < starIndex;
    
    if (!isActive && !isHalfActive) {
      return '';
    }

    if (xiaomiStyle) {
      if (currentValue >= 4.5) {
        return 'fill-[#FFD700]';
      } else if (currentValue >= 3) {
        return 'fill-[#FFA500]';
      } else {
        return 'fill-[#F4B400]';
      }
    } else {
      return 'fill-[#F4B400]';
    }
  }, [xiaomiStyle]);

  // Get rating text based on value
  const getRatingText = useCallback((rating: number): string => {
    if (rating === 0) return '';
    if (rating <= 1) return 'Terrible';
    if (rating <= 2) return 'Poor';
    if (rating <= 3) return 'Average';
    if (rating <= 4) return 'Good';
    return 'Excellent';
  }, []);

  // Handle star click/hover
  const handleStarInteraction = useCallback((starIndex: number, isHalf: boolean = false) => {
    if (readonly) return;
    
    const newRating = allowHalfStars && isHalf ? starIndex - 0.5 : starIndex;
    onChange(newRating);
  }, [readonly, allowHalfStars, onChange]);

  const handleMouseEnter = useCallback((starIndex: number, isHalf: boolean = false) => {
    if (readonly) return;
    
    const hoverRating = allowHalfStars && isHalf ? starIndex - 0.5 : starIndex;
    setHoverValue(hoverRating);
  }, [readonly, allowHalfStars]);

  const handleMouseLeave = useCallback(() => {
    if (readonly) return;
    setHoverValue(null);
  }, [readonly]);

  // Determine the display value (hover takes precedence)
  const displayValue = hoverValue !== null ? hoverValue : value;

  // Generate stars
  const stars = useMemo(() => {
    const starElements = [];
    
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = displayValue >= i;
      const isHalfFilled = displayValue >= i - 0.5 && displayValue < i;
      
      starElements.push(
        <div key={i} className="relative">
          {allowHalfStars ? (
            // Half-star support: split each star into two clickable areas
            <div className="relative">
              {/* Left half */}
              <button
                type="button"
                disabled={readonly}
                className={`absolute left-0 top-0 w-1/2 h-full z-10 ${
                  readonly ? 'cursor-default' : 'cursor-pointer'
                }`}
                onClick={() => handleStarInteraction(i, true)}
                onMouseEnter={() => handleMouseEnter(i, true)}
                onMouseLeave={handleMouseLeave}
                aria-label={`Rate ${i - 0.5} stars`}
              />
              
              {/* Right half */}
              <button
                type="button"
                disabled={readonly}
                className={`absolute right-0 top-0 w-1/2 h-full z-10 ${
                  readonly ? 'cursor-default' : 'cursor-pointer'
                }`}
                onClick={() => handleStarInteraction(i, false)}
                onMouseEnter={() => handleMouseEnter(i, false)}
                onMouseLeave={handleMouseLeave}
                aria-label={`Rate ${i} stars`}
              />
              
              {/* Star visual */}
              <div className={`${sizeConfig.padding} transition-all duration-300 ${
                !readonly && hoverValue !== null ? 'scale-110' : ''
              } ${xiaomiStyle ? 'hover:scale-105' : ''}`}>
                <div className="relative">
                  {/* Background star (gray) */}
                  <Star className={`${sizeConfig.starSize} ${
                    xiaomiStyle ? 'text-gray-200' : 'text-gray-300'
                  } transition-colors duration-200`} />
                  
                  {/* Filled portion */}
                  <div 
                    className="absolute top-0 left-0 overflow-hidden transition-all duration-300"
                    style={{
                      width: isFilled ? '100%' : isHalfFilled ? '50%' : '0%'
                    }}
                  >
                    <Star className={`${sizeConfig.starSize} ${getFillColors(i, displayValue)} ${getStarColors(i, displayValue)} transition-all duration-300 ${
                      xiaomiStyle && displayValue >= 4.5 ? 'filter drop-shadow-sm' : ''
                    }`} />
                  </div>
                  
                  {/* Xiaomi style glow effect for high ratings */}
                  {xiaomiStyle && displayValue >= 4.5 && (isFilled || isHalfFilled) && (
                    <div className="absolute inset-0 pointer-events-none">
                      <Star className={`${sizeConfig.starSize} text-[#FFD700] opacity-30 blur-sm animate-pulse`} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Simple full-star support
            <button
              type="button"
              disabled={readonly}
              className={`${sizeConfig.padding} transition-all duration-300 ${
                readonly ? 'cursor-default' : `cursor-pointer ${xiaomiStyle ? 'hover:scale-105' : 'hover:scale-110'}`
              }`}
              onClick={() => handleStarInteraction(i, false)}
              onMouseEnter={() => handleMouseEnter(i, false)}
              onMouseLeave={handleMouseLeave}
              aria-label={`Rate ${i} stars`}
            >
              <div className="relative">
                <Star
                  className={`${sizeConfig.starSize} ${
                    isFilled
                      ? `${getFillColors(i, displayValue)} ${getStarColors(i, displayValue)}`
                      : xiaomiStyle ? 'text-gray-200' : 'text-gray-300'
                  } transition-all duration-300 ${
                    xiaomiStyle && displayValue >= 4.5 && isFilled ? 'filter drop-shadow-sm' : ''
                  }`}
                />
                
                {/* Xiaomi style glow effect for high ratings */}
                {xiaomiStyle && displayValue >= 4.5 && isFilled && (
                  <div className="absolute inset-0 pointer-events-none">
                    <Star className={`${sizeConfig.starSize} text-[#FFD700] opacity-30 blur-sm animate-pulse`} />
                  </div>
                )}
              </div>
            </button>
          )}
        </div>
      );
    }
    
    return starElements;
  }, [
    maxRating,
    displayValue,
    allowHalfStars,
    readonly,
    sizeConfig,
    xiaomiStyle,
    handleStarInteraction,
    handleMouseEnter,
    handleMouseLeave,
    getStarColors,
    getFillColors,
  ]);

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Stars container */}
      <div className={`flex items-center ${sizeConfig.gap} ${
        xiaomiStyle ? 'p-1 rounded-lg' : ''
      }`}>
        {stars}
      </div>
      
      {/* Rating text */}
      {showText && displayValue > 0 && (
        <p className={`${sizeConfig.textSize} ${
          xiaomiStyle 
            ? displayValue >= 4.5 
              ? 'text-[#FFD700] font-semibold' 
              : displayValue >= 3 
                ? 'text-[#FFA500] font-medium' 
                : 'text-gray-600 font-medium'
            : 'text-gray-600 font-medium'
        } mt-2 transition-colors duration-300`}>
          {getRatingText(displayValue)} ({displayValue.toFixed(allowHalfStars ? 1 : 0)}/5)
        </p>
      )}
      
      {/* Accessibility: Screen reader support */}
      <div className="sr-only" aria-live="polite">
        Current rating: {displayValue} out of {maxRating} stars
      </div>
    </div>
  );
};

export default StarRatingComponent;