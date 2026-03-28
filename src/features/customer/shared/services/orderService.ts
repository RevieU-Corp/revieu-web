import { apiClient } from '../../../../api/apiClient';
import { Voucher } from '../types/coupons';
import { mapVoucherResponse } from './voucherService';

type BackendOrder = {
  id: number | string;
  coupon_id?: number | string | null;
  merchant_id?: number | string | null;
  store_id?: number | string | null;
  quantity: number;
  total_price: number;
  status: string;
  note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type BackendPayResult = {
  order: BackendOrder;
  vouchers: Array<Parameters<typeof mapVoucherResponse>[0]>;
};

export interface CouponOrder {
  id: string;
  couponId?: string;
  merchantId?: string;
  storeId?: string;
  quantity: number;
  totalPrice: number;
  status: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaidCouponOrderResult {
  order: CouponOrder;
  vouchers: Voucher[];
}

const parseDate = (value?: string | null): Date => {
  if (!value) {
    return new Date();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const mapOrder = (raw: BackendOrder): CouponOrder => ({
  id: String(raw.id),
  couponId: raw.coupon_id !== null && raw.coupon_id !== undefined ? String(raw.coupon_id) : undefined,
  merchantId:
    raw.merchant_id !== null && raw.merchant_id !== undefined ? String(raw.merchant_id) : undefined,
  storeId: raw.store_id !== null && raw.store_id !== undefined ? String(raw.store_id) : undefined,
  quantity: raw.quantity,
  totalPrice: raw.total_price,
  status: raw.status,
  note: raw.note ?? '',
  createdAt: parseDate(raw.created_at),
  updatedAt: parseDate(raw.updated_at),
});

export class OrderService {
  async createCouponOrder(couponId: string, quantity = 1): Promise<CouponOrder> {
    const response = await apiClient.post('/orders', {
      coupon_id: Number(couponId),
      quantity,
    });

    return mapOrder(response.data.data);
  }

  async payCouponOrder(orderId: string): Promise<PaidCouponOrderResult> {
    const response = await apiClient.post(`/orders/${orderId}/pay`);
    const result = response.data.data as BackendPayResult;

    return {
      order: mapOrder(result.order),
      vouchers: result.vouchers.map((voucher) => mapVoucherResponse(voucher)),
    };
  }

  async getCouponOrder(orderId: string): Promise<PaidCouponOrderResult> {
    const response = await apiClient.get(`/orders/${orderId}`);
    const result = response.data.data as BackendPayResult;

    return {
      order: mapOrder(result.order),
      vouchers: result.vouchers.map((voucher) => mapVoucherResponse(voucher)),
    };
  }
}

export const orderService = new OrderService();
