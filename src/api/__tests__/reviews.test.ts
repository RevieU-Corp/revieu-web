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
      text: 'Excellent noodles',
      images: ['https://cdn.revieu.com/reviews/noodles.jpg'],
      tags: ['#noodles'],
      visitDate: '2026-03-07',
    });

    expect(mockPost).toHaveBeenCalledWith('/reviews', {
      merchantId: '12',
      storeId: '34',
      rating: 4.5,
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
    });
  });

  test('list maps backend rating fields for frontend consumers', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: [backendReview],
      },
    });

    const response = await reviewsApi.list();

    expect(mockGet).toHaveBeenCalledWith('/reviews');
    expect(response.data).toHaveLength(1);
    expect(response.data[0]).toMatchObject({
      id: '99',
      overallRating: 4.5,
      businessName: 'Northern Cafe',
    });
  });
});
