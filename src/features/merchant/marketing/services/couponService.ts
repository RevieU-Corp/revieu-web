import { apiClient } from '../../../../api/apiClient';

export interface Coupon {
  id: number;
  merchant_id: number;
  store_id: number | null;
  title: string;
  description: string;
  image_url: string;
  type: string;
  coupon_type: string;
  original_price: number;
  sale_price: number;
  discount_percentage: number;
  dish_ids: string; // JSON-encoded number[] — parse with JSON.parse before use
  total_quantity: number;
  claimed_count: number;
  max_per_user: number;
  valid_from: string | null;
  valid_until: string | null;
  status: string;
}

export interface UpsertCouponPayload {
  title: string;
  description?: string;
  type: string;
  coupon_type?: 'normal' | 'limited_time';
  // Mirrors sale_price. The customer-facing app derives paid-vs-free from
  // `price > 0`, so it has to be populated for paid coupons to show correctly.
  price?: number;
  original_price?: number;
  sale_price?: number;
  discount_percentage?: number;
  image_url?: string;
  dish_ids?: number[];
  total_quantity: number;
  max_per_user: number;
  valid_from?: string | null;
  valid_until?: string | null;
  terms?: string;
  status?: 'draft' | 'active';
}

export const couponService = {
  async list(storeId: string): Promise<Coupon[]> {
    const response = await apiClient.get<{ data: Coupon[] }>(`/merchant/stores/${storeId}/coupons`);
    return response.data.data;
  },

  async create(storeId: string, payload: UpsertCouponPayload): Promise<Coupon> {
    const response = await apiClient.post<{ data: Coupon }>(`/merchant/stores/${storeId}/coupons`, payload);
    return response.data.data;
  },

  async update(storeId: string, couponId: number, payload: Partial<UpsertCouponPayload>): Promise<Coupon> {
    const response = await apiClient.patch<{ data: Coupon }>(`/merchant/stores/${storeId}/coupons/${couponId}`, payload);
    return response.data.data;
  },

  async setEnabled(storeId: string, couponId: number, enabled: boolean): Promise<Coupon> {
    const response = await apiClient.post<{ data: Coupon }>(`/merchant/stores/${storeId}/coupons/${couponId}/${enabled ? 'enable' : 'disable'}`);
    return response.data.data;
  },

  async remove(storeId: string, couponId: number): Promise<void> {
    await apiClient.delete(`/merchant/stores/${storeId}/coupons/${couponId}`);
  },
};
