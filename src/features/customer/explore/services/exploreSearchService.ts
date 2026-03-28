import {
  MOCK_EXPLORE_LANDING_DATA,
} from '../data/mockExploreSearchData';
import {
  ExploreQuickFilterKey,
  ExploreSearchApi,
  ExploreSearchLandingData,
  ExploreSearchRequest,
  ExploreSuggestion,
} from '../types';
import { storeBrowserService } from '../../shared/services/storeBrowserService';

const SEARCH_STORAGE_KEY = 'explore.search.recent';

const shouldUseRemoteSearchApi = (): boolean =>
  import.meta.env.VITE_ENABLE_EXPLORE_SEARCH_API === 'true';

const hasActiveFilter = (
  activeFilters: ExploreQuickFilterKey[],
  filterKey: ExploreQuickFilterKey,
): boolean => activeFilters.includes(filterKey);

const suggestionMatchesFilters = (
  suggestion: ExploreSuggestion,
  activeFilters: ExploreQuickFilterKey[],
): boolean => {
  if (activeFilters.length === 0) {
    return true;
  }

  if (hasActiveFilter(activeFilters, 'nearby') && suggestion.distanceMiles > 1) {
    return false;
  }

  if (hasActiveFilter(activeFilters, 'open-now') && !suggestion.isOpenNow) {
    return false;
  }

  if (hasActiveFilter(activeFilters, 'popular') && !suggestion.isPopular) {
    return false;
  }

  if (hasActiveFilter(activeFilters, 'price') && suggestion.priceLevel > 2) {
    return false;
  }

  return true;
};

const suggestionMatchesQuery = (suggestion: ExploreSuggestion, query: string): boolean => {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = query.trim().toLowerCase();
  return (
    suggestion.name.toLowerCase().includes(normalizedQuery) ||
    suggestion.category.toLowerCase().includes(normalizedQuery)
  );
};

const getRecentSearchesFromStorage = (): string[] => {
  const rawValue = localStorage.getItem(SEARCH_STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;
    return Array.isArray(parsedValue)
      ? parsedValue.filter((value): value is string => typeof value === 'string')
      : [];
  } catch {
    return [];
  }
};

const saveRecentSearchesToStorage = (searches: string[]): void => {
  localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(searches));
};

const getLandingDataFromApi = async (): Promise<ExploreSearchLandingData> => {
  return storeBrowserService.getExploreLandingData();
};

const getSuggestionsFromApi = async (request: ExploreSearchRequest): Promise<ExploreSuggestion[]> => {
  const suggestions = await storeBrowserService.getExploreSuggestions();

  return suggestions.filter(
    (suggestion) =>
      suggestionMatchesQuery(suggestion, request.query) &&
      suggestionMatchesFilters(suggestion, request.activeFilters),
  );
};

export const getInitialRecentSearches = (fallbackSearches: string[]): string[] => {
  const localSearches = getRecentSearchesFromStorage();
  return localSearches.length > 0 ? localSearches : fallbackSearches;
};

export const persistRecentSearches = (searches: string[]): void => {
  saveRecentSearchesToStorage(searches);
};

export const exploreSearchService: ExploreSearchApi = {
  async getLandingData() {
    if (shouldUseRemoteSearchApi()) {
      try {
        return await getLandingDataFromApi();
      } catch (error) {
        console.error('Failed to load explore search landing data from API. Using fallback data.', error);
      }
    }

    try {
      return await storeBrowserService.getExploreLandingData();
    } catch (error) {
      console.error('Failed to build explore landing data from stores. Using fallback data.', error);
      return {
        quickFilters: [...MOCK_EXPLORE_LANDING_DATA.quickFilters],
        trendingSearches: [...MOCK_EXPLORE_LANDING_DATA.trendingSearches],
        browseCategories: [...MOCK_EXPLORE_LANDING_DATA.browseCategories],
        recentSearches: [...MOCK_EXPLORE_LANDING_DATA.recentSearches],
      };
    }
  },

  async searchSuggestions(request) {
    if (shouldUseRemoteSearchApi()) {
      try {
        return await getSuggestionsFromApi(request);
      } catch (error) {
        console.error('Failed to load explore search suggestions from API. Using fallback data.', error);
      }
    }

    return getSuggestionsFromApi(request);
  },
};
