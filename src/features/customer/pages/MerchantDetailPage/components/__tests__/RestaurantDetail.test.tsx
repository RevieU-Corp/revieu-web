import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { PATHS } from '../../../../../../routes/paths';

const { apiGetMock, getAvailableCouponsMock, navigateMock } = vi.hoisted(() => ({
  apiGetMock: vi.fn(),
  getAvailableCouponsMock: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../../../../../../api/apiClient', () => ({
  apiClient: {
    get: apiGetMock,
  },
}));

vi.mock('../../../../shared/services/couponService', () => ({
  couponService: {
    getAvailableCoupons: getAvailableCouponsMock,
  },
}));

describe('RestaurantDetail', () => {
  beforeEach(() => {
    apiGetMock.mockReset();
    getAvailableCouponsMock.mockReset();
    navigateMock.mockReset();
    apiGetMock.mockResolvedValue({
      data: {
        data: {
          id: 235,
          merchant_id: 205,
          name: 'Revieu Demo Cafe',
          description: 'Seeded store for frontend/backend integration testing',
          address: '123 Integration Ave',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          phone: '(415) 555-0101',
          avg_rating: 0,
          review_count: 0,
        },
      },
    });
    getAvailableCouponsMock.mockResolvedValue([]);
  });

  it('navigates to write review with store and merchant context', async () => {
    const { RestaurantDetail } = await import('../RestaurantDetail');

    render(
      <MemoryRouter>
        <RestaurantDetail storeId="235" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Revieu Demo Cafe')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /write review/i }));

    expect(navigateMock).toHaveBeenCalledWith(PATHS.CUSTOMER.WRITE_REVIEW, {
      state: {
        merchantId: '205',
        merchantName: 'Revieu Demo Cafe',
        storeId: '235',
      },
    });
  });
});
