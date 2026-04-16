import { apiClient } from './apiClient';

export interface MerchantListItem {
    id: string;
    name: string;
    businessName: string;
    category: string;
    rating: number;
    reviewCount: number;
    coverImage: string;
}

interface MerchantListParams {
    search?: string;
    category?: string;
}

interface BackendMerchantListResponse {
    data: MerchantListItem[];
}

export const merchantsApi = {
    list: async (params: MerchantListParams = {}): Promise<MerchantListItem[]> => {
        const response = await apiClient.get<BackendMerchantListResponse>('/merchants', { params });
        return response.data.data;
    },

    getById: async (id: string): Promise<MerchantListItem> => {
        const response = await apiClient.get<MerchantListItem>(`/merchants/${id}`);
        return response.data;
    },
};
