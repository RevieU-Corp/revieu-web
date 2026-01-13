export interface MerchantData {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  averageCost: number;
  category: string;
  phone: string;
  address: string;
  hours: string;
  parking: string;
  description: string;
}

export interface Deal {
  id: string;
  title: string;
  originalPrice: number;
  discountPrice: number;
  description: string;
  validUntil: string;
}

export interface Voucher {
  id: string;
  title: string;
  discount: string;
  minSpend: number;
  validUntil: string;
  gradient: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  isRecommended?: boolean;
  rating?: number;
  reviews?: number;
  likes?: number;
}

export interface Review {
  id: string;
  username: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  images?: string[];
}