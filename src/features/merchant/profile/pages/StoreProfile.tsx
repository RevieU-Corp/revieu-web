import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Phone,
  Globe,
  Camera,
  Plus,
  Edit3,
  Save,
  X,
  ExternalLink,
  Trash2,
  Upload,
  ImageIcon
} from 'lucide-react';
import InteractiveMap from '../../shared/components/InteractiveMap';
import ConfirmationDialog from '../../shared/components/ConfirmationDialog';
import MenuItemModal from '../../shared/components/MenuItemModal';
import { DEFAULT_MERCHANT_ASSETS } from '../../shared/constants/defaults';
import {
  MerchantStoreRecord,
  storeProfileService,
  parseStringArray,
  uploadMerchantImages,
} from '../services/storeProfileService';

// TypeScript interfaces
interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  isAvailable: boolean;
  image?: string;
}

interface StoreData {
  id: string;
  name: string;
  phone: string;
  website: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  coordinates: { lat: number; lng: number };
  coverPhoto: string;
  gallery: string[];
  menuImages: string[];
  bio: string;
  menu: MenuItem[];
  operatingHours: {
    open: string;
    close: string;
  };
  outdoorSeating: boolean;
  accessibility: boolean;
  petFriendly: boolean;
  wifiOutlets: 'none' | 'wifi' | 'outlets' | 'both';
  parking: 'free' | 'paid' | 'valet' | 'street';
}

// Mock data for McDonald's USC
const mockStoreData: StoreData = {
  id: '',
  name: "McDonald's - USC Figueroa",
  phone: "+1 (213) 749-1444",
  website: "https://www.mcdonalds.com/location/ca/los-angeles/3037-s-figueroa-st/",
  streetAddress: "3037 S Figueroa St",
  city: 'Los Angeles',
  state: 'CA',
  country: 'USA',
  coordinates: { lat: 34.0253, lng: -118.2831 },
  coverPhoto: DEFAULT_MERCHANT_ASSETS.COVER_PHOTO, // Use default cover photo
  gallery: [],
  menuImages: [],
  bio: "Welcome to the heart of the Trojan community! Serving USC students and local residents 24/7. We offer high-speed Wi-Fi, ample indoor seating, and the classic taste you love. Perfect for late-night study sessions or pre-game meals.",
  operatingHours: {
    open: "06:00",
    close: "23:00"
  },
  outdoorSeating: true,
  accessibility: true,
  petFriendly: false,
  wifiOutlets: 'both',
  parking: 'street',
  menu: [
    {
      id: 1,
      name: "Big Mac",
      price: 5.99,
      description: "Double beef patties with special sauce, lettuce, cheese, pickles, onions on a sesame seed bun.",
      category: "Burgers",
      isAvailable: true,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "World Famous Fries",
      price: 3.49,
      description: "Golden, crispy potatoes fried to perfection.",
      category: "Sides",
      isAvailable: true,
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      name: "McFlurry with OREO",
      price: 4.29,
      description: "Creamy vanilla soft serve mixed with crunchy OREO pieces.",
      category: "Desserts",
      isAvailable: true,
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop"
    }
  ]
};

const categoryColors: Record<string, string> = {
  "Burgers": "bg-blue-100 text-blue-800",
  "Sides": "bg-green-100 text-green-800",
  "Desserts": "bg-purple-100 text-purple-800",
  "Drinks": "bg-orange-100 text-orange-800"
};

const formatAddress = (store: Pick<StoreData, 'streetAddress' | 'city' | 'state' | 'country'>) =>
  [store.streetAddress, store.city, store.state, store.country].filter(Boolean).join(', ');

const normalizeStoreData = (raw: MerchantStoreRecord, base: StoreData = mockStoreData): StoreData => ({
  ...base,
  id: String(raw.id),
  name: raw.name ?? base.name,
  phone: raw.phone ?? '',
  website: raw.website ?? '',
  streetAddress: raw.address ?? '',
  city: raw.city ?? '',
  state: raw.state ?? '',
  country: raw.country ?? '',
  coordinates: {
    lat: raw.latitude ?? base.coordinates.lat,
    lng: raw.longitude ?? base.coordinates.lng,
  },
  coverPhoto: raw.cover_image_url || DEFAULT_MERCHANT_ASSETS.COVER_PHOTO,
  gallery: parseStringArray(raw.images),
  menuImages: parseStringArray(raw.menu_images),
  bio: raw.description ?? '',
});

const buildStoreUpdatePayload = (store: StoreData) => ({
  name: store.name,
  description: store.bio,
  address: store.streetAddress,
  city: store.city,
  state: store.state,
  country: store.country,
  phone: store.phone,
  website: store.website,
  latitude: store.coordinates.lat,
  longitude: store.coordinates.lng,
  cover_image_url: store.coverPhoto,
  images: store.gallery,
  menu_images: store.menuImages,
});

const StoreProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [storeData, setStoreData] = useState(mockStoreData);
  const [savedStoreData, setSavedStoreData] = useState(mockStoreData);
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  const [menuItemModal, setMenuItemModal] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    item: MenuItem | null;
  }>({
    isOpen: false,
    mode: 'add',
    item: null
  });

  useEffect(() => {
    let cancelled = false;

    const loadStore = async () => {
      setIsLoadingStore(true);
      setStatusMessage(null);

      try {
        const primaryStore = await storeProfileService.getPrimaryStore();
        if (cancelled) {
          return;
        }

        if (!primaryStore) {
          setStatusMessage('No merchant store found yet.');
          setStoreData(mockStoreData);
          setSavedStoreData(mockStoreData);
          return;
        }

        const normalizedStore = normalizeStoreData(primaryStore, mockStoreData);
        setStoreData(normalizedStore);
        setSavedStoreData(normalizedStore);
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load store profile:', error);
          setStatusMessage('Failed to load your store profile.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingStore(false);
        }
      }
    };

    void loadStore();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    if (!storeData.id) {
      setStatusMessage('Store context is missing.');
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const updatedStore = await storeProfileService.updateStore(
        storeData.id,
        buildStoreUpdatePayload(storeData)
      );
      const normalizedStore = normalizeStoreData(updatedStore, storeData);
      setStoreData(normalizedStore);
      setSavedStoreData(normalizedStore);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save store profile:', error);
      setStatusMessage('Failed to save store profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setStatusMessage(null);
    setStoreData(savedStoreData);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'cover' | 'gallery' | 'menuImages'
  ) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (files.length === 0) {
      return;
    }

    setIsUploadingImages(true);
    setStatusMessage(null);

    try {
      const uploadedUrls = await uploadMerchantImages(
        type === 'cover' ? [files[0]] : files
      );

      setStoreData((prev) => {
        if (type === 'cover') {
          return {
            ...prev,
            coverPhoto: uploadedUrls[0] ?? prev.coverPhoto,
          };
        }

        if (type === 'gallery') {
          return {
            ...prev,
            gallery: [...prev.gallery, ...uploadedUrls],
          };
        }

        return {
          ...prev,
          menuImages: [...prev.menuImages, ...uploadedUrls],
        };
      });
    } catch (error) {
      console.error('Failed to upload images:', error);
      setStatusMessage('Failed to upload images.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleGalleryImageEdit = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setIsUploadingImages(true);
    setStatusMessage(null);

    try {
      const [uploadedUrl] = await uploadMerchantImages([file]);
      if (!uploadedUrl) {
        return;
      }

      setStoreData((prev) => ({
        ...prev,
        gallery: prev.gallery.map((img, i) => (i === index ? uploadedUrl : img)),
      }));
    } catch (error) {
      console.error('Failed to replace gallery image:', error);
      setStatusMessage('Failed to upload images.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleDeleteGalleryImage = (index: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Photo',
      message: 'Are you sure you want to delete this photo? This action cannot be undone.',
      onConfirm: () => {
        setStoreData(prev => ({
          ...prev,
          gallery: prev.gallery.filter((_, i) => i !== index)
        }));
        closeConfirmDialog();
      }
    });
  };

  const handleMenuImageEdit = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setIsUploadingImages(true);
    setStatusMessage(null);

    try {
      const [uploadedUrl] = await uploadMerchantImages([file]);
      if (!uploadedUrl) {
        return;
      }

      setStoreData((prev) => ({
        ...prev,
        menuImages: prev.menuImages.map((img, i) => (i === index ? uploadedUrl : img)),
      }));
    } catch (error) {
      console.error('Failed to replace menu image:', error);
      setStatusMessage('Failed to upload images.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleDeleteMenuImage = (index: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Menu Image',
      message: 'Are you sure you want to delete this menu image? This action cannot be undone.',
      onConfirm: () => {
        setStoreData(prev => ({
          ...prev,
          menuImages: prev.menuImages.filter((_, i) => i !== index)
        }));
        closeConfirmDialog();
      }
    });
  };

  const handleDeleteMenuItem = (itemId: number) => {
    const item = storeData.menu.find(m => m.id === itemId);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Menu Item',
      message: `Are you sure you want to delete "${item?.name}"? This action cannot be undone.`,
      onConfirm: () => {
        setStoreData(prev => ({
          ...prev,
          menu: prev.menu.filter(item => item.id !== itemId)
        }));
        closeConfirmDialog();
      }
    });
  };

  const handleMenuItemImageUpload = (itemId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a JPEG, PNG, or WebP image');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setStoreData(prev => ({
          ...prev,
          menu: prev.menu.map(item =>
            item.id === itemId ? { ...item, image: result } : item
          )
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMenuItemImage = (itemId: number) => {
    setStoreData(prev => ({
      ...prev,
      menu: prev.menu.map(item =>
        item.id === itemId ? { ...item, image: undefined } : item
      )
    }));
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleAddMenuItem = () => {
    setMenuItemModal({
      isOpen: true,
      mode: 'add',
      item: null
    });
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setMenuItemModal({
      isOpen: true,
      mode: 'edit',
      item
    });
  };

  const handleSaveMenuItem = (itemData: Omit<MenuItem, 'id'> | MenuItem) => {
    if (menuItemModal.mode === 'add') {
      // Generate new ID
      const newId = Math.max(...storeData.menu.map(item => item.id), 0) + 1;
      const newItem: MenuItem = {
        id: newId,
        ...(itemData as Omit<MenuItem, 'id'>)
      };
      
      setStoreData(prev => ({
        ...prev,
        menu: [...prev.menu, newItem]
      }));
    } else {
      // Update existing item
      setStoreData(prev => ({
        ...prev,
        menu: prev.menu.map(item =>
          item.id === (itemData as MenuItem).id ? (itemData as MenuItem) : item
        )
      }));
    }
  };

  const closeMenuItemModal = () => {
    setMenuItemModal({
      isOpen: false,
      mode: 'add',
      item: null
    });
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{storeData.name}</h1>
            {isLoadingStore && <p className="mt-1 text-sm text-gray-500">Loading store profile...</p>}
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving || isUploadingImages}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || isUploadingImages}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
                  style={{ backgroundColor: '#FFBC0D' }}
                >
                  <Save size={16} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoadingStore}
                className="flex items-center gap-2 px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
                style={{ backgroundColor: '#FFBC0D' }}
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {statusMessage && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {statusMessage}
          </div>
        )}

        {/* Cover Photo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="relative aspect-video bg-gray-100">
            <img
              src={storeData.coverPhoto || DEFAULT_MERCHANT_ASSETS.COVER_PHOTO}
              alt="Store cover"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to default image if the current image fails to load
                const target = e.target as HTMLImageElement;
                if (target.src !== DEFAULT_MERCHANT_ASSETS.COVER_PHOTO) {
                  target.src = DEFAULT_MERCHANT_ASSETS.COVER_PHOTO;
                }
              }}
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <label className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                  <Camera size={16} />
                  {storeData.coverPhoto === DEFAULT_MERCHANT_ASSETS.COVER_PHOTO
                    ? 'Upload Cover Photo'
                    : 'Change Cover Photo'
                  }
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'cover')}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Default image indicator */}
            {!isEditing && storeData.coverPhoto === DEFAULT_MERCHANT_ASSETS.COVER_PHOTO && (
              <div className="absolute top-4 left-4">
                <div className="bg-blue-100 border border-blue-300 rounded-lg px-3 py-1">
                  <p className="text-xs text-blue-800 font-medium">
                    📸 Default Cover Photo
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={storeData.name}
                  onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 font-medium">{storeData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={storeData.phone}
                    onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{storeData.phone}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-gray-400" />
                {isEditing ? (
                  <input
                    type="url"
                    value={storeData.website}
                    onChange={(e) => setStoreData({ ...storeData, website: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                ) : (
                  <a
                    href={storeData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {storeData.website}
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Opening Time</label>
                  {isEditing ? (
                    <input
                      type="time"
                      value={storeData.operatingHours.open}
                      onChange={(e) => setStoreData({
                        ...storeData,
                        operatingHours: { ...storeData.operatingHours, open: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{storeData.operatingHours.open}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Closing Time</label>
                  {isEditing ? (
                    <input
                      type="time"
                      value={storeData.operatingHours.close}
                      onChange={(e) => setStoreData({
                        ...storeData,
                        operatingHours: { ...storeData.operatingHours, close: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{storeData.operatingHours.close}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Outdoor Seating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Outdoor Seating</label>
              {isEditing ? (
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="outdoorSeating"
                      checked={storeData.outdoorSeating === true}
                      onChange={() => setStoreData({ ...storeData, outdoorSeating: true })}
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="outdoorSeating"
                      checked={storeData.outdoorSeating === false}
                      onChange={() => setStoreData({ ...storeData, outdoorSeating: false })}
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
              ) : (
                <p className="text-gray-900">{storeData.outdoorSeating ? 'Yes' : 'No'}</p>
              )}
            </div>

            {/* Accessibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accessibility (ADA Compliant)</label>
              {isEditing ? (
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="accessibility"
                      checked={storeData.accessibility === true}
                      onChange={() => setStoreData({ ...storeData, accessibility: true })}
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="accessibility"
                      checked={storeData.accessibility === false}
                      onChange={() => setStoreData({ ...storeData, accessibility: false })}
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
              ) : (
                <p className="text-gray-900">{storeData.accessibility ? 'Yes' : 'No'}</p>
              )}
            </div>

            {/* Pet-Friendly */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pet-Friendly</label>
              {isEditing ? (
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="petFriendly"
                      checked={storeData.petFriendly === true}
                      onChange={() => setStoreData({ ...storeData, petFriendly: true })}
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="petFriendly"
                      checked={storeData.petFriendly === false}
                      onChange={() => setStoreData({ ...storeData, petFriendly: false })}
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
              ) : (
                <p className="text-gray-900">{storeData.petFriendly ? 'Yes' : 'No'}</p>
              )}
            </div>

            {/* Wi-Fi & Outlets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wi-Fi & Outlets</label>
              {isEditing ? (
                <select
                  value={storeData.wifiOutlets}
                  onChange={(e) => setStoreData({ ...storeData, wifiOutlets: e.target.value as 'none' | 'wifi' | 'outlets' | 'both' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="none">None</option>
                  <option value="wifi">Free Wi-Fi</option>
                  <option value="outlets">Power Outlets Available</option>
                  <option value="both">Free Wi-Fi & Power Outlets</option>
                </select>
              ) : (
                <p className="text-gray-900">
                  {storeData.wifiOutlets === 'none' && 'None'}
                  {storeData.wifiOutlets === 'wifi' && 'Free Wi-Fi'}
                  {storeData.wifiOutlets === 'outlets' && 'Power Outlets Available'}
                  {storeData.wifiOutlets === 'both' && 'Free Wi-Fi & Power Outlets'}
                </p>
              )}
            </div>

            {/* Parking */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parking</label>
              {isEditing ? (
                <select
                  value={storeData.parking}
                  onChange={(e) => setStoreData({ ...storeData, parking: e.target.value as 'free' | 'paid' | 'valet' | 'street' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="free">Free Parking</option>
                  <option value="paid">Paid Parking</option>
                  <option value="valet">Valet</option>
                  <option value="street">Street Parking</option>
                </select>
              ) : (
                <p className="text-gray-900">
                  {storeData.parking === 'free' && 'Free Parking'}
                  {storeData.parking === 'paid' && 'Paid Parking'}
                  {storeData.parking === 'valet' && 'Valet'}
                  {storeData.parking === 'street' && 'Street Parking'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-400 mt-1" />
                {isEditing ? (
                  <textarea
                    value={storeData.streetAddress}
                    onChange={(e) => setStoreData({ ...storeData, streetAddress: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows={2}
                  />
                ) : (
                  <p className="text-gray-900">{formatAddress(storeData)}</p>
                )}
              </div>
            </div>

            {/* Interactive Map */}
            <InteractiveMap
              lat={storeData.coordinates.lat}
              lng={storeData.coordinates.lng}
              address={formatAddress(storeData)}
              isEditing={isEditing}
            />
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Photo Gallery</h2>
            {isEditing && (
              <label className="flex items-center gap-2 px-3 py-2 text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
                <Plus size={16} />
                Add Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'gallery')}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {storeData.gallery.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                {isEditing && (
                  <>
                    {/* Overlay for better button visibility */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg z-10 gallery-overlay" />

                    {/* Delete button - top right corner */}
                    <button
                      onClick={() => handleDeleteGalleryImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 bg-opacity-95 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-700 shadow-lg z-30 gallery-button group/delete"
                      title="Delete photo"
                      style={{ backdropFilter: 'blur(4px)' }}
                    >
                      <X size={12} />
                      {/* Tooltip */}
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/delete:opacity-100 transition-opacity whitespace-nowrap">
                        Delete
                      </span>
                    </button>

                    {/* Edit button - bottom right corner */}
                    <label className="absolute bottom-2 right-2 p-2 bg-white bg-opacity-95 rounded-full text-gray-700 hover:bg-gray-100 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-30 gallery-button group/edit"
                      title="Edit photo"
                      style={{ backdropFilter: 'blur(4px)' }}
                    >
                      <Edit3 size={14} />
                      {/* Tooltip */}
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/edit:opacity-100 transition-opacity whitespace-nowrap">
                        Edit
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleGalleryImageEdit(index, e)}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
            ))}
          </div>
          {storeData.gallery.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Camera size={32} className="mx-auto mb-2 text-gray-400" />
              <p>No photos yet. Add some photos to showcase your business!</p>
            </div>
          )}
        </div>

        {/* Store Bio */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Bio</h2>
          {isEditing ? (
            <textarea
              value={storeData.bio}
              onChange={(e) => setStoreData({ ...storeData, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              rows={4}
              placeholder="Tell customers about your store..."
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">{storeData.bio}</p>
          )}
        </div>

        {/* Menu Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Menu Images</h2>
              <p className="text-sm text-gray-600 mt-1">
                Upload photos of your physical menus, menu boards, or digital displays
              </p>
            </div>
            {isEditing && (
              <label className="flex items-center gap-2 px-3 py-2 text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
                <Plus size={16} />
                Add Menu Image
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'menuImages')}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {storeData.menuImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {storeData.menuImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image}
                      alt={`Menu ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                        {/* Edit button */}
                        <label className="p-2 bg-white bg-opacity-90 text-gray-700 rounded-full hover:bg-opacity-100 transition-all cursor-pointer shadow-lg">
                          <Edit3 size={16} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMenuImageEdit(index, e)}
                            className="hidden"
                          />
                        </label>
                        
                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteMenuImage(index)}
                          className="p-2 bg-red-600 bg-opacity-90 text-white rounded-full hover:bg-opacity-100 transition-all shadow-lg"
                          title="Delete menu image"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">No menu images yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                {isEditing 
                  ? "Upload photos of your menus to help customers see what you offer"
                  : "Menu images will appear here once added"
                }
              </p>
              {isEditing && (
                <label className="inline-flex items-center gap-2 px-4 py-2 text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
                  <Plus size={16} />
                  Add First Menu Image
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'menuImages')}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Star Products</h2>
            </div>
            {isEditing && (
              <button 
                onClick={handleAddMenuItem}
                className="flex items-center gap-2 px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
                style={{ backgroundColor: '#FFBC0D' }}>
                <Plus size={16} />
                Add Item
              </button>
            )}
          </div>

          {isEditing && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Image Guidelines:</strong> Upload high-quality images (JPEG, PNG, or WebP) up to 5MB.
                Square images work best for consistent display.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {storeData.menu.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Menu Item Image */}
                  <div className="flex-shrink-0">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      {item.image ? (
                        <>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {isEditing && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <div className="flex gap-1">
                                <label className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                                  title="Change image">
                                  <Edit3 size={12} />
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => handleMenuItemImageUpload(item.id, e)}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  onClick={() => handleRemoveMenuItemImage(item.id)}
                                  className="p-1.5 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                                  title="Remove image"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {isEditing ? (
                            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-50 transition-colors">
                              <Upload size={16} className="text-gray-400 mb-1" />
                              <span className="text-xs text-gray-500 text-center px-1">Add Image</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => handleMenuItemImageUpload(item.id, e)}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <ImageIcon size={16} className="mb-1" />
                              <span className="text-xs text-center">No Image</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Menu Item Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[item.category] || 'bg-gray-100 text-gray-800'}`}>
                            {item.category}
                          </span>
                          {item.isAvailable && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Available
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <p className="text-xl font-bold text-gray-900">${item.price}</p>
                        {isEditing && (
                          <div className="flex items-center gap-2 mt-2">
                            <button 
                              onClick={() => handleEditMenuItem(item)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="p-1 text-red-400 hover:text-red-600 transition-colors"
                              title="Delete menu item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {storeData.menu.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Plus size={32} className="mx-auto mb-2 text-gray-400" />
              <p>No menu items yet. Add some items to showcase your offerings!</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="danger"
      />

      {/* Menu Item Modal */}
      <MenuItemModal
        isOpen={menuItemModal.isOpen}
        onClose={closeMenuItemModal}
        onSave={handleSaveMenuItem}
        item={menuItemModal.item}
        mode={menuItemModal.mode}
      />
    </>
  );
};

export default StoreProfile;
