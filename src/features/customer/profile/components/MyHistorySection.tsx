import React from 'react';
import { Review } from '../types';
import { Icons } from './Icons';
import { SectionHeading } from './SectionHeading';

interface MyHistorySectionProps {
  latestReview: Review | null;
  loading?: boolean;
  onViewAllReviews: () => void;
}

export const MyHistorySection: React.FC<MyHistorySectionProps> = ({
  latestReview,
  loading = false,
  onViewAllReviews,
}) => {
  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '0.28s' }}>
      <SectionHeading icon={<Icons.Clock />} title="My History" />

      <article className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-[0_10px_30px_-15px_rgba(17,24,39,0.35)]">
        {loading && (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-brand-red"></div>
          </div>
        )}

        {!loading && latestReview && (
          <div className="flex items-start gap-4">
            <img
              src={latestReview.businessImage}
              alt={latestReview.businessName}
              className="h-14 w-14 rounded-2xl object-cover border border-gray-100"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[17px] font-bold text-gray-900 leading-tight">{latestReview.businessName}</h3>
                  <p className="mt-1 text-xs font-medium text-gray-500">{latestReview.date}</p>
                </div>
                <button
                  type="button"
                  aria-label="View all reviews"
                  onClick={onViewAllReviews}
                  className="h-8 w-8 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:text-brand-red hover:border-brand-red/30 transition-colors"
                >
                  <Icons.ChevronRight size={16} />
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{latestReview.content}</p>
            </div>
          </div>
        )}

        {!loading && !latestReview && (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">No review history yet.</p>
            <button
              type="button"
              aria-label="View all reviews"
              onClick={onViewAllReviews}
              className="h-8 w-8 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:text-brand-red hover:border-brand-red/30 transition-colors"
            >
              <Icons.ChevronRight size={16} />
            </button>
          </div>
        )}
      </article>
    </section>
  );
};
