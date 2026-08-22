import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock('../../../../../api/apiClient', () => ({
  apiClient: {
    get: mockGet,
  },
}));

vi.mock('../../../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '204',
      name: 'Tester',
      email: 'tester@example.com',
      avatar: '',
    },
    isAuthenticated: true,
  }),
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

describe('HomePage', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockGet.mockReset();
    mockGet.mockResolvedValue(storeListResponse);
  });

  it('renders live store data instead of the hard-coded merchant feed', async () => {
    const { default: HomePage } = await import('../HomePage');

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Revieu Demo Cafe').length).toBeGreaterThan(0);
    });
  });

  it('preserves a typed home search in the in-app explore route', async () => {
    const LocationProbe = () => {
      const location = useLocation();
      return <output data-testid="location">{location.pathname}{location.search}</output>;
    };
    const { default: HomePage } = await import('../HomePage');

    render(
      <MemoryRouter initialEntries={['/customer/home']}>
        <LocationProbe />
        <HomePage />
      </MemoryRouter>,
    );

    const input = screen.getByRole('searchbox', { name: 'Search merchants' });
    fireEvent.change(input, { target: { value: 'ramen' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('location')).toHaveTextContent('/customer/explore?q=ramen');
  });
});
