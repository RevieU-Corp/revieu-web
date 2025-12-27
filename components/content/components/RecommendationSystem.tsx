import React, { useMemo } from 'react';
import { RecommendationSystemProps, RecommendedMerchant } from '../types/discover';
import { generateRecommendations } from '../utils/recommendationUtils';

/**
 * 推荐系统组件
 * 基于用户收藏和地理位置生成推荐
 */
export const RecommendationSystem: React.FC<RecommendationSystemProps & {
  merchants: any[];
  onMerchantClick?: (merchant: RecommendedMerchant) => void;
}> = ({
  userFavorites,
  userLocation,
  selectedCategory,
  merchants,
  onMerchantClick
}) => {
  // 生成推荐列表
  const recommendations = useMemo(() => {
    return generateRecommendations(
      merchants,
      userLocation,
      userFavorites,
      10 // 限制推荐数量
    );
  }, [merchants, userLocation, userFavorites]);

  // 根据选中的分类筛选推荐
  const filteredRecommendations = useMemo(() => {
    if (!selectedCategory) return recommendations;
    
    // 这里可以根据 selectedCategory 进一步筛选
    return recommendations;
  }, [recommendations, selectedCategory]);

  const hasRecommendations = filteredRecommendations.length > 0;
  const hasUserFavorites = userFavorites.length > 0;

  return (
    <div className="flex-1 px-4">
      {/* 推荐标题 */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          {hasUserFavorites ? '🎯 为您推荐' : '⭐ 热门推荐'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {hasUserFavorites 
            ? '基于您的收藏偏好，为您推荐附近5英里内的优质商家'
            : '为您推荐附近5英里内评分最高的商家'
          }
        </p>
      </div>

      {/* 推荐列表 */}
      {hasRecommendations ? (
        <div className="space-y-3">
          {filteredRecommendations.map((merchant) => (
            <RecommendationCard
              key={merchant.id}
              merchant={merchant}
              onClick={() => onMerchantClick?.(merchant)}
            />
          ))}
        </div>
      ) : (
        <EmptyRecommendationState />
      )}
    </div>
  );
};

/**
 * 推荐商家卡片组件
 */
interface RecommendationCardProps {
  merchant: RecommendedMerchant;
  onClick?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  merchant,
  onClick
}) => {
  return (
    <div 
      className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex gap-3 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99]"
      onClick={onClick}
    >
      {/* 商家图片 */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
        <img 
          src={merchant.image} 
          alt={merchant.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* 推荐标识 */}
        {merchant.relevanceScore > 0.5 && (
          <div className="absolute top-1 left-1 bg-[#990000] text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
            推荐
          </div>
        )}
      </div>

      {/* 商家信息 */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-900 text-sm truncate pr-2">
              {merchant.name}
            </h3>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
              {merchant.distance}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-1 font-medium">
            {merchant.category}
          </p>
        </div>

        <div>
          {/* 评分和价格 */}
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs font-bold text-gray-900">{merchant.rating}</span>
            <span className="text-xs text-gray-400">({merchant.reviews})</span>
            <span className="text-xs text-gray-300 mx-1">•</span>
            <span className="text-xs font-bold text-green-600">{merchant.price}</span>
          </div>
          
          {/* 标签 */}
          <div className="flex gap-1 flex-wrap">
            {merchant.tags.slice(0, 2).map(tag => (
              <span 
                key={tag} 
                className="text-xs bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded border border-gray-100 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 空推荐状态组件
 */
const EmptyRecommendationState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        暂无推荐内容
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        附近5英里内暂时没有符合条件的商家
      </p>
      <div className="text-xs text-gray-400">
        <p>• 尝试选择其他分类</p>
        <p>• 或者扩大搜索范围</p>
      </div>
    </div>
  );
};