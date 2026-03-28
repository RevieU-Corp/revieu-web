import { GoogleGenerativeAI } from "@google/generative-ai";
import { apiClient } from '../../../../api/apiClient';
import { reviewsApi } from '../../../../api/reviews';
import { storeBrowserService } from '../../shared/services/storeBrowserService';
import { PendingReviewMerchant, UserProfile } from '../types';

// TODO: Move API key to environment variable for security
const genAI = new GoogleGenerativeAI('AIzaSyDCInZ57xrv6hpYu-oGqPfm0wa8zEHYYBM');

type BackendOrder = {
  id: number | string;
  merchant_id?: number | string | null;
  store_id?: number | string | null;
  status?: string;
  created_at?: string | null;
  coupon?: {
    title?: string | null;
  };
};

const DEFAULT_BUSINESS_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400';

/**
 * Generates a creative bio for the user using Google's Gemini AI
 * @param user - The user profile to generate bio for
 * @param interests - Array of user interests to incorporate
 * @returns A creative bio string (max 60 characters)
 */
export const generateCreativeBio = async (
  user: UserProfile,
  interests: string[]
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Generate a short, engaging bio (max 60 characters) for a user on a local review platform called RevieU.

User: ${user.name}
Location: ${user.location}
Level: ${user.level}
Reviews: ${user.stats.totalReviews}
Current bio: ${user.bio}
Interests: ${interests.join(', ')}

Requirements:
- Max 60 characters
- Include 1-3 relevant emojis
- Natural and authentic tone
- Capture local explorer spirit

Return ONLY the bio text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedBio = response.text().trim();

    // Ensure max 60 characters
    return generatedBio.length > 60
      ? generatedBio.substring(0, 57) + '...'
      : generatedBio;

  } catch (error) {
    console.error('Failed to generate bio:', error);
    // Fallback to original bio on error
    return user.bio;
  }
};

async function fetchPendingReviewMerchantsFromApi(): Promise<PendingReviewMerchant[]> {
  const [ordersResponse, reviewsResponse, stores] = await Promise.all([
    apiClient.get<{ data: BackendOrder[] }>('/orders'),
    reviewsApi.list({ limit: 100 }),
    storeBrowserService.listStores(100),
  ]);

  const reviewedMerchantIds = new Set(
    reviewsResponse.data.map((review) => review.merchantId)
  );
  const reviewedStoreIds = new Set(
    reviewsResponse.data
      .map((review) => review.storeId)
      .filter((storeId): storeId is string => Boolean(storeId))
  );
  const storeById = new Map(stores.map((store) => [store.id, store]));
  const latestPendingByStore = new Map<string, PendingReviewMerchant>();
  const orders = (ordersResponse.data?.data ?? []).filter((order) => order.status === 'paid');

  const sortedOrders = [...orders].sort((left, right) => {
    const leftTime = new Date(left.created_at ?? '').getTime();
    const rightTime = new Date(right.created_at ?? '').getTime();
    return rightTime - leftTime;
  });

  sortedOrders.forEach((order) => {
    const merchantId =
      order.merchant_id !== null && order.merchant_id !== undefined
        ? String(order.merchant_id)
        : '';
    const storeId =
      order.store_id !== null && order.store_id !== undefined
        ? String(order.store_id)
        : merchantId;

    if (!storeId || latestPendingByStore.has(storeId)) {
      return;
    }

    if ((merchantId && reviewedMerchantIds.has(merchantId)) || reviewedStoreIds.has(storeId)) {
      return;
    }

    const store = storeById.get(storeId);
    latestPendingByStore.set(storeId, {
      id: storeId,
      businessName: store?.name || `Merchant ${merchantId || storeId}`,
      businessImage: store?.image || DEFAULT_BUSINESS_IMAGE,
      lastVisitedAt: formatLastVisitedAt(order.created_at),
      lastOrderItems: [order.coupon?.title || 'Completed order'],
    });
  });

  return Array.from(latestPendingByStore.values());
}

export const getLatestVisitedMerchantsWithoutReview = async (): Promise<PendingReviewMerchant[]> => {
  return fetchPendingReviewMerchantsFromApi();
};

const formatLastVisitedAt = (dateString?: string | null): string => {
  if (!dateString) {
    return 'Recently';
  }

  const visitedAt = new Date(dateString);
  if (Number.isNaN(visitedAt.getTime())) {
    return 'Recently';
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfVisitedDay = new Date(
    visitedAt.getFullYear(),
    visitedAt.getMonth(),
    visitedAt.getDate()
  );
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfVisitedDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) {
    return 'Today';
  }

  if (diffDays === 1) {
    return 'Yesterday';
  }

  return visitedAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
