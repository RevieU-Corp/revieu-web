import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGet, reviewsListMock, listStoresMock } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  reviewsListMock: vi.fn(),
  listStoresMock: vi.fn(),
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(function MockGoogleGenerativeAI() {
    return {
      getGenerativeModel: vi.fn(),
    };
  }),
}));

vi.mock('../../../../../api/apiClient', () => ({
  apiClient: {
    get: mockGet,
  },
}));

vi.mock('../../../../../api/reviews', () => ({
  reviewsApi: {
    list: reviewsListMock,
  },
}));

vi.mock('../../../shared/services/storeBrowserService', () => ({
  storeBrowserService: {
    listStores: listStoresMock,
  },
}));

import { getLatestVisitedMerchantsWithoutReview } from '../profileService';

describe('profileService', () => {
  beforeEach(() => {
    mockGet.mockReset();
    reviewsListMock.mockReset();
    listStoresMock.mockReset();
  });

  it('derives pending review merchants from paid orders that have not been reviewed yet', async () => {
    mockGet.mockResolvedValue({
      data: {
        data: [
          {
            id: 3,
            merchant_id: 205,
            store_id: 235,
            status: 'paid',
            created_at: '2026-03-28T08:36:27.219542Z',
            coupon: {
              title: 'Paid Demo Bundle',
            },
          },
        ],
      },
    });
    reviewsListMock.mockResolvedValue({
      data: [],
      total: 0,
    });
    listStoresMock.mockResolvedValue([
      {
        id: '235',
        merchantId: '205',
        name: 'Revieu Demo Cafe',
        image: 'https://example.com/store.jpg',
      },
    ]);

    const merchants = await getLatestVisitedMerchantsWithoutReview();

    expect(mockGet).toHaveBeenCalledWith('/orders');
    expect(reviewsListMock).toHaveBeenCalledWith({ limit: 100 });
    expect(listStoresMock).toHaveBeenCalledWith(100);
    expect(merchants).toEqual([
      expect.objectContaining({
        id: '235',
        businessName: 'Revieu Demo Cafe',
        businessImage: 'https://example.com/store.jpg',
        lastOrderItems: ['Paid Demo Bundle'],
      }),
    ]);
  });
});
