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

import { couponService } from '../couponService';

const backendCoupon = {
  id: 9,
  merchant_id: 205,
  store_id: 235,
  title: 'Paid Demo Bundle',
  description: 'Paid demo coupon for frontend/backend integration testing',
  coupon_type: 'paid',
  value: '30 value for 9.99',
  price: 9.99,
  total_quantity: 20,
  claimed_count: 1,
  terms: 'Show this voucher to the cashier.',
  expiry_date: '2026-09-24T08:35:25.232537Z',
  status: 'active',
  created_at: '2026-03-28T08:35:25.232537Z',
  updated_at: '2026-03-28T08:35:25.232537Z',
};

describe('couponService', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
  });

  test('loads coupons from the backend store route and maps them to frontend coupon fields', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: [backendCoupon],
      },
    });

    const coupons = await couponService.getAvailableCoupons('235', '204');

    expect(mockGet).toHaveBeenCalledWith('/stores/235/coupons');
    expect(coupons).toHaveLength(1);
    expect(coupons[0]).toMatchObject({
      id: '9',
      merchantId: '205',
      title: 'Paid Demo Bundle',
      description: 'Paid demo coupon for frontend/backend integration testing',
      type: 'paid',
      value: '30 value for 9.99',
      price: 9.99,
      maxRedemptions: 20,
      currentRedemptions: 1,
      usageInstructions: 'Show this voucher to the cashier.',
      isActive: true,
    });
    expect(coupons[0].expiryDate).toBeInstanceOf(Date);
  });

  test('validates coupons through the backend validate endpoint', async () => {
    mockPost.mockResolvedValue({
      data: {
        data: {
          is_valid: true,
        },
      },
    });

    const result = await couponService.validateCoupon('9', '204');

    expect(mockPost).toHaveBeenCalledWith('/coupons/9/validate', { quantity: 1 });
    expect(result).toEqual({
      isValid: true,
      eligibilityInfo: {
        isEligible: true,
        failedRules: [],
        requirements: [],
      },
    });
  });

  test('builds paid coupon payment data from cached backend coupon data instead of calling the deprecated payment endpoint', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: [backendCoupon],
      },
    });
    mockPost.mockResolvedValue({
      data: {
        data: {
          is_valid: true,
        },
      },
    });

    await couponService.getAvailableCoupons('235', '204');
    const result = await couponService.initiatePaidCouponFlow('9', '204');

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(result.paymentData).toMatchObject({
      couponId: '9',
      paymentAmount: 9.99,
      currency: '$',
      userId: '204',
      dealInfo: {
        id: '9',
        title: 'Paid Demo Bundle',
        description: 'Paid demo coupon for frontend/backend integration testing',
        type: 'paid',
        value: '30 value for 9.99',
        price: 9.99,
        usageInstructions: 'Show this voucher to the cashier.',
      },
    });
    expect(result).not.toHaveProperty('paymentUrl');
    expect(result).not.toHaveProperty('sessionId');
  });

  test('checks redeemed state from the authenticated voucher collection', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: [
          {
            id: 31,
            code: 'VCH-PAID-9',
            coupon_id: 9,
            user_id: 204,
            merchant_id: 205,
            status: 'active',
            expiry_date: '2026-09-24T08:35:25.232537Z',
            created_at: '2026-03-28T08:38:08.330669Z',
            updated_at: '2026-03-28T08:38:08.330669Z',
          },
        ],
      },
    });

    await expect(couponService.hasUserRedeemedCoupon('9', '204')).resolves.toBe(true);
    expect(mockGet).toHaveBeenCalledWith('/vouchers');
  });
});
