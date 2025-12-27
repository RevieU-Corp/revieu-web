import { Merchant, UserFavorite, Location, RecommendedMerchant, MerchantScore } from '../types/discover';

/**
 * 计算两个地理位置之间的距离（英里）
 * 使用 Haversine 公式
 */
export const calculateDistance = (
  location1: Location,
  location2: Location
): number => {
  const R = 3959; // 地球半径（英里）
  const dLat = toRadians(location2.latitude - location1.latitude);
  const dLon = toRadians(location2.longitude - location1.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(location1.latitude)) * 
    Math.cos(toRadians(location2.latitude)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * 根据用户收藏计算商家的相关性分数
 */
export const calculateRelevanceScore = (
  merchant: Merchant,
  userFavorites: UserFavorite[]
): number => {
  if (userFavorites.length === 0) return 0;
  
  // 计算分类匹配度
  const categoryMatches = userFavorites.filter(
    favorite => favorite.category === merchant.category
  ).length;
  
  // 基础相关性分数（0-1）
  const baseScore = categoryMatches / userFavorites.length;
  
  // 考虑时间衰减（最近的收藏权重更高）
  const now = new Date();
  const timeWeightedScore = userFavorites.reduce((acc, favorite) => {
    if (favorite.category === merchant.category) {
      const daysSince = (now.getTime() - favorite.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      const timeWeight = Math.exp(-daysSince / 30); // 30天衰减
      return acc + timeWeight;
    }
    return acc;
  }, 0) / userFavorites.length;
  
  return Math.min(baseScore + timeWeightedScore * 0.3, 1);
};

/**
 * 计算距离分数（距离越近分数越高）
 */
export const calculateDistanceScore = (distanceInMiles: number): number => {
  // 5英里内线性衰减，超过5英里为0
  return Math.max(0, (5 - distanceInMiles) / 5);
};

/**
 * 计算评分分数（标准化到0-1）
 */
export const calculateRatingScore = (rating: number): number => {
  // 假设评分范围是1-5，标准化到0-1
  return Math.max(0, (rating - 1) / 4);
};

/**
 * 计算商家的综合分数
 */
export const calculateMerchantScore = (
  merchant: Merchant,
  userLocation: Location,
  userFavorites: UserFavorite[]
): MerchantScore => {
  // 模拟商家位置（实际应用中应该从数据中获取）
  const merchantLocation: Location = {
    latitude: 34.0522 + (Math.random() - 0.5) * 0.1, // USC 附近随机位置
    longitude: -118.2437 + (Math.random() - 0.5) * 0.1
  };
  
  const distance = calculateDistance(userLocation, merchantLocation);
  
  const relevanceScore = calculateRelevanceScore(merchant, userFavorites);
  const distanceScore = calculateDistanceScore(distance);
  const ratingScore = calculateRatingScore(merchant.rating);
  
  // 权重分配：相关性40%，距离30%，评分30%
  const finalScore = relevanceScore * 0.4 + distanceScore * 0.3 + ratingScore * 0.3;
  
  return {
    merchant,
    relevanceScore,
    distanceScore,
    ratingScore,
    finalScore
  };
};

/**
 * 筛选5英里范围内的商家
 */
export const filterByDistance = (
  merchants: Merchant[],
  userLocation: Location,
  radiusInMiles: number = 5
): Merchant[] => {
  return merchants.filter(() => {
    // 模拟商家位置
    const merchantLocation: Location = {
      latitude: 34.0522 + (Math.random() - 0.5) * 0.1,
      longitude: -118.2437 + (Math.random() - 0.5) * 0.1
    };
    
    const distance = calculateDistance(userLocation, merchantLocation);
    return distance <= radiusInMiles;
  });
};

/**
 * 生成推荐商家列表
 */
export const generateRecommendations = (
  merchants: Merchant[],
  userLocation: Location,
  userFavorites: UserFavorite[],
  limit: number = 10
): RecommendedMerchant[] => {
  // 首先筛选5英里范围内的商家
  const nearbyMerchants = filterByDistance(merchants, userLocation, 5);
  
  // 如果用户有收藏，基于收藏推荐；否则推荐高评分商家
  let scoredMerchants: MerchantScore[];
  
  if (userFavorites.length > 0) {
    // 基于用户收藏的推荐
    scoredMerchants = nearbyMerchants
      .map(merchant => calculateMerchantScore(merchant, userLocation, userFavorites))
      .sort((a, b) => b.finalScore - a.finalScore);
  } else {
    // 默认推荐：按评分排序
    scoredMerchants = nearbyMerchants
      .map(merchant => ({
        merchant,
        relevanceScore: 0,
        distanceScore: calculateDistanceScore(
          calculateDistance(userLocation, {
            latitude: 34.0522 + (Math.random() - 0.5) * 0.1,
            longitude: -118.2437 + (Math.random() - 0.5) * 0.1
          })
        ),
        ratingScore: calculateRatingScore(merchant.rating),
        finalScore: calculateRatingScore(merchant.rating)
      }))
      .sort((a, b) => b.merchant.rating - a.merchant.rating);
  }
  
  // 转换为推荐商家格式并限制数量
  return scoredMerchants
    .slice(0, limit)
    .map(scored => ({
      ...scored.merchant,
      relevanceScore: scored.finalScore
    }));
};