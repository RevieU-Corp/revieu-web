import { Star, ThumbsUp } from 'lucide-react';

interface ReviewListCardProps {
  username: string;
  avatar: string;
  rating: number;
  tasteScore: number;
  envScore: number;
  serviceScore: number;
  date: string;
  comment: string;
  tags: string[];
  images?: string[];
  helpful: number;
}

export function ReviewListCard({
  username,
  avatar,
  rating,
  tasteScore,
  envScore,
  serviceScore,
  date,
  comment,
  tags,
  images,
  helpful
}: ReviewListCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFA500] to-[#FF8C00] flex items-center justify-center text-xl flex-shrink-0">
            {avatar}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{username}</h4>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-[#FFA500] text-[#FFA500]'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Individual Scores */}
      <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
        <span className="font-medium">Taste {tasteScore.toFixed(1)}</span>
        <span className="text-gray-300">•</span>
        <span className="font-medium">Env {envScore.toFixed(1)}</span>
        <span className="text-gray-300">•</span>
        <span className="font-medium">Service {serviceScore.toFixed(1)}</span>
      </div>

      {/* Comment */}
      <p className="text-gray-700 text-sm leading-relaxed mb-3">{comment}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-[#FFA500]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Images Grid */}
      {images && images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {images.map((img, idx) => (
            <div key={idx} className="aspect-square rounded-xl overflow-hidden">
              <img
                src={img}
                alt={`Review ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Helpful Button */}
      <div className="pt-3 border-t border-gray-100">
        <button className="flex items-center gap-2 text-gray-600 hover:text-[#FFA500] transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span className="text-xs font-medium">Helpful ({helpful})</span>
        </button>
      </div>
    </div>
  );
}