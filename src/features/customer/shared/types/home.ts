// Home页面相关的类型定义

export interface PostData {
  id: number;
  avatar: string;
  username: string;
  timestamp: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
}

export type PostCategory = 'recommend' | 'follow' | 'food' | 'activity' | 'leisure';

export interface ActivityData {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  badgeColor: string;
}

export interface ActivityCardProps {
  title: string;
  subtitle?: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
}

export interface StudentPostProps {
  id: number;
  avatar: string;
  username: string;
  timestamp: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  image: string;
  tag?: string;
  rating?: number;
  location: string;
}

export interface HomeMerchant {
  id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: string;
  status: 'Open' | 'Closed';
  offer?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  content: string;
  image?: string;
  likes: number;
}

export enum TabType {
  HOME = 'HOME',
  DISCOVER = 'DISCOVER',
  EXPLORE = 'EXPLORE',
  PROFILE = 'PROFILE'
}

export enum CategoryType {
  RECOMMEND = 'Recommend',
  FOLLOWING = 'Following',
  ACTIVITIES = 'Activities'
}