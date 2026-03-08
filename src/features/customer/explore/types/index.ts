export type ExploreQuickFilterKey = 'nearby' | 'open-now' | 'popular' | 'price';

export interface ExploreQuickFilter {
  key: ExploreQuickFilterKey;
  label: string;
}

export interface ExploreBrowseCategory {
  id: string;
  label: string;
  icon: string;
}

export interface ExploreSuggestion {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distanceMiles: number;
  imageUrl: string;
  isOpenNow: boolean;
  isPopular: boolean;
  priceLevel: 1 | 2 | 3 | 4;
  category: string;
}

export interface ExploreSearchLandingData {
  quickFilters: ExploreQuickFilter[];
  recentSearches: string[];
  trendingSearches: string[];
  browseCategories: ExploreBrowseCategory[];
}

export interface ExploreSearchRequest {
  query: string;
  activeFilters: ExploreQuickFilterKey[];
}

export interface ExploreSearchApi {
  getLandingData: () => Promise<ExploreSearchLandingData>;
  searchSuggestions: (request: ExploreSearchRequest) => Promise<ExploreSuggestion[]>;
}
