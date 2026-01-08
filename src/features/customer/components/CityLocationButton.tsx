import React from 'react';
import { MapPin } from 'lucide-react';

export const CityLocationButton: React.FC = () => {
  const handleClick = () => {
    alert('此功能正在开发中');
  };

  return (
    <button 
      onClick={handleClick}
      className="w-8 h-8 bg-[#990000] rounded-full flex items-center justify-center text-white shadow-sm hover:bg-[#770000] transition-colors"
    >
      <MapPin className="w-5 h-5" />
    </button>
  );
};