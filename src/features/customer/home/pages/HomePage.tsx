import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { RangeSelector } from '../../../../components/common';
import { StudentPost } from '../../reviews/components/StudentPost';
import { ActivityCard, CityLocationButton } from '../components';
import { useAutoScroll } from '../../shared/hooks/useAutoScroll';
import { showDevelopmentAlert } from '../../shared/utils/postUtils';
import { activities, studentPosts } from '../../shared/constants/index';
import { PostCategory } from '../../shared/types';

const HomePage: React.FC = () => {
  const [activePostCategory, setActivePostCategory] = useState<PostCategory>('recommend');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const { handleMouseEnter, handleMouseLeave } = useAutoScroll(scrollContainerRef);

  const handlePostCategoryChange = (category: PostCategory) => {
    if (category !== 'recommend') {
      showDevelopmentAlert();
    }
    setActivePostCategory(category);
  };

  // Check if tabs need scroll indicator
  useEffect(() => {
    const checkScroll = () => {
      if (tabsContainerRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = tabsContainerRef.current;
        // Show indicator if there's more content to scroll
        setShowScrollIndicator(scrollWidth > clientWidth && scrollLeft + clientWidth < scrollWidth - 5);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);

    const tabsContainer = tabsContainerRef.current;
    tabsContainer?.addEventListener('scroll', checkScroll);

    return () => {
      window.removeEventListener('resize', checkScroll);
      tabsContainer?.removeEventListener('scroll', checkScroll);
    };
  }, []);

  return (
    <div className="bg-white font-sans w-full">
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
            className="flex gap-4 overflow-x-auto px-3 pb-4 no-scrollbar"
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
        </div>

        {/* Student Posts Section */}
        <div>
          {/* Category Tabs - Twitter Style */}
          <div className="border-b border-gray-200 -mx-3 mb-5 relative">
            <div
              ref={tabsContainerRef}
              className="flex gap-1 overflow-x-auto px-3 no-scrollbar scroll-smooth"
            >
              <button
                onClick={() => handlePostCategoryChange('recommend')}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all relative ${
                  activePostCategory === 'recommend'
                    ? 'text-[#990000]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                推荐
                {activePostCategory === 'recommend' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#990000] rounded-t-full"></div>
                )}
              </button>
              <button
                onClick={() => handlePostCategoryChange('follow')}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all relative ${
                  activePostCategory === 'follow'
                    ? 'text-[#990000]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                关注
                {activePostCategory === 'follow' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#990000] rounded-t-full"></div>
                )}
              </button>
              <button
                onClick={() => handlePostCategoryChange('food')}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all relative ${
                  activePostCategory === 'food'
                    ? 'text-[#990000]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                美食
                {activePostCategory === 'food' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#990000] rounded-t-full"></div>
                )}
              </button>
              <button
                onClick={() => handlePostCategoryChange('activity')}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all relative ${
                  activePostCategory === 'activity'
                    ? 'text-[#990000]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                🎪 活动
                {activePostCategory === 'activity' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#FFD700] rounded-t-full"></div>
                )}
              </button>
              <button
                onClick={() => handlePostCategoryChange('leisure')}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all relative ${
                  activePostCategory === 'leisure'
                    ? 'text-[#990000]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                休闲
                {activePostCategory === 'leisure' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#990000] rounded-t-full"></div>
                )}
              </button>
            </div>

            {/* Scroll Indicator */}
            {showScrollIndicator && (
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/90 to-transparent flex items-center justify-end pr-2 pointer-events-none">
                <ChevronRight className="w-5 h-5 text-gray-400 animate-pulse" />
              </div>
            )}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-2 gap-3">
            {studentPosts.map((post) => (
              <StudentPost key={post.id} {...post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;