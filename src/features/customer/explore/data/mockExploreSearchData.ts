import {
  ExploreBrowseCategory,
  ExploreQuickFilter,
  ExploreSearchLandingData,
  ExploreSuggestion,
} from '../types';

export const MOCK_EXPLORE_QUICK_FILTERS: ExploreQuickFilter[] = [
  { key: 'nearby', label: 'Nearby' },
  { key: 'open-now', label: 'Open now' },
  { key: 'popular', label: 'Popular' },
  { key: 'price', label: 'Price' },
];

export const MOCK_EXPLORE_BROWSE_CATEGORIES: ExploreBrowseCategory[] = [
  { id: 'food', label: 'Food', icon: '🍜' },
  { id: 'coffee', label: 'Coffee', icon: '☕' },
  { id: 'bars', label: 'Bars', icon: '🍸' },
  { id: 'beauty', label: 'Beauty', icon: '💄' },
];

export const MOCK_EXPLORE_LANDING_DATA: ExploreSearchLandingData = {
  quickFilters: MOCK_EXPLORE_QUICK_FILTERS,
  recentSearches: ['pizza near me', 'restaurants', 'tacos'],
  trendingSearches: ['Sushi', 'Pizza', 'Coffee', 'Bars'],
  browseCategories: MOCK_EXPLORE_BROWSE_CATEGORIES,
};

export const MOCK_EXPLORE_SUGGESTIONS: ExploreSuggestion[] = [
  {
    id: 's1',
    name: 'Red Hot Pizza',
    rating: 4.38,
    reviewCount: 1800,
    distanceMiles: 0.4,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80',
    isOpenNow: true,
    isPopular: true,
    priceLevel: 2,
    category: 'food',
  },
  {
    id: 's2',
    name: 'Sakura Sushi',
    rating: 4.13,
    reviewCount: 940,
    distanceMiles: 0.54,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=80',
    isOpenNow: true,
    isPopular: true,
    priceLevel: 3,
    category: 'food',
  },
  {
    id: 's3',
    name: 'Roma Slice House',
    rating: 4.21,
    reviewCount: 720,
    distanceMiles: 0.5,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80',
    isOpenNow: false,
    isPopular: false,
    priceLevel: 1,
    category: 'food',
  },
  {
    id: 's4',
    name: 'Sunset Coffee Lab',
    rating: 4.44,
    reviewCount: 520,
    distanceMiles: 0.35,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&q=80',
    isOpenNow: true,
    isPopular: false,
    priceLevel: 2,
    category: 'coffee',
  },
];
