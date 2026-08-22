import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Ticket } from 'lucide-react';
import { couponService } from '../../../shared/services/couponService';
import { MerchantInfo } from '../../../shared/types/coupons';
import { useAuth } from '../../../../../contexts/AuthContext';
import { ImageWithFallback } from './ImageWithFallback';

interface DealCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  expiry: string;
  expiryDate: Date;
  value: string;
  type: 'free' | 'paid';
  price?: number;
  merchantId: string;
  usageInstructions: string;
  merchantInfo: MerchantInfo;
}

export function DealCard({
  id,
  title,
  description,
  imageUrl,
  expiry,
  expiryDate,
  value,
  type,
  price,
  merchantId,
  usageInstructions,
  merchantInfo,
}: DealCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUseNow = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user?.id) {
        setError('Please log in to redeem this coupon');
        return;
      }

      const userId = user.id;
      
      // Validate the coupon first
      const validationResult = await couponService.validateCoupon(id, userId);
      
      if (!validationResult.isValid) {
        setError(validationResult.errorMessage || 'This coupon is not available');
        setIsLoading(false);
        return;
      }
      
      // Handle different coupon types
      if (type === 'free') {
        navigate('/customer/voucher/display', {
          state: {
            couponId: id,
            userId,
            dealInfo: {
              id,
              title,
              description,
              value,
              type,
              merchantId,
              price,
              expiryDate,
              usageInstructions,
            },
            merchantInfo,
          }
        });
      } else if (type === 'paid') {
        // For paid coupons, initiate payment flow
        const paymentFlowResult = await couponService.initiatePaidCouponFlow(id, userId);
        
        // Navigate to payment page with coupon data
        navigate('/customer/payment', {
          state: {
            couponPaymentData: paymentFlowResult.paymentData,
            merchantInfo,
            dealInfo: {
              id,
              title,
              description,
              value,
              type,
              price,
              merchantId,
              expiryDate,
              usageInstructions,
            }
          }
        });
      }
    } catch (error: any) {
      console.error('Error handling coupon redemption:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleUseNow}
      disabled={isLoading}
      className="w-full text-left bg-white rounded-2xl p-3 shadow-sm hover:shadow-md active:scale-[0.98] transition-all border border-gray-100 relative disabled:cursor-not-allowed"
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl z-10">
          <Loader2 className="w-6 h-6 animate-spin text-[#FF6900]" />
        </div>
      )}

      <div className="flex gap-3">
        {/* Photo — fixed square thumbnail, cropped (not stretched) to fill it.
            Falls back to a branded placeholder when no photo was uploaded, so
            every card in the list keeps the same rhythm. */}
        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-orange-50">
          {imageUrl ? (
            <ImageWithFallback src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Ticket className="w-7 h-7 text-[#FF6900]/40" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h3 className="font-bold text-base text-gray-900 line-clamp-1">{title}</h3>
            <p className="text-gray-500 text-xs line-clamp-2 mt-0.5">{description}</p>
          </div>
          <div className="flex items-end justify-between gap-2 mt-1.5">
            <span className="text-xs text-gray-400 truncate">{expiry}</span>
            <span className="text-xl font-bold text-[#FF6900] leading-none shrink-0">{value}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1 text-red-500 text-xs mt-2">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span className="truncate">{error}</span>
        </div>
      )}
    </button>
  );
}
