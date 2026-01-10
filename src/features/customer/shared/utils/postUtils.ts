import { PostCategory } from '../types';

export const getPostCategoryTitle = (category: PostCategory): string => {
  switch (category) {
    case 'recommend': return 'Recommend';
    case 'follow': return 'Following';
    case 'food': return 'Food';
    case 'activity': return 'Events';
    case 'leisure': return 'Leisure';
    default: return 'Recommend';
  }
};

export const showDevelopmentAlert = (): void => {
  alert('此功能正在开发中');
};