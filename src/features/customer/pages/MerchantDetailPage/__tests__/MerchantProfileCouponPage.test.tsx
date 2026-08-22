import { cleanup, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const { mockGet, getAvailableCouponsMock } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  getAvailableCouponsMock: vi.fn(),
}));

vi.mock('../../../../../api/apiClient', () => ({
  apiClient: {
    get: mockGet,
  },
}));

vi.mock('../../../shared/services/couponService', () => ({
  couponService: {
    getAvailableCoupons: getAvailableCouponsMock,
  },
}));

vi.mock('../components/DealCard', () => ({
  DealCard: ({ title }: { title: string }) => <button type="button">{title}</button>,
}));

import MerchantProfileCouponPage from '../MerchantProfileCouponPage';

describe('MerchantProfileCouponPage', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockGet.mockReset();
    getAvailableCouponsMock.mockReset();
    mockGet.mockResolvedValue({
      data: {
        data: {
          id: 235,
          merchant_id: 205,
          name: 'Lone Star Taco Bar',
          address: '501 Congress Ave',
          city: 'Austin',
          state: 'TX',
          country: 'USA',
          phone: '(512) 555-0278',
          cover_image_url: 'https://img.example/cover.jpg',
        },
      },
    });
    getAvailableCouponsMock.mockResolvedValue([
      {
        id: '9',
        merchantId: '205',
        title: 'Paid Demo Bundle',
        description: 'Server-backed coupon',
        type: 'paid',
        value: '30 value for $9.99',
        price: 9.99,
        expiryDate: new Date('2026-09-24T08:35:25.232537Z'),
        maxRedemptions: 20,
        currentRedemptions: 1,
        eligibilityRules: [],
        usageInstructions: 'Show this voucher to the cashier.',
        isActive: true,
        createdAt: new Date('2026-03-28T08:35:25.232537Z'),
        updatedAt: new Date('2026-03-28T08:35:25.232537Z'),
      },
    ]);
  });

  it('loads direct coupon links from the backend without navigation state or fake deals', async () => {
    render(
      <MemoryRouter initialEntries={['/customer/merchant/235/coupon']}>
        <Routes>
          <Route path="/customer/merchant/:id/coupon" element={<MerchantProfileCouponPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Lone Star Taco Bar')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Paid Demo Bundle' })).toBeInTheDocument();
    expect(getAvailableCouponsMock).toHaveBeenCalledWith('235', '');
    expect(mockGet).toHaveBeenCalledWith('/stores/235');
    expect(screen.queryByText('Flash Deal')).not.toBeInTheDocument();
    expect(screen.queryByText('Get QR')).not.toBeInTheDocument();
  });

  it('fails closed when the coupon endpoint is unavailable', async () => {
    getAvailableCouponsMock.mockRejectedValue(new Error('network unavailable'));

    render(
      <MemoryRouter initialEntries={['/customer/merchant/235/coupon']}>
        <Routes>
          <Route path="/customer/merchant/:id/coupon" element={<MerchantProfileCouponPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Live coupons are unavailable.')).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: 'Paid Demo Bundle' })).not.toBeInTheDocument();
    expect(screen.queryByText('Get QR')).not.toBeInTheDocument();
  });
});
