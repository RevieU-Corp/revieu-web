import React, { useState, useEffect } from 'react';
import { QrCode, Keyboard, CheckCircle, AlertCircle, X } from 'lucide-react';
import RedemptionScanner from './RedemptionScanner';
import { voucherService } from '../../../customer/shared/services/voucherService';

// Device detection hook
const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(mobileRegex.test(userAgent) || (isTouchDevice && isSmallScreen));
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};

interface RedemptionResult {
  success: boolean;
  message: string;
  couponName?: string;
  discount?: string;
}

const RedemptionButton: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [redemptionResult, setRedemptionResult] = useState<RedemptionResult | null>(null);
  const isMobile = useDeviceDetection();

  const handleRedeem = async (code: string) => {
    setShowScanner(false);
    try {
      const voucher = await voucherService.getVoucherByCode(code.trim());
      if (voucher.status === 'used') {
        setRedemptionResult({ success: false, message: 'This voucher has already been used.' });
      } else if (voucher.status === 'expired') {
        setRedemptionResult({ success: false, message: 'This voucher has expired.' });
      } else {
        await voucherService.markVoucherAsUsed(voucher.id, '');
        setRedemptionResult({
          success: true,
          message: 'Voucher redeemed successfully!',
          couponName: voucher.dealTitle,
          discount: voucher.dealValue,
        });
      }
    } catch {
      setRedemptionResult({ success: false, message: 'Invalid voucher code. Please check and try again.' });
    }

    setTimeout(() => setRedemptionResult(null), 5000);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  return (
    <>
      {/* Redemption Button */}
      <button
        onClick={() => setShowScanner(true)}
        className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        title={isMobile ? 'Scan Coupon' : 'Enter Coupon Code'}
      >
        {isMobile ? (
          <>
            <QrCode size={18} />
            <span className="text-sm font-medium hidden sm:inline">Scan</span>
          </>
        ) : (
          <>
            <Keyboard size={18} />
            <span className="text-sm font-medium">Redeem</span>
          </>
        )}
      </button>

      {/* Redemption Result Toast */}
      {redemptionResult && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          redemptionResult.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {redemptionResult.success ? (
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                redemptionResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {redemptionResult.message}
              </p>
              {redemptionResult.success && redemptionResult.couponName && (
                <div className="mt-1">
                  <p className="text-xs text-green-700">
                    <strong>{redemptionResult.couponName}</strong> - {redemptionResult.discount}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setRedemptionResult(null)}
              className={`p-1 rounded-full hover:bg-opacity-20 ${
                redemptionResult.success 
                  ? 'text-green-600 hover:bg-green-600' 
                  : 'text-red-600 hover:bg-red-600'
              }`}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Scanner Modal */}
      <RedemptionScanner
        isOpen={showScanner}
        onClose={handleCloseScanner}
        onRedeem={handleRedeem}
      />
    </>
  );
};

export default RedemptionButton;