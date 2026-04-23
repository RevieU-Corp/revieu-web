import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Share2, 
  Copy, 
  Check, 
  Calendar, 
  MapPin, 
  Clock,
  Wallet,
  Mail,
  MessageSquare,
  QrCode
} from 'lucide-react';
import { Voucher, DealInfo, MerchantInfo } from '../../shared/types/coupons';
import { voucherService } from '../../shared/services';
import { PATHS } from '../../../../routes/paths';

interface VoucherDisplayProps {
  voucher?: Voucher;
  dealInfo?: DealInfo;
  merchantInfo?: MerchantInfo;
}

interface LocationState {
  // Pre-redemption (set by DealCard)
  couponId?: string;
  userId?: string;
  // Post-redemption (set after Add to Wallet)
  voucher?: Voucher;
  qrCodeDataUrl?: string;
  dealInfo: DealInfo;
  merchantInfo?: MerchantInfo;
}

const VoucherDisplay: React.FC<VoucherDisplayProps> = ({ 
  voucher: propVoucher, 
  dealInfo: propDealInfo, 
  merchantInfo: propMerchantInfo 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const dealInfo = propDealInfo || state?.dealInfo;
  const merchantInfo = propMerchantInfo || state?.merchantInfo || {
    name: 'Sample Merchant',
    address: '123 Main St, City, State'
  };

  const [voucher, setVoucher] = useState<Voucher | undefined>(propVoucher || state?.voucher);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(state?.qrCodeDataUrl || '');
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isAddingToWallet, setIsAddingToWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  // Redirect only if there's no deal info at all
  useEffect(() => {
    if (!dealInfo) {
      navigate(PATHS.CUSTOMER.ME.ROOT, { replace: true });
    }
  }, [dealInfo, navigate]);

  if (!dealInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading voucher...</p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddToWallet = async () => {
    if (voucher || isAddingToWallet) return;
    const couponId = state?.couponId;
    const userId = state?.userId;
    if (!couponId || !userId) {
      setWalletError('Missing coupon info. Please try again.');
      return;
    }
    setIsAddingToWallet(true);
    setWalletError(null);
    try {
      const { couponService } = await import('../../shared/services/couponService');
      const result = await couponService.redeemFreeCoupon(couponId, userId);
      if (result.success) {
        setVoucher(result.voucher);
        setQrCodeDataUrl(result.qrCodeDataUrl || '');
      } else {
        setWalletError(result.message || 'Failed to redeem coupon.');
      }
    } catch (err: any) {
      setWalletError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsAddingToWallet(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(voucher?.code ?? '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy voucher code:', error);
    }
  };


  const handleShare = async (method: 'email' | 'sms' | 'social' | 'copy') => {
    setIsSharing(true);
    try {
      const success = await voucherService.shareVoucher(voucher?.id ?? '', {
        method,
        message: `Check out this great deal: ${dealInfo.title} at ${merchantInfo.name}!`
      });
      
      if (success) {
        setShowShareOptions(false);
        // Show success message
        if (method === 'copy') {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } else {
        alert('Failed to share voucher. Please try again.');
      }
    } catch (error) {
      console.error('Failed to share voucher:', error);
      alert('Failed to share voucher. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const formatExpiryDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpiringSoon = () => {
    if (!voucher) return false;
    const expiryDate = new Date(voucher.expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl z-50 px-6 flex items-center justify-between border-b border-gray-100">
        <button
          onClick={handleBack}
          className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-sm font-bold text-gray-900">Your Voucher</h1>
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all"
        >
          <Share2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="pt-24 px-6 pb-10">
        {voucher ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Added to My Rewards!</h3>
                <p className="text-sm text-green-600">Present this QR code to the merchant to redeem.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">Coupon Available</h3>
                <p className="text-sm text-blue-600">Tap "Add to My Wallet" to save and get your QR code.</p>
              </div>
            </div>
          </div>
        )}

        {/* Voucher Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
          {/* Deal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{dealInfo.title}</h2>
                <p className="text-blue-100 text-sm">{dealInfo.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black">{dealInfo.value}</div>
                {dealInfo.type === 'paid' && dealInfo.price && (
                  <div className="text-sm opacity-75">Paid ${dealInfo.price}</div>
                )}
              </div>
            </div>

            {/* Merchant Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/20">
              <MapPin className="w-4 h-4" />
              <div>
                <p className="font-semibold">{merchantInfo.name}</p>
                <p className="text-sm text-blue-100">{merchantInfo.address}</p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-6 text-center border-b border-gray-100">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Voucher QR Code" className="w-48 h-48 mx-auto" />
              ) : (
                <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-gray-50">
                  <QrCode className="h-20 w-20 text-gray-300" />
                </div>
              )}
            </div>
            {voucher ? (
              <p className="text-sm text-gray-600 mb-4">Scan this QR code at the merchant</p>
            ) : (
              <p className="text-sm text-gray-400 mb-4">QR code will appear after adding to wallet</p>
            )}

            {voucher && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Voucher Code</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-xl font-mono font-bold text-gray-900 tracking-wider">
                  {voucher.code}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            )}
          </div>

          {/* Voucher Details */}
          {voucher && (
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isExpiringSoon() ? 'bg-red-100' : 'bg-gray-100'}`}>
                  <Calendar className={`w-4 h-4 ${isExpiringSoon() ? 'text-red-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Expires</p>
                  <p className={`text-sm ${isExpiringSoon() ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                    {formatExpiryDate(voucher.expiryDate)}
                    {isExpiringSoon() && ' (Expires Soon!)'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Generated</p>
                  <p className="text-sm text-gray-600">
                    {new Date(voucher.generatedAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: 'numeric', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {voucher.usageInstructions && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">How to Use</h4>
                  <p className="text-sm text-blue-800">{voucher.usageInstructions}</p>
                </div>
              )}
            </div>
          </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {walletError && (
            <p className="text-sm text-red-500 text-center">{walletError}</p>
          )}
          {voucher ? (
            <div className="w-full bg-green-50 border border-green-200 text-green-700 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Added to My Wallet
            </div>
          ) : (
            <button
              onClick={handleAddToWallet}
              disabled={isAddingToWallet}
              className="w-full bg-black text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Wallet className="w-5 h-5" />
              {isAddingToWallet ? 'Adding...' : 'Add to My Wallet'}
            </button>
          )}
          <button
            onClick={() => navigate(PATHS.CUSTOMER.ME.ROOT)}
            className="w-full bg-gray-100 text-gray-900 py-4 rounded-2xl font-semibold hover:bg-gray-200 active:scale-[0.98] transition-all"
          >
            View All Vouchers
          </button>
        </div>
      </div>

      {/* Share Options Modal */}
      {showShareOptions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full p-6 animate-in slide-in-from-bottom">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-semibold text-center mb-6">Share Voucher</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handleShare('email')}
                disabled={isSharing}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50"
              >
                <Mail className="w-6 h-6 text-gray-700" />
                <span className="text-sm font-medium">Email</span>
              </button>
              
              <button
                onClick={() => handleShare('sms')}
                disabled={isSharing}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50"
              >
                <MessageSquare className="w-6 h-6 text-gray-700" />
                <span className="text-sm font-medium">SMS</span>
              </button>
              
              <button
                onClick={() => handleShare('social')}
                disabled={isSharing}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50"
              >
                <Share2 className="w-6 h-6 text-gray-700" />
                <span className="text-sm font-medium">Social</span>
              </button>
              
              <button
                onClick={() => handleShare('copy')}
                disabled={isSharing}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50"
              >
                <Copy className="w-6 h-6 text-gray-700" />
                <span className="text-sm font-medium">Copy Link</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowShareOptions(false)}
              className="w-full py-3 text-gray-600 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherDisplay;
