import { beforeEach, describe, expect, test, vi } from 'vitest';

const { mockGet, mockPost, mockPatch, mockToDataURL } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPatch: vi.fn(),
  mockToDataURL: vi.fn(),
}));

vi.mock('../../../../../api/apiClient', () => ({
  apiClient: {
    get: mockGet,
    post: mockPost,
    patch: mockPatch,
  },
}));

vi.mock('qrcode', () => ({
  default: {
    toDataURL: mockToDataURL,
  },
}));

import { voucherService } from '../voucherService';
import type { Coupon } from '../../types/coupons';

const coupon: Coupon = {
  id: '8',
  merchantId: '205',
  title: 'Free Welcome Drink',
  description: 'Free demo coupon for frontend/backend integration testing',
  type: 'free',
  value: '1 free drink',
  expiryDate: new Date('2026-09-24T08:35:25.232537Z'),
  maxRedemptions: 20,
  currentRedemptions: 0,
  eligibilityRules: [],
  usageInstructions: 'Show this voucher to the cashier.',
  isActive: true,
  createdAt: new Date('2026-03-04T11:25:42.305135Z'),
  updatedAt: new Date('2026-03-04T11:25:42.305135Z'),
};

describe('voucherService', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
    mockPatch.mockReset();
    mockToDataURL.mockReset();
    mockToDataURL.mockResolvedValue('data:image/png;base64,test-qr');
  });

  test('creates vouchers with the backend request shape and maps the response back to frontend voucher fields', async () => {
    mockPost.mockResolvedValue({
      data: {
        id: 4,
        code: 'FREEINT20260328A',
        coupon_id: 8,
        user_id: 204,
        merchant_id: 205,
        status: 'active',
        expiry_date: '0001-01-01T00:00:00Z',
        created_at: '2026-03-28T08:38:42.830526541Z',
        updated_at: '2026-03-28T08:38:42.830526541Z',
      },
    });

    const result = await voucherService.generateVoucher(coupon, '204');

    expect(mockPost).toHaveBeenCalledWith(
      '/vouchers',
      expect.objectContaining({
        couponId: '8',
        userId: '204',
        code: expect.any(String),
      })
    );
    expect(result.success).toBe(true);
    expect(result.voucher).toMatchObject({
      id: '4',
      couponId: '8',
      userId: '204',
      merchantId: '205',
      status: 'active',
      merchantName: '',
      dealTitle: 'Free Welcome Drink',
      dealValue: '1 free drink',
      usageInstructions: 'Show this voucher to the cashier.',
    });
    expect(result.voucher.expiryDate).toEqual(coupon.expiryDate);
    expect(result.qrCodeDataUrl).toBe('data:image/png;base64,test-qr');
  });

  test('unwraps the backend vouchers list envelope before categorizing vouchers', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: [
          {
            id: 3,
            code: 'VCH-4FBBF1EEDA45',
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

    const result = await voucherService.getUserVouchers('204');

    expect(mockGet).toHaveBeenCalledWith('/vouchers');
    expect(result.total).toBe(1);
    expect(result.active[0]).toMatchObject({
      id: '3',
      couponId: '9',
      userId: '204',
      merchantId: '205',
      status: 'active',
    });
  });
});
