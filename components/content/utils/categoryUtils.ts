import { Merchant } from '../types/discover';
import { CATEGORY_MAPPINGS, FOOD_CATEGORIES, BEAUTY_CATEGORIES, SHOPPING_ENTERTAINMENT_CATEGORIES } from '../constants/categories';

/**
 * 根据分类筛选商家
 * @param merchants 商家列表
 * @param categoryId 分类ID
 * @returns 筛选后的商家列表
 */
export const filterMerchantsByCategory = (
  merchants: Merchant[],
  categoryId: string
): Merchant[] => {
  if (!categoryId || categoryId === '') {
    return merchants;
  }

  const categoryMappings = CATEGORY_MAPPINGS[categoryId as keyof typeof CATEGORY_MAPPINGS];
  
  if (!categoryMappings) {
    return merchants;
  }

  return merchants.filter(merchant => 
    categoryMappings.some(mapping => 
      merchant.category.toLowerCase().includes(mapping.toLowerCase())
    )
  );
};

/**
 * 检查商家是否属于指定分类
 * @param merchant 商家信息
 * @param categoryId 分类ID
 * @returns 是否匹配
 */
export const isMerchantInCategory = (
  merchant: Merchant,
  categoryId: string
): boolean => {
  if (!categoryId || categoryId === '') {
    return true;
  }

  const categoryMappings = CATEGORY_MAPPINGS[categoryId as keyof typeof CATEGORY_MAPPINGS];
  
  if (!categoryMappings) {
    return false;
  }

  return categoryMappings.some(mapping => 
    merchant.category.toLowerCase().includes(mapping.toLowerCase())
  );
};

/**
 * 获取分类的显示名称
 * @param categoryId 分类ID
 * @returns 显示名称
 */
export const getCategoryDisplayName = (categoryId: string): string => {
  // 从所有分类中查找对应的显示名称
  const allCategories = [
    ...FOOD_CATEGORIES,
    ...BEAUTY_CATEGORIES,
    ...SHOPPING_ENTERTAINMENT_CATEGORIES
  ];
  
  const category = allCategories.find(cat => cat.id === categoryId);
  return category?.name || categoryId;
};

/**
 * 验证分类选择的一致性
 * 确保只有一个分类被选中
 * @param selectedCategories 选中的分类列表
 * @returns 是否符合单选模式
 */
export const validateSingleSelection = (selectedCategories: string[]): boolean => {
  return selectedCategories.length <= 1;
};