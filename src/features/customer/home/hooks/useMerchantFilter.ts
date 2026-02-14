import { useState, useMemo } from 'react';
import { HomeMerchant } from '../../shared/types';
import { FeatureType } from '../components/FeatureBar';
import { CategoryType } from '../components/CategoryFilter';

// Extended merchant type with additional filtering properties
export interface ExtendedMerchant extends HomeMerchant {
  trojanMetric: number;
  hasActiveCoupon: boolean;
  distanceInMiles: number;
  isOpen: boolean;
}

export const useMerchantFilter = (merchants: ExtendedMerchant[]) => {
  const [activeFeature, setActiveFeature] = useState<FeatureType>('Top Rated');
  const [selectedDistance, setSelectedDistance] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');

  const filteredAndSortedMerchants = useMemo(() => {
    let result = [...merchants];

    // Apply category filter first
    if (selectedCategory !== 'All') {
      result = result.filter(merchant => {
        const category = merchant.category.toLowerCase();
        switch (selectedCategory) {
          case 'Asian / Chinese':
            return category.includes('asian') || category.includes('chinese') || category.includes('sushi') || category.includes('thai') || category.includes('vietnamese');
          case 'Burgers & Pizza':
            return category.includes('burger') || category.includes('pizza') || category.includes('fast food');
          case 'Coffee & Boba':
            return category.includes('coffee') || category.includes('boba') || category.includes('tea') || category.includes('cafe');
          case 'Healthy & Bowls':
            return category.includes('healthy') || category.includes('bowl') || category.includes('salad') || category.includes('mediterranean') || category.includes('health');
          case 'Mexican':
            return category.includes('mexican') || category.includes('taco') || category.includes('burrito');
          case 'Dessert':
            return category.includes('dessert') || category.includes('ice cream') || category.includes('bakery') || category.includes('sweet');
          default:
            return true;
        }
      });
    }

    // Apply active feature filter/sort
    switch (activeFeature) {
      case 'Top Rated':
        result = result.sort((a, b) => b.rating - a.rating);
        break;

      case 'Nearby':
        // Filter by selected distance and sort by distance
        result = result.filter(merchant => merchant.distanceInMiles <= selectedDistance);
        result = result.sort((a, b) => a.distanceInMiles - b.distanceInMiles);
        break;

      case 'Street Food':
        result = result.filter(merchant => 
          merchant.category.toLowerCase().includes('street') || 
          merchant.category.toLowerCase().includes('food') ||
          merchant.category.toLowerCase().includes('mexican') ||
          merchant.category.toLowerCase().includes('asian')
        );
        result = result.sort((a, b) => b.rating - a.rating);
        break;

      case 'Open Now':
        result = result.filter(merchant => merchant.isOpen);
        result = result.sort((a, b) => b.rating - a.rating);
        break;

      default:
        break;
    }

    return result;
  }, [merchants, activeFeature, selectedDistance, selectedCategory]);

  return {
    activeFeature,
    setActiveFeature,
    selectedDistance,
    setSelectedDistance,
    selectedCategory,
    setSelectedCategory,
    filteredMerchants: filteredAndSortedMerchants,
    totalCount: merchants.length,
    filteredCount: filteredAndSortedMerchants.length
  };
};
