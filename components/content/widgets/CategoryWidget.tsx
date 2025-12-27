import React from 'react';
import { CategoryWidgetProps } from '../types/discover';
import { useDebounce } from '../hooks/useDebounce';

/**
 * 分类 Widget 组件
 * 支持水平滚动和单选模式
 */
export const CategoryWidget: React.FC<CategoryWidgetProps> = ({
  title,
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  // 防抖处理，防止快速连续点击
  const debouncedSelect = useDebounce(onCategorySelect, 200);

  const handleCategoryClick = (categoryId: string) => {
    // 如果点击的是已选中的分类，则取消选择
    if (selectedCategory === categoryId) {
      debouncedSelect('');
    } else {
      debouncedSelect(categoryId);
    }
  };

  return (
    <div className="mb-2">
      {/* Widget 标题 */}
      <div className="px-4 mb-1">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>

      {/* 分类按钮列表 - 支持左右滑动 */}
      <div className="flex gap-1 overflow-x-auto pb-1 px-4 no-scrollbar scroll-smooth">
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={() => handleCategoryClick(category.id)}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * 分类按钮组件
 */
interface CategoryButtonProps {
  category: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  isSelected,
  onClick
}) => {
  const showDevelopmentAlert = () => {
    alert('此功能正在开发中');
  };

  const handleClick = () => {
    showDevelopmentAlert();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative flex-shrink-0
        w-14 h-16
        rounded-lg
        overflow-hidden
        flex flex-col items-center justify-center
        p-1
        transition-all duration-200
        cursor-pointer
        bg-transparent
        ${isSelected 
          ? 'opacity-100' 
          : 'opacity-70 hover:opacity-100'
        }
      `}
      style={{
        minHeight: '44px', // 确保触控友好
        minWidth: '44px'
      }}
    >
      {/* Icon */}
      {category.icon && (
        <span className={`text-2xl mb-1 ${isSelected ? 'transform scale-110' : ''}`}>
          {category.icon}
        </span>
      )}

      {/* 分类名称 */}
      <span className={`text-xs font-medium leading-tight text-center ${
        isSelected ? 'text-[#990000] font-semibold' : 'text-gray-600'
      }`}>
        {category.name}
      </span>

      {/* 选中指示器 */}
      {isSelected && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-[#990000] rounded-full"></div>
      )}
    </button>
  );
};