import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { ReviewListCard } from './ReviewListCard';

export interface MerchantReviewListItem {
  id: string;
  username: string;
  avatarLabel: string;
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

export interface MerchantReviewSummary {
  storeName: string;
  overallRating: number;
  reviewCount: number;
  tasteScore: number;
  envScore: number;
  serviceScore: number;
}

interface ReviewListPageProps {
  onBack?: () => void;
  summary: MerchantReviewSummary;
  reviews: MerchantReviewListItem[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

export function ReviewListPage({
  onBack,
  summary,
  reviews,
  isLoading = false,
  error = null,
  emptyMessage = 'No reviews yet.',
}: ReviewListPageProps) {
  const filters = useMemo(() => {
    const tagSet = new Set<string>();
    reviews.forEach((review) => {
      review.tags.forEach((tag) => {
        if (tag) {
          tagSet.add(tag);
        }
      });
    });

    return ['All', ...Array.from(tagSet)];
  }, [reviews]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    setActiveFilter('All');
  }, [filters.join('|'), summary.storeName]);

  const filteredReviews = useMemo(() => {
    if (activeFilter === 'All') {
      return reviews;
    }

    return reviews.filter((review) => review.tags.includes(activeFilter));
  }, [activeFilter, reviews]);

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="flex h-14 items-center px-4">
          <button type="button" onClick={onBack} className="mr-3">
            <ArrowLeft className="h-6 w-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Reviews</h1>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div
              className="h-6 w-1 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #FFA500 0%, #DC2626 100%)',
              }}
            />
            <h2 className="text-lg font-bold text-gray-900">Overall Rating</h2>
          </div>
          <p className="mb-4 text-sm font-medium text-gray-500">{summary.storeName}</p>

          <div className="flex items-start gap-6">
            <div className="text-center">
              <div className="mb-1 text-5xl font-bold text-gray-900">{summary.overallRating.toFixed(1)}</div>
              <div className="mb-1 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(summary.overallRating)
                        ? 'fill-[#FFA500] text-[#FFA500]'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">{summary.reviewCount} reviews</p>
            </div>

            <div className="flex-1 space-y-3">
              {[
                { label: 'Taste', score: summary.tasteScore },
                { label: 'Environment', score: summary.envScore },
                { label: 'Service', score: summary.serviceScore },
              ].map(({ label, score }) => {
                const width = `${Math.max(0, Math.min(100, Math.round((score / 5) * 100)))}%`;

                return (
                  <div key={label}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <span className="text-sm font-bold text-gray-900">{score.toFixed(1)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width,
                          background: 'linear-gradient(90deg, #FFA500 0%, #FF8C00 100%)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {filters.length > 1 && (
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'border-2 border-[#FFA500] bg-orange-50 text-[#FFA500]'
                    : 'border border-gray-200 bg-gray-50 text-gray-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
            Loading reviews...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        {!isLoading && !error && filteredReviews.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
            {emptyMessage}
          </div>
        )}

        {!isLoading && !error && filteredReviews.length > 0 && (
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <ReviewListCard
                key={review.id}
                username={review.username}
                avatar={review.avatarLabel}
                rating={review.rating}
                tasteScore={review.tasteScore}
                envScore={review.envScore}
                serviceScore={review.serviceScore}
                date={review.date}
                comment={review.comment}
                tags={review.tags}
                images={review.images}
                helpful={review.helpful}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
