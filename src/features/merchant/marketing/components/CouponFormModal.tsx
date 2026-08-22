import React, { useEffect, useState } from 'react';
import { Dish } from '../../dishes/services/dishService';
import { Coupon, UpsertCouponPayload, couponService } from '../services/couponService';

interface CouponFormModalProps {
  isOpen: boolean;
  coupon: Coupon | null;
  dishes: Dish[];
  error?: string | null;
  onClose: () => void;
  onSubmit: (payload: UpsertCouponPayload) => Promise<void>;
}

// A `datetime-local` input reads and writes *local wall-clock* time, while the
// backend stores UTC. Shifting by the local UTC offset before slicing keeps the
// round-trip lossless: `new Date(value).toISOString()` on submit reconstructs
// the exact instant we were given.
const toDatetimeLocal = (iso: string | null): string => {
  if (!iso) return '';
  const date = new Date(iso);
  const offsetMs = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - offsetMs);
  return local.toISOString().slice(0, 16);
};

const CouponFormModal: React.FC<CouponFormModalProps> = ({ isOpen, coupon, dishes, error, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [couponType, setCouponType] = useState<'normal' | 'limited_time'>('normal');
  const [selectedDishIds, setSelectedDishIds] = useState<number[]>([]);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFormError(null);
    if (coupon) {
      setTitle(coupon.title);
      setCouponType(coupon.coupon_type === 'limited_time' ? 'limited_time' : 'normal');
      setSelectedDishIds(coupon.dish_ids ? (JSON.parse(coupon.dish_ids) as number[]) : []);
      setOriginalPrice(coupon.original_price);
      setSalePrice(coupon.sale_price);
      setTotalQuantity(coupon.total_quantity);
      setValidFrom(toDatetimeLocal(coupon.valid_from));
      setValidUntil(toDatetimeLocal(coupon.valid_until));
      setImageUrl(coupon.image_url ?? '');
    } else {
      setTitle('');
      setCouponType('normal');
      setSelectedDishIds([]);
      setOriginalPrice(0);
      setSalePrice(0);
      setTotalQuantity(1);
      setValidFrom('');
      setValidUntil('');
      setImageUrl('');
    }
  }, [isOpen, coupon]);

  if (!isOpen) return null;

  const toggleDish = (dishId: number) => {
    setSelectedDishIds((prev) => (prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]));
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await couponService.uploadImage(file);
      setImageUrl(url);
    } catch (uploadError) {
      console.error('Failed to upload coupon image:', uploadError);
      setFormError('Failed to upload image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const discountPercentage = originalPrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

  const buildPayload = (status: 'draft' | 'active'): UpsertCouponPayload => {
    const payload: UpsertCouponPayload = {
      title,
      type: 'percentage',
      coupon_type: couponType,
      // The customer-facing app classifies a coupon as paid via `price > 0`;
      // without this it would show every merchant-created coupon as free.
      price: salePrice,
      original_price: originalPrice,
      sale_price: salePrice,
      discount_percentage: discountPercentage,
      dish_ids: selectedDishIds,
      total_quantity: totalQuantity,
      max_per_user: 1,
      status,
    };

    // Omit the key entirely when no manual image was chosen, so the backend's
    // single-dish auto-fill fallback can still apply instead of us sending an
    // explicit empty string that would look like a deliberate clear.
    if (imageUrl) {
      payload.image_url = imageUrl;
    }

    // The backend's *time.Time fields cannot tell a JSON null from an absent
    // key, so sending null is misleading — omit the keys instead when they
    // don't apply.
    if (couponType === 'limited_time') {
      if (validFrom) payload.valid_from = new Date(validFrom).toISOString();
      if (validUntil) payload.valid_until = new Date(validUntil).toISOString();
    } else if (coupon) {
      // A PATCH cannot infer "clear" from an omitted nullable timestamp. Tell
      // the backend explicitly when an existing limited-time coupon becomes
      // a normal coupon, otherwise old dates can keep it scheduled/expired.
      payload.clear_valid_from = Boolean(coupon.valid_from);
      payload.clear_valid_until = Boolean(coupon.valid_until);
    }

    return payload;
  };

  const validate = (): boolean => {
    if (!title.trim()) {
      setFormError('Coupon name is required.');
      return false;
    }
    if (originalPrice <= 0) {
      setFormError('Original price must be greater than 0.');
      return false;
    }
    if (salePrice < 0) {
      setFormError('Discount price cannot be negative.');
      return false;
    }
    if (totalQuantity <= 0) {
      setFormError('Total quantity must be greater than 0.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (status: 'draft' | 'active') => {
    if (!validate()) return;
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

        {/* Client-side validation takes priority; the `error` prop carries the
            save failure reported by the parent, which would otherwise render
            behind this overlay. */}
        {(formError ?? error) && (
          <p className="px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{formError ?? error}</p>
        )}

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

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Coupon photo (optional — falls back to the dish photo if left blank)</p>
          <div className="flex items-center gap-3">
            <label
              htmlFor="coupon-image-upload"
              className={`px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium cursor-pointer hover:bg-gray-50 ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {isUploadingImage ? 'Uploading...' : imageUrl ? 'Change photo' : 'Upload photo'}
            </label>
            <input
              id="coupon-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploadingImage}
              className="hidden"
            />
            {imageUrl && <img src={imageUrl} alt="preview" className="w-12 h-12 object-cover rounded-lg" />}
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
