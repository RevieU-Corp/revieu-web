import React from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { ImageWithFallback } from '../../../../components/common';
import { ExploreSuggestion } from '../types';

interface SuggestionItemProps {
  suggestion: ExploreSuggestion;
  onSelect: (suggestion: ExploreSuggestion) => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({ suggestion, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(suggestion)}
      className="w-full flex items-center gap-3 text-left"
      aria-label={`Open merchant profile for ${suggestion.name}`}
    >
      <ImageWithFallback
        src={suggestion.imageUrl}
        alt={suggestion.name}
        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-[21px] leading-[1.2] text-[#222222] font-medium truncate">{suggestion.name}</h4>
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="w-3.5 h-3.5 fill-[#f7b500] text-[#f7b500]" />
          ))}
          <span className="text-[#8a8896] text-sm ml-1">
            {suggestion.rating.toFixed(2)}-{suggestion.distanceMiles.toFixed(2)} miles
          </span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-[#9b0d0d] flex-shrink-0" />
    </button>
  );
};

export default SuggestionItem;
