import { ActivityData, PostData } from '../types';

// Mock Activities Data
export const activities: ActivityData[] = [
  {
    id: 1,
    title: "Taco Tuesday",
    subtitle: "50% off all tacos at participating restaurants",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60",
    badge: "WEEKLY",
    badgeColor: "bg-orange-500"
  },
  {
    id: 2,
    title: "Bank of America Credit Card Special",
    subtitle: "Get 5% cashback on dining purchases",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&auto=format&fit=crop&q=60",
    badge: "LIMITED",
    badgeColor: "bg-blue-600"
  },
  {
    id: 3,
    title: "USC Student Night",
    subtitle: "Free appetizers with student ID",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&auto=format&fit=crop&q=60",
    badge: "STUDENT",
    badgeColor: "bg-red-600"
  },
  {
    id: 4,
    title: "Happy Hour Special",
    subtitle: "Buy 1 get 1 free drinks 4-6 PM",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&auto=format&fit=crop&q=60",
    badge: "DAILY",
    badgeColor: "bg-green-500"
  },
  {
    id: 5,
    title: "Weekend Brunch Festival",
    subtitle: "Special brunch menu all weekend",
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&auto=format&fit=crop&q=60",
    badge: "WEEKEND",
    badgeColor: "bg-purple-500"
  }
];

// Mock Student Posts Data
export const studentPosts: PostData[] = [
  {
    id: 1,
    avatar: "🎓",
    username: "Sarah Chen",
    timestamp: "2h ago",
    text: "Just tried the new poke bowl at Trojan Grounds and it's amazing! Perfect study fuel before finals. 🍜",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    likes: 24,
    comments: 7
  },
  {
    id: 2,
    avatar: "⚡",
    username: "Mike Torres",
    timestamp: "5h ago",
    text: "Seoul Kitchen has a student discount on Tuesdays! Got bulgogi and kimchi fried rice for under $12. Game changer! 💰",
    likes: 45,
    comments: 12
  },
  {
    id: 3,
    avatar: "🌟",
    username: "Emma Wilson",
    timestamp: "1d ago",
    text: "Study Hall is my new favorite spot! Great wifi, lots of outlets, and the coffee is actually good.",
    image: "https://images.unsplash.com/photo-1633940907831-945322bc60f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    likes: 38,
    comments: 15
  },
  {
    id: 4,
    avatar: "🎨",
    username: "Alex Park",
    timestamp: "2d ago",
    text: "The avocado toast at Café Dulce is incredible! Perfect Instagram moment and tasty too 📸",
    likes: 52,
    comments: 8
  },
  {
    id: 5,
    avatar: "🏀",
    username: "Jordan Lee",
    timestamp: "3d ago",
    text: "Post-game meal at Seoul Kitchen hit different. Their spicy ramen is undefeated!",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    likes: 67,
    comments: 19
  },
  {
    id: 6,
    avatar: "📚",
    username: "Maya Singh",
    timestamp: "4d ago",
    text: "Found the best study spot with unlimited coffee refills. Finals week just got easier!",
    likes: 41,
    comments: 11
  }
];