// Profile页面相关的类型定义

export interface UserData {
  name: string;
  handle: string;
  avatar: string;
  major: string;
  bio: string;
  stats: {
    reviews: number;
    followers: number;
    following: number;
  };
}

export interface UserPost {
  id: number;
  avatar: string;
  username: string;
  timestamp: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
}

export interface SavedPlace {
  id: number;
  name: string;
  category: string;
  image: string;
}

export type ProfileTab = 'reviews' | 'saved';