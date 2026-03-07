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

export interface ReviewListResponse {
    data: ReviewResponse[];
    total: number;
    cursor?: string;
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

interface BackendContentReviewListResponse {
    reviews: BackendContentReviewItem[];
    total: number;
    cursor?: number;
}

export interface ReviewListRequest {
    cursor?: string;
    limit?: number;
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
                images: review.images ?? [],
                tags: review.tags ?? [],
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
