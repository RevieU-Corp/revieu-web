import React, { useState, useEffect } from 'react';
import { RecommendationSystem } from '../components/RecommendationSystem';
import { UserFavorite, Location, RecommendedMerchant } from '../types/discover';

interface RecommendationSectionProps {
  selectedCategory: string | null;
  merchants: any[];
  searchQuery?: string;
}

/**
 * 推荐区域组件
 * 占用屏幕下半部分，展示个性化推荐
 */
export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  selectedCategory,
  merchants
}) => {
  const [userFavorites, setUserFavorites] = useState<UserFavorite[]>([]);
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 34.0522, // USC 默认位置
    longitude: -118.2437
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 模拟获取用户收藏数据
  useEffect(() => {
    const loadUserFavorites = async () => {
      setIsLoading(true);
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 模拟用户收藏数据
        const mockFavorites: UserFavorite[] = [
          {
            merchantId: '1',
            category: 'Chinese',
            timestamp: new Date(Date.now() - 86400000) // 1天前
          },
          {
            merchantId: '4',
            category: 'Bubble Tea',
            timestamp: new Date(Date.now() - 172800000) // 2天前
          }
        ];
        
        setUserFavorites(mockFavorites);
      } catch (err) {
        setError('加载用户偏好失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFavorites();
  }, []);

  // 获取用户位置
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('获取位置失败，使用默认位置:', error);
          // 保持默认的 USC 位置
        }
      );
    }
  }, []);

  const handleMerchantClick = (merchant: RecommendedMerchant) => {
    // 处理商家点击事件
    console.log('点击商家:', merchant.name);
    // 这里可以导航到商家详情页面
  };

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div 
      className="flex flex-col bg-white rounded-t-3xl shadow-lg"
      style={{ 
        minHeight: '50vh', // 占用下半屏
        maxHeight: '60vh'
      }}
    >
      {/* 拖拽指示器 */}
      <div className="flex justify-center py-3">
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* 推荐内容 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingState />
        ) : (
          <RecommendationSystem
            userFavorites={userFavorites}
            userLocation={userLocation}
            selectedCategory={selectedCategory || undefined}
            merchants={merchants}
            onMerchantClick={handleMerchantClick}
          />
        )}
      </div>
    </div>
  );
};

/**
 * 加载状态组件
 */
const LoadingState: React.FC = () => {
  return (
    <div className="px-4 py-8">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>
        
        {/* 模拟商家卡片加载 */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 mb-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 错误状态组件
 */
interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl mb-4">😕</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        出现了一些问题
      </h3>
      <p className="text-sm text-gray-500 mb-6 text-center">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-[#990000] text-white rounded-lg font-medium hover:bg-[#770000] transition-colors"
      >
        重试
      </button>
    </div>
  );
};