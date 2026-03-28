import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock('../../../../../api/apiClient', () => ({
  apiClient: {
    get: mockGet,
  },
}));

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

describe('DiscoverPage', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockGet.mockResolvedValue(storeListResponse);
  });

  it('renders recommended merchants from live store data', async () => {
    const { default: DiscoverPage } = await import('../DiscoverPage');

    render(
      <MemoryRouter>
        <DiscoverPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Revieu Demo Cafe')).toBeInTheDocument();
    });
  });
});
