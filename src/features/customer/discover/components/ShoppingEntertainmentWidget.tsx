import React from 'react';
import { CategoryWidget } from './CategoryWidget';
import { SHOPPING_ENTERTAINMENT_CATEGORIES } from '../../shared/constants/categories';

interface ShoppingEntertainmentWidgetProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
}

/**
 * 购物娱乐分类 Widget
 * 包含超市、衣服店、鞋子店、礼物、电影、酒店、休闲
 */
export const ShoppingEntertainmentWidget: React.FC<ShoppingEntertainmentWidgetProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <CategoryWidget
      title="🛍️ Shopping & Fun"
      categories={SHOPPING_ENTERTAINMENT_CATEGORIES}
      selectedCategory={selectedCategory}
      onCategorySelect={onCategorySelect}
    />
  );
};