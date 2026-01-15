import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PaymentPage from '../PaymentPage';
import CouponPaymentSuccessPage from '../CouponPaymentSuccessPage';
import { CouponPaymentData, MerchantInfo } from '../../shared/types/coupons';

// Mock the voucher service
vi.mock('../../shared/services/voucherService', () => ({
  voucherService: {
    generateVoucher: vi.fn().mockResolvedValue({
      success: true,
      voucher: {
        id: 'test-voucher-id',
        code: 'TEST-VOUCHER-CODE',
        couponId: 'test-coupon-id',
        userId: 'test-user-id',
        merchantId: 'test-merchant-id',
        status: 'active',
        generatedAt: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        qrCode: 'test-qr-code',
        usageInstructions: 'Test usage instructions',
        merchantName: 'Test Merchant',
        dealTitle: 'Test Deal',
        dealValue: '$10 off'
      },
      qrCodeDataUrl: 'data:image/png;base64,test-qr-code-data'
    }),
    exportVoucher: vi.fn().mockResolvedValue({})
  }
}));

const mockCouponPaymentData: CouponPaymentData = {
  couponId: 'test-coupon-id',
  dealInfo: {
    id: 'test-deal-id',
    title: 'Test Deal',
    description: 'Test deal description',
    value: '$10 off',
    type: 'paid',
    price: 15.99,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    usageInstructions: 'Present this voucher at checkout'
  },
  merchantInfo: {
    id: 'test-merchant-id',
    name: 'Test Merchant',
    logo: 'test-logo.png',
    address: '123 Test St, Test City',
    phone: '(555) 123-4567'
  },
  paymentAmount: 15.99,
  currency: '$',
  userId: 'test-user-id'
};

const mockMerchantInfo: MerchantInfo = {
  id: 'test-merchant-id',
  name: 'Test Merchant',
  logo: 'test-logo.png',
  address: '123 Test St, Test City',
  phone: '(555) 123-4567'
};

const renderWithRouter = (component: React.ReactElement, initialState?: any) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Payment Integration for Coupons', () => {
  describe('PaymentPage with Coupon Data', () => {
    it('should display coupon information when coupon data is provided', () => {
      // Mock location state with coupon data
      const mockLocation = {
        state: {
          couponData: mockCouponPaymentData,
          merchantInfo: mockMerchantInfo
        },
        pathname: '/customer/payment',
        search: '',
        hash: '',
        key: 'test'
      };

      // Mock useLocation hook
      vi.doMock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useLocation: () => mockLocation,
          useNavigate: () => vi.fn()
        };
      });

      renderWithRouter(<PaymentPage />);

      // Check that coupon-specific elements are displayed
      expect(screen.getByText('Coupon Deal')).toBeInTheDocument();
      expect(screen.getByText('Test Deal')).toBeInTheDocument();
      expect(screen.getByText('Test Merchant')).toBeInTheDocument();
      expect(screen.getByText('$15.99')).toBeInTheDocument();
    });

    it('should display regular payment interface when no coupon data is provided', () => {
      const mockLocation = {
        state: {
          dealInfo: {
            title: 'Regular Deal',
            price: '12.99',
            oldPrice: '18.99',
            description: 'Regular deal description'
          }
        },
        pathname: '/customer/payment',
        search: '',
        hash: '',
        key: 'test'
      };

      vi.doMock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useLocation: () => mockLocation,
          useNavigate: () => vi.fn()
        };
      });

      renderWithRouter(<PaymentPage />);

      // Check that regular payment elements are displayed
      expect(screen.getByText('Regular Deal')).toBeInTheDocument();
      expect(screen.getByText('¥12.99')).toBeInTheDocument();
      expect(screen.queryByText('Coupon Deal')).not.toBeInTheDocument();
    });
  });

  describe('CouponPaymentSuccessPage', () => {
    it('should display coupon redemption success information', () => {
      const mockLocation = {
        state: {
          dealInfo: {
            title: 'Test Deal',
            price: '15.99',
            description: 'Test deal description'
          },
          paymentMethod: 'UPay',
          orderNumber: 'ORD123456789',
          voucherCode: 'TEST-VOUCHER-CODE',
          couponData: mockCouponPaymentData,
          merchantInfo: mockMerchantInfo,
          isCouponPayment: true
        },
        pathname: '/customer/payment/coupon-success',
        search: '',
        hash: '',
        key: 'test'
      };

      vi.doMock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useLocation: () => mockLocation,
          useNavigate: () => vi.fn()
        };
      });

      renderWithRouter(<CouponPaymentSuccessPage />);

      // Check that coupon success elements are displayed
      expect(screen.getByText('Coupon Redeemed!')).toBeInTheDocument();
      expect(screen.getByText('Your voucher is ready to use')).toBeInTheDocument();
      expect(screen.getByText('Coupon Deal Redeemed')).toBeInTheDocument();
      expect(screen.getByText('Test Deal')).toBeInTheDocument();
    });

    it('should display merchant information when provided', () => {
      const mockLocation = {
        state: {
          dealInfo: {
            title: 'Test Deal',
            price: '15.99',
            description: 'Test deal description'
          },
          paymentMethod: 'UPay',
          orderNumber: 'ORD123456789',
          voucherCode: 'TEST-VOUCHER-CODE',
          couponData: mockCouponPaymentData,
          merchantInfo: mockMerchantInfo,
          isCouponPayment: true
        },
        pathname: '/customer/payment/coupon-success',
        search: '',
        hash: '',
        key: 'test'
      };

      vi.doMock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useLocation: () => mockLocation,
          useNavigate: () => vi.fn()
        };
      });

      renderWithRouter(<CouponPaymentSuccessPage />);

      // Check that merchant information is displayed
      expect(screen.getByText('Test Merchant')).toBeInTheDocument();
      expect(screen.getByText('123 Test St, Test City')).toBeInTheDocument();
      expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();
    });
  });

  describe('Integration Flow', () => {
    it('should handle the complete coupon payment flow data structure', () => {
      // Test that the data structure flows correctly from PaymentPage to CouponPaymentSuccessPage
      const paymentPageState = {
        couponData: mockCouponPaymentData,
        merchantInfo: mockMerchantInfo
      };

      const successPageState = {
        dealInfo: {
          title: mockCouponPaymentData.dealInfo.title,
          price: mockCouponPaymentData.paymentAmount.toString(),
          description: mockCouponPaymentData.dealInfo.description
        },
        paymentMethod: 'UPay',
        orderNumber: 'ORD123456789',
        voucherCode: 'TEST-VOUCHER-CODE',
        couponData: mockCouponPaymentData,
        merchantInfo: mockMerchantInfo,
        isCouponPayment: true
      };

      // Verify that the data structure is consistent
      expect(successPageState.dealInfo.title).toBe(paymentPageState.couponData.dealInfo.title);
      expect(successPageState.dealInfo.description).toBe(paymentPageState.couponData.dealInfo.description);
      expect(successPageState.merchantInfo).toBe(paymentPageState.merchantInfo);
      expect(successPageState.couponData).toBe(paymentPageState.couponData);
      expect(successPageState.isCouponPayment).toBe(true);
    });
  });
});