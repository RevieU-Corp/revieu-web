import { DEFAULT_MERCHANT_ASSETS } from '../constants/defaults';

export interface MerchantProfile {
  name: string;
  phone: string;
  website: string;
  address: string;
  coordinates: { lat: number; lng: number };
  coverPhoto: string;
  gallery: string[];
  bio: string;
  menu: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  isAvailable: boolean;
}

/**
 * Creates a new merchant profile with default values
 */
export const createDefaultMerchantProfile = (overrides: Partial<MerchantProfile> = {}): MerchantProfile => {
  return {
    name: "New Business",
    phone: "",
    website: "",
    address: "",
    coordinates: { lat: 0, lng: 0 },
    coverPhoto: DEFAULT_MERCHANT_ASSETS.COVER_PHOTO,
    gallery: [...DEFAULT_MERCHANT_ASSETS.DEFAULT_GALLERY],
    bio: "Welcome to our business! We're excited to serve you.",
    menu: [],
    ...overrides
  };
};

/**
 * Resets merchant profile images to defaults
 */
export const resetToDefaultImages = (profile: MerchantProfile): MerchantProfile => {
  return {
    ...profile,
    coverPhoto: DEFAULT_MERCHANT_ASSETS.COVER_PHOTO,
    gallery: [...DEFAULT_MERCHANT_ASSETS.DEFAULT_GALLERY]
  };
};

/**
 * Checks if the merchant is using default cover photo
 */
export const isUsingDefaultCover = (profile: MerchantProfile): boolean => {
  return profile.coverPhoto === DEFAULT_MERCHANT_ASSETS.COVER_PHOTO;
};