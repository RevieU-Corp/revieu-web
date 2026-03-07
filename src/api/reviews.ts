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
}

export interface ReviewListResponse {
    data: ReviewResponse[];
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

interface BackendReviewListResponse {
    data: BackendReviewResponse[];
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
    list: async (): Promise<ReviewListResponse> => {
        const response = await apiClient.get<BackendReviewListResponse>('/reviews');
        return {
            data: response.data.data.map(mapReviewResponse),
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
