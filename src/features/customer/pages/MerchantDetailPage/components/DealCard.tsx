import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { couponService } from '../../../shared/services/couponService';
import { MerchantInfo } from '../../../shared/types/coupons';
import { useAuth } from '../../../../../contexts/AuthContext';

interface DealCardProps {
  id: string;
  title: string;
  description: string;
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
        // For free coupons, attempt direct redemption
        const redemptionResult = await couponService.redeemFreeCoupon(id, userId);
        
        if (redemptionResult.success) {
          // Navigate to voucher display page with the result
          navigate('/customer/voucher/display', {
            state: {
              voucher: redemptionResult.voucher,
              qrCodeDataUrl: redemptionResult.qrCodeDataUrl,
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
        } else {
          setError(redemptionResult.message || 'Failed to redeem coupon');
        }
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
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 relative">
      {/* Left Accent Strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6900]" />
      
      <div className="p-4 pl-5">
        <div className="flex items-start gap-4">
          {/* Value Section */}
          <div className="flex-shrink-0">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FF6900] mb-1">{value}</div>
              <div className="text-xs text-gray-400 font-medium">COUPON</div>
            </div>
          </div>

          {/* Divider with notches */}
          <div className="relative flex flex-col items-center justify-center px-2">
            <div className="w-px h-full bg-gray-200 relative">
              {/* Top notch */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FAFAFA] rounded-full border border-gray-200" />
              {/* Bottom notch */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FAFAFA] rounded-full border border-gray-200" />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base mb-1 text-gray-900">{title}</h3>
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">{description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{expiry}</span>
              <div className="flex flex-col items-end gap-1">
                {error && (
                  <div className="flex items-center gap-1 text-red-500 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span className="max-w-32 truncate">{error}</span>
                  </div>
                )}
                <button 
                  onClick={handleUseNow}
                  disabled={isLoading}
                  className="text-[#FF6900] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Use Now
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative ticket edge */}
      <div className="absolute bottom-0 left-0 right-0 h-2 flex justify-around">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-1 h-2 bg-[#FAFAFA]" />
        ))}
      </div>
    </div>
  );
}
