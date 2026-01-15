import { Star, Heart } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface PopDishCardProps {
  image: string;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  likes: number;
  description?: string;
}

export function PopDishCard({ image, name, price, rating, reviews, likes, description }: PopDishCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100">
      {/* Dish Image */}
      <div className="relative h-40 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Popular Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <Star className="w-3 h-3 fill-white" />
          Popular
        </div>
        {/* Like Button */}
        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all group">
          <Heart className="w-5 h-5 text-red-500 group-hover:fill-red-500 transition-all" />
        </button>
      </div>
      {/* Dish Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-base text-gray-900 flex-1">{name}</h3>
          <div className="text-[#FFA500] font-bold text-lg ml-2">${price}</div>
        </div>
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}
        {/* Rating and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#FFA500]/10 px-2 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-[#FFA500] text-[#FFA500]" />
              <span className="text-sm font-semibold text-gray-900">{rating}</span>
            </div>
            <span className="text-xs text-gray-500">({reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Heart className="w-4 h-4" />
            <span className="text-xs">{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}