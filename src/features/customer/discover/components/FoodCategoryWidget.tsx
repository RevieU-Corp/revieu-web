import React from 'react';
import { CategoryWidget } from './CategoryWidget';
import { FOOD_CATEGORIES } from '../../shared/constants/categories';

interface FoodCategoryWidgetProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
}

/**
 * 美食分类 Widget
 * 包含亚洲菜、西餐、南美菜、墨西哥菜、欧洲菜、快餐、drink
 */
export const FoodCategoryWidget: React.FC<FoodCategoryWidgetProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <CategoryWidget
      title="🍽️ Food"
      categories={FOOD_CATEGORIES}
      selectedCategory={selectedCategory}
      onCategorySelect={onCategorySelect}
    />
  );
};