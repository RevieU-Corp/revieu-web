import { apiClient } from '../../../../api/apiClient';
import { Activity, HomeMerchant, Merchant } from '../types';
import {
  ExploreBrowseCategory,
  ExploreQuickFilter,
  ExploreSuggestion,
} from '../../explore/types';

interface BackendStore {
  id: number;
  merchant_id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  cover_image_url?: string;
  avg_rating?: number;
  review_count?: number;
  status: number;
}

interface StoreListResponse {
  data: BackendStore[];
  cursor: number | null;
}

export interface StoreBrowserMerchant {
  id: string;
  merchantId: string;
  name: string;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  distanceMiles: number;
  distanceLabel: string;
  isOpen: boolean;
  city: string;
  state: string;
}

interface HomePageData {
  activities: Activity[];
  merchants: HomeMerchant[];
}

interface ExploreLandingData {
  quickFilters: ExploreQuickFilter[];
  trendingSearches: string[];
  browseCategories: ExploreBrowseCategory[];
  recentSearches: string[];
}

const DEFAULT_STORE_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200';
const USC_COORDINATES = {
  latitude: 34.0224,
  longitude: -118.2851,
};

const QUICK_FILTERS: ExploreQuickFilter[] = [
  { key: 'nearby', label: 'Nearby' },
  { key: 'open-now', label: 'Open Now' },
  { key: 'popular', label: 'Popular' },
  { key: 'price', label: 'Budget' },
];

const CATEGORY_ICON_MAP: Record<string, string> = {
  'Cafe & Bakery': '☕',
  Drinks: '🥤',
  American: '🍔',
  Asian: '🍜',
  Mexican: '🌮',
  Mediterranean: '🥗',
  Grocery: '🛒',
  Beauty: '💄',
  Leisure: '🎯',
};

const RECENT_SEARCHES = ['Coffee', 'Brunch', 'Boba', 'Student deals'];

let cachedStores: StoreBrowserMerchant[] | null = null;

const toRadians = (value: number): number => (value * Math.PI) / 180;

const calculateDistanceMiles = (latitude?: number, longitude?: number): number => {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return 0.5;
  }

  const earthRadiusMiles = 3959;
  const dLat = toRadians(latitude - USC_COORDINATES.latitude);
  const dLng = toRadians(longitude - USC_COORDINATES.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(USC_COORDINATES.latitude)) *
      Math.cos(toRadians(latitude)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
};

const formatDistanceLabel = (distanceMiles: number): string => {
  if (distanceMiles < 10) {
    return `${distanceMiles.toFixed(1)} mi`;
  }

  return `${Math.round(distanceMiles)} mi`;
};

const inferCategory = (store: BackendStore): string => {
  const haystack = `${store.name} ${store.description || ''}`.toLowerCase();

  if (haystack.includes('boba') || haystack.includes('tea') || haystack.includes('drink')) {
    return 'Drinks';
  }

  if (haystack.includes('cafe') || haystack.includes('coffee') || haystack.includes('bakery')) {
    return 'Cafe & Bakery';
  }

  if (haystack.includes('sushi') || haystack.includes('ramen') || haystack.includes('asian')) {
    return 'Asian';
  }

  if (haystack.includes('taco') || haystack.includes('mexican') || haystack.includes('burrito')) {
    return 'Mexican';
  }

  if (haystack.includes('salad') || haystack.includes('mediterranean') || haystack.includes('healthy')) {
    return 'Mediterranean';
  }

  if (haystack.includes('market') || haystack.includes('grocery')) {
    return 'Grocery';
  }

  return 'American';
};

const normalizeRating = (rating?: number): number => {
  if (typeof rating !== 'number' || Number.isNaN(rating) || rating <= 0) {
    return 4.2;
  }

  return Number(rating.toFixed(1));
};

const mapStore = (store: BackendStore): StoreBrowserMerchant => {
  const distanceMiles = calculateDistanceMiles(store.latitude, store.longitude);
  const category = inferCategory(store);

  return {
    id: String(store.id),
    merchantId: String(store.merchant_id),
    name: store.name,
    image: store.cover_image_url || DEFAULT_STORE_IMAGE,
    category,
    description: store.description || `Discover ${category.toLowerCase()} picks from ${store.name}.`,
    rating: normalizeRating(store.avg_rating),
    reviewCount: store.review_count || 0,
    distanceMiles,
    distanceLabel: formatDistanceLabel(distanceMiles),
    isOpen: store.status === 1,
    city: store.city || '',
    state: store.state || '',
  };
};

const mapToActivity = (store: StoreBrowserMerchant): Activity => ({
  id: store.id,
  title: store.name,
  description: store.description,
  image: store.image,
  tag: store.isOpen ? 'Open Now' : 'Featured',
  location: [store.city, store.state].filter(Boolean).join(', ') || 'Nearby',
});

const mapToHomeMerchant = (store: StoreBrowserMerchant): HomeMerchant => ({
  id: store.id,
  name: store.name,
  image: store.image,
  category: store.category,
  rating: store.rating,
  reviewCount: store.reviewCount,
  distance: store.distanceLabel,
  status: store.isOpen ? 'Open' : 'Closed',
});

const mapToDiscoverMerchant = (store: StoreBrowserMerchant): Merchant => ({
  id: Number(store.id),
  name: store.name,
  category: store.category,
  rating: store.rating,
  reviews: store.reviewCount,
  price: '$$',
  distance: store.distanceLabel,
  image: store.image,
  tags: [store.category, store.isOpen ? 'Open Now' : 'Featured'],
});

const mapToExploreSuggestion = (store: StoreBrowserMerchant): ExploreSuggestion => ({
  id: store.id,
  name: store.name,
  rating: store.rating,
  reviewCount: store.reviewCount,
  distanceMiles: Number(store.distanceMiles.toFixed(2)),
  imageUrl: store.image,
  isOpenNow: store.isOpen,
  isPopular: store.reviewCount >= 10 || store.rating >= 4.5,
  priceLevel: 2,
  category: store.category,
});

const unique = (values: string[]): string[] => Array.from(new Set(values.filter(Boolean)));

export const storeBrowserService = {
  async listStores(limit = 24): Promise<StoreBrowserMerchant[]> {
    if (cachedStores && cachedStores.length >= limit) {
      return cachedStores.slice(0, limit);
    }

    const response = await apiClient.get<StoreListResponse>('/stores', {
      params: {
        limit,
      },
    });

    const rawStores = response.data.data || [];
    const stores = rawStores.map(mapStore);
    cachedStores = stores;

    return stores;
  },

  async getHomePageData(limit = 12): Promise<HomePageData> {
    const stores = await this.listStores(limit);
    return {
      activities: stores.slice(0, 6).map(mapToActivity),
      merchants: stores.map(mapToHomeMerchant),
    };
  },

  async getDiscoverMerchants(limit = 12): Promise<Merchant[]> {
    const stores = await this.listStores(limit);
    return stores.map(mapToDiscoverMerchant);
  },

  async getExploreSuggestions(limit = 24): Promise<ExploreSuggestion[]> {
    const stores = await this.listStores(limit);
    return stores.map(mapToExploreSuggestion);
  },

  async getExploreLandingData(limit = 24): Promise<ExploreLandingData> {
    const stores = await this.listStores(limit);
    const categories = unique(stores.map((store) => store.category)).slice(0, 6);

    return {
      quickFilters: QUICK_FILTERS,
      recentSearches: RECENT_SEARCHES,
      trendingSearches: stores.slice(0, 6).map((store) => store.name),
      browseCategories: categories.map((category) => ({
        id: category.toLowerCase().replace(/\s+/g, '-'),
        label: category,
        icon: CATEGORY_ICON_MAP[category] || '📍',
      })),
    };
  },
};
