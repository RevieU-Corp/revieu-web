import { cleanup, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const { listStoreReviewsMock, storeDetailGetMock } = vi.hoisted(() => ({
  listStoreReviewsMock: vi.fn(),
  storeDetailGetMock: vi.fn(),
}));

vi.mock('../../../../../api/reviews', () => ({
  reviewsApi: {
    listStoreReviews: listStoreReviewsMock,
  },
}));

vi.mock('../../../../../api/apiClient', () => ({
  apiClient: {
    get: storeDetailGetMock,
  },
}));

describe('MerchantReviewsPage', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    listStoreReviewsMock.mockReset();
    storeDetailGetMock.mockReset();
    storeDetailGetMock.mockResolvedValue({
      data: {
        data: {
          id: 278,
          merchant_id: 202,
          name: 'Lone Star Taco Bar',
          avg_rating: 4.5,
          review_count: 1,
        },
      },
    });
  });

  it('loads reviews for the route store id and renders live review content', async () => {
    listStoreReviewsMock.mockResolvedValue({
      data: [
        {
          id: '12',
          merchantId: '202',
          storeId: '278',
          userId: '211',
          overallRating: 4.5,
          detailedRatings: {
            quality: 4.5,
            environment: 4.4,
            service: 4.5,
            value: 4.6,
          },
          text: 'Fresh tortillas, quick counter service, and a solid brunch combo.',
          images: ['https://cdn.revieu.com/reviews/taco.jpg'],
          tags: ['#Fresh', '#Quick'],
          createdAt: '2026-03-25T09:52:52.842824Z',
          likeCount: 3,
          commentCount: 1,
          username: 'yanxia',
          avatarUrl: 'https://cdn.revieu.com/avatar.jpg',
        },
      ],
    });

    const { default: MerchantReviewsPage } = await import('../MerchantReviewsPage');

    render(
      <MemoryRouter initialEntries={['/customer/merchant/278/reviews']}>
        <Routes>
          <Route path="/customer/merchant/:id/reviews" element={<MerchantReviewsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading reviews...')).toBeInTheDocument();

    await waitFor(() => {
      expect(listStoreReviewsMock).toHaveBeenCalledWith('278', { limit: 20 });
    });

    expect(await screen.findByText('Fresh tortillas, quick counter service, and a solid brunch combo.')).toBeInTheDocument();
    expect(screen.getByText('Lone Star Taco Bar')).toBeInTheDocument();
    expect(screen.getByText('yanxia')).toBeInTheDocument();
  });

  it('renders a real empty state when the store has no reviews', async () => {
    listStoreReviewsMock.mockResolvedValue({
      data: [],
    });

    const { default: MerchantReviewsPage } = await import('../MerchantReviewsPage');

    render(
      <MemoryRouter initialEntries={['/customer/merchant/278/reviews']}>
        <Routes>
          <Route path="/customer/merchant/:id/reviews" element={<MerchantReviewsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('No reviews for this store yet.')).toBeInTheDocument();
    expect(screen.queryByText('Loading reviews...')).not.toBeInTheDocument();
  });
});
