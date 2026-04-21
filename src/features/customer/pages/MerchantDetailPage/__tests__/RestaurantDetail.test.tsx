import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const { mockGet, listStoreReviewsMock, getAvailableCouponsMock } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  listStoreReviewsMock: vi.fn(),
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

vi.mock('../../../../../api/reviews', () => ({
  reviewsApi: {
    listStoreReviews: listStoreReviewsMock,
  },
}));

describe('RestaurantDetail', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockGet.mockReset();
    listStoreReviewsMock.mockReset();
    getAvailableCouponsMock.mockReset();

    mockGet.mockResolvedValue({
      data: {
        data: {
          id: 278,
          merchant_id: 202,
          name: 'Lone Star Taco Bar',
          description: 'Austin-style tacos, aguas frescas, and weekend brunch.',
          address: '501 Congress Ave',
          city: 'Austin',
          state: 'TX',
          country: 'USA',
          phone: '(512) 555-0278',
          cover_image_url: 'https://img.example/cover.jpg',
          menu_images:
            '["https://cdn.revieu.com/menus/taco-board.jpg","https://cdn.revieu.com/menus/brunch-board.jpg"]',
          avg_rating: 4.5,
          review_count: 1,
        },
      },
    });
    getAvailableCouponsMock.mockResolvedValue([]);
  });

  it('loads live reviews when the reviews tab is opened', async () => {
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

    const { RestaurantDetail } = await import('../components/RestaurantDetail');

    render(
      <MemoryRouter>
        <RestaurantDetail storeId="278" />
      </MemoryRouter>
    );

    expect(await screen.findByText('Lone Star Taco Bar')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /reviews/i })[0]);

    await waitFor(() => {
      expect(listStoreReviewsMock).toHaveBeenCalledWith('278', { limit: 3 });
    });

    expect(await screen.findByText('Fresh tortillas, quick counter service, and a solid brunch combo.')).toBeInTheDocument();
    expect(screen.queryByText(/Reviews are not wired into this page yet/i)).not.toBeInTheDocument();
  });

  it('renders uploaded menu images when the menu tab is opened', async () => {
    const { RestaurantDetail } = await import('../components/RestaurantDetail');

    render(
      <MemoryRouter>
        <RestaurantDetail storeId="278" />
      </MemoryRouter>
    );

    expect(await screen.findByText('Lone Star Taco Bar')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /menu/i })[0]);

    expect(await screen.findByAltText('Menu image 1')).toHaveAttribute(
      'src',
      'https://cdn.revieu.com/menus/taco-board.jpg'
    );
    expect(screen.getByAltText('Menu image 2')).toHaveAttribute(
      'src',
      'https://cdn.revieu.com/menus/brunch-board.jpg'
    );
    expect(
      screen.queryByText(/Menu data is still mocked in the frontend/i)
    ).not.toBeInTheDocument();
  });

  it('renders a real empty state in the reviews tab when the api returns no reviews', async () => {
    listStoreReviewsMock.mockResolvedValue({
      data: [],
    });

    const { RestaurantDetail } = await import('../components/RestaurantDetail');

    render(
      <MemoryRouter>
        <RestaurantDetail storeId="278" />
      </MemoryRouter>
    );

    expect(await screen.findByText('Lone Star Taco Bar')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /reviews/i })[0]);

    expect(await screen.findByText('No reviews for this store yet.')).toBeInTheDocument();
  });

  it('renders an empty state when the store has not uploaded menu images yet', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        data: {
          id: 278,
          merchant_id: 202,
          name: 'Lone Star Taco Bar',
          description: 'Austin-style tacos, aguas frescas, and weekend brunch.',
          address: '501 Congress Ave',
          city: 'Austin',
          state: 'TX',
          country: 'USA',
          phone: '(512) 555-0278',
          cover_image_url: 'https://img.example/cover.jpg',
          menu_images: '[]',
          avg_rating: 4.5,
          review_count: 1,
        },
      },
    });

    const { RestaurantDetail } = await import('../components/RestaurantDetail');

    render(
      <MemoryRouter>
        <RestaurantDetail storeId="278" />
      </MemoryRouter>
    );

    expect(await screen.findByText('Lone Star Taco Bar')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /menu/i })[0]);

    expect(await screen.findByText('No menu images uploaded yet.')).toBeInTheDocument();
  });
});
