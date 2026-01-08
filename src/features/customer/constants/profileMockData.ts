import { UserData, UserPost, SavedPlace } from '../types';

// Mock User Data
export const userData: UserData = {
  name: "Tommy Trojan",
  handle: "@fighton_tommy",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60",
  major: "Computer Science '25",
  bio: "Always looking for the best boba in LA 🧋 | USC Viterbi",
  stats: {
    reviews: 42,
    followers: 856,
    following: 124
  }
};

// Mock User Posts (Reusing structure for 'Reviews' tab)
export const userPosts: UserPost[] = [
  {
    id: 101,
    avatar: "✌️",
    username: "Tommy Trojan",
    timestamp: "2d ago",
    text: "Finally tried the new spot at the Village. The pasta was solid but a bit pricey for a student budget. 🍝",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&auto=format&fit=crop&q=60",
    likes: 45,
    comments: 5
  },
  {
    id: 102,
    avatar: "✌️",
    username: "Tommy Trojan",
    timestamp: "1w ago",
    text: "Hidden gem alert! 💎 Found a quiet study cafe with amazing cold brew just 5 mins from campus.",
    image: "https://images.unsplash.com/photo-1461023058943-716030f9b263?w=500&auto=format&fit=crop&q=60",
    likes: 128,
    comments: 12
  }
];

// Mock Saved Places
export const savedPlaces: SavedPlace[] = [
  { 
    id: 1, 
    name: "Dulce", 
    category: "Cafe", 
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60" 
  },
  { 
    id: 2, 
    name: "Marugame Udon", 
    category: "Japanese", 
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=60" 
  },
  { 
    id: 3, 
    name: "Trader Joe's", 
    category: "Grocery", 
    image: "https://images.unsplash.com/photo-1604719312566-b7ce1232a7e9?w=500&auto=format&fit=crop&q=60" 
  },
];