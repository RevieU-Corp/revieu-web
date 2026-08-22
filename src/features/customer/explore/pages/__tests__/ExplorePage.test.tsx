import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';

const { getLandingDataMock, searchSuggestionsMock } = vi.hoisted(() => ({
  getLandingDataMock: vi.fn(),
  searchSuggestionsMock: vi.fn(),
}));

vi.mock('../../services/exploreSearchService', () => ({
  exploreSearchService: {
    getLandingData: getLandingDataMock,
    searchSuggestions: searchSuggestionsMock,
  },
  getInitialRecentSearches: (fallback: string[]) => fallback,
  persistRecentSearches: vi.fn(),
}));

describe('ExplorePage', () => {
  beforeEach(() => {
    getLandingDataMock.mockReset();
    searchSuggestionsMock.mockReset();
    getLandingDataMock.mockResolvedValue({
      quickFilters: [
        { key: 'nearby', label: 'Nearby' },
        { key: 'open-now', label: 'Open Now' },
      ],
      recentSearches: [],
      trendingSearches: [],
      browseCategories: [],
    });
    searchSuggestionsMock.mockResolvedValue([
      {
        id: '235',
        name: 'Ramen Demo',
        rating: 4.7,
        reviewCount: 10,
        distanceMiles: 0.5,
        imageUrl: '',
        isOpenNow: true,
        isPopular: true,
        priceLevel: 2,
        category: 'Asian',
      },
    ]);
  });

  afterEach(() => {
    cleanup();
  });

  it('hydrates the query from the in-app URL and requests matching suggestions', async () => {
    const { default: ExplorePage } = await import('../ExplorePage');

    render(
      <MemoryRouter initialEntries={['/customer/explore?q=ramen']}>
        <ExplorePage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(searchSuggestionsMock).toHaveBeenCalledWith({ query: 'ramen', activeFilters: [] });
    });
    expect(screen.getByRole('heading', { name: 'Results for "ramen"' })).toBeInTheDocument();
    expect(screen.getByText('Ramen Demo')).toBeInTheDocument();
  });

  it('keeps selected filters in the URL and sends them with the next request', async () => {
    const LocationProbe = () => {
      const location = useLocation();
      return <output data-testid="location">{location.search}</output>;
    };
    const { default: ExplorePage } = await import('../ExplorePage');

    render(
      <MemoryRouter initialEntries={['/customer/explore']}>
        <LocationProbe />
        <ExplorePage />
      </MemoryRouter>,
    );

    const nearbyButton = await screen.findByRole('button', { name: 'Nearby' });
    fireEvent.click(nearbyButton);

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('filters=nearby');
      expect(searchSuggestionsMock).toHaveBeenLastCalledWith({ query: '', activeFilters: ['nearby'] });
    });
  });
});
