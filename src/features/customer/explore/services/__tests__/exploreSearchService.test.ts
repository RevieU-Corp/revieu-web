import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock('../../../../../api/apiClient', () => ({
  apiClient: {
    get: mockGet,
  },
}));

import { exploreSearchService } from '../exploreSearchService';

const storeListResponse = {
  data: {
    data: [
      {
        id: 235,
        merchant_id: 205,
        name: 'Revieu Demo Cafe',
        description: 'Seeded store for frontend/backend integration testing',
        address: '123 Integration Ave',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        latitude: 37.7899,
        longitude: -122.3942,
        cover_image_url: 'https://example.com/store.jpg',
        avg_rating: 4.7,
        review_count: 14,
        status: 1,
      },
    ],
    cursor: null,
  },
};

describe('exploreSearchService', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockGet.mockResolvedValue(storeListResponse);
  });

  it('builds search suggestions from the backend stores endpoint', async () => {
    const suggestions = await exploreSearchService.searchSuggestions({
      query: 'Revieu',
      activeFilters: [],
    });

    expect(mockGet).toHaveBeenCalledWith('/stores', {
      params: {
        limit: 24,
      },
    });
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({
      id: '235',
      name: 'Revieu Demo Cafe',
      category: 'Cafe & Bakery',
      isOpenNow: true,
    });
  });
});
