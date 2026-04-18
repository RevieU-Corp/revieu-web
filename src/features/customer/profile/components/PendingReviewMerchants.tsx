import React from 'react';
import { PendingReviewMerchant } from '../types';
import { Icons } from './Icons';
import { SectionHeading } from './SectionHeading';
import { ImageWithFallback } from '../../../../components/common';

interface PendingReviewMerchantsProps {
  merchants: PendingReviewMerchant[];
  loading?: boolean;
  onWriteReview: (merchant: PendingReviewMerchant) => void;
}

export const PendingReviewMerchants: React.FC<PendingReviewMerchantsProps> = ({
  merchants,
  loading = false,
  onWriteReview,
}) => {
  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <SectionHeading icon={<Icons.ShoppingBag />} title="Laet Merchant I Visit" />
      <p className="-mt-2 mb-5 text-sm text-gray-500">Places you visited but still have not reviewed.</p>

      {loading && (
        <div className="rounded-[24px] bg-white/90 border border-gray-100 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-brand-red"></div>
        </div>
      )}

      {!loading && merchants.length === 0 && (
        <div className="rounded-[24px] bg-white p-7 border border-gray-100 text-center">
          <h3 className="text-lg font-bold text-gray-900">All caught up</h3>
          <p className="mt-1 text-sm text-gray-500">No pending merchant reviews right now.</p>
        </div>
      )}

      {!loading && merchants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {merchants.map((merchant) => (
            <article
              key={merchant.storeId}
              className="relative overflow-hidden rounded-[24px] border border-gray-100 bg-white p-5 shadow-[0_8px_28px_-14px_rgba(17,24,39,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-14px_rgba(17,24,39,0.35)]"
            >
              <div className="absolute -top-10 -right-6 h-24 w-24 rounded-full bg-brand-red/8 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-start gap-3">
                  <ImageWithFallback
                    src={merchant.businessImage}
                    alt={merchant.businessName}
                    className="h-14 w-14 rounded-2xl object-cover border border-gray-100"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-bold text-gray-900 leading-tight truncate">
                      {merchant.businessName}
                    </h3>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-red bg-brand-red/5 px-2 py-1 rounded-full">
                      <Icons.Clock size={12} />
                      Last visit: {merchant.lastVisitedAt}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-600 leading-relaxed line-clamp-2">
                  You ordered: {merchant.lastOrderItems.join(', ')}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                    Not reviewed yet
                  </span>
                  <button
                    type="button"
                    onClick={() => onWriteReview(merchant)}
                    className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-black"
                  >
                    Write Review
                    <Icons.ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
