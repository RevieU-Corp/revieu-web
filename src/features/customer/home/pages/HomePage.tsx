import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageFrame } from '../../../../components/common';
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
    <div className="min-h-dvh bg-slate-50">
      <Header onSearchTap={() => navigate(PATHS.CUSTOMER.EXPLORE)} />

      <PageFrame contentClassName="space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Explore RevieU</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Find places worth talking about
              </h1>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Discover nearby businesses, compare experiences, and share your next recommendation.
            </p>
          </div>
          <FeatureBar
            activeFeature={activeFeature}
            onFeatureChange={setActiveFeature}
            showDistanceSlider={activeFeature === 'Nearby'}
            selectedDistance={selectedDistance}
            onDistanceChange={setSelectedDistance}
          />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Discounts</h2>
              <p className="mt-1 text-sm text-slate-500">Daily offers from local businesses</p>
            </div>
            <button type="button" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all
            </button>
          </div>
          <FeaturedSection activities={activities} />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">{getFeatureTitle()}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredCount} of {totalCount} places
              </p>
            </div>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            </div>
          ) : (
            <MerchantFeed merchants={filteredMerchants} />
          )}
        </section>
      </PageFrame>
    </div>
  );
};

export default HomePage;
