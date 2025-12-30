import { CategoryItem } from '../types';

// 美食分类数据
export const FOOD_CATEGORIES: CategoryItem[] = [
  { 
    id: 'asian', 
    name: 'Asian', 
    icon: '🍜'
  },
  { 
    id: 'western', 
    name: 'American', 
    icon: '🍔'
  },
  { 
    id: 'south-american', 
    name: 'Latin', 
    icon: '🌮'
  },
  { 
    id: 'mexican', 
    name: 'Mexican', 
    icon: '🌯'
  },
  { 
    id: 'european', 
    name: 'European', 
    icon: '🍝'
  },
  { 
    id: 'fast-food', 
    name: 'Fast Food', 
    icon: '🍟'
  },
  { 
    id: 'drinks', 
    name: 'Drinks', 
    icon: '🥤'
  }
];

// 美容服务分类数据
export const BEAUTY_CATEGORIES: CategoryItem[] = [
  { 
    id: 'beauty', 
    name: 'Beauty', 
    icon: '💄'
  },
  { 
    id: 'hair-wash', 
    name: 'Hair Care', 
    icon: '💇'
  },
  { 
    id: 'spa', 
    name: 'Spa', 
    icon: '🧖‍♀️'
  }
];

// 购物娱乐分类数据
export const SHOPPING_ENTERTAINMENT_CATEGORIES: CategoryItem[] = [
  { 
    id: 'supermarket', 
    name: 'Grocery', 
    icon: '🛒'
  },
  { 
    id: 'clothing', 
    name: 'Clothing', 
    icon: '👕'
  },
  { 
    id: 'shoes', 
    name: 'Shoes', 
    icon: '👟'
  },
  { 
    id: 'gifts', 
    name: 'Gifts', 
    icon: '🎁'
  },
  { 
    id: 'movies', 
    name: 'Movies', 
    icon: '🎬'
  },
  { 
    id: 'hotels', 
    name: 'Hotels', 
    icon: '🏨'
  },
  { 
    id: 'leisure', 
    name: 'Leisure', 
    icon: '🎯'
  }
];

// 分类映射，用于筛选商家
export const CATEGORY_MAPPINGS = {
  // 美食分类映射
  'asian': ['Chinese', 'Japanese', 'Korean', 'Thai', 'Vietnamese', 'Asian'],
  'western': ['American', 'Steakhouse', 'BBQ', 'Burger'],
  'south-american': ['Brazilian', 'Peruvian', 'Colombian', 'South American'],
  'mexican': ['Mexican', 'Tex-Mex', 'Tacos'],
  'european': ['Italian', 'French', 'Mediterranean', 'European'],
  'fast-food': ['Fast Food', 'Quick Service'],
  'drinks': ['Cafe & Bakery', 'Coffee', 'Bubble Tea', 'Drinks', 'Bar'],
  
  // 美容服务映射
  'beauty': ['Beauty', 'Cosmetics', 'Skincare'],
  'hair-wash': ['Hair Salon', 'Barber', 'Hair Care'],
  'spa': ['Spa', 'Massage', 'Wellness'],
  
  // 购物娱乐映射
  'supermarket': ['Grocery', 'Supermarket', 'Food Store'],
  'clothing': ['Clothing', 'Fashion', 'Apparel'],
  'shoes': ['Shoes', 'Footwear'],
  'gifts': ['Gifts', 'Souvenirs', 'Novelty'],
  'movies': ['Cinema', 'Theater', 'Entertainment'],
  'hotels': ['Hotel', 'Accommodation', 'Lodging'],
  'leisure': ['Recreation', 'Sports', 'Gaming', 'Leisure']
} as const;