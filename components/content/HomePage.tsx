
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Plus, Home, Compass, Heart, User } from 'lucide-react';
import { StudentPost } from './StudentPost';

// --- Types ---
interface PostData {
  id: number;
  avatar: string;
  username: string;
  timestamp: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
}

interface CategoryButtonProps {
  title: string;
  background: string;
  badge?: string;
  iconEmoji: string;
  textColor?: string;
}

// --- Mock Data ---
const studentPosts: PostData[] = [
  {
    id: 1,
    avatar: "🍜",
    username: "Alex Johnson",
    timestamp: "2h ago",
    text: "Found the best ramen spot near campus! The broth is incredible and student discount applies.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60",
    likes: 124,
    comments: 12
  },
  {
    id: 2,
    avatar: "🌮",
    username: "Sarah Lee",
    timestamp: "4h ago",
    text: "Late night taco run? These are definitely the best al pastor tacos I've had in LA.",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60",
    likes: 89,
    comments: 8
  },
  {
    id: 3,
    avatar: "📚",
    username: "Mike Chen",
    timestamp: "5h ago",
    text: "This cafe is perfect for studying. Super quiet, fast wifi, and plenty of outlets.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60",
    likes: 256,
    comments: 45
  },
  {
    id: 4,
    avatar: "🍔",
    username: "Emily Davis",
    timestamp: "1d ago",
    text: "The Monday burger deal is back! $5 for a cheeseburger and fries.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    likes: 67,
    comments: 15
  },
  {
    id: 5,
    avatar: "🍵",
    username: "Jess Wilson",
    timestamp: "1d ago",
    text: "Matcha heaven right here. A bit pricey but worth it for a treat.",
    image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=500&auto=format&fit=crop&q=60",
    likes: 112,
    comments: 9
  },
  {
    id: 6,
    avatar: "🍕",
    username: "Tom Baker",
    timestamp: "2d ago",
    text: "Crispy thin crust pizza. Great for sharing with a group after class.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
    likes: 45,
    comments: 3
  }
];

// --- Sub-Components ---

const CategoryButton: React.FC<CategoryButtonProps> = ({ title, background, badge, iconEmoji, textColor = "text-white" }) => (
  <button
    className="relative flex-shrink-0 w-32 h-24 rounded-xl p-3 flex flex-col justify-between overflow-hidden shadow-md transition-transform hover:scale-95 text-left"
    style={{ background }}
  >
    <div className="flex justify-between items-start w-full">
      <span className="text-xl filter drop-shadow-sm">{iconEmoji}</span>
      {badge && (
        <span className="bg-white/20 backdrop-blur-sm text-[10px] font-bold px-1.5 py-0.5 rounded text-white border border-white/10">
          {badge}
        </span>
      )}
    </div>
    <span className={`font-bold text-sm leading-tight ${textColor}`}>{title}</span>
  </button>
);

const FAB: React.FC = () => (
  <button className="fixed bottom-20 right-4 w-14 h-14 bg-[#990000] rounded-full shadow-lg shadow-red-900/30 flex items-center justify-center text-white z-40 hover:scale-105 active:scale-95 transition-all">
    <Plus className="w-8 h-8" />
  </button>
);

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 pb-safe">
      <button className="flex flex-col items-center gap-1 text-[#990000]">
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-bold">Home</span>
      </button>
      <button
        onClick={() => navigate('/discover')}
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Compass className="w-6 h-6" />
        <span className="text-[10px] font-medium">Discover</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
        <Heart className="w-6 h-6" />
        <span className="text-[10px] font-medium">Saved</span>
      </button>
      <button
        onClick={() => navigate('/profile')}
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <User className="w-6 h-6" />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </div>
  );
};

const CitySelector: React.FC = () => (
  <div className="w-8 h-8 bg-[#990000] rounded-lg flex items-center justify-center text-white shadow-sm">
    <MapPin className="w-4 h-4" />
  </div>
);

// --- Main Component ---

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-30 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14 relative">
          <div className="flex items-center gap-3">
            <CitySelector />
          </div>

          {/* Centered Title */}
          <h1
            className="absolute left-1/2 transform -translate-x-1/2 text-[#990000] font-bold text-3xl tracking-wide"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            RevieU
          </h1>

          <div className="w-9 h-9 bg-[#FFC72C] rounded-full flex items-center justify-center text-[#990000] font-bold border-2 border-white shadow-sm">
            <span className="text-sm">TJ</span>
          </div>
        </div>
        <div className="px-4 pb-3">
          <p className="text-gray-500 text-sm font-medium">Good afternoon, Trojans ✌️</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 pt-4 space-y-6">

        {/* Search Bar */}
        <div className="bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center px-4 py-3 gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search near USC..."
            className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm"
          />
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
          <button className="px-5 py-2 rounded-full bg-[#990000] text-white text-xs font-bold whitespace-nowrap shadow-md shadow-red-900/20">
            Near USC
          </button>
          <button className="px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium whitespace-nowrap">
            Open Now
          </button>
          <button className="px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium whitespace-nowrap">
            Top Rated
          </button>
          <button className="px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium whitespace-nowrap">
            <span className="text-[#990000]">$$</span> Budget
          </button>
        </div>

        {/* Categories */}
        <div className="-mx-4">
          <div className="flex gap-3 overflow-x-auto px-4 pb-4 no-scrollbar">
            <CategoryButton
              title="Top Lists"
              background="linear-gradient(135deg, #990000 0%, #660000 100%)"
              badge="TOP"
              iconEmoji="📈"
            />
            <CategoryButton
              title="Budget Eats"
              background="linear-gradient(135deg, #FFC72C 0%, #F57F17 100%)"
              textColor="text-[#7b1113]"
              badge="DEAL"
              iconEmoji="💸"
            />
            <CategoryButton
              title="School Specials"
              background="linear-gradient(135deg, #333333 0%, #000000 100%)"
              badge="USC"
              iconEmoji="🎓"
            />
            <CategoryButton
              title="Coupons"
              background="linear-gradient(135deg, #D32F2F 30%, #FFC107 100%)"
              badge="PROMO"
              iconEmoji="🎟️"
            />
          </div>
        </div>

        {/* Student Posts Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-900">Student Posts</h2>
            <button className="text-[#990000] text-sm font-semibold hover:underline">
              See all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {studentPosts.map((post) => (
              <StudentPost key={post.id} {...post} />
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Elements */}
      <FAB />
      <BottomNav />
    </div>
  );
};

export default HomePage;
