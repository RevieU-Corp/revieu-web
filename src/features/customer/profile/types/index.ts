// User Profile Types
export interface UserProfile {
  name: string;
  handle: string;
  location: string;
  level: number;
  points: number;
  nextLevelPoints: number;
  joinDate: string;
  bio: string;
  avatar: string;
  coverImage: string;
  stats: UserStats;
}

export interface UserStats {
  totalReviews: number;
  photosUploaded: number;
  helpfulVotes: number;
  views: string;
}

// Review Types
export interface Review {
  id: string;
  businessName: string;
  businessImage: string;
  location: string;
  rating: number;
  date: string;
  content: string;
  images: string[];
  helpfulCount: number;
}

// Coupon Types
export interface Coupon {
  id: string;
  businessName: string;
  offerTitle: string;
  expiryDate: string;
  code: string;
  status: 'active' | 'expired';
  logo: string;
  color: string;
}

// Order Types
export interface Order {
  id: string;
  businessName: string;
  businessImage: string;
  date: string;
  items: string[];
  total: string;
  status: 'completed' | 'pending' | 'cancelled';
}
