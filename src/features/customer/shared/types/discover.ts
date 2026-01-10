// DiscoverPage 相关的类型定义

export interface CategoryItem {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface CategoryWidgetProps {
  title: string;
  categories: CategoryItem[];
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
}

export interface UserFavorite {
  merchantId: string;
  category: string;
  timestamp: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Merchant {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  distance: string;
  image: string;
  tags: string[];
}

export interface RecommendedMerchant extends Merchant {
  relevanceScore: number;
}

export interface RecommendationSystemProps {
  userFavorites: UserFavorite[];
  userLocation: Location;
  selectedCategory?: string;
}

export interface RecommendationContext {
  userFavorites: UserFavorite[];
  userLocation: Location;
  selectedCategory?: string;
  radiusInMiles: number; // 固定为 5
}

export interface MerchantScore {
  merchant: Merchant;
  relevanceScore: number;
  distanceScore: number;
  ratingScore: number;
  finalScore: number;
}

export type CategoryType = 'food' | 'beauty' | 'shopping-entertainment';