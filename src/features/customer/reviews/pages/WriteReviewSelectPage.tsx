import React, { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, MapPin, Search, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../../../../components/common';
import { PATHS } from '../../../../routes/paths';
import {
  getWriteReviewTargetSelectionData,
  ReviewMerchantTargetOption,
  ReviewStoreTargetOption,
  WriteReviewTargetSelectionData,
} from '../services/writeReviewTargetService';

const matchesMerchantSearch = (merchant: ReviewMerchantTargetOption, search: string): boolean => {
  const haystack = `${merchant.name} ${merchant.category}`.toLowerCase();
  return haystack.includes(search);
};

const MerchantListSection = ({
  title,
  merchants,
  onSelect,
}: {
  title: string;
  merchants: ReviewMerchantTargetOption[];
  onSelect: (merchant: ReviewMerchantTargetOption) => void;
}) => {
  if (merchants.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-400">{title}</h2>
      <div className="space-y-3">
        {merchants.map((merchant) => (
          <button
            key={merchant.merchantId}
            type="button"
            onClick={() => onSelect(merchant)}
            className="flex w-full items-center gap-3 rounded-3xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:border-[#990000]/20 hover:shadow-md"
          >
            <ImageWithFallback
              src={merchant.image}
              alt={merchant.name}
              className="h-14 w-14 rounded-2xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-gray-900">{merchant.name}</p>
              <p className="mt-1 text-sm text-gray-500">{merchant.category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#990000]">{merchant.rating.toFixed(1)}</p>
              <p className="text-xs text-gray-400">{merchant.reviewCount} reviews</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </button>
        ))}
      </div>
    </section>
  );
};

const StoreListSection = ({
  title,
  stores,
  onSelect,
}: {
  title: string;
  stores: ReviewStoreTargetOption[];
  onSelect: (store: ReviewStoreTargetOption) => void;
}) => {
  if (stores.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-400">{title}</h2>
      <div className="space-y-3">
        {stores.map((store) => (
          <button
            key={store.storeId}
            type="button"
            onClick={() => onSelect(store)}
            className="flex w-full items-center gap-3 rounded-3xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:border-[#990000]/20 hover:shadow-md"
          >
            <ImageWithFallback
              src={store.image}
              alt={store.name}
              className="h-14 w-14 rounded-2xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-gray-900">{store.name}</p>
              <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{store.address}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#990000]">{store.rating.toFixed(1)}</p>
              <p className="text-xs text-gray-400">{store.reviewCount} reviews</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </button>
        ))}
      </div>
    </section>
  );
};

const WriteReviewSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectionData, setSelectionData] = useState<WriteReviewTargetSelectionData | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<ReviewMerchantTargetOption | null>(null);
  const [merchantSearch, setMerchantSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSelectionData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextData = await getWriteReviewTargetSelectionData();
        if (!cancelled) {
          setSelectionData(nextData);
        }
      } catch (loadError) {
        if (!cancelled) {
          console.error('Failed to load review target selector data:', loadError);
          setError('Unable to load merchants right now.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadSelectionData();

    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedMerchantSearch = merchantSearch.trim().toLowerCase();
  const recentMerchants = selectionData?.recentMerchants ?? [];
  const otherMerchants = selectionData?.otherMerchants ?? [];
  const filteredRecentMerchants = normalizedMerchantSearch
    ? recentMerchants.filter((merchant) => matchesMerchantSearch(merchant, normalizedMerchantSearch))
    : recentMerchants;
  const filteredOtherMerchants = normalizedMerchantSearch
    ? otherMerchants.filter((merchant) => matchesMerchantSearch(merchant, normalizedMerchantSearch))
    : otherMerchants;

  const selectedStores = selectedMerchant
    ? selectionData?.storesByMerchant[selectedMerchant.merchantId] ?? []
    : [];
  const recentStores = selectedStores.filter((store) => store.isRecent);
  const otherStores = selectedStores.filter((store) => !store.isRecent);

  const handleSelectStore = (store: ReviewStoreTargetOption) => {
    if (!selectedMerchant) {
      return;
    }

    navigate(PATHS.CUSTOMER.WRITE_REVIEW, {
      state: {
        merchantId: selectedMerchant.merchantId,
        merchantName: selectedMerchant.name,
        storeId: store.storeId,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 pb-8 pt-6">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (selectedMerchant) {
                setSelectedMerchant(null);
                return;
              }

              navigate(-1);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#990000]">
              {selectedMerchant ? 'Step 2 of 2' : 'Step 1 of 2'}
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedMerchant ? 'Choose a location' : 'Choose a merchant'}
            </h1>
          </div>
        </div>

        {!selectedMerchant && (
          <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-gray-600" htmlFor="merchant-search">
              Search merchants
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                id="merchant-search"
                value={merchantSearch}
                onChange={(event) => setMerchantSearch(event.target.value)}
                placeholder="Search merchants"
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        )}

        {isLoading && (
          <div className="rounded-3xl border border-gray-100 bg-white px-5 py-8 text-center text-sm text-gray-500 shadow-sm">
            Loading review options...
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-3xl border border-red-100 bg-red-50 px-5 py-8 text-center text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!isLoading && !error && !selectedMerchant && (
          <div className="space-y-6">
            {normalizedMerchantSearch ? (
              filteredRecentMerchants.length === 0 && filteredOtherMerchants.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-500 shadow-sm">
                  No merchants match your search.
                </div>
              ) : (
                <MerchantListSection
                  title="Search results"
                  merchants={[...filteredRecentMerchants, ...filteredOtherMerchants]}
                  onSelect={setSelectedMerchant}
                />
              )
            ) : (
              <>
                <MerchantListSection
                  title="Recent purchases"
                  merchants={filteredRecentMerchants}
                  onSelect={setSelectedMerchant}
                />
                <MerchantListSection
                  title="All merchants"
                  merchants={filteredOtherMerchants}
                  onSelect={setSelectedMerchant}
                />
              </>
            )}
          </div>
        )}

        {!isLoading && !error && selectedMerchant && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src={selectedMerchant.image}
                  alt={selectedMerchant.name}
                  className="h-14 w-14 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-gray-900">{selectedMerchant.name}</p>
                  <p className="text-sm text-gray-500">{selectedMerchant.category}</p>
                </div>
              </div>
            </div>

            {selectedStores.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-500 shadow-sm">
                This merchant does not have any published locations available for review.
              </div>
            ) : (
              <>
                <StoreListSection title="Recent purchases" stores={recentStores} onSelect={handleSelectStore} />
                <StoreListSection title="All locations" stores={otherStores} onSelect={handleSelectStore} />
              </>
            )}
          </div>
        )}

        {!isLoading && !error && !selectedMerchant && recentMerchants.length === 0 && otherMerchants.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-500 shadow-sm">
            <Store className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            No merchants with reviewable locations are available right now.
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteReviewSelectPage;
