import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../../api/apiClient';
import { reviewsApi, StoreReviewResponse } from '../../../../api/reviews';
import { MerchantReviewListItem, MerchantReviewSummary, ReviewListPage } from './components/ReviewListPage';

const REVIEW_PAGE_SIZE = 20;

interface BackendStoreDetail {
  id: number;
  merchant_id: number;
  name: string;
  avg_rating?: number | null;
  review_count?: number | null;
}

interface StoreSummary {
  name: string;
  avgRating: number;
  reviewCount: number;
}

function mapStoreSummary(raw: BackendStoreDetail): StoreSummary {
  return {
    name: raw.name,
    avgRating: raw.avg_rating ?? 0,
    reviewCount: raw.review_count ?? 0,
  };
}

function formatReviewDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Recently';
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getAvatarLabel(username: string): string {
  const trimmed = username.trim();
  if (!trimmed) {
    return 'R';
  }

  return trimmed.charAt(0).toUpperCase();
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function mapReviewsToCards(reviews: StoreReviewResponse[]): MerchantReviewListItem[] {
  return reviews.map((review) => ({
    id: review.id,
    username: review.username,
    avatarLabel: getAvatarLabel(review.username),
    rating: Math.round(review.overallRating),
    tasteScore: review.detailedRatings?.quality ?? review.overallRating,
    envScore: review.detailedRatings?.environment ?? review.overallRating,
    serviceScore: review.detailedRatings?.service ?? review.overallRating,
    date: formatReviewDate(review.createdAt),
    comment: review.text ?? '',
    tags: review.tags,
    images: review.images,
    helpful: review.likeCount,
  }));
}

function buildSummary(store: StoreSummary | null, reviews: StoreReviewResponse[]): MerchantReviewSummary {
  const tasteValues = reviews
    .map((review) => review.detailedRatings?.quality)
    .filter((value): value is number => typeof value === 'number' && value > 0);
  const envValues = reviews
    .map((review) => review.detailedRatings?.environment)
    .filter((value): value is number => typeof value === 'number' && value > 0);
  const serviceValues = reviews
    .map((review) => review.detailedRatings?.service)
    .filter((value): value is number => typeof value === 'number' && value > 0);
  const overallRatings = reviews
    .map((review) => review.overallRating)
    .filter((value): value is number => typeof value === 'number' && value > 0);

  return {
    storeName: store?.name ?? 'Store Reviews',
    overallRating: store?.avgRating || average(overallRatings),
    reviewCount: store?.reviewCount ?? reviews.length,
    tasteScore: average(tasteValues) || store?.avgRating || 0,
    envScore: average(envValues) || store?.avgRating || 0,
    serviceScore: average(serviceValues) || store?.avgRating || 0,
  };
}

const MerchantReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<StoreSummary | null>(null);
  const [reviews, setReviews] = useState<StoreReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPage = async () => {
      if (!id) {
        setError('Store id is missing.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const [storeResult, reviewsResult] = await Promise.allSettled([
        apiClient.get<{ data: BackendStoreDetail }>(`/stores/${id}`),
        reviewsApi.listStoreReviews(id, { limit: REVIEW_PAGE_SIZE }),
      ]);

      if (cancelled) {
        return;
      }

      if (storeResult.status === 'fulfilled') {
        setStore(mapStoreSummary(storeResult.value.data.data));
      }

      if (reviewsResult.status === 'fulfilled') {
        setReviews(reviewsResult.value.data);
      } else {
        setReviews([]);
        setError('Failed to load reviews.');
      }

      setIsLoading(false);
    };

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const summary = useMemo(() => buildSummary(store, reviews), [reviews, store]);
  const reviewCards = useMemo(() => mapReviewsToCards(reviews), [reviews]);

  return (
    <ReviewListPage
      onBack={handleBack}
      summary={summary}
      reviews={reviewCards}
      isLoading={isLoading}
      error={error}
      emptyMessage="No reviews for this store yet."
    />
  );
};

export default MerchantReviewsPage;
