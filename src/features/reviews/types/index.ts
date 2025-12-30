// Reviews页面相关的类型定义

export interface ReviewData {
  id: number;
  restaurantName: string;
  rating: number;
  reviewText: string;
  image?: string;
  author: string;
  timestamp: string;
}

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

export interface CommentData {
  id: number;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface WriteReviewFormData {
  restaurantName: string;
  rating: number;
  reviewText: string;
  image?: string;
}