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