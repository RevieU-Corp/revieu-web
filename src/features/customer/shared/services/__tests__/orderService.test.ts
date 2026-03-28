import { beforeEach, describe, expect, test, vi } from 'vitest';

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}));

vi.mock('../../../../../api/apiClient', () => ({
  apiClient: {
    get: mockGet,
    post: mockPost,
  },
}));

import { orderService } from '../orderService';

describe('orderService', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
  });

  test('creates coupon orders through the backend orders endpoint', async () => {
    mockPost.mockResolvedValue({
      data: {
        data: {
          id: 3,
          coupon_id: 9,
          store_id: 235,
          merchant_id: 205,
          quantity: 1,
          total_price: 9.99,
          status: 'pending',
          note: '',
          created_at: '2026-03-28T08:36:27.219542973Z',
          updated_at: '2026-03-28T08:36:27.219542973Z',
        },
      },
    });

    const order = await orderService.createCouponOrder('9');

    expect(mockPost).toHaveBeenCalledWith('/orders', {
      coupon_id: 9,
      quantity: 1,
    });
    expect(order).toMatchObject({
      id: '3',
      couponId: '9',
      storeId: '235',
      merchantId: '205',
      quantity: 1,
      totalPrice: 9.99,
      status: 'pending',
    });
  });

  test('pays coupon orders and unwraps the backend order-plus-vouchers payload', async () => {
    mockPost.mockResolvedValue({
      data: {
        data: {
          order: {
            id: 3,
            coupon_id: 9,
            store_id: 235,
            merchant_id: 205,
            quantity: 1,
            total_price: 9.99,
            status: 'paid',
            note: '',
            created_at: '2026-03-28T08:36:27.219542Z',
            updated_at: '2026-03-28T08:36:27.219542Z',
          },
          vouchers: [
            {
              id: 3,
              code: 'VCH-4FBBF1EEDA45',
              coupon_id: 9,
              user_id: 204,
              order_id: 3,
              merchant_id: 205,
              status: 'active',
              expiry_date: '2026-09-24T08:35:25.232537Z',
              created_at: '2026-03-28T08:38:08.330669883Z',
              updated_at: '2026-03-28T08:38:08.330669883Z',
            },
          ],
        },
      },
    });

    const result = await orderService.payCouponOrder('3');

    expect(mockPost).toHaveBeenCalledWith('/orders/3/pay');
    expect(result.order).toMatchObject({
      id: '3',
      couponId: '9',
      status: 'paid',
    });
    expect(result.vouchers[0]).toMatchObject({
      id: '3',
      couponId: '9',
      userId: '204',
      merchantId: '205',
      status: 'active',
    });
  });
});
