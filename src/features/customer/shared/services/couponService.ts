import { apiClient } from '../../../../api/apiClient';
import {
  Coupon,
  PaymentFlowResult,
  ValidationErrorCode,
  ValidationResult,
  VoucherResult,
} from '../types/coupons';
import { CouponService } from '../types/services';
import { voucherService } from './voucherService';

type BackendCoupon = {
  id: number | string;
  merchant_id: number | string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  coupon_type?: string | null;
  value?: string | null;
  price?: number | null;
  total_quantity?: number | null;
  claimed_count?: number | null;
  terms?: string | null;
  expiry_date?: string | null;
  valid_until?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const DEFAULT_USAGE_INSTRUCTIONS = 'Show this voucher to the merchant to redeem your deal.';

const parseDate = (value?: string | null): Date | undefined => {
  if (!value || value.startsWith('0001-01-01T00:00:00')) {
    return undefined;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const toValidationError = (message: string, code: ValidationErrorCode): ValidationResult => ({
  isValid: false,
  errorCode: code,
  errorMessage: message,
});

export class CouponServiceImpl implements CouponService {
  private couponCache = new Map<string, Coupon>();

  async validateCoupon(couponId: string, _userId: string): Promise<ValidationResult> {
    try {
      const response = await apiClient.post(`/coupons/${couponId}/validate`, { quantity: 1 });
      const result = response.data?.data ?? response.data;

      if (!result?.is_valid) {
        return toValidationError('This coupon is not available', 'INACTIVE');
      }

      return {
        isValid: true,
        eligibilityInfo: {
          isEligible: true,
          failedRules: [],
          requirements: [],
        },
      };
    } catch (error) {
      return this.handleValidationError(error);
    }
  }

  async redeemFreeCoupon(couponId: string, userId: string): Promise<VoucherResult> {
    const validationResult = await this.validateCoupon(couponId, userId);
    if (!validationResult.isValid) {
      return {
        voucher: {} as VoucherResult['voucher'],
        qrCodeDataUrl: '',
        success: false,
        message: validationResult.errorMessage,
      };
    }

    const coupon = await this.getCouponById(couponId);
    if (coupon.type !== 'free') {
      return {
        voucher: {} as VoucherResult['voucher'],
        qrCodeDataUrl: '',
        success: false,
        message: 'This coupon requires payment',
      };
    }

    return voucherService.generateVoucher(coupon, userId);
  }

  async initiatePaidCouponFlow(couponId: string, userId: string): Promise<PaymentFlowResult> {
    const validationResult = await this.validateCoupon(couponId, userId);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errorMessage || 'Coupon validation failed');
    }

    const coupon = await this.getCouponById(couponId);
    if (coupon.type !== 'paid' || coupon.price === undefined) {
      throw new Error('This coupon does not require payment');
    }

    return {
      paymentData: {
        couponId,
        userId,
        currency: '$',
        paymentAmount: coupon.price,
        merchantInfo: {
          id: coupon.merchantId,
          name: '',
          logo: '',
          address: '',
          phone: '',
        },
        dealInfo: {
          id: coupon.id,
          title: coupon.title,
          description: coupon.description,
          value: coupon.value,
          type: coupon.type,
          price: coupon.price,
          expiryDate: coupon.expiryDate,
          usageInstructions: coupon.usageInstructions,
        },
      },
    };
  }

  async getCouponById(couponId: string): Promise<Coupon> {
    const coupon = this.couponCache.get(couponId);
    if (!coupon) {
      throw new Error('Coupon data is not loaded');
    }

    return coupon;
  }

  async getAvailableCoupons(storeId: string, _userId: string): Promise<Coupon[]> {
    const response = await apiClient.get(`/stores/${storeId}/coupons`);
    const rawCoupons = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
    const coupons = (rawCoupons as BackendCoupon[]).map((coupon) => this.mapCoupon(coupon));

    coupons.forEach((coupon) => {
      this.couponCache.set(coupon.id, coupon);
    });

    return coupons;
  }

  async hasUserRedeemedCoupon(couponId: string, userId: string): Promise<boolean> {
    const vouchers = await voucherService.getUserVouchers(userId);
    return vouchers.active.concat(vouchers.used, vouchers.expired).some((voucher) => voucher.couponId === couponId);
  }

  private mapCoupon(raw: BackendCoupon): Coupon {
    const price = raw.price ?? undefined;
    const isPaid = (raw.coupon_type ?? '').toLowerCase() === 'paid' || (price ?? 0) > 0;
    const expiryDate = parseDate(raw.valid_until) ?? parseDate(raw.expiry_date) ?? new Date();
    const createdAt = parseDate(raw.created_at) ?? new Date();
    const updatedAt = parseDate(raw.updated_at) ?? createdAt;

    return {
      id: String(raw.id),
      merchantId: String(raw.merchant_id),
      title: raw.title,
      description: raw.description ?? '',
      imageUrl: raw.image_url ?? undefined,
      type: isPaid ? 'paid' : 'free',
      value: raw.value ?? '',
      price,
      expiryDate,
      maxRedemptions: raw.total_quantity ?? undefined,
      currentRedemptions: raw.claimed_count ?? 0,
      eligibilityRules: [],
      usageInstructions: raw.terms?.trim() || DEFAULT_USAGE_INSTRUCTIONS,
      isActive: raw.status === 'active',
      createdAt,
      updatedAt,
    };
  }

  private handleValidationError(error: unknown): ValidationResult {
    const message = this.getBackendErrorMessage(error).toLowerCase();

    if (message.includes('expired')) {
      return toValidationError('This coupon has expired', 'EXPIRED');
    }
    if (message.includes('sold out')) {
      return toValidationError('This coupon is no longer available', 'OUT_OF_STOCK');
    }
    if (message.includes('inactive')) {
      return toValidationError('This coupon is not active', 'INACTIVE');
    }
    if (message.includes('per-user') || message.includes('limit')) {
      return toValidationError('You have already reached the limit for this coupon', 'ALREADY_REDEEMED');
    }
    if (message.includes('network')) {
      return toValidationError('Network error. Please try again.', 'NETWORK_ERROR');
    }

    return toValidationError(
      this.getBackendErrorMessage(error) || 'Unable to validate coupon',
      'SERVER_ERROR'
    );
  }

  private getBackendErrorMessage(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof error.response === 'object' &&
      error.response !== null &&
      'data' in error.response &&
      typeof error.response.data === 'object' &&
      error.response.data !== null &&
      'error' in error.response.data &&
      typeof error.response.data.error === 'string'
    ) {
      return error.response.data.error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown error';
  }
}

export const couponService = new CouponServiceImpl();
