# Design Document: DiscoverPage 重构

## Overview

本设计文档描述了 DiscoverPage.tsx 的重构方案，旨在创建一个更加用户友好和功能丰富的发现页面。新设计将页面分为两个主要区域：上半部分包含三个分类 widget，下半部分展示基于用户偏好的个性化推荐。整个设计遵循移动优先原则，专为 16:9 手机屏幕优化。

## Architecture

### 组件层次结构

```
DiscoverPage
├── Header (Sticky)
├── CategoryWidgets (上半屏)
│   ├── FoodCategoryWidget
│   ├── BeautyCategoryWidget
│   └── ShoppingEntertainmentWidget
└── RecommendationSection (下半屏)
    ├── RecommendationHeader
    ├── MerchantList
    └── EmptyState (条件渲染)
```

### 状态管理

使用 React Hooks 进行本地状态管理：
- `selectedCategory`: 当前选中的分类
- `userFavorites`: 用户收藏数据
- `recommendedMerchants`: 推荐商家列表
- `isLoading`: 加载状态
- `userLocation`: 用户位置信息

## Components and Interfaces

### 1. CategoryWidget 组件

```typescript
interface CategoryWidgetProps {
  title: string;
  categories: CategoryItem[];
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
}

interface CategoryItem {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}
```

**设计特点：**
- 水平滚动的按钮列表
- 单选模式，一次只能选择一个分类
- 视觉反馈：选中状态使用主题色 `#990000`
- 按钮样式与 HomePage 保持一致

### 2. RecommendationSystem 组件

```typescript
interface RecommendationSystemProps {
  userFavorites: UserFavorite[];
  userLocation: Location;
  selectedCategory?: string;
}

interface UserFavorite {
  merchantId: string;
  category: string;
  timestamp: Date;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface RecommendedMerchant {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: number;
  image: string;
  tags: string[];
  relevanceScore: number;
}
```

### 3. MerchantCard 组件

保持现有的商家卡片设计，确保视觉一致性：
- 左侧图片 (24x24)
- 右侧信息区域
- 评分、距离、标签显示
- 点击交互效果

## Data Models

### 分类数据结构

```typescript
const FOOD_CATEGORIES = [
  { id: 'asian', name: '亚洲菜', icon: '🍜' },
  { id: 'western', name: '西餐', icon: '🍔' },
  { id: 'south-american', name: '南美菜', icon: '🌮' },
  { id: 'mexican', name: '墨西哥菜', icon: '🌯' },
  { id: 'european', name: '欧洲菜', icon: '🍝' },
  { id: 'fast-food', name: '快餐', icon: '🍟' },
  { id: 'drinks', name: 'drink', icon: '🥤' }
];

const BEAUTY_CATEGORIES = [
  { id: 'beauty', name: 'beauty', icon: '💄' },
  { id: 'hair-wash', name: '洗吹', icon: '💇' },
  { id: 'spa', name: 'spa', icon: '🧖‍♀️' }
];

const SHOPPING_ENTERTAINMENT_CATEGORIES = [
  { id: 'supermarket', name: '超市', icon: '🛒' },
  { id: 'clothing', name: '衣服店', icon: '👕' },
  { id: 'shoes', name: '鞋子店', icon: '👟' },
  { id: 'gifts', name: '礼物', icon: '🎁' },
  { id: 'movies', name: '电影', icon: '🎬' },
  { id: 'hotels', name: '酒店', icon: '🏨' },
  { id: 'leisure', name: '休闲', icon: '🎯' }
];
```

### 推荐算法数据模型

```typescript
interface RecommendationContext {
  userFavorites: UserFavorite[];
  userLocation: Location;
  selectedCategory?: string;
  radiusInMiles: number; // 固定为 5
}

interface MerchantScore {
  merchant: Merchant;
  relevanceScore: number;
  distanceScore: number;
  ratingScore: number;
  finalScore: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property-Based Testing Analysis

让我使用 prework 工具来分析需求中的验收标准：

### Property Reflection

在分析了所有验收标准后，我发现以下可以合并的冗余属性：
- 筛选功能测试（1.3, 2.3, 3.3, 6.1, 6.2）可以合并为一个通用的分类筛选属性
- 单选模式测试（1.4, 2.4, 3.4）可以合并为一个通用的单选行为属性
- 布局空间测试（4.1, 5.3）是重复的，只需要一个属性
- 状态持久性和筛选准确性（6.2, 6.3）可以合并为一个综合属性

### Correctness Properties

基于 prework 分析，以下是需要验证的核心属性：

**Property 1: 分类筛选一致性**
*For any* 分类 widget 和任意分类选择，当用户点击分类按钮时，显示的商家列表应该只包含匹配该分类的商家，并且筛选状态应该保持直到用户选择其他分类
**Validates: Requirements 1.3, 2.3, 3.3, 6.1, 6.2, 6.3**

**Property 2: 单选模式行为**
*For any* 分类 widget，当用户点击任意分类按钮时，只有该按钮应该处于选中状态，其他所有按钮都应该处于未选中状态
**Validates: Requirements 1.4, 2.4, 3.4**

**Property 3: 地理范围限制**
*For any* 用户位置和推荐请求，返回的所有推荐商家都应该在用户位置 5 英里范围内
**Validates: Requirements 4.4**

**Property 4: 推荐排序正确性**
*For any* 推荐商家列表，商家应该按照相关性分数或评分降序排列
**Validates: Requirements 4.5**

**Property 5: 基于收藏的推荐准确性**
*For any* 有收藏记录的用户，推荐系统应该优先推荐与用户收藏类似的商家类型
**Validates: Requirements 4.2**

**Property 6: 触控元素尺寸适配**
*For any* 交互元素（按钮、卡片），其最小触控区域应该不小于 44x44 像素以确保手指触控友好性
**Validates: Requirements 5.5**

**Property 7: 分类与搜索协同工作**
*For any* 搜索查询和分类选择的组合，结果应该同时满足搜索条件和分类筛选条件
**Validates: Requirements 6.5**

## Error Handling

### 网络错误处理
- **推荐数据加载失败**: 显示重试按钮和友好的错误提示
- **位置获取失败**: 使用默认位置（USC 校园）并提示用户手动设置位置
- **商家数据加载超时**: 显示加载骨架屏，超时后显示错误状态

### 数据异常处理
- **空推荐结果**: 显示个性化的空状态页面，建议用户尝试其他分类
- **无效分类选择**: 自动重置为默认状态
- **用户位置超出服务范围**: 提示用户当前位置暂不支持，建议切换到支持的区域

### 用户交互错误
- **快速连续点击**: 使用防抖机制避免重复请求
- **无效触摸操作**: 提供视觉反馈指导正确操作

## Testing Strategy

### 单元测试
使用 Jest 和 React Testing Library 进行组件级测试：

**组件渲染测试**:
- 验证三个分类 widget 正确渲染
- 验证推荐区域正确显示
- 验证空状态正确处理

**交互测试**:
- 测试分类按钮点击行为
- 测试搜索与分类筛选的协同工作
- 测试加载状态和错误状态

**边界条件测试**:
- 测试空数据情况
- 测试网络错误情况
- 测试极端屏幕尺寸

### 属性测试
使用 fast-check 进行属性测试，每个测试运行最少 100 次迭代：

**分类筛选属性测试**:
- 生成随机商家数据和分类选择
- 验证筛选结果的准确性和一致性
- **Feature: discover-page-refactor, Property 1: 分类筛选一致性**

**单选模式属性测试**:
- 生成随机按钮点击序列
- 验证只有最后点击的按钮处于选中状态
- **Feature: discover-page-refactor, Property 2: 单选模式行为**

**地理范围属性测试**:
- 生成随机用户位置和商家位置
- 验证所有推荐结果都在 5 英里范围内
- **Feature: discover-page-refactor, Property 3: 地理范围限制**

**推荐排序属性测试**:
- 生成随机商家数据和评分
- 验证推荐列表按正确顺序排序
- **Feature: discover-page-refactor, Property 4: 推荐排序正确性**

**收藏推荐属性测试**:
- 生成随机用户收藏数据
- 验证推荐结果与用户偏好的相关性
- **Feature: discover-page-refactor, Property 5: 基于收藏的推荐准确性**

**触控适配属性测试**:
- 生成随机屏幕尺寸
- 验证所有交互元素满足最小触控尺寸要求
- **Feature: discover-page-refactor, Property 6: 触控元素尺寸适配**

**搜索分类协同属性测试**:
- 生成随机搜索查询和分类选择组合
- 验证结果同时满足两个筛选条件
- **Feature: discover-page-refactor, Property 7: 分类与搜索协同工作**

### 集成测试
- 测试与现有 BottomNav 组件的集成
- 测试与 AuthContext 的用户状态集成
- 测试与地理位置服务的集成

### 视觉回归测试
- 使用 Storybook 创建组件故事
- 截图对比确保视觉一致性
- 测试不同屏幕尺寸下的布局表现

### 性能测试
- 测试大量商家数据的渲染性能
- 测试滚动性能和内存使用
- 测试推荐算法的计算性能

## Implementation Notes

### 技术栈
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **fast-check** for property-based testing
- **Jest & React Testing Library** for unit testing

### 性能优化
- 使用 `React.memo` 优化分类按钮重渲染
- 实现虚拟滚动处理大量推荐结果
- 使用 `useMemo` 缓存筛选和排序结果
- 实现图片懒加载减少初始加载时间

### 可访问性
- 所有按钮包含适当的 ARIA 标签
- 支持键盘导航
- 提供屏幕阅读器友好的文本描述
- 确保足够的颜色对比度

### 响应式设计
- 移动优先的设计方法
- 使用 CSS Grid 和 Flexbox 实现灵活布局
- 支持横屏和竖屏模式
- 适配不同 DPI 的屏幕