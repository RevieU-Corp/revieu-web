import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Copy, Download, Home, QrCode, BarChart3, Tag, MapPin, Phone, Clock } from 'lucide-react';
import { PATHS } from '../../../routes/paths';
import { voucherService } from '../shared/services/voucherService';
import { CouponPaymentData, MerchantInfo, Voucher } from '../shared/types/coupons';

interface CouponPaymentSuccessState {
  dealInfo: {
    title: string;
    price: string;
    description: string;
  };
  paymentMethod: string;
  orderNumber: string;
  voucherCode: string;
  couponData?: CouponPaymentData;
  merchantInfo?: MerchantInfo;
  isCouponPayment: boolean;
  voucher?: Voucher | null;
}

const CouponPaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGeneratingVoucher, setIsGeneratingVoucher] = useState(true);
  const [voucherError, setVoucherError] = useState<string>('');

  // Get payment data from navigation state
  const hasPaymentData = Boolean(location.state);
  const paymentData = (location.state as CouponPaymentSuccessState | null) || {
    dealInfo: {
      title: '',
      price: '',
      description: ''
    },
    paymentMethod: '',
    orderNumber: '',
    voucherCode: '',
    isCouponPayment: false
  };

  const { couponData, merchantInfo, isCouponPayment, voucher: initialVoucher } = paymentData;

  useEffect(() => {
    let cancelled = false;

    const loadVoucher = async () => {
      if (!hasPaymentData || !isCouponPayment) {
        setIsGeneratingVoucher(false);
        return;
      }

      if (!initialVoucher) {
        setIsGeneratingVoucher(false);
        return;
      }

      try {
        setIsGeneratingVoucher(true);
        if (!cancelled) {
          setVoucher(initialVoucher);
        }

        const qrCode = await voucherService.generateQRCode(initialVoucher.code);
        if (!cancelled) {
          setQrCodeDataUrl(qrCode);
        }
      } catch (error) {
        console.error('Error generating voucher:', error);
        if (!cancelled) {
          setVoucherError('Failed to generate voucher QR code. Please contact support.');
        }
      } finally {
        if (!cancelled) {
          setIsGeneratingVoucher(false);
        }
      }
    };

    void loadVoucher();

    return () => {
      cancelled = true;
    };
  }, [hasPaymentData, initialVoucher, isCouponPayment]);

  const handleCopyCode = async () => {
    try {
      const codeToUse = voucher?.code || paymentData.voucherCode;
      await navigator.clipboard.writeText(codeToUse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    // Implement voucher download functionality
    if (voucher) {
      voucherService.exportVoucher(voucher.id, 'pdf').then(() => {
        console.log('Voucher downloaded');
      }).catch(error => {
        console.error('Download failed:', error);
      });
    }
  };

  const handleViewVouchers = () => {
    navigate(PATHS.CUSTOMER.ME.ROOT);
  };

  // QR Code component
  const QRCodeDisplay = () => {
    if (isGeneratingVoucher) {
      return (
        <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mx-auto">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <div className="text-xs text-gray-500">Generating QR Code...</div>
          </div>
        </div>
      );
    }

    if (qrCodeDataUrl) {
      return (
        <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-xl p-4 mx-auto">
          <img 
            src={qrCodeDataUrl} 
            alt="Voucher QR Code" 
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    // Fallback QR code placeholder
    return (
      <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mx-auto">
        <div className="text-center">
          <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
          <div className="text-xs text-gray-500">QR Code</div>
          <div className="text-xs text-gray-400 mt-1">{voucher?.code || paymentData.voucherCode}</div>
        </div>
      </div>
    );
  };

  // Barcode component
  const BarcodeDisplay = () => (
    <div className="w-full max-w-xs bg-white border-2 border-gray-200 rounded-lg p-4 mx-auto">
      <div className="flex items-center justify-center mb-2">
        <BarChart3 className="w-8 h-8 text-gray-400" />
      </div>
      <div className="flex justify-center space-x-1 mb-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-800"
            style={{
              width: Math.random() > 0.5 ? '2px' : '1px',
              height: '40px'
            }}
          />
        ))}
      </div>
      <div className="text-center text-xs text-gray-600 font-mono">
        {voucher?.code || paymentData.voucherCode}
      </div>
    </div>
  );

  if (!hasPaymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md rounded-2xl bg-white p-6 text-center shadow-sm border border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Payment result unavailable</h1>
          <p className="mt-2 text-sm text-gray-600">
            This page can only show a confirmed server payment result. No order or voucher was created from this page.
          </p>
          <button
            type="button"
            onClick={() => navigate('/customer/payment')}
            className="mt-5 w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white"
          >
            Return to payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="p-4 space-y-6 max-w-md mx-auto pt-8">
        {/* Success Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isCouponPayment ? 'Coupon Redeemed!' : 'Payment Successful!'}
          </h1>
          <p className="text-gray-600">
            {isCouponPayment ? 'Your voucher is ready to use' : 'Your order has been confirmed'}
          </p>
        </div>

        {/* Coupon Deal Indicator */}
        {isCouponPayment && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Tag className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Coupon Deal Redeemed</h3>
                <p className="text-sm text-gray-600">
                  {couponData?.dealInfo.type === 'paid' ? 'Paid coupon successfully processed' : 'Free coupon activated'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Order Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number</span>
              <span className="font-semibold text-gray-900">{paymentData.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Item</span>
              <span className="font-semibold text-gray-900">{paymentData.dealInfo.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-900">{paymentData.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-bold text-green-600">
                {isCouponPayment ? `${couponData?.currency || '¥'}${paymentData.dealInfo.price}` : `¥${paymentData.dealInfo.price}`}
              </span>
            </div>
            {isCouponPayment && couponData?.dealInfo.value && (
              <div className="flex justify-between">
                <span className="text-gray-600">Deal Value</span>
                <span className="font-semibold text-orange-600">{couponData.dealInfo.value}</span>
              </div>
            )}
          </div>
        </div>

        {/* Voucher Error Display */}
        {voucherError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <h3 className="font-semibold text-red-900 mb-2">Voucher Generation Error</h3>
            <p className="text-sm text-red-800">{voucherError}</p>
            <p className="text-xs text-red-600 mt-2">
              Please contact support with order number: {paymentData.orderNumber}
            </p>
          </div>
        )}

        {/* Voucher Code Section */}
        {!voucherError && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="font-bold text-lg text-gray-900 mb-2">Your Voucher</h2>
              <p className="text-sm text-gray-600">
                Show this code at {merchantInfo?.name || 'the restaurant'} to redeem your {isCouponPayment ? 'coupon deal' : 'order'}
              </p>
            </div>

            {/* QR Code */}
            <div className="mb-6">
              <QRCodeDisplay />
            </div>

            {/* Barcode */}
            <div className="mb-6">
              <BarcodeDisplay />
            </div>

            {/* Voucher Code */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Voucher Code</div>
                <div className="text-2xl font-bold text-gray-900 font-mono tracking-wider mb-3">
                  {isGeneratingVoucher ? 'Generating...' : (voucher?.code || paymentData.voucherCode)}
                </div>
                <button
                  onClick={handleCopyCode}
                  disabled={isGeneratingVoucher}
                  className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                disabled={isGeneratingVoucher || !voucher}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-xl font-medium text-gray-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={handleViewVouchers}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-100 hover:bg-blue-200 rounded-xl font-medium text-blue-700 transition-colors"
              >
                View All Vouchers
              </button>
              <button
                onClick={() => navigate(PATHS.CUSTOMER.HOME)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                <Home className="w-5 h-5" />
                Done
              </button>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to Redeem</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Show the QR code or barcode to the cashier</li>
            <li>• Or provide the voucher code verbally</li>
            <li>• Valid until {voucher?.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString() : '30 days from purchase'}</li>
            <li>• Cannot be combined with other offers</li>
            {isCouponPayment && couponData?.dealInfo.usageInstructions && (
              <li>• {couponData.dealInfo.usageInstructions}</li>
            )}
          </ul>
        </div>

        {/* Merchant Information */}
        {merchantInfo && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Merchant Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Tag className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{merchantInfo.name}</div>
                  <div className="text-sm text-gray-600">Merchant</div>
                </div>
              </div>
              
              {merchantInfo.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-600">{merchantInfo.address}</div>
                </div>
              )}
              
              {merchantInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div className="text-sm text-gray-600">{merchantInfo.phone}</div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div className="text-sm text-gray-600">Check merchant for operating hours</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponPaymentSuccessPage;
