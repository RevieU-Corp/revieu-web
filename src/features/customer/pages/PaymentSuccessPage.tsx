import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Copy, Download, Home, QrCode, BarChart3 } from 'lucide-react';
import { PATHS } from '../../../routes/paths';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  // 从路由状态获取支付信息
  const paymentData = location.state || {
    dealInfo: {
      title: 'Lunch Combo A',
      price: '12.99',
      description: 'Orange chicken, fried rice, and egg roll'
    },
    paymentMethod: 'UPay',
    orderNumber: `ORD${Date.now()}`,
    voucherCode: `VCH${Math.random().toString(36).substr(2, 8).toUpperCase()}`
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(paymentData.voucherCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    // 这里可以实现下载兑换码的功能
    console.log('Download voucher');
  };

  // 生成简单的二维码占位符（实际项目中应该使用真实的二维码库）
  const QRCodePlaceholder = () => (
    <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mx-auto">
      <div className="text-center">
        <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
        <div className="text-xs text-gray-500">QR Code</div>
        <div className="text-xs text-gray-400 mt-1">{paymentData.voucherCode}</div>
      </div>
    </div>
  );

  // 生成条形码占位符
  const BarcodeePlaceholder = () => (
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
        {paymentData.voucherCode}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="p-4 space-y-6 max-w-md mx-auto pt-8">
        {/* Success Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your order has been confirmed</p>
        </div>

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
              <span className="font-bold text-green-600">¥{paymentData.dealInfo.price}</span>
            </div>
          </div>
        </div>

        {/* Voucher Code Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="font-bold text-lg text-gray-900 mb-2">Your Voucher</h2>
            <p className="text-sm text-gray-600">Show this code at the restaurant to redeem your order</p>
          </div>

          {/* QR Code */}
          <div className="mb-6">
            <QRCodePlaceholder />
          </div>

          {/* Barcode */}
          <div className="mb-6">
            <BarcodeePlaceholder />
          </div>

          {/* Voucher Code */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Voucher Code</div>
              <div className="text-2xl font-bold text-gray-900 font-mono tracking-wider mb-3">
                {paymentData.voucherCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
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
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download
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

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to Redeem</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Show the QR code or barcode to the cashier</li>
            <li>• Or provide the voucher code verbally</li>
            <li>• Valid for 30 days from purchase date</li>
            <li>• Cannot be combined with other offers</li>
          </ul>
        </div>

        {/* Restaurant Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Restaurant Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name</span>
              <span className="text-gray-900">Northern Cafe</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Address</span>
              <span className="text-gray-900 text-right">123 N Tryon St, Charlotte, NC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone</span>
              <span className="text-gray-900">(704) 555-0123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hours</span>
              <span className="text-gray-900">10:00 AM - 10:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;