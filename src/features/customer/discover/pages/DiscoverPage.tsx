import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { FoodCategoryWidget, BeautyCategoryWidget, ShoppingEntertainmentWidget, FilterModal } from '../components';
import { filterMerchantsByCategory } from '../../shared/utils/categoryUtils';
import { generateRecommendations } from '../../shared/utils/recommendationUtils';
import { FOOD_CATEGORIES, BEAUTY_CATEGORIES, SHOPPING_ENTERTAINMENT_CATEGORIES } from '../../shared/constants/categories';
import { Merchant, RecommendedMerchant } from '../../shared/types';
import { PATHS } from '../../../../routes/paths';
import '../../shared/styles/DiscoverPage.css';

// Mock Data - 保持现有的商家数据
const merchants: Merchant[] = [
  {
    id: 1,
    name: "Dulce",
    category: "Cafe & Bakery",
    rating: 4.8,
    reviews: 1240,
    price: "$",
    distance: "0.2 mi",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60",
    tags: ["Study Spot", "Wifi"]
  },
  {
    id: 2,
    name: "Northern Cafe",
    category: "Chinese",
    rating: 4.5,
    reviews: 856,
    price: "$",
    distance: "0.5 mi",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60",
    tags: ["Dumplings", "Fast"]
  },
  {
    id: 3,
    name: "Trader Joe's",
    category: "Grocery",
    rating: 4.9,
    reviews: 2300,
    price: "$",
    distance: "0.1 mi",
    image: "https://images.unsplash.com/photo-1604719312566-b7ce1232a7e9?w=500&auto=format&fit=crop&q=60",
    tags: ["Groceries", "Snacks"]
  },
  {
    id: 4,
    name: "Pot of Cha",
    category: "Bubble Tea",
    rating: 4.3,
    reviews: 450,
    price: "$",
    distance: "0.3 mi",
    image: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=500&auto=format&fit=crop&q=60",
    tags: ["Boba", "Dessert"]
  },
  {
    id: 5,
    name: "Target",
    category: "Retail",
    rating: 4.0,
    reviews: 1500,
    price: "$",
    distance: "0.1 mi",
    image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=500&auto=format&fit=crop&q=60",
    tags: ["Essentials", "Clothes"]
  },
  {
    id: 6,
    name: "Cava",
    category: "Mediterranean",
    rating: 4.7,
    reviews: 980,
    price: "$",
    distance: "0.4 mi",
    image: "https://images.unsplash.com/photo-1626202382368-3b6be6798969?w=500&auto=format&fit=crop&q=60",
    tags: ["Healthy", "Bowls"]
  }
];

const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // 处理商家点击
  const handleMerchantClick = (merchant: Pick<RecommendedMerchant, 'id' | 'name'>) => {
    navigate(PATHS.CUSTOMER.MERCHANT_INFO(merchant.id.toString()), {
      state: { merchantName: merchant.name },
    });
  };
  // 从所有商家中提取所有可用的 tags
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    merchants.forEach(merchant => {
      merchant.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, []);

  // 获取分类显示名称
  const getCategoryDisplayName = (categoryId: string) => {
    const allCategories = [
      ...FOOD_CATEGORIES,
      ...BEAUTY_CATEGORIES,
      ...SHOPPING_ENTERTAINMENT_CATEGORIES
    ];
    const category = allCategories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  // 处理分类选择
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // 筛选商家 - 支持按分类和标签筛选
  const filteredMerchants = React.useMemo(() => {
    let filtered = merchants;

    // 按分类筛选
    if (selectedCategory) {
      filtered = filterMerchantsByCategory(filtered, selectedCategory);
    }

    // 按标签筛选 - 商家必须包含所有选中的标签
    if (selectedTags.length > 0) {
      filtered = filtered.filter(merchant =>
        selectedTags.every(tag => merchant.tags.includes(tag))
      );
    }

    return filtered;
  }, [selectedCategory, selectedTags]);

  // 生成推荐列表 - 当选择的分类商家不够时，自动添加其他热门商家
  const recommendations = React.useMemo(() => {
    const userLocation = { latitude: 34.0522, longitude: -118.2437 }; // USC 位置
    const userFavorites = [
      { merchantId: '2', category: 'Chinese', timestamp: new Date() },
      { merchantId: '4', category: 'Bubble Tea', timestamp: new Date() }
    ];

    let recommendedMerchants = generateRecommendations(
      filteredMerchants,
      userLocation,
      userFavorites,
      10
    );

    // 如果筛选后的商家不够（少于3个），添加其他热门商家
    if (recommendedMerchants.length < 3) {
      const additionalMerchants = generateRecommendations(
        merchants,
        userLocation,
        userFavorites,
        10 - recommendedMerchants.length
      ).filter((merchant: RecommendedMerchant) =>
        !recommendedMerchants.some((existing: RecommendedMerchant) => existing.id === merchant.id)
      );

      recommendedMerchants = [...recommendedMerchants, ...additionalMerchants];
    }

    return recommendedMerchants.slice(0, 10);
  }, [filteredMerchants]);

  return (
    <div className="bg-[#FAFAFA] pb-24 font-sans w-full">
      {/* Sticky Header - 优化布局 */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-30 px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-[#990000]">Discover</h1>

          {/* 搜索栏 - 与标题对齐 */}
          <div className="flex-1 ml-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search restaurants, shops..."
                readOnly
                onMouseDown={(event) => {
                  event.preventDefault();
                  navigate(PATHS.CUSTOMER.EXPLORE);
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#990000]/20 transition-shadow text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 分类 Widgets 区域 - 更紧凑的布局 */}
      <div className="px-0 py-2">
        <FoodCategoryWidget
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        <BeautyCategoryWidget
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        <ShoppingEntertainmentWidget
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </div>

      {/* 推荐区域 - 滚动式布局 */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {selectedCategory
              ? `🎯 ${getCategoryDisplayName(selectedCategory)} Picks`
              : recommendations.length > 0 ? '🎯 Recommended for You' : '⭐ Top Rated'
            }
          </h2>

          {/* 筛选按钮 */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm transition-colors ${selectedTags.length > 0
              ? 'bg-[#990000] text-white border-[#990000] hover:bg-[#880000]'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
            {selectedTags.length > 0 && (
              <span className="ml-1 bg-white text-[#990000] text-xs font-bold px-1.5 py-0.5 rounded-full">
                {selectedTags.length}
              </span>
            )}
          </button>
        </div>

        <div className="grid gap-4">
          {recommendations.map((merchant: RecommendedMerchant) => (
            <div
              key={merchant.id}
              className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex gap-3 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99]"
              onClick={() => handleMerchantClick({ id: merchant.id, name: merchant.name })}
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover" />
                {merchant.relevanceScore > 0.5 && (
                  <div className="absolute top-1 left-1 bg-[#990000] text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                    Rec
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-sm truncate pr-2">{merchant.name}</h3>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{merchant.distance}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">{merchant.category}</p>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-gray-900">{merchant.rating}</span>
                    <span className="text-xs text-gray-400">({merchant.reviews})</span>
                    <span className="text-xs text-gray-300 mx-1">•</span>
                    <span className="text-xs font-bold text-green-600">{merchant.price}</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {merchant.tags.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-xs bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded border border-gray-100 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        availableTags={availableTags}
        selectedTags={selectedTags}
        onApplyFilter={setSelectedTags}
      />
    </div>
  );
};

export default DiscoverPage;
