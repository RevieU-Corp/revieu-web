import React from 'react';
import { SavedPlace } from '../types';

interface SavedPlaceCardProps {
  place: SavedPlace;
  onClick?: () => void;
}

export const SavedPlaceCard: React.FC<SavedPlaceCardProps> = ({ place, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="h-32 bg-gray-200">
        <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-bold text-gray-900 text-sm">{place.name}</h3>
        <p className="text-xs text-gray-500">{place.category}</p>
      </div>
    </div>
  );
};