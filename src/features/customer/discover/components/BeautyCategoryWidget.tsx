import React from 'react';
import { CategoryWidget } from './CategoryWidget';
import { BEAUTY_CATEGORIES } from '../../shared/constants/categories';

interface BeautyCategoryWidgetProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
}

/**
 * 美容服务分类 Widget
 * 包含beauty、洗吹、spa
 */
export const BeautyCategoryWidget: React.FC<BeautyCategoryWidgetProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <CategoryWidget
      title="💄 Beauty"
      categories={BEAUTY_CATEGORIES}
      selectedCategory={selectedCategory}
      onCategorySelect={onCategorySelect}
    />
  );
};