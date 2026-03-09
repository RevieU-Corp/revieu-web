import React from 'react';
import { Review } from '../types';
import { Icons } from './Icons';
import { ImageWithFallback } from '../../../../components/common';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06)] group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3.5">
          <ImageWithFallback
            src={review.businessImage} 
            alt={review.businessName} 
            className="w-11 h-11 rounded-xl object-cover bg-gray-50 ring-1 ring-black/5"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-bold text-gray-900 text-[15px] leading-tight group-hover:text-brand-red transition-colors">{review.businessName}</h3>
            <div className="flex items-center gap-2 mt-1">
                 <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icons.Star 
                      key={star} 
                      size={12} 
                      className={`${star <= review.rating ? 'fill-brand-gold text-brand-gold' : 'text-gray-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400 font-medium">• {review.date}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-300 hover:text-gray-600 p-1">
          <Icons.More size={18} />
        </button>
      </div>

      <p className="text-gray-700 text-[15px] leading-relaxed mb-4 font-normal line-clamp-3">
        {review.content}
      </p>

      {review.images.length > 0 && (
        <div className="flex gap-2.5 mb-5 overflow-hidden">
          {review.images.map((img, idx) => (
            <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                <ImageWithFallback
                src={img}
                alt="Attachment"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                />
            </div>
          ))}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
        <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-1.5 -ml-3 rounded-lg transition-colors">
          <Icons.ThumbsUp size={16} />
          <span>Helpful</span>
          {review.helpfulCount > 0 && <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-600 ml-1">{review.helpfulCount}</span>}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
           <Icons.MessageSquare size={16} />
           <span>Comment</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
