import React, { useEffect, useState } from 'react';
import { Dish } from '../../dishes/services/dishService';
import { Coupon, UpsertCouponPayload } from '../services/couponService';

interface CouponFormModalProps {
  isOpen: boolean;
  coupon: Coupon | null;
  dishes: Dish[];
  onClose: () => void;
  onSubmit: (payload: UpsertCouponPayload) => Promise<void>;
}

const toDatetimeLocal = (iso: string | null): string => (iso ? iso.slice(0, 16) : '');

const CouponFormModal: React.FC<CouponFormModalProps> = ({ isOpen, coupon, dishes, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [couponType, setCouponType] = useState<'normal' | 'limited_time'>('normal');
  const [selectedDishIds, setSelectedDishIds] = useState<number[]>([]);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (coupon) {
      setTitle(coupon.title);
      setCouponType(coupon.coupon_type === 'limited_time' ? 'limited_time' : 'normal');
      setSelectedDishIds(coupon.dish_ids ? (JSON.parse(coupon.dish_ids) as number[]) : []);
      setOriginalPrice(coupon.original_price);
      setSalePrice(coupon.sale_price);
      setTotalQuantity(coupon.total_quantity);
      setValidFrom(toDatetimeLocal(coupon.valid_from));
      setValidUntil(toDatetimeLocal(coupon.valid_until));
    } else {
      setTitle('');
      setCouponType('normal');
      setSelectedDishIds([]);
      setOriginalPrice(0);
      setSalePrice(0);
      setTotalQuantity(1);
      setValidFrom('');
      setValidUntil('');
    }
  }, [isOpen, coupon]);

  if (!isOpen) return null;

  const toggleDish = (dishId: number) => {
    setSelectedDishIds((prev) => (prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]));
  };

  const discountPercentage = originalPrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

  const buildPayload = (status: 'draft' | 'active'): UpsertCouponPayload => ({
    title,
    type: 'percentage',
    coupon_type: couponType,
    original_price: originalPrice,
    sale_price: salePrice,
    discount_percentage: discountPercentage,
    dish_ids: selectedDishIds,
    total_quantity: totalQuantity,
    max_per_user: 1,
    valid_from: couponType === 'limited_time' && validFrom ? new Date(validFrom).toISOString() : null,
    valid_until: couponType === 'limited_time' && validUntil ? new Date(validUntil).toISOString() : null,
    status,
  });

  const handleSubmit = async (status: 'draft' | 'active') => {
    if (!title.trim() || originalPrice <= 0 || salePrice < 0 || totalQuantity <= 0) return;
    setIsSaving(true);
    try {
      await onSubmit(buildPayload(status));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold">{coupon ? 'Edit Coupon' : 'Create Coupon'}</h2>

        <input type="text" placeholder="Coupon name" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />

        <div className="flex gap-2">
          <button type="button" onClick={() => setCouponType('normal')} className={`flex-1 py-2 rounded-lg border ${couponType === 'normal' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}>Normal Coupon</button>
          <button type="button" onClick={() => setCouponType('limited_time')} className={`flex-1 py-2 rounded-lg border ${couponType === 'limited_time' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}>Limited-Time Coupon</button>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Applicable dishes (none selected = all dishes)</p>
          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
            {dishes.map((dish) => (
              <button
                key={dish.id}
                type="button"
                onClick={() => toggleDish(dish.id)}
                className={`px-3 py-1 rounded-full text-sm border ${selectedDishIds.includes(dish.id) ? 'bg-blue-100 border-blue-400 text-blue-800' : 'border-gray-300 text-gray-600'}`}
              >
                {dish.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Original price</label>
            <input type="number" step="0.01" value={originalPrice} onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Discount price</label>
            <input type="number" step="0.01" value={salePrice} onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <p className="text-sm text-gray-500">${originalPrice.toFixed(2)} → ${salePrice.toFixed(2)} ({discountPercentage}% off)</p>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Total quantity</label>
          <input type="number" value={totalQuantity} onChange={(e) => setTotalQuantity(parseInt(e.target.value, 10) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>

        {couponType === 'limited_time' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Start time</label>
              <input type="datetime-local" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">End time</label>
              <input type="datetime-local" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg">Cancel</button>
          <button onClick={() => handleSubmit('draft')} disabled={isSaving} className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg disabled:opacity-50">Save as Draft</button>
          <button onClick={() => handleSubmit('active')} disabled={isSaving} className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Publish</button>
        </div>
      </div>
    </div>
  );
};

export default CouponFormModal;
