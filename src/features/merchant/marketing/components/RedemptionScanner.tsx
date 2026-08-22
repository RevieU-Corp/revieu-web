import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Search, X, AlertCircle, Keyboard } from 'lucide-react';

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

interface RedemptionScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onRedeem: (code: string) => void;
}

const RedemptionScanner: React.FC<RedemptionScannerProps> = ({ isOpen, onClose, onRedeem }) => {
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [html5QrCode, setHtml5QrCode] = useState<any>(null);
  const isMobile = useDeviceDetection();
  const scannerRef = useRef<HTMLDivElement>(null);

  // Dynamically import html5-qrcode only when needed
  useEffect(() => {
    if (isOpen && isMobile && !html5QrCode) {
      // Use dynamic import with error handling
      const loadScanner = async () => {
        try {
          const module = await import('html5-qrcode');
          const Html5Qrcode = module.Html5Qrcode || (module as any).default?.Html5Qrcode;
          if (Html5Qrcode) {
            setHtml5QrCode(new Html5Qrcode('qr-reader'));
          } else {
            throw new Error('Html5Qrcode not found in module');
          }
        } catch (error) {
          console.error('Failed to load QR code scanner:', error);
          setScanError('QR scanner not available. Please use manual entry below.');
        }
      };
      
      loadScanner();
    }
  }, [isOpen, isMobile, html5QrCode]);

  const startScanning = async () => {
    if (!html5QrCode) return;

    try {
      setIsScanning(true);
      setScanError(null);

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: "environment" }, // Use back camera
        config,
        (decodedText: string) => {
          // Successfully scanned
          stopScanning();
          onRedeem(decodedText);
        },
        (errorMessage: string) => {
          // Scanning error (can be ignored for continuous scanning)
          console.log('Scan error:', errorMessage);
        }
      );
    } catch (error) {
      console.error('Error starting scanner:', error);
      setScanError('Unable to access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (html5QrCode && isScanning) {
      try {
        await html5QrCode.stop();
        setIsScanning(false);
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onRedeem(manualCode.trim());
      setManualCode('');
    }
  };

  const handleClose = () => {
    stopScanning();
    setManualCode('');
    setScanError(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, html5QrCode, isScanning]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (html5QrCode && isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [html5QrCode, isScanning]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="presentation">
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="redemption-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              {isMobile ? <QrCode className="w-5 h-5 text-blue-600" /> : <Keyboard className="w-5 h-5 text-blue-600" />}
            </div>
            <div>
              <h3 id="redemption-dialog-title" className="text-lg font-semibold text-gray-900">
                {isMobile ? 'Scan Coupon' : 'Enter Coupon Code'}
              </h3>
              <p className="text-sm text-gray-600">
                {isMobile ? 'Point camera at QR code' : 'Type or paste coupon code'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            type="button"
            aria-label="Close redemption dialog"
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isMobile ? (
            // Mobile: QR Scanner
            <div className="space-y-4">
              {!isScanning ? (
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <QrCode size={48} className="text-gray-400" />
                  </div>
                  <button
                    onClick={startScanning}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Start Camera Scanner
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div id="qr-reader" ref={scannerRef} className="w-full"></div>
                  <button
                    onClick={stopScanning}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Stop Scanner
                  </button>
                </div>
              )}

              {scanError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600" />
                    <p className="text-sm text-red-700">{scanError}</p>
                  </div>
                </div>
              )}

              {/* Fallback manual entry for mobile */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-3">Or enter code manually:</p>
                <form onSubmit={handleManualSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!manualCode.trim()}
                    aria-label="Search coupon code"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Search size={16} />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            // Desktop: Manual Entry
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Keyboard size={24} className="text-blue-600" />
                </div>
                <p className="text-gray-600">Enter the coupon code to redeem</p>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    aria-label="Coupon code"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    placeholder="e.g., STUDENT20, SAVE15"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono text-lg"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={!manualCode.trim()}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Redeem Coupon
                </button>
              </form>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Or select automatic verification
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedemptionScanner;
