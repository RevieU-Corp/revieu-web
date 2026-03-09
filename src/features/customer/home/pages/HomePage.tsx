import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, FeatureBar, FeaturedSection, MerchantFeed } from '../components';
import CategoryFilter from '../components/CategoryFilter';
import { Activity, HomeMerchant } from '../../shared/types';
import { useMerchantFilter } from '../hooks/useMerchantFilter';
import { enrichMerchantsData } from '../utils/merchantUtils';
import { PATHS } from '../../../../routes/paths';

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Study Hall',
    description: 'BOGO Drafts for Grad Students.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    tag: 'Trending',
    location: 'Jefferson Blvd'
  },
  {
    id: '2',
    title: 'SunLife Organic',
    description: 'Exclusive 20% savings.',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800',
    tag: 'Exclusive',
    location: 'USC Village'
  },
  {
    id: '3',
    title: 'Honeybird',
    description: 'Southern comfort food deals.',
    image: 'https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&q=80&w=800',
    tag: 'Hot Deal',
    location: 'Figueroa St'
  },
  {
    id: '4',
    title: 'Cava USC',
    description: 'Free side with any bowl.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    tag: 'New',
    location: 'USC Village'
  },
  {
    id: '5',
    title: 'Chipotle',
    description: 'BOGO Bowl special.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800',
    tag: 'Popular',
    location: 'Exposition Blvd'
  },
  {
    id: '6',
    title: 'Starbucks Reserve',
    description: 'Premium coffee experience.',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800',
    tag: 'Premium',
    location: 'Trousdale Pkwy'
  }
];

const baseMerchants: HomeMerchant[] = [
  {
    id: 'm1',
    name: 'SunLife Organics',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800',
    category: 'Healthy & Bowls',
    rating: 4.8,
    reviewCount: 215,
    distance: '0.4 mi',
    status: 'Open',
    offer: '20% Student'
  },
  {
    id: 'm2',
    name: 'Honeybird',
    image: 'https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&q=80&w=800',
    category: 'Burgers & Pizza',
    rating: 4.6,
    reviewCount: 540,
    distance: '1.2 mi',
    status: 'Open'
  },
  {
    id: 'm3',
    name: 'Cava USC',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    category: 'Healthy & Bowls',
    rating: 4.9,
    reviewCount: 1205,
    distance: '2.1 mi',
    status: 'Open',
    offer: 'Free Side'
  },
  {
    id: 'm4',
    name: 'Starbucks Reserve',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800',
    category: 'Coffee & Boba',
    rating: 4.5,
    reviewCount: 892,
    distance: '3.4 mi',
    status: 'Closed'
  },
  {
    id: 'm5',
    name: 'Chipotle Mexican Grill',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800',
    category: 'Mexican',
    rating: 4.7,
    reviewCount: 1543,
    distance: '4.8 mi',
    status: 'Open',
    offer: 'BOGO Bowl'
  },
  {
    id: 'm6',
    name: 'Panda Express',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800',
    category: 'Asian / Chinese',
    rating: 4.3,
    reviewCount: 678,
    distance: '6.3 mi',
    status: 'Open'
  },
  {
    id: 'm7',
    name: 'Sweet Rose Creamery',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800',
    category: 'Dessert',
    rating: 4.9,
    reviewCount: 432,
    distance: '9.2 mi',
    status: 'Open',
    offer: 'Student Discount'
  }
];

// Keep one unique entry per merchant to avoid duplicated storefronts in Home feed
const MOCK_MERCHANTS: HomeMerchant[] = baseMerchants.map((merchant, index) => ({
  ...merchant,
  id: `m${index + 1}`,
}));

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Enrich merchant data with filtering properties
  const enrichedMerchants = useMemo(() => enrichMerchantsData(MOCK_MERCHANTS), []);

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
      <Header onSearchTap={() => navigate(PATHS.CUSTOMER.EXPLORE)} />

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
          <FeaturedSection activities={MOCK_ACTIVITIES} />
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
          
          <MerchantFeed merchants={filteredMerchants} />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
