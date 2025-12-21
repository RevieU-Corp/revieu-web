import { Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ShopCardProps {
  image: string;
  name: string;
  rating: number;
  distance: string;
  price: string;
}

export function ShopCard({ image, name, rating, distance, price }: ShopCardProps) {
  return (
    <div className="flex-shrink-0 w-40 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="relative h-32 w-full overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="truncate mb-1">{name}</h3>
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-3.5 h-3.5 fill-[#FFC72C] text-[#FFC72C]" />
          <span className="text-gray-700">{rating}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <span>{distance}</span>
          <span>·</span>
          <span>{price}</span>
        </div>
      </div>
    </div>
  );
}
