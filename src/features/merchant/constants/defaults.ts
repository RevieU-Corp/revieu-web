// Default assets for merchant profiles
export const DEFAULT_MERCHANT_ASSETS = {
  // Default cover photo - beautiful cafe storefront scene
  COVER_PHOTO: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
  
  // Default gallery images for new merchants
  DEFAULT_GALLERY: [
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop", // Interior seating
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop", // Cafe area
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", // Kitchen
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"  // Food close-up
  ]
};

// Helper function to get default cover photo
export const getDefaultCoverPhoto = (): string => {
  return DEFAULT_MERCHANT_ASSETS.COVER_PHOTO;
};

// Helper function to check if an image is the default cover photo
export const isDefaultCoverPhoto = (imageUrl: string): boolean => {
  return imageUrl === DEFAULT_MERCHANT_ASSETS.COVER_PHOTO;
};