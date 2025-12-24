import { Star } from "lucide-react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";

interface NearbyCardProps {
  image: string;
  name: string;
  rating: number;
  isOpen?: boolean;
  reviewCount: number;
  category: string;
  price: string;
  distance: string;
  tags?: string[];
}

export function NearbyCard({
  image,
  name,
  rating,
  isOpen,
  reviewCount,
  category,
  price,
  distance,
  tags
}: NearbyCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm flex gap-3 p-3">
      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="mb-1 truncate">{name}</h3>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Star className="w-3.5 h-3.5 fill-[#FFC72C] text-[#FFC72C]" />
          <span className="text-gray-700">{rating}</span>
          <span className="text-gray-500">({reviewCount})</span>
        </div>
        <div className="text-gray-600 mb-2">
          {category} · {price} · {distance}
        </div>
         <span className="text-gray-500">({reviewCount})</span>
        {isOpen && (
          <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            Open now
          </span>
        )}
        {tags && tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-[#990000] bg-red-50 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
