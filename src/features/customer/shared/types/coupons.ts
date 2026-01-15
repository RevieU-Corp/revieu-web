// Coupon redemption system type definitions

// Core Coupon Types
export interface Coupon {
  id: string;
  merchantId: string;
  title: string;
  description: string;
  type: 'free' | 'paid';
  value: string;
  price?: number;
  expiryDate: Date;
  maxRedemptions?: number;
  currentRedemptions: number;
  eligibilityRules: EligibilityRule[];
  usageInstructions: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Voucher Types
export interface Voucher {
  id: string;
  code: string;
  couponId: string;
  userId: string;
  merchantId: string;
  status: 'active' | 'used' | 'expired';
  generatedAt: Date;
  expiryDate: Date;
  usedAt?: Date;
  qrCode: string;
  paymentId?: string;
  usageInstructions: string;
  merchantName: string;
  dealTitle: string;
  dealValue: string;
}

// Eligibility and Validation Types
export interface EligibilityRule {
  type: 'new_user' | 'membership_level' | 'previous_purchase' | 'location' | 'age_restriction' | 'single_use';
  value: any;
  description: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  errorCode?: ValidationErrorCode;
  eligibilityInfo?: EligibilityInfo;
  suggestedAlternatives?: Coupon[];
}

export interface EligibilityInfo {
  isEligible: boolean;
  failedRules: EligibilityRule[];
  requirements: string[];
}

export type ValidationErrorCode = 
  | 'EXPIRED'
  | 'OUT_OF_STOCK'
  | 'NOT_ELIGIBLE'
  | 'ALREADY_REDEEMED'
  | 'INACTIVE'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR';

// Service Result Types
export interface VoucherResult {
  voucher: Voucher;
  qrCodeDataUrl: string;
  success: boolean;
  message?: string;
}

export interface PaymentFlowResult {
  paymentUrl: string;
  paymentData: CouponPaymentData;
  sessionId: string;
}

export interface CouponPaymentData {
  couponId: string;
  dealInfo: DealInfo;
  merchantInfo: MerchantInfo;
  paymentAmount: number;
  currency: string;
  userId: string;
}

// Supporting Types
export interface DealInfo {
  id: string;
  title: string;
  description: string;
  value: string;
  type: 'free' | 'paid';
  price?: number;
  expiryDate: Date;
  usageInstructions: string;
}

export interface MerchantInfo {
  id: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
}

// Redemption Flow Types
export interface RedemptionState {
  step: RedemptionStep;
  couponId: string;
  validationResult?: ValidationResult;
  paymentData?: CouponPaymentData;
  voucherResult?: VoucherResult;
  error?: RedemptionError;
}

export type RedemptionStep = 
  | 'validation'
  | 'payment'
  | 'processing'
  | 'success'
  | 'error';

export interface RedemptionError {
  code: ValidationErrorCode;
  message: string;
  retryable: boolean;
  suggestedActions: string[];
}

// Voucher Management Types
export interface VoucherCollection {
  active: Voucher[];
  used: Voucher[];
  expired: Voucher[];
  total: number;
}

export interface VoucherFilter {
  status?: Voucher['status'];
  merchantId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

// Enhanced DealCard Props (extending existing)
export interface EnhancedDealCardProps {
  id: string;
  title: string;
  description: string;
  expiry: string;
  value: string;
  type: 'free' | 'paid';
  price?: number;
  merchantId: string;
  isLoading?: boolean;
  onUseNow: (dealId: string) => void;
}

// Sharing and Export Types
export interface VoucherShareOptions {
  method: 'email' | 'sms' | 'social' | 'copy';
  recipient?: string;
  message?: string;
}

export interface VoucherExportData {
  voucher: Voucher;
  qrCodeDataUrl: string;
  merchantInfo: MerchantInfo;
  exportFormat: 'pdf' | 'image' | 'wallet';
}