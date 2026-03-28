import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Building2, Check, Tag } from 'lucide-react';
import { CouponPaymentData, DealInfo, MerchantInfo } from '../shared/types/coupons';
import { orderService } from '../shared/services';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface PaymentPageLocationState {
  dealInfo?: DealInfo;
  couponData?: CouponPaymentData;
  couponPaymentData?: CouponPaymentData;
  merchantInfo?: MerchantInfo;
}

interface LegacyDealInfo {
  title: string;
  price: string;
  oldPrice?: string;
  description: string;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Get payment data from navigation state
  const locationState = location.state as PaymentPageLocationState;
  const couponData = locationState?.couponData || locationState?.couponPaymentData;
  const merchantInfo = locationState?.merchantInfo;
  
  // Use coupon data if available, otherwise fallback to legacy deal info
  const dealInfo = couponData ? {
    title: couponData.dealInfo.title,
    price: couponData.paymentAmount.toString(),
    description: couponData.dealInfo.description
  } : locationState?.dealInfo || {
    title: 'Lunch Combo A',
    price: '12.99',
    description: 'Orange chicken, fried rice, and egg roll'
  };

  // Legacy deal info might have oldPrice
  const legacyDealInfo: LegacyDealInfo | null = !couponData ? (locationState?.dealInfo as any || {
    title: 'Lunch Combo A',
    price: '12.99',
    oldPrice: '18.99',
    description: 'Orange chicken, fried rice, and egg roll'
  }) : null;

  const isCouponPayment = !!couponData;

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upay',
      name: 'UPay',
      icon: <div className="w-8 h-8 bg-gradient-to-br from-[#FFA500] to-[#FF8C00] rounded-lg flex items-center justify-center text-white font-bold text-sm">U</div>,
      description: 'Revieu\'s secure payment system'
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      icon: <Smartphone className="w-8 h-8 text-gray-700" />,
      description: 'Pay with Touch ID or Face ID'
    },
    {
      id: 'bank-card',
      name: 'Bank Card',
      icon: <CreditCard className="w-8 h-8 text-gray-700" />,
      description: 'Credit or Debit Card'
    }
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      if (isCouponPayment && couponData) {
        const order = await orderService.createCouponOrder(couponData.couponId);
        const paidResult = await orderService.payCouponOrder(order.id);
        const paymentMethod = paymentMethods.find((method) => method.id === selectedMethod)?.name ?? 'UPay';

        navigate('/customer/payment/coupon-success', {
          state: {
            dealInfo,
            paymentMethod,
            orderNumber: paidResult.order.id,
            voucherCode: paidResult.vouchers[0]?.code ?? '',
            couponData,
            merchantInfo,
            isCouponPayment: true,
            voucher: paidResult.vouchers[0] ?? null,
          }
        });
      } else {
        const paymentResult = {
          dealInfo,
          paymentMethod: paymentMethods.find((method) => method.id === selectedMethod)?.name,
          orderNumber: `ORD${Date.now()}`,
          voucherCode: `VCH${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        };

        navigate('/customer/payment/success', {
          state: paymentResult
        });
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 h-16 flex items-center z-20 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Payment</h1>
      </div>

      <div className="p-4 space-y-6 max-w-md mx-auto">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h2>
          
          {/* Show coupon indicator if this is a coupon payment */}
          {isCouponPayment && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Tag className="w-5 h-5 text-orange-600" />
              <div className="flex-1">
                <div className="text-sm font-medium text-orange-800">Coupon Deal</div>
                <div className="text-xs text-orange-600">
                  {couponData?.dealInfo.type === 'paid' ? 'Paid coupon redemption' : 'Free coupon redemption'}
                </div>
              </div>
            </div>
          )}

          {/* Merchant info for coupon payments */}
          {isCouponPayment && merchantInfo && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900">{merchantInfo.name}</div>
              <div className="text-xs text-gray-600">{merchantInfo.address}</div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{dealInfo.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{dealInfo.description}</p>
                {isCouponPayment && couponData?.dealInfo.usageInstructions && (
                  <p className="text-xs text-blue-600 mt-2">
                    Instructions: {couponData.dealInfo.usageInstructions}
                  </p>
                )}
              </div>
              <div className="text-right ml-4">
                <div className="text-lg font-bold text-red-600">
                  {isCouponPayment ? `${couponData?.currency || '¥'}${dealInfo.price}` : `¥${dealInfo.price}`}
                </div>
                {!isCouponPayment && legacyDealInfo?.oldPrice && (
                  <div className="text-sm text-gray-400 line-through">¥{legacyDealInfo.oldPrice}</div>
                )}
                {isCouponPayment && couponData?.dealInfo.value && (
                  <div className="text-xs text-green-600 mt-1">
                    Value: {couponData.dealInfo.value}
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-red-600">
                  {isCouponPayment ? `${couponData?.currency || '¥'}${dealInfo.price}` : `¥${dealInfo.price}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {paymentError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {paymentError}
          </div>
        )}

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === method.id
                    ? 'border-[#FFA500] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  {method.icon}
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                  {selectedMethod === method.id && (
                    <div className="w-6 h-6 bg-[#FFA500] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={!selectedMethod || isProcessing}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            selectedMethod && !isProcessing
              ? 'bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white hover:shadow-lg active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {isCouponPayment ? 'Processing Coupon...' : 'Processing...'}
            </div>
          ) : (
            `${isCouponPayment ? 'Redeem for' : 'Pay'} ${isCouponPayment ? `${couponData?.currency || '¥'}${dealInfo.price}` : `¥${dealInfo.price}`}`
          )}
        </button>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500 leading-relaxed">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Secured by Revieu Payment System</span>
          </div>
          Your payment information is encrypted and secure
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
