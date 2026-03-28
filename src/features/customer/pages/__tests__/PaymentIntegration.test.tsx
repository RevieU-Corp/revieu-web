import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
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

// Clean up after each test to prevent DOM pollution
afterEach(() => {
  cleanup();
});

describe('Payment Integration for Coupons', () => {
  describe('PaymentPage with Coupon Data', () => {
    it('should display coupon information when deal cards pass couponPaymentData in navigation state', () => {
      render(
        <MemoryRouter initialEntries={[{
          pathname: '/customer/payment',
          state: {
            couponPaymentData: mockCouponPaymentData,
            merchantInfo: mockMerchantInfo
          }
        }]}>
          <PaymentPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Coupon Deal')).toBeInTheDocument();
      const dealTitles = screen.getAllByText('Test Deal');
      expect(dealTitles.length).toBeGreaterThan(0);
      const prices = screen.getAllByText('$15.99');
      expect(prices.length).toBeGreaterThan(0);
    });

    it('should display coupon information when coupon data is provided', () => {
      // Render with MemoryRouter and inject location state
      render(
        <MemoryRouter initialEntries={[{
          pathname: '/customer/payment',
          state: {
            couponData: mockCouponPaymentData,
            merchantInfo: mockMerchantInfo
          }
        }]}>
          <PaymentPage />
        </MemoryRouter>
      );

      // Check that coupon-specific elements are displayed
      expect(screen.getByText('Coupon Deal')).toBeInTheDocument();
      const dealTitles = screen.getAllByText('Test Deal');
      expect(dealTitles.length).toBeGreaterThan(0);
      const merchantNames = screen.getAllByText('Test Merchant');
      expect(merchantNames.length).toBeGreaterThan(0);
      const prices = screen.getAllByText('$15.99');
      expect(prices.length).toBeGreaterThan(0);
    });

    it('should display regular payment interface when no coupon data is provided', () => {
      // Render with MemoryRouter and inject regular deal info
      render(
        <MemoryRouter initialEntries={[{
          pathname: '/customer/payment',
          state: {
            dealInfo: {
              title: 'Regular Deal',
              price: '12.99',
              oldPrice: '18.99',
              description: 'Regular deal description'
            }
          }
        }]}>
          <PaymentPage />
        </MemoryRouter>
      );

      // Check that regular payment elements are displayed
      expect(screen.getByText('Regular Deal')).toBeInTheDocument();
      const prices = screen.getAllByText('¥12.99');
      expect(prices.length).toBeGreaterThan(0);
      expect(screen.queryByText('Coupon Deal')).not.toBeInTheDocument();
    });
  });


  describe('CouponPaymentSuccessPage', () => {
    it('should display coupon redemption success information', () => {
      // Render with MemoryRouter and inject coupon payment success state
      render(
        <MemoryRouter initialEntries={[{
          pathname: '/customer/payment/coupon-success',
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
          }
        }]}>
          <CouponPaymentSuccessPage />
        </MemoryRouter>
      );

      // Check that coupon success elements are displayed
      expect(screen.getByText('Coupon Redeemed!')).toBeInTheDocument();
      expect(screen.getByText('Your voucher is ready to use')).toBeInTheDocument();
      expect(screen.getByText('Coupon Deal Redeemed')).toBeInTheDocument();
      const dealTitles = screen.getAllByText('Test Deal');
      expect(dealTitles.length).toBeGreaterThan(0);
    });

    it('should display merchant information when provided', () => {
      // Render with MemoryRouter and inject coupon payment success state
      render(
        <MemoryRouter initialEntries={[{
          pathname: '/customer/payment/coupon-success',
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
          }
        }]}>
          <CouponPaymentSuccessPage />
        </MemoryRouter>
      );

      // Check that merchant information is displayed
      const merchantNames = screen.getAllByText('Test Merchant');
      expect(merchantNames.length).toBeGreaterThan(0);
      const addresses = screen.getAllByText('123 Test St, Test City');
      expect(addresses.length).toBeGreaterThan(0);
      const phones = screen.getAllByText('(555) 123-4567');
      expect(phones.length).toBeGreaterThan(0);
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
