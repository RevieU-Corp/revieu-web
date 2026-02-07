import { apiClient } from './apiClient';

// Request types
export interface CreateReviewRequest {
    merchantId: string;
    overallRating: number;
    detailedRatings?: {
        quality: number;
        environment: number;
        service: number;
    };
    text?: string;
    images?: string[];  // Array of R2 URLs
    tags?: string[];
    locationVerified?: boolean;
}

// Response types
export interface ReviewResponse {
    id: string;
    merchantId: string;
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
    createdAt: string;
    status?: string;
}

export interface ReviewListResponse {
    data: ReviewResponse[];
}

/**
 * Reviews API service
 */
export const reviewsApi = {
    /**
     * Create a new review
     */
    create: async (request: CreateReviewRequest): Promise<ReviewResponse> => {
        // Transform to backend format (rating instead of overallRating)
        const backendRequest = {
            merchantId: request.merchantId,
            rating: request.overallRating,
            text: request.text,
            images: request.images,
            tags: request.tags,
        };
        const response = await apiClient.post<ReviewResponse>('/reviews', backendRequest);
        return response.data;
    },

    /**
     * Get user's reviews
     */
    list: async (): Promise<ReviewListResponse> => {
        const response = await apiClient.get<ReviewListResponse>('/reviews');
        return response.data;
    },

    /**
     * Get review by ID
     */
    getById: async (id: string): Promise<ReviewResponse> => {
        const response = await apiClient.get<ReviewResponse>(`/reviews/${id}`);
        return response.data;
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
