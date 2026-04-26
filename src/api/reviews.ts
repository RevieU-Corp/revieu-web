import { apiClient } from './apiClient';

// Request types
export interface CreateReviewRequest {
    merchantId: string;
    storeId?: string;
    venueId?: string;
    overallRating: number;
    detailedRatings?: {
        quality: number;
        environment: number;
        service: number;
    };
    text?: string;
    images?: string[];  // Array of R2 URLs
    tags?: string[];
    visitDate?: string;  // Format: YYYY-MM-DD
    locationVerified?: boolean;
}

// Response types
export interface ReviewResponse {
    id: string;
    merchantId: string;
    venueId?: string;
    storeId?: string;
    userId: string;
    overallRating: number;
    detailedRatings?: {
        quality: number;
        environment: number;
        service: number;
        value?: number;
    };
    text?: string;
    images: string[];
    tags: string[];
    visitDate?: string;
    createdAt: string;
    status?: string;
    businessName: string;
    businessImage: string;
    location: string;
    likeCount: number;
    commentCount?: number;
    isLiked?: boolean;
}

export interface StoreReviewResponse {
    id: string;
    merchantId: string;
    storeId: string;
    userId: string;
    overallRating: number;
    detailedRatings?: {
        quality: number;
        environment: number;
        service: number;
        value?: number;
    };
    text?: string;
    images: string[];
    tags: string[];
    visitDate?: string;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    isLiked?: boolean;
    username: string;
    avatarUrl: string;
}

export interface ReviewListResponse {
    data: ReviewResponse[];
    total: number;
    cursor?: string;
}

export interface StoreReviewListResponse {
    data: StoreReviewResponse[];
    cursor?: string;
}

export interface AiReviewCandidatesResponse {
    candidates: string[];
    // styleApplied is true when the polish call actually injected the user's saved
    // writing-style profile. Frontends use this to surface a "applied your writing
    // style" hint after the request returns.
    styleApplied: boolean;
}

interface BackendReviewResponse {
    id: string;
    merchantId: string;
    venueId?: string;
    storeId?: string;
    userId: string;
    rating: number;
    text?: string;
    images?: string[];
    tags?: string[];
    visitDate?: string;
    createdAt: string;
    status?: string;
    businessName: string;
    businessImage: string;
    location: string;
    likeCount: number;
}

interface BackendContentReviewItem {
    id: number;
    rating: number;
    rating_env?: number;
    rating_service?: number;
    rating_value?: number;
    content: string;
    images?: string[];
    avg_cost?: number;
    like_count: number;
    comment_count: number;
    is_liked: boolean;
    merchant: {
        id: number;
        name: string;
        category?: string;
    };
    tags?: string[];
    created_at: string;
}

interface BackendStoreReviewItem {
    id: number;
    user_id: number;
    merchant_id: number;
    store_id: number;
    rating: number;
    rating_food?: number;
    rating_env?: number;
    rating_service?: number;
    rating_value?: number;
    content: string;
    images?: string[] | string;
    tags?: string[] | string;
    visit_date?: string;
    like_count: number;
    comment_count: number;
    is_liked: boolean;
    created_at: string;
    user?: {
        id: number;
        profile?: {
            nickname?: string;
            avatar_url?: string;
        };
    };
}

interface BackendContentReviewListResponse {
    reviews: BackendContentReviewItem[];
    total: number;
    cursor?: number;
}

interface BackendStoreReviewListResponse {
    data: BackendStoreReviewItem[];
    cursor?: number;
}

interface BackendAiReviewCandidatesResponse {
    candidates?: string[];
    style_applied?: boolean;
}

export interface ReviewListRequest {
    cursor?: string;
    limit?: number;
}

function normalizeStringArray(value: string[] | string | undefined): string[] {
    if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === 'string');
    }

    if (typeof value !== 'string') {
        return [];
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return [];
    }

    try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
            return parsed.filter((item): item is string => typeof item === 'string');
        }
    } catch {
        return [value];
    }

    return [];
}

function mapReviewResponse(review: BackendReviewResponse): ReviewResponse {
    return {
        id: review.id,
        merchantId: review.merchantId,
        venueId: review.venueId,
        storeId: review.storeId,
        userId: review.userId,
        overallRating: review.rating,
        text: review.text,
        images: review.images ?? [],
        tags: review.tags ?? [],
        visitDate: review.visitDate,
        createdAt: review.createdAt,
        status: review.status,
        businessName: review.businessName,
        businessImage: review.businessImage,
        location: review.location,
        likeCount: review.likeCount,
    };
}

function mapStoreReviewResponse(review: BackendStoreReviewItem): StoreReviewResponse {
    return {
        id: String(review.id),
        merchantId: String(review.merchant_id),
        storeId: String(review.store_id),
        userId: String(review.user_id),
        overallRating: review.rating,
        detailedRatings: {
            quality: review.rating_food ?? review.rating,
            environment: review.rating_env ?? 0,
            service: review.rating_service ?? 0,
            value: review.rating_value ?? 0,
        },
        text: review.content,
        images: normalizeStringArray(review.images),
        tags: normalizeStringArray(review.tags),
        visitDate: review.visit_date,
        createdAt: review.created_at,
        likeCount: review.like_count,
        commentCount: review.comment_count,
        isLiked: review.is_liked,
        username: review.user?.profile?.nickname || `User ${review.user_id}`,
        avatarUrl: review.user?.profile?.avatar_url ?? '',
    };
}

/**
 * Reviews API service
 */
export const reviewsApi = {
    /**
     * Create a new review
     */
    create: async (request: CreateReviewRequest): Promise<ReviewResponse> => {
        const backendRequest = {
            merchantId: request.merchantId,
            storeId: request.storeId ?? request.venueId,
            rating: request.overallRating,
            text: request.text,
            images: request.images,
            tags: request.tags,
            visitDate: request.visitDate,
        };
        const response = await apiClient.post<BackendReviewResponse>('/reviews', backendRequest);
        return mapReviewResponse(response.data);
    },

    /**
     * Get user's reviews
     */
    list: async (request: ReviewListRequest = {}): Promise<ReviewListResponse> => {
        const response = await apiClient.get<BackendContentReviewListResponse>('/user/reviews', {
            params: {
                cursor: request.cursor,
                limit: request.limit,
            },
        });
        return {
            data: response.data.reviews.map((review) => ({
                id: String(review.id),
                merchantId: String(review.merchant.id),
                userId: '',
                overallRating: review.rating,
                detailedRatings: {
                    quality: review.rating_env ?? 0,
                    environment: review.rating_value ?? 0,
                    service: review.rating_service ?? 0,
                },
                text: review.content,
                images: normalizeStringArray(review.images),
                tags: normalizeStringArray(review.tags),
                createdAt: review.created_at,
                businessName: review.merchant.name,
                businessImage: '',
                location: '',
                likeCount: review.like_count,
                commentCount: review.comment_count,
                isLiked: review.is_liked,
            })),
            total: response.data.total,
            cursor: response.data.cursor !== undefined ? String(response.data.cursor) : undefined,
        };
    },

    listStoreReviews: async (storeId: string, request: ReviewListRequest = {}): Promise<StoreReviewListResponse> => {
        const response = await apiClient.get<BackendStoreReviewListResponse>(`/stores/${storeId}/reviews`, {
            params: {
                cursor: request.cursor,
                limit: request.limit,
            },
        });

        return {
            data: response.data.data.map(mapStoreReviewResponse),
            cursor: response.data.cursor !== undefined ? String(response.data.cursor) : undefined,
        };
    },

    generateAiReviewCandidates: async (formData: FormData): Promise<AiReviewCandidatesResponse> => {
        const response = await apiClient.post<BackendAiReviewCandidatesResponse>(
            '/ai/reviews/suggestions',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return {
            candidates: response.data.candidates ?? [],
            styleApplied: response.data.style_applied === true,
        };
    },

    /**
     * Get review by ID
     */
    getById: async (id: string): Promise<ReviewResponse> => {
        const response = await apiClient.get<BackendReviewResponse>(`/reviews/${id}`);
        return mapReviewResponse(response.data);
    },

    /**
     * Like a review
     */
    like: async (id: string): Promise<void> => {
        await apiClient.post(`/reviews/${id}/like`);
    },

    /**
     * Comment on a review
     */
    comment: async (id: string, text: string): Promise<void> => {
        await apiClient.post(`/reviews/${id}/comments`, { text });
    },
};

export default reviewsApi;
