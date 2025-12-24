import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { StudentPost } from '../features/Posts';
import { ActivityCard } from '../features/Activities';
import { FAB } from '../layout/FAB';
import { BottomNav } from '../layout/BottomNav';
import { RangeSelector } from '../common/RangeSelector';
import './HomePage.css';

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

type PostCategory = 'recommend' | 'follow' | 'food' | 'activity' | 'leisure';

// --- Mock Activities Data ---
const activities = [
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

// --- Mock Data ---
const studentPosts: PostData[] = [
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

// --- Sub-Components ---

const CityLocationButton: React.FC = () => {
  const handleClick = () => {
    alert('此功能正在开发中');
  };

  return (
    <button 
      onClick={handleClick}
      className="w-8 h-8 bg-[#990000] rounded-full flex items-center justify-center text-white shadow-sm hover:bg-[#770000] transition-colors"
    >
      <MapPin className="w-5 h-5" />
    </button>
  );
};

// --- Main Component ---

const HomePage: React.FC = () => {
  const [activePostCategory, setActivePostCategory] = useState<PostCategory>('recommend');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  
  const showDevelopmentAlert = () => {
    alert('此功能正在开发中');
  };

  // 自动滚动效果
  useEffect(() => {
    if (!isAutoScrolling) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    let scrollPosition = 0;
    let direction = 1; // 1 为向右，-1 为向左

    const autoScroll = () => {
      if (!container) return;

      // 每次滚动的距离
      const scrollStep = 2;
      scrollPosition += scrollStep * direction;

      // 到达右边界时反向
      if (scrollPosition >= maxScroll) {
        direction = -1;
        scrollPosition = maxScroll;
      }
      // 到达左边界时反向
      else if (scrollPosition <= 0) {
        direction = 1;
        scrollPosition = 0;
      }

      container.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(autoScroll, 50); // 每50ms滚动一次

    return () => clearInterval(intervalId);
  }, [isAutoScrolling]);

  // 鼠标进入时暂停自动滚动
  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
  };

  // 鼠标离开时恢复自动滚动
  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
  };

  const handlePostCategoryChange = (category: PostCategory) => {
    if (category !== 'recommend') {
      showDevelopmentAlert();
    }
    setActivePostCategory(category);
  };

  const getPostCategoryTitle = (category: PostCategory) => {
    switch (category) {
      case 'recommend': return 'Recommend';
      case 'follow': return 'Following';
      case 'food': return 'Food';
      case 'activity': return 'Events';
      case 'leisure': return 'Leisure';
      default: return 'Recommend';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans max-w-sm mx-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-30 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16 relative">
          <div className="flex items-center gap-2">
            <CityLocationButton />
            <RangeSelector />
          </div>

          {/* Centered Title */}
          <h1
            className="absolute left-1/2 transform -translate-x-1/2 text-[#990000] font-bold text-2xl tracking-wide"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            RevieU
          </h1>

          <button 
            onClick={showDevelopmentAlert}
            className="w-10 h-10 bg-[#FFC72C] rounded-full flex items-center justify-center text-[#990000] font-bold border-2 border-white shadow-sm cursor-pointer hover:bg-[#FFD700] transition-colors"
          >
            <span className="text-base">👤</span>
          </button>
        </div>
        <div className="px-4 pb-3">
          <p className="text-gray-500 text-sm font-medium">Good afternoon, xxx</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-3 pt-4 space-y-5">

        {/* Search Bar */}
        <div className="bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center px-4 py-3 gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search near USC..."
            className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm"
            onFocus={showDevelopmentAlert}
          />
          <button onClick={showDevelopmentAlert} className="cursor-pointer hover:opacity-70 transition-opacity">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 no-scrollbar">
          <button className="px-4 py-2 rounded-full bg-[#990000] text-white text-xs font-bold whitespace-nowrap shadow-md shadow-red-900/20">
            Coupons
          </button>
          <button 
            onClick={showDevelopmentAlert}
            className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium whitespace-nowrap hover:bg-gray-50 transition-colors"
          >
            Open Now
          </button>
          <button 
            onClick={showDevelopmentAlert}
            className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium whitespace-nowrap hover:bg-gray-50 transition-colors"
          >
            Top Rated
          </button>
          <button 
            onClick={showDevelopmentAlert}
            className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium whitespace-nowrap hover:bg-gray-50 transition-colors"
          >
            <span className="text-[#990000]">$</span> Budget
          </button>
        </div>

        {/* Activities Section */}
        <div className="-mx-3">
          <div className="flex items-center justify-between px-3 mb-3">
            <h2 className="font-bold text-lg text-gray-900">🎪 Hot Activities</h2>
            <button 
              onClick={showDevelopmentAlert}
              className="text-[#990000] text-sm font-semibold hover:underline"
            >
              See All
            </button>
          </div>
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto px-3 pb-4 train-station-scroll"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseEnter}
            onTouchEnd={handleMouseLeave}
          >
            {/* 复制活动数据以实现无缝循环 */}
            {[...activities, ...activities].map((activity, index) => (
              <div
                key={`${activity.id}-${index}`}
                className="flex-shrink-0"
              >
                <ActivityCard
                  title={activity.title}
                  subtitle={activity.subtitle}
                  image={activity.image}
                  badge={activity.badge}
                  badgeColor={activity.badgeColor}
                  onClick={showDevelopmentAlert}
                />
              </div>
            ))}
          </div>
          
          {/* 滚动指示器 - 火车站风格 */}
          <div className="flex justify-center items-center px-3 mt-2 gap-4">
            <div className="flex gap-1">
              {activities.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-[#990000] to-[#FF6B35] train-station-indicator"
                  style={{
                    animationDelay: `${index * 0.3}s`
                  }}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 train-station-text flex items-center gap-1">
              <span>🚂</span>
              <span>Auto Scrolling</span>
            </div>
          </div>
        </div>

        {/* Student Posts Grid */}
        <div>
          {/* Post Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-3 px-3 no-scrollbar">
            <button
              onClick={() => handlePostCategoryChange('recommend')}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activePostCategory === 'recommend'
                  ? 'bg-[#990000] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              推荐
            </button>
            <button
              onClick={() => handlePostCategoryChange('follow')}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activePostCategory === 'follow'
                  ? 'bg-[#990000] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              关注
            </button>
            <button
              onClick={() => handlePostCategoryChange('food')}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activePostCategory === 'food'
                  ? 'bg-[#990000] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              美食
            </button>
            <button
              onClick={() => handlePostCategoryChange('activity')}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all relative overflow-hidden ${
                activePostCategory === 'activity'
                  ? 'shadow-lg transform scale-105'
                  : 'hover:shadow-md hover:scale-102'
              }`}
              style={{
                background: 'linear-gradient(45deg, #FF6B35 0%, #F7931E 50%, #FFD700 100%)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              <span className="relative z-10 font-extrabold tracking-wide text-white">
                🎪 活动
              </span>
              {activePostCategory === 'activity' && (
                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              )}
            </button>
            <button
              onClick={() => handlePostCategoryChange('leisure')}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activePostCategory === 'leisure'
                  ? 'bg-[#990000] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              休闲
            </button>
          </div>

          {/* Post Section Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-900">
              {getPostCategoryTitle(activePostCategory)}
            </h2>
            <button 
              onClick={showDevelopmentAlert}
              className="text-[#990000] text-sm font-semibold hover:underline"
            >
        
              Filter
            </button>
          </div>
          
          {/* Posts Grid */}
          <div className="grid grid-cols-2 gap-3">
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
