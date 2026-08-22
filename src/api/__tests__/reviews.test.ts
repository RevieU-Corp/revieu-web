import { beforeEach, describe, expect, test, vi } from 'vitest';

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}));

vi.mock('../apiClient', () => ({
  apiClient: {
    get: mockGet,
    post: mockPost,
  },
}));

import { reviewsApi } from '../reviews';

const backendReview = {
  id: '99',
  merchantId: '12',
  venueId: '12',
  storeId: '34',
  userId: '7',
  rating: 4.5,
  ratingEnv: 4.4,
  ratingService: 4.5,
  ratingValue: 4.6,
  ratingFood: 4.5,
  locationVerified: true,
  text: 'Excellent noodles',
  images: ['https://cdn.revieu.com/reviews/noodles.jpg'],
  tags: ['#noodles'],
  visitDate: '2026-03-07',
  createdAt: '2026-03-07T10:00:00Z',
  businessName: 'Northern Cafe',
  businessImage: 'https://cdn.revieu.com/merchant.jpg',
  location: '123 Main St',
  likeCount: 8,
};

describe('reviewsApi', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
  });

  test('create sends backend review payload and maps response back to frontend fields', async () => {
    mockPost.mockResolvedValue({ data: backendReview });

    const response = await reviewsApi.create({
      merchantId: '12',
      storeId: '34',
      overallRating: 4.5,
      detailedRatings: {
        quality: 4.5,
        environment: 4.4,
        service: 4.5,
        value: 4.6,
      },
      locationVerified: true,
      text: 'Excellent noodles',
      images: ['https://cdn.revieu.com/reviews/noodles.jpg'],
      tags: ['#noodles'],
      visitDate: '2026-03-07',
    });

    expect(mockPost).toHaveBeenCalledWith('/reviews', {
      merchantId: '12',
      storeId: '34',
      rating: 4.5,
      ratingEnv: 4.4,
      ratingService: 4.5,
      ratingValue: 4.6,
      ratingFood: 4.5,
      locationVerified: true,
      text: 'Excellent noodles',
      images: ['https://cdn.revieu.com/reviews/noodles.jpg'],
      tags: ['#noodles'],
      visitDate: '2026-03-07',
    });
    expect(response).toMatchObject({
      id: '99',
      merchantId: '12',
      storeId: '34',
      overallRating: 4.5,
      text: 'Excellent noodles',
      businessName: 'Northern Cafe',
      locationVerified: true,
    });
    expect(response.detailedRatings).toEqual({
      quality: 4.5,
      environment: 4.4,
      service: 4.5,
      value: 4.6,
    });
  });

  test('list calls paginated my-reviews API and maps content review fields', async () => {
    mockGet.mockResolvedValue({
      data: {
        reviews: [
          {
            id: 99,
            rating: 4.5,
            content: 'Excellent noodles',
            images: ['https://cdn.revieu.com/reviews/noodles.jpg'],
            like_count: 8,
            comment_count: 3,
            is_liked: true,
            merchant: {
              id: 12,
              name: 'Northern Cafe',
              category: 'restaurant',
            },
            tags: ['#noodles'],
            created_at: '2026-03-07T10:00:00Z',
          },
        ],
        total: 7,
        cursor: 55,
      },
    });

    const response = await reviewsApi.list({ limit: 20, cursor: '55' });

    expect(mockGet).toHaveBeenCalledWith('/user/reviews', {
      params: {
        limit: 20,
        cursor: '55',
      },
    });
    expect(response.data).toHaveLength(1);
    expect(response.data[0]).toMatchObject({
      id: '99',
      overallRating: 4.5,
      businessName: 'Northern Cafe',
      likeCount: 8,
      commentCount: 3,
    });
    expect(response.total).toBe(7);
    expect(response.cursor).toBe('55');
  });

  test('listStoreReviews calls paginated store-reviews API and maps live backend review fields', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: [
          {
            id: 12,
            user_id: 211,
            merchant_id: 202,
            store_id: 278,
            rating: 4.5,
            rating_food: 4.5,
            rating_env: 4.4,
            rating_service: 4.5,
            rating_value: 4.6,
            content: 'Fresh tortillas, quick counter service, and a solid brunch combo.',
            images: '["https://cdn.revieu.com/reviews/taco.jpg"]',
            like_count: 3,
            comment_count: 1,
            is_liked: false,
            created_at: '2026-03-25T09:52:52.842824Z',
            visit_date: '2026-03-25T00:00:00Z',
            user: {
              id: 211,
              profile: {
                nickname: 'yanxia',
                avatar_url: 'https://cdn.revieu.com/avatar.jpg',
              },
            },
          },
        ],
        cursor: 11,
      },
    });

    const response = await reviewsApi.listStoreReviews('278', { limit: 20, cursor: '11' });

    expect(mockGet).toHaveBeenCalledWith('/stores/278/reviews', {
      params: {
        limit: 20,
        cursor: '11',
      },
    });
    expect(response.data).toHaveLength(1);
    expect(response.data[0]).toMatchObject({
      id: '12',
      merchantId: '202',
      storeId: '278',
      userId: '211',
      overallRating: 4.5,
      text: 'Fresh tortillas, quick counter service, and a solid brunch combo.',
      likeCount: 3,
      commentCount: 1,
      username: 'yanxia',
      avatarUrl: 'https://cdn.revieu.com/avatar.jpg',
    });
    expect(response.data[0].images).toEqual(['https://cdn.revieu.com/reviews/taco.jpg']);
    expect(response.data[0].detailedRatings).toMatchObject({
      quality: 4.5,
      environment: 4.4,
      service: 4.5,
      value: 4.6,
    });
    expect(response.cursor).toBe('11');
  });

  test('generateAiReviewCandidates posts multipart form data and returns polished candidates', async () => {
    const formData = new FormData();
    formData.append('text', 'The noodles were great but service was slow.');

    mockPost.mockResolvedValue({
      data: {
        candidates: [
          'The noodles were flavorful and comforting, though the service felt a bit slow during my visit.',
          'I really liked the noodles here, but the wait for service was longer than expected.',
          'Great noodles with rich flavor, but the slower service kept the meal from feeling seamless.',
        ],
      },
    });

    const response = await reviewsApi.generateAiReviewCandidates(formData);

    expect(mockPost).toHaveBeenCalledWith(
      '/ai/reviews/suggestions',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    expect(response).toEqual({
      candidates: [
        'The noodles were flavorful and comforting, though the service felt a bit slow during my visit.',
        'I really liked the noodles here, but the wait for service was longer than expected.',
        'Great noodles with rich flavor, but the slower service kept the meal from feeling seamless.',
      ],
    });
  });
});
