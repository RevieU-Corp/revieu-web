import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGet, listStoresMock } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  listStoresMock: vi.fn(),
}));

vi.mock('../../../../../api/apiClient', () => ({
  apiClient: {
    get: mockGet,
  },
}));

vi.mock('../../../shared/services/storeBrowserService', () => ({
  storeBrowserService: {
    listStores: listStoresMock,
  },
}));

import { getWriteReviewTargetSelectionData } from '../writeReviewTargetService';

describe('writeReviewTargetService', () => {
  beforeEach(() => {
    mockGet.mockReset();
    listStoresMock.mockReset();
  });

  it('puts recently purchased merchants first and sorts stores by recent purchases within a merchant', async () => {
    mockGet.mockImplementation((url: string) => {
      if (url === '/orders') {
        return Promise.resolve({
          data: {
            data: [
              {
                id: 10,
                merchant_id: 205,
                store_id: 235,
                status: 'paid',
                created_at: '2026-04-18T09:00:00Z',
              },
              {
                id: 9,
                merchant_id: 205,
                store_id: 236,
                status: 'paid',
                created_at: '2026-04-17T09:00:00Z',
              },
              {
                id: 8,
                merchant_id: 206,
                store_id: 277,
                status: 'paid',
                created_at: '2026-04-16T09:00:00Z',
              },
            ],
          },
        });
      }

      if (url === '/merchants') {
        return Promise.resolve({
          data: {
            data: [
              {
                id: '205',
                name: 'Revieu Demo Cafe',
                businessName: 'Revieu Demo Cafe',
                category: 'Cafe',
                rating: 4.6,
                reviewCount: 8,
                coverImage: 'https://example.com/205.jpg',
              },
              {
                id: '206',
                name: 'Mission Street Ramen',
                businessName: 'Mission Street Ramen',
                category: 'Ramen',
                rating: 4.8,
                reviewCount: 12,
                coverImage: 'https://example.com/206.jpg',
              },
              {
                id: '207',
                name: 'Sunset Boba',
                businessName: 'Sunset Boba',
                category: 'Drinks',
                rating: 4.3,
                reviewCount: 4,
                coverImage: 'https://example.com/207.jpg',
              },
            ],
          },
        });
      }

      throw new Error(`Unexpected GET ${url}`);
    });

    listStoresMock.mockResolvedValue([
      {
        id: '235',
        merchantId: '205',
        name: 'Revieu Demo Cafe - Main',
        image: 'https://example.com/store-235.jpg',
        category: 'Cafe',
        description: '',
        rating: 4.6,
        reviewCount: 8,
        distanceMiles: 0.5,
        distanceLabel: '0.5 mi',
        isOpen: true,
        city: 'San Francisco',
        state: 'CA',
      },
      {
        id: '236',
        merchantId: '205',
        name: 'Revieu Demo Cafe - Annex',
        image: 'https://example.com/store-236.jpg',
        category: 'Cafe',
        description: '',
        rating: 4.2,
        reviewCount: 3,
        distanceMiles: 0.8,
        distanceLabel: '0.8 mi',
        isOpen: true,
        city: 'San Francisco',
        state: 'CA',
      },
      {
        id: '237',
        merchantId: '205',
        name: 'Revieu Demo Cafe - Uptown',
        image: 'https://example.com/store-237.jpg',
        category: 'Cafe',
        description: '',
        rating: 4.1,
        reviewCount: 1,
        distanceMiles: 1.2,
        distanceLabel: '1.2 mi',
        isOpen: true,
        city: 'San Francisco',
        state: 'CA',
      },
      {
        id: '277',
        merchantId: '206',
        name: 'Mission Street Ramen',
        image: 'https://example.com/store-277.jpg',
        category: 'Ramen',
        description: '',
        rating: 4.8,
        reviewCount: 12,
        distanceMiles: 0.7,
        distanceLabel: '0.7 mi',
        isOpen: true,
        city: 'San Francisco',
        state: 'CA',
      },
      {
        id: '278',
        merchantId: '207',
        name: 'Sunset Boba - USC',
        image: 'https://example.com/store-278.jpg',
        category: 'Drinks',
        description: '',
        rating: 4.3,
        reviewCount: 4,
        distanceMiles: 1.1,
        distanceLabel: '1.1 mi',
        isOpen: true,
        city: 'Los Angeles',
        state: 'CA',
      },
    ]);

    const result = await getWriteReviewTargetSelectionData();

    expect(result.recentMerchants.map((merchant) => merchant.merchantId)).toEqual(['205', '206']);
    expect(result.otherMerchants.map((merchant) => merchant.merchantId)).toEqual(['207']);
    expect(result.storesByMerchant['205'].map((store) => store.storeId)).toEqual(['235', '236', '237']);
    expect(result.storesByMerchant['205'].map((store) => store.isRecent)).toEqual([true, true, false]);
  });
});
