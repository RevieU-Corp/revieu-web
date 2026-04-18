import { useEffect, useState } from 'react';
import { MapPin, Phone, Star, Ticket, MenuSquare, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../../../api/apiClient';
import { couponService } from '../../../shared/services/couponService';
import { Coupon, MerchantInfo } from '../../../shared/types/coupons';
import { PATHS } from '../../../../../routes/paths';
import { DealCard } from './DealCard';
import { ImageWithFallback } from './ImageWithFallback';

interface RestaurantDetailProps {
  storeId?: string;
  onBack?: () => void;
}

interface BackendStore {
  id: number;
  merchant_id: number;
  name: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  phone?: string | null;
  cover_image_url?: string | null;
  avg_rating?: number | null;
  review_count?: number | null;
}

interface StoreDetail {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  coverImageUrl: string;
  rating: number;
  reviewCount: number;
}

const FALLBACK_HERO =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80';
const FALLBACK_LOGO =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80';

const FALLBACK_STORE: StoreDetail = {
  id: '',
  merchantId: '',
  name: 'Merchant Preview',
  description: 'Live store data is not available for this route yet.',
  address: 'Store details will appear here after the backend lookup succeeds.',
  phone: '',
  coverImageUrl: FALLBACK_HERO,
  rating: 0,
  reviewCount: 0,
};

const mapStore = (raw: BackendStore): StoreDetail => {
  const addressParts = [raw.address, raw.city, raw.state, raw.country].filter(Boolean);

  return {
    id: String(raw.id),
    merchantId: String(raw.merchant_id),
    name: raw.name,
    description: raw.description ?? 'No store description available yet.',
    address: addressParts.join(', ') || 'Address unavailable',
    phone: raw.phone ?? '',
    coverImageUrl: raw.cover_image_url || FALLBACK_HERO,
    rating: raw.avg_rating ?? 0,
    reviewCount: raw.review_count ?? 0,
  };
};

export function RestaurantDetail({ storeId, onBack }: RestaurantDetailProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'deals' | 'menu' | 'reviews'>('deals');
  const [store, setStore] = useState<StoreDetail>(FALLBACK_STORE);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadStore = async () => {
      if (!storeId) {
        setIsLoading(false);
        setError('Store id is missing');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [storeResponse, couponList] = await Promise.all([
          apiClient.get(`/stores/${storeId}`),
          couponService.getAvailableCoupons(storeId, ''),
        ]);

        if (cancelled) {
          return;
        }

        setStore(mapStore(storeResponse.data.data));
        setCoupons(couponList);
      } catch (loadError) {
        if (!cancelled) {
          console.error('Failed to load store detail:', loadError);
          setError('Live store data is unavailable for this route.');
          setCoupons([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadStore();

    return () => {
      cancelled = true;
    };
  }, [storeId]);

  const merchantInfo: MerchantInfo = {
    id: store.merchantId,
    name: store.name,
    logo: '',
    address: store.address,
    phone: store.phone,
  };

  const handleWriteReview = () => {
    if (!store.id || !store.merchantId) {
      return;
    }

    navigate(PATHS.CUSTOMER.WRITE_REVIEW, {
      state: {
        merchantId: store.merchantId,
        merchantName: store.name,
        storeId: store.id,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="relative h-64 w-full">
        <ImageWithFallback
          src={store.coverImageUrl}
          alt={store.name}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow"
        >
          Back
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 translate-y-1/2 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
          <ImageWithFallback
            src={store.coverImageUrl || FALLBACK_LOGO}
            alt={`${store.name} logo`}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="px-6 pb-8 pt-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">{store.description}</p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-[#FFA500] px-3 py-1 text-white">
            <Star className="h-4 w-4 fill-white text-white" />
            <span className="font-semibold">{store.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-500">{store.reviewCount} reviews</span>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleWriteReview}
            disabled={!store.id || !store.merchantId}
            className="rounded-full bg-[#990000] px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#7a0000] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Write Review
          </button>
        </div>

        <div className="mt-6 space-y-3 rounded-3xl border border-gray-100 bg-gray-50 p-5">
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <MapPin className="mt-0.5 h-5 w-5 text-[#FF6900]" />
            <span>{store.address}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Phone className="h-5 w-5 text-[#FF6900]" />
            <span>{store.phone || 'Phone unavailable'}</span>
          </div>
        </div>

        <div className="mt-6 flex rounded-full border border-gray-200 bg-gray-50 p-1">
          {[
            { key: 'deals', label: 'Deals', icon: Ticket },
            { key: 'menu', label: 'Menu', icon: MenuSquare },
            { key: 'reviews', label: 'Reviews', icon: MessageCircle },
          ].map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key as 'deals' | 'menu' | 'reviews')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  isActive ? 'bg-white text-[#FF6900] shadow-sm' : 'text-gray-500'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>

        {activeTab === 'deals' && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Live Coupons</h2>
              {isLoading && <span className="text-sm text-gray-400">Loading...</span>}
            </div>

            {error && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {error}
              </div>
            )}

            {!isLoading && coupons.length === 0 && (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
                No live coupons are available for this store yet.
              </div>
            )}

            {coupons.map((coupon) => (
              <DealCard
                key={coupon.id}
                id={coupon.id}
                title={coupon.title}
                description={coupon.description}
                expiry={`Valid until ${coupon.expiryDate.toLocaleDateString('en-US')}`}
                expiryDate={coupon.expiryDate}
                value={coupon.value || (coupon.price ? `$${coupon.price}` : 'FREE')}
                type={coupon.type}
                price={coupon.price}
                merchantId={coupon.merchantId}
                usageInstructions={coupon.usageInstructions}
                merchantInfo={merchantInfo}
              />
            ))}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="mt-8 rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
            Menu data is still mocked in the frontend. The store detail and coupon APIs are now live; menu integration can be done next.
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="mt-8 rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
            Reviews are not wired into this page yet. The next backend-aligned step is `/stores/:id/reviews`.
          </div>
        )}
      </div>
    </div>
  );
}
