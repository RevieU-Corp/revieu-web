import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Star, ChevronLeft } from 'lucide-react';
import { merchantsApi, MerchantListItem } from '../../../../api/merchants';

interface MerchantSearchStepProps {
  onSelect: (merchant: { id: string; name: string; category: string }) => void;
  onBack?: () => void;
}

const DEBOUNCE_MS = 300;

const MerchantSearchStep: React.FC<MerchantSearchStepProps> = ({ onSelect, onBack }) => {
  const [query, setQuery] = useState('');
  const [merchants, setMerchants] = useState<MerchantListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const timerRef = useRef<number | null>(null);

  const fetchMerchants = useCallback(async (search: string) => {
    setLoading(true);
    try {
      const data = await merchantsApi.list({ search: search || undefined });
      setMerchants(data);
    } catch {
      setMerchants([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  }, []);

  // Load all merchants on mount
  useEffect(() => {
    fetchMerchants('');
  }, [fetchMerchants]);

  // Debounced search
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      fetchMerchants(query.trim());
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [query, fetchMerchants]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 h-16 flex items-center gap-3 z-20 shadow-sm">
        {onBack && (
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <h1 className="font-semibold text-gray-800 text-lg">Select Business</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by business name..."
            autoFocus
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000] transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Results */}
        {loading && !hasSearched ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[#990000] rounded-full animate-spin" />
          </div>
        ) : merchants.length === 0 && hasSearched ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No businesses found</p>
            {query && <p className="text-gray-300 text-xs mt-1">Try a different search term</p>}
          </div>
        ) : (
          <div className="space-y-2">
            {merchants.map((m) => (
              <button
                key={m.id}
                onClick={() => onSelect({ id: m.id, name: m.businessName || m.name, category: m.category })}
                className="w-full flex items-center gap-3.5 bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100/50 hover:border-[#990000]/30 hover:shadow-md transition-all duration-200 text-left active:scale-[0.98]"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 overflow-hidden">
                  {m.coverImage ? (
                    <img src={m.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">
                      {(m.businessName || m.name).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {m.businessName || m.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {m.category && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{m.category}</span>
                    )}
                    {m.rating > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {m.rating.toFixed(1)}
                      </span>
                    )}
                    {m.reviewCount > 0 && (
                      <span className="text-xs text-gray-400">{m.reviewCount} reviews</span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ChevronLeft className="w-4 h-4 text-gray-300 rotate-180 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantSearchStep;
