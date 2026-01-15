import { ImageWithFallback } from './ImageWithFallback';

interface MealDealCardProps {
  image: string;
  title: string;
  price: string;
  oldPrice?: string;
  description?: string;
}

export function DealsSection({ image, title, price, oldPrice, description }: MealDealCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      <div className="flex gap-4 p-3">
        {/* Left: Food Photo */}
        <div className="w-24 h-24 flex-shrink-0">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        {/* Right: Information */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Title */}
          <div>
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{title}</h3>
            {description && (
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">{description}</p>
            )}
          </div>
          {/* Price and Button */}
          <div className="flex items-end justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-red-600">¥{price}</span>
              {oldPrice && (
                <span className="text-sm text-gray-400 line-through">¥{oldPrice}</span>
              )}
            </div>
            <button className="bg-[#FFA500] hover:bg-[#FF8C00] active:scale-95 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm">
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}