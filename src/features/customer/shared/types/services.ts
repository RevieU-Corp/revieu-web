// Service interfaces for coupon redemption system

import {
  Coupon,
  Voucher,
  ValidationResult,
  VoucherResult,
  PaymentFlowResult,
  RedemptionState,
  VoucherCollection,
  VoucherFilter,
  VoucherShareOptions,
  VoucherExportData
} from './coupons';

// Coupon Service Interface
export interface CouponService {
  /**
   * Validates a coupon for a specific user
   * @param couponId - The ID of the coupon to validate
   * @param userId - The ID of the user attempting redemption
   * @returns Promise resolving to validation result
   */
  validateCoupon(couponId: string, userId: string): Promise<ValidationResult>;

  /**
   * Redeems a free coupon and generates a voucher
   * @param couponId - The ID of the coupon to redeem
   * @param userId - The ID of the user redeeming the coupon
   * @returns Promise resolving to voucher result
   */
  redeemFreeCoupon(couponId: string, userId: string): Promise<VoucherResult>;

  /**
   * Initiates the payment flow for a paid coupon
   * @param couponId - The ID of the coupon requiring payment
   * @param userId - The ID of the user purchasing the coupon
   * @returns Promise resolving to payment flow configuration
   */
  initiatePaidCouponFlow(couponId: string, userId: string): Promise<PaymentFlowResult>;

  /**
   * Retrieves coupon details by ID
   * @param couponId - The ID of the coupon to retrieve
   * @returns Promise resolving to coupon data
   */
  getCouponById(couponId: string): Promise<Coupon>;

  /**
   * Gets available coupons for a merchant
   * @param merchantId - The ID of the merchant
   * @param userId - The ID of the user (for eligibility checking)
   * @returns Promise resolving to array of available coupons
   */
  getAvailableCoupons(merchantId: string, userId: string): Promise<Coupon[]>;

  /**
   * Checks if a user has already redeemed a specific coupon
   * @param couponId - The ID of the coupon to check
   * @param userId - The ID of the user
   * @returns Promise resolving to boolean indicating redemption status
   */
  hasUserRedeemedCoupon(couponId: string, userId: string): Promise<boolean>;
}

// Voucher Service Interface
export interface VoucherService {
  /**
   * Generates a unique voucher code
   * @param couponData - The coupon data for voucher generation
   * @param userId - The ID of the user receiving the voucher
   * @param paymentId - Optional payment/order ID for paid coupons
   * @returns Promise resolving to voucher result
   */
  generateVoucher(couponData: Coupon, userId: string, paymentId?: string): Promise<VoucherResult>;

  /**
   * Retrieves voucher by ID
   * @param voucherId - The ID of the voucher to retrieve
   * @returns Promise resolving to voucher data
   */
  getVoucherById(voucherId: string): Promise<Voucher>;

  /**
   * Retrieves voucher by code
   * @param voucherCode - The code of the voucher to retrieve
   * @returns Promise resolving to voucher data
   */
  getVoucherByCode(voucherCode: string): Promise<Voucher>;

  /**
   * Gets all vouchers for a user with optional filtering
   * @param userId - The ID of the user
   * @param filter - Optional filter criteria
   * @returns Promise resolving to voucher collection
   */
  getUserVouchers(userId: string, filter?: VoucherFilter): Promise<VoucherCollection>;

  /**
   * Marks a voucher as used
   * @param voucherId - The ID of the voucher to mark as used
   * @param merchantId - The ID of the merchant redeeming the voucher
   * @returns Promise resolving to updated voucher
   */
  markVoucherAsUsed(voucherId: string, merchantId: string): Promise<Voucher>;

  /**
   * Generates QR code for a voucher
   * @param voucherCode - The voucher code to encode
   * @returns Promise resolving to QR code data URL
   */
  generateQRCode(voucherCode: string): Promise<string>;

  /**
   * Shares a voucher via specified method
   * @param voucherId - The ID of the voucher to share
   * @param shareOptions - The sharing configuration
   * @returns Promise resolving to success status
   */
  shareVoucher(voucherId: string, shareOptions: VoucherShareOptions): Promise<boolean>;

  /**
   * Exports voucher data for external use
   * @param voucherId - The ID of the voucher to export
   * @param format - The export format
   * @returns Promise resolving to export data
   */
  exportVoucher(voucherId: string, format: 'pdf' | 'image' | 'wallet'): Promise<VoucherExportData>;

  /**
   * Updates voucher status (for system use)
   * @param voucherId - The ID of the voucher to update
   * @param status - The new status
   * @returns Promise resolving to updated voucher
   */
  updateVoucherStatus(voucherId: string, status: Voucher['status']): Promise<Voucher>;

  /**
   * Deletes a voucher by ID
   * @param voucherId - The ID of the voucher to delete
   * @returns Promise resolving when deletion is complete
   */
  deleteVoucher(voucherId: string): Promise<void>;
}

// Redemption State Management Interface
export interface RedemptionStateService {
  /**
   * Gets current redemption state
   * @param sessionId - The session ID for the redemption flow
   * @returns Promise resolving to current state
   */
  getRedemptionState(sessionId: string): Promise<RedemptionState>;

  /**
   * Updates redemption state
   * @param sessionId - The session ID for the redemption flow
   * @param state - The new state data
   * @returns Promise resolving to updated state
   */
  updateRedemptionState(sessionId: string, state: Partial<RedemptionState>): Promise<RedemptionState>;

  /**
   * Clears redemption state
   * @param sessionId - The session ID to clear
   * @returns Promise resolving to success status
   */
  clearRedemptionState(sessionId: string): Promise<boolean>;

  /**
   * Creates a new redemption session
   * @param couponId - The ID of the coupon being redeemed
   * @param userId - The ID of the user
   * @returns Promise resolving to session ID
   */
  createRedemptionSession(couponId: string, userId: string): Promise<string>;
}

// Validation Service Interface
export interface ValidationService {
  /**
   * Validates coupon availability
   * @param coupon - The coupon to validate
   * @returns Promise resolving to validation result
   */
  validateCouponAvailability(coupon: Coupon): Promise<ValidationResult>;

  /**
   * Validates user eligibility for a coupon
   * @param coupon - The coupon to validate against
   * @param userId - The ID of the user
   * @returns Promise resolving to validation result
   */
  validateUserEligibility(coupon: Coupon, userId: string): Promise<ValidationResult>;

  /**
   * Validates voucher code format
   * @param voucherCode - The voucher code to validate
   * @returns Boolean indicating if format is valid
   */
  validateVoucherCodeFormat(voucherCode: string): boolean;

  /**
   * Validates QR code data
   * @param qrData - The QR code data to validate
   * @returns Boolean indicating if QR data is valid
   */
  validateQRCodeData(qrData: string): boolean;
}
