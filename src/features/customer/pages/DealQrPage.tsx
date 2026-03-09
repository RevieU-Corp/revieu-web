import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock3, Copy, MapPin, QrCode } from 'lucide-react';
import { voucherService } from '../shared/services/voucherService';

interface DealQrLocationState {
  merchantName: string;
  dealTitle: string;
  dealPrice: string;
  distance: string;
  voucherCode: string;
}

const DealQrPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const state = location.state as DealQrLocationState | undefined;

  const payload = useMemo<DealQrLocationState>(() => {
    if (state) return state;
    return {
      merchantName: 'Merchant',
      dealTitle: 'Special Deal',
      dealPrice: '$0.00',
      distance: '0.0 Miles',
      voucherCode: `DEAL-${Date.now().toString(36).toUpperCase()}`,
    };
  }, [state]);

  useEffect(() => {
    let mounted = true;
    const generate = async () => {
      try {
        const dataUrl = await voucherService.generateQRCode(payload.voucherCode);
        if (mounted) {
          setQrCodeDataUrl(dataUrl);
        }
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    generate();
    return () => {
      mounted = false;
    };
  }, [payload.voucherCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload.voucherCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7f7] via-white to-[#fff3f3] pb-10">
      <div className="mx-auto max-w-[430px] px-4 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#f2dede] bg-white text-[#ab1f1f]"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <p className="text-base font-semibold text-[#9a1d1d]">Deal QR</p>
          <div className="w-10" />
        </div>

        <div className="rounded-[24px] border border-[#f3e2e2] bg-white p-5 shadow-[0_12px_30px_rgba(199,30,30,0.08)]">
          <p className="text-[22px] font-semibold leading-tight text-[#2c2f37]">{payload.merchantName}</p>
          <p className="mt-1 text-sm text-[#8e93a0]">{payload.dealTitle}</p>

          <div className="mt-3 flex items-center gap-4 text-sm text-[#7f8592]">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#c52525]" />
              {payload.distance}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-[#c52525]" />
              Valid Today
            </span>
          </div>

          <div className="mt-5 rounded-2xl bg-gradient-to-r from-[#d61f1f] to-[#a00d0d] px-4 py-3 text-white">
            <p className="text-xs uppercase tracking-widest opacity-80">Deal Price</p>
            <p className="text-2xl font-semibold">{payload.dealPrice}</p>
          </div>

          <div className="mt-5 rounded-2xl border border-[#f0f0f0] bg-[#fafafa] p-4">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-[#8f95a1]">
              Scan To Redeem
            </p>
            <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-xl bg-white p-3 shadow-inner">
              {isLoading ? (
                <div className="text-center">
                  <div className="mx-auto mb-2 h-7 w-7 animate-spin rounded-full border-2 border-[#b62222] border-t-transparent" />
                  <p className="text-xs text-[#8e95a2]">Generating...</p>
                </div>
              ) : qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Deal QR Code" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center">
                  <QrCode className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-xs text-gray-500">QR unavailable</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#ead6d6] bg-white py-2.5 text-sm font-semibold text-[#7f2b2b]"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied' : payload.voucherCode}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DealQrPage;
