import { HomeMerchant } from '../../shared/types';
import { ExtendedMerchant } from '../hooks/useMerchantFilter';

/**
 * Converts distance string (e.g., "0.5 mi") to numeric miles
 */
export const parseDistance = (distanceStr: string): number => {
  const match = distanceStr.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
};

/**
 * Checks if a merchant is currently open based on current time
 * This is a simplified version - in production, you'd check actual business hours
 */
export const isCurrentlyOpen = (status: string): boolean => {
  return status.toLowerCase() === 'open';
};

/**
 * Generates a random Trojan Metric score for demo purposes
 * In production, this would come from your backend
 */
export const generateTrojanMetric = (merchant: HomeMerchant): number => {
  // Generate based on rating and review count for consistency
  const ratingScore = (merchant.rating / 5) * 50;
  const reviewScore = Math.min((merchant.reviewCount / 1000) * 30, 30);
  const randomBonus = Math.random() * 20;
  
  return Math.round(ratingScore + reviewScore + randomBonus);
};

/**
 * Determines if merchant has active coupons
 * In production, this would come from your backend
 */
export const hasActiveCoupon = (merchant: HomeMerchant): boolean => {
  return !!merchant.offer;
};

/**
 * Converts a basic HomeMerchant to ExtendedMerchant with filtering properties
 */
export const enrichMerchantData = (merchant: HomeMerchant): ExtendedMerchant => {
  return {
    ...merchant,
    trojanMetric: generateTrojanMetric(merchant),
    hasActiveCoupon: hasActiveCoupon(merchant),
    distanceInMiles: parseDistance(merchant.distance),
    isOpen: isCurrentlyOpen(merchant.status)
  };
};

/**
 * Enriches an array of merchants with filtering properties
 */
export const enrichMerchantsData = (merchants: HomeMerchant[]): ExtendedMerchant[] => {
  return merchants.map(enrichMerchantData);
};

/**
 * Gets a color class based on Trojan Metric score
 */
export const getTrojanMetricColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Gets a badge label based on Trojan Metric score
 */
export const getTrojanMetricBadge = (score: number): string => {
  if (score >= 90) return 'Elite';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Great';
  if (score >= 60) return 'Good';
  if (score >= 50) return 'Average';
  return 'Fair';
};
