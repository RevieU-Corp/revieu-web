export const getRatingText = (rating: number): string => {
  switch (rating) {
    case 1: return "Poor";
    case 2: return "Fair";
    case 3: return "Good";
    case 4: return "Very Good";
    case 5: return "Excellent";
    default: return "";
  }
};

export const validateReviewForm = (
  restaurantName: string,
  rating: number,
  reviewText: string
): boolean => {
  return restaurantName.trim() !== '' && rating > 0 && reviewText.trim() !== '';
};

export const formatCharacterCount = (current: number, max: number): string => {
  return `${current}/${max} characters`;
};