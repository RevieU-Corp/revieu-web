import React from 'react';
import { Star, ThumbsUp } from 'lucide-react';

interface ReviewCardProps {
  username: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  images?: string[];
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ 
  username, 
  avatar, 
  rating, 
  date, 
  comment, 
  helpful, 
  images 
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* User Info */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFA500] to-[#FF8C00] flex items-center justify-center text-xl">
            {avatar}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{username}</h4>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-1 bg-[#FFA500] px-2 py-1 rounded-lg">
          <Star className="w-4 h-4 fill-white text-white" />
          <span className="text-white font-bold text-sm">{rating}</span>
        </div>
      </div>

      {/* Review Images */}
      {images && images.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Review ${idx + 1}`}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* Comment */}
      <p className="text-gray-700 text-sm mb-3 leading-relaxed">
        {comment}
      </p>

      {/* Helpful Button */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <button className="flex items-center gap-1.5 text-gray-600 hover:text-[#FFA500] transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span className="text-xs font-medium">Helpful ({helpful})</span>
        </button>
      </div>
    </div>
  );
};