import React from 'react';
import { Edit3, Trash2, ImageIcon } from 'lucide-react';
import { Coupon } from '../services/couponService';
import { Dish } from '../../dishes/services/dishService';

interface CouponHorizontalListProps {
  coupons: Coupon[];
  dishes: Dish[];
  onEdit: (coupon: Coupon) => void;
  onToggleEnabled: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  disabled: 'bg-gray-100 text-gray-500',
  scheduled: 'bg-blue-100 text-blue-700',
  expired: 'bg-red-100 text-red-700',
  sold_out: 'bg-orange-100 text-orange-700',
};

const formatTimeRange = (validFrom: string | null, validUntil: string | null): string | null => {
  if (!validFrom && !validUntil) return null;
  const fmt = (iso: string) => new Date(iso).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });
  if (validFrom && validUntil) return `${fmt(validFrom)} - ${fmt(validUntil)}`;
  return validFrom ? `From ${fmt(validFrom)}` : `Until ${fmt(validUntil as string)}`;
};

const CouponHorizontalList: React.FC<CouponHorizontalListProps> = ({ coupons, dishes, onEdit, onToggleEnabled, onDelete }) => {
  if (coupons.length === 0) {
    return <p className="text-gray-500 text-center py-4">No coupons yet. Click "Create Coupon" to make your first one.</p>;
  }

  return (
    <div className="space-y-3">
      {coupons.map((coupon) => {
        const dishIds: number[] = coupon.dish_ids ? JSON.parse(coupon.dish_ids) : [];
        const dishNames = dishIds.length === 0 ? 'All dishes' : dishIds.map((id) => dishes.find((d) => d.id === id)?.name).filter(Boolean).join(', ') || 'Selected dishes';
        const timeRange = formatTimeRange(coupon.valid_from, coupon.valid_until);

        return (
          <div key={coupon.id} className="flex items-center gap-4 border border-gray-200 rounded-lg p-3">
            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
              {coupon.image_url ? <img src={coupon.image_url} alt={coupon.title} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" size={24} />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{coupon.title}</p>
              <p className="text-xs text-gray-500">{coupon.coupon_type === 'limited_time' ? 'Limited-Time Coupon' : 'Normal Coupon'} · {dishNames}</p>
              <p className="text-sm text-gray-700">${coupon.original_price.toFixed(2)} → ${coupon.sale_price.toFixed(2)}</p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm text-gray-700">{coupon.claimed_count} / {coupon.total_quantity} claimed</p>
              {timeRange && <p className="text-xs text-gray-500">{timeRange}</p>}
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${statusStyles[coupon.status] ?? 'bg-gray-100 text-gray-600'}`}>{coupon.status}</span>
            </div>

            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => onEdit(coupon)} className="text-blue-600 text-sm flex items-center gap-1"><Edit3 size={14} /> Edit</button>
              <button onClick={() => onToggleEnabled(coupon)} className="text-gray-600 text-sm">{coupon.status === 'disabled' ? 'Enable' : 'Disable'}</button>
              <button onClick={() => onDelete(coupon)} className="text-red-600 text-sm flex items-center gap-1"><Trash2 size={14} /> Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CouponHorizontalList;
