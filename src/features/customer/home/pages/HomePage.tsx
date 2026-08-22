import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, FeatureBar, FeaturedSection, MerchantFeed } from '../components';
import CategoryFilter from '../components/CategoryFilter';
import { Activity, HomeMerchant } from '../../shared/types';
import { useMerchantFilter } from '../hooks/useMerchantFilter';
import { enrichMerchantsData } from '../utils/merchantUtils';
import { PATHS } from '../../../../routes/paths';
import { storeBrowserService } from '../../shared/services/storeBrowserService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [merchants, setMerchants] = useState<HomeMerchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      setIsLoading(true);
      try {
        const nextData = await storeBrowserService.getHomePageData();
        if (!isMounted) {
          return;
        }

        setActivities(nextData.activities);
        setMerchants(nextData.merchants);
      } catch (error) {
        console.error('Failed to load home page stores.', error);
        if (isMounted) {
          setActivities([]);
          setMerchants([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const enrichedMerchants = useMemo(() => enrichMerchantsData(merchants), [merchants]);

  // Use the filtering hook
  const {
    activeFeature,
    setActiveFeature,
    selectedDistance,
    setSelectedDistance,
    selectedCategory,
    setSelectedCategory,
    filteredMerchants,
    totalCount,
    filteredCount
  } = useMerchantFilter(enrichedMerchants);

  // Get feature label for display
  const getFeatureTitle = () => {
    switch (activeFeature) {
      case 'Top Rated':
        return 'Top Rated';
      case 'Nearby':
        return `Within ${selectedDistance} Miles`;
      case 'Street Food':
        return 'Street Food';
      case 'Open Now':
        return 'Open Now';
      default:
        return 'Merchants';
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20 max-w-lg mx-auto overflow-x-hidden">
      {/* Compact Header */}
      <Header
        onSearchTap={() => navigate(PATHS.CUSTOMER.EXPLORE)}
        onNotificationTap={() => navigate(PATHS.CUSTOMER.ME.NOTIFICATIONS)}
        onProfileTap={() => navigate(PATHS.CUSTOMER.ME.ROOT)}
      />

      <main className="px-8 space-y-6 mt-4">
        {/* Compact Feature Buttons with Distance Slider */}
        <FeatureBar 
          activeFeature={activeFeature}
          onFeatureChange={setActiveFeature}
          showDistanceSlider={activeFeature === 'Nearby'}
          selectedDistance={selectedDistance}
          onDistanceChange={setSelectedDistance}
        />

        {/* Discount Section - Horizontal Scrolling Cards */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-[20px] font-[700] text-[#4B4B4B] tracking-tight leading-none">Discount</h2>
              <p className="font-['Roboto'] text-[12px] font-[525] text-[#BB4C4C] mt-1.5 ml-[3px]">Daily Performance</p>
            </div>
            <button className="font-['Roboto'] text-[12px] font-[525] text-[#7F7D92]">Detail</button>
          </div>
          <FeaturedSection activities={activities} />
        </section>

        {/* Filtered Merchant List with Dropdown Filter */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-start gap-3">
              <div>
                <h2 className="text-[20px] font-[700] text-[rgba(75,_75,_75,_1)] tracking-tight leading-none">
                  {getFeatureTitle()}
                </h2>
                <p className="font-['Roboto'] text-[12px] font-[525] text-[#BB4C4C] mt-1.5 ml-1 leading-none tracking-normal">
                  {filteredCount} of {totalCount} places
                </p>
              </div>
              <CategoryFilter 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#990000]"></div>
            </div>
          ) : (
            <MerchantFeed merchants={filteredMerchants} />
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
