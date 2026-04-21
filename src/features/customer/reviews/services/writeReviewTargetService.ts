import { apiClient } from '../../../../api/apiClient';
import { storeBrowserService, StoreBrowserMerchant } from '../../shared/services/storeBrowserService';

type BackendOrder = {
  merchant_id?: number | string | null;
  store_id?: number | string | null;
  status?: string | null;
  created_at?: string | null;
};

type BackendMerchant = {
  id: number | string;
  name?: string | null;
  businessName?: string | null;
  category?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  coverImage?: string | null;
};

const DEFAULT_MERCHANT_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200';

export interface ReviewMerchantTargetOption {
  merchantId: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
}

export interface ReviewStoreTargetOption {
  storeId: string;
  merchantId: string;
  name: string;
  image: string;
  category: string;
  address: string;
  rating: number;
  reviewCount: number;
  isRecent: boolean;
}

export interface WriteReviewTargetSelectionData {
  recentMerchants: ReviewMerchantTargetOption[];
  otherMerchants: ReviewMerchantTargetOption[];
  storesByMerchant: Record<string, ReviewStoreTargetOption[]>;
}

const parseTimestamp = (value?: string | null): number => {
  if (!value) {
    return 0;
  }

  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const mapMerchant = (merchant: BackendMerchant): ReviewMerchantTargetOption => ({
  merchantId: String(merchant.id),
  name: merchant.businessName?.trim() || merchant.name?.trim() || `Merchant ${merchant.id}`,
  category: merchant.category?.trim() || 'Merchant',
  image: merchant.coverImage?.trim() || DEFAULT_MERCHANT_IMAGE,
  rating: typeof merchant.rating === 'number' ? merchant.rating : 0,
  reviewCount: typeof merchant.reviewCount === 'number' ? merchant.reviewCount : 0,
});

const mapStore = (
  store: StoreBrowserMerchant,
  isRecent: boolean,
): ReviewStoreTargetOption => ({
  storeId: store.id,
  merchantId: store.merchantId,
  name: store.name,
  image: store.image,
  category: store.category,
  address: [store.city, store.state].filter(Boolean).join(', ') || 'Location unavailable',
  rating: store.rating,
  reviewCount: store.reviewCount,
  isRecent,
});

export async function getWriteReviewTargetSelectionData(): Promise<WriteReviewTargetSelectionData> {
  const [ordersResponse, merchantsResponse, stores] = await Promise.all([
    apiClient.get<{ data: BackendOrder[] }>('/orders'),
    apiClient.get<{ data: BackendMerchant[] }>('/merchants'),
    storeBrowserService.listStores(100),
  ]);

  const availableMerchantIds = new Set(stores.map((store) => store.merchantId));
  const availableStoreIds = new Set(stores.map((store) => store.id));

  const merchants = (merchantsResponse.data?.data ?? [])
    .map(mapMerchant)
    .filter((merchant) => availableMerchantIds.has(merchant.merchantId))
    .sort((left, right) => left.name.localeCompare(right.name));

  const merchantById = new Map(merchants.map((merchant) => [merchant.merchantId, merchant]));
  const recentMerchantIds: string[] = [];
  const recentStoreIdsByMerchant = new Map<string, string[]>();

  const paidOrders = [...(ordersResponse.data?.data ?? [])]
    .filter((order) => order.status === 'paid')
    .sort((left, right) => parseTimestamp(right.created_at) - parseTimestamp(left.created_at));

  paidOrders.forEach((order) => {
    const merchantId =
      order.merchant_id !== null && order.merchant_id !== undefined ? String(order.merchant_id) : '';
    const storeId =
      order.store_id !== null && order.store_id !== undefined ? String(order.store_id) : '';

    if (!merchantId || !storeId) {
      return;
    }

    if (!availableMerchantIds.has(merchantId) || !availableStoreIds.has(storeId)) {
      return;
    }

    if (!recentMerchantIds.includes(merchantId)) {
      recentMerchantIds.push(merchantId);
    }

    const recentStoreIds = recentStoreIdsByMerchant.get(merchantId) ?? [];
    if (!recentStoreIds.includes(storeId)) {
      recentStoreIds.push(storeId);
      recentStoreIdsByMerchant.set(merchantId, recentStoreIds);
    }
  });

  const recentMerchants = recentMerchantIds
    .map((merchantId) => merchantById.get(merchantId))
    .filter((merchant): merchant is ReviewMerchantTargetOption => Boolean(merchant));

  const recentMerchantIdSet = new Set(recentMerchants.map((merchant) => merchant.merchantId));
  const otherMerchants = merchants.filter((merchant) => !recentMerchantIdSet.has(merchant.merchantId));

  const storesByMerchant: Record<string, ReviewStoreTargetOption[]> = {};

  merchants.forEach((merchant) => {
    const recentStoreIds = recentStoreIdsByMerchant.get(merchant.merchantId) ?? [];
    const recentStoreOrder = new Map(recentStoreIds.map((storeId, index) => [storeId, index]));

    storesByMerchant[merchant.merchantId] = stores
      .filter((store) => store.merchantId === merchant.merchantId)
      .sort((left, right) => {
        const leftRecent = recentStoreOrder.has(left.id);
        const rightRecent = recentStoreOrder.has(right.id);

        if (leftRecent && rightRecent) {
          return recentStoreOrder.get(left.id)! - recentStoreOrder.get(right.id)!;
        }

        if (leftRecent) {
          return -1;
        }

        if (rightRecent) {
          return 1;
        }

        return left.name.localeCompare(right.name);
      })
      .map((store) => mapStore(store, recentStoreOrder.has(store.id)));
  });

  return {
    recentMerchants,
    otherMerchants,
    storesByMerchant,
  };
}
