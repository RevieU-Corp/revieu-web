// Validation schemas and type guards for coupon redemption system

import {
  Coupon,
  Voucher,
  EligibilityRule,
  CouponPaymentData
} from './coupons';

// Validation Error Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationSchema<T> {
  validate(data: unknown): SchemaValidationResult<T>;
  validatePartial(data: unknown): SchemaValidationResult<Partial<T>>;
}

export interface SchemaValidationResult<T> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
}

// Type Guards
export function isCoupon(data: unknown): data is Coupon {
  if (!data || typeof data !== 'object') return false;
  
  const obj = data as Record<string, unknown>;
  
  return (
    typeof obj.id === 'string' &&
    typeof obj.merchantId === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    (obj.type === 'free' || obj.type === 'paid') &&
    typeof obj.value === 'string' &&
    (obj.price === undefined || typeof obj.price === 'number') &&
    obj.expiryDate instanceof Date &&
    (obj.maxRedemptions === undefined || typeof obj.maxRedemptions === 'number') &&
    typeof obj.currentRedemptions === 'number' &&
    Array.isArray(obj.eligibilityRules) &&
    typeof obj.usageInstructions === 'string' &&
    typeof obj.isActive === 'boolean' &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date
  );
}

export function isVoucher(data: unknown): data is Voucher {
  if (!data || typeof data !== 'object') return false;
  
  const obj = data as Record<string, unknown>;
  
  return (
    typeof obj.id === 'string' &&
    typeof obj.code === 'string' &&
    typeof obj.couponId === 'string' &&
    typeof obj.userId === 'string' &&
    typeof obj.merchantId === 'string' &&
    ['active', 'used', 'expired'].includes(obj.status as string) &&
    obj.generatedAt instanceof Date &&
    obj.expiryDate instanceof Date &&
    (obj.usedAt === undefined || obj.usedAt instanceof Date) &&
    typeof obj.qrCode === 'string' &&
    (obj.paymentId === undefined || typeof obj.paymentId === 'string') &&
    typeof obj.usageInstructions === 'string' &&
    typeof obj.merchantName === 'string' &&
    typeof obj.dealTitle === 'string' &&
    typeof obj.dealValue === 'string'
  );
}

export function isEligibilityRule(data: unknown): data is EligibilityRule {
  if (!data || typeof data !== 'object') return false;
  
  const obj = data as Record<string, unknown>;
  
  return (
    ['new_user', 'membership_level', 'previous_purchase', 'location', 'age_restriction', 'single_use'].includes(obj.type as string) &&
    obj.value !== undefined &&
    typeof obj.description === 'string'
  );
}

// Validation Functions
export function validateCouponData(data: unknown): SchemaValidationResult<Coupon> {
  const errors: ValidationError[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push({ field: 'root', message: 'Data must be an object', code: 'INVALID_TYPE' });
    return { success: false, errors };
  }
  
  const obj = data as Record<string, unknown>;
  
  // Required string fields
  const requiredStringFields = ['id', 'merchantId', 'title', 'description', 'value', 'usageInstructions'];
  for (const field of requiredStringFields) {
    if (!obj[field] || typeof obj[field] !== 'string' || (obj[field] as string).trim() === '') {
      errors.push({ field, message: `${field} is required and must be a non-empty string`, code: 'REQUIRED_FIELD' });
    }
  }
  
  // Type validation
  if (obj.type !== 'free' && obj.type !== 'paid') {
    errors.push({ field: 'type', message: 'Type must be either "free" or "paid"', code: 'INVALID_VALUE' });
  }
  
  // Price validation for paid coupons
  if (obj.type === 'paid') {
    if (!obj.price || typeof obj.price !== 'number' || obj.price <= 0) {
      errors.push({ field: 'price', message: 'Price is required for paid coupons and must be a positive number', code: 'INVALID_PRICE' });
    }
  }
  
  // Date validations
  if (!obj.expiryDate || !(obj.expiryDate instanceof Date) || isNaN(obj.expiryDate.getTime())) {
    errors.push({ field: 'expiryDate', message: 'Expiry date must be a valid Date object', code: 'INVALID_DATE' });
  } else if (obj.expiryDate <= new Date()) {
    errors.push({ field: 'expiryDate', message: 'Expiry date must be in the future', code: 'EXPIRED_DATE' });
  }
  
  // Number validations
  if (obj.currentRedemptions !== undefined && (typeof obj.currentRedemptions !== 'number' || obj.currentRedemptions < 0)) {
    errors.push({ field: 'currentRedemptions', message: 'Current redemptions must be a non-negative number', code: 'INVALID_NUMBER' });
  }
  
  if (obj.maxRedemptions !== undefined && (typeof obj.maxRedemptions !== 'number' || obj.maxRedemptions <= 0)) {
    errors.push({ field: 'maxRedemptions', message: 'Max redemptions must be a positive number', code: 'INVALID_NUMBER' });
  }
  
  // Eligibility rules validation
  if (!Array.isArray(obj.eligibilityRules)) {
    errors.push({ field: 'eligibilityRules', message: 'Eligibility rules must be an array', code: 'INVALID_TYPE' });
  } else {
    obj.eligibilityRules.forEach((rule, index) => {
      if (!isEligibilityRule(rule)) {
        errors.push({ field: `eligibilityRules[${index}]`, message: 'Invalid eligibility rule format', code: 'INVALID_RULE' });
      }
    });
  }
  
  // Boolean validations
  if (typeof obj.isActive !== 'boolean') {
    errors.push({ field: 'isActive', message: 'isActive must be a boolean', code: 'INVALID_TYPE' });
  }
  
  return {
    success: errors.length === 0,
    data: errors.length === 0 ? obj as unknown as Coupon : undefined,
    errors
  };
}

export function validateVoucherData(data: unknown): SchemaValidationResult<Voucher> {
  const errors: ValidationError[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push({ field: 'root', message: 'Data must be an object', code: 'INVALID_TYPE' });
    return { success: false, errors };
  }
  
  const obj = data as Record<string, unknown>;
  
  // Required string fields
  const requiredStringFields = ['id', 'code', 'couponId', 'userId', 'merchantId', 'qrCode', 'usageInstructions', 'merchantName', 'dealTitle', 'dealValue'];
  for (const field of requiredStringFields) {
    if (!obj[field] || typeof obj[field] !== 'string' || (obj[field] as string).trim() === '') {
      errors.push({ field, message: `${field} is required and must be a non-empty string`, code: 'REQUIRED_FIELD' });
    }
  }
  
  // Status validation
  if (!['active', 'used', 'expired'].includes(obj.status as string)) {
    errors.push({ field: 'status', message: 'Status must be "active", "used", or "expired"', code: 'INVALID_VALUE' });
  }
  
  // Date validations
  if (!obj.generatedAt || !(obj.generatedAt instanceof Date) || isNaN(obj.generatedAt.getTime())) {
    errors.push({ field: 'generatedAt', message: 'Generated date must be a valid Date object', code: 'INVALID_DATE' });
  }
  
  if (!obj.expiryDate || !(obj.expiryDate instanceof Date) || isNaN(obj.expiryDate.getTime())) {
    errors.push({ field: 'expiryDate', message: 'Expiry date must be a valid Date object', code: 'INVALID_DATE' });
  }
  
  if (obj.usedAt !== undefined && (!(obj.usedAt instanceof Date) || isNaN(obj.usedAt.getTime()))) {
    errors.push({ field: 'usedAt', message: 'Used date must be a valid Date object or undefined', code: 'INVALID_DATE' });
  }
  
  // Voucher code format validation
  if (obj.code && typeof obj.code === 'string') {
    if (!validateVoucherCodeFormat(obj.code as string)) {
      errors.push({ field: 'code', message: 'Voucher code format is invalid', code: 'INVALID_FORMAT' });
    }
  }
  
  return {
    success: errors.length === 0,
    data: errors.length === 0 ? obj as unknown as Voucher : undefined,
    errors
  };
}

export function validatePaymentData(data: unknown): SchemaValidationResult<CouponPaymentData> {
  const errors: ValidationError[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push({ field: 'root', message: 'Data must be an object', code: 'INVALID_TYPE' });
    return { success: false, errors };
  }
  
  const obj = data as Record<string, unknown>;
  
  // Required string fields
  const requiredStringFields = ['couponId', 'currency', 'userId'];
  for (const field of requiredStringFields) {
    if (!obj[field] || typeof obj[field] !== 'string' || (obj[field] as string).trim() === '') {
      errors.push({ field, message: `${field} is required and must be a non-empty string`, code: 'REQUIRED_FIELD' });
    }
  }
  
  // Payment amount validation
  if (!obj.paymentAmount || typeof obj.paymentAmount !== 'number' || obj.paymentAmount <= 0) {
    errors.push({ field: 'paymentAmount', message: 'Payment amount must be a positive number', code: 'INVALID_AMOUNT' });
  }
  
  // Deal info validation
  if (!obj.dealInfo || typeof obj.dealInfo !== 'object') {
    errors.push({ field: 'dealInfo', message: 'Deal info is required and must be an object', code: 'REQUIRED_FIELD' });
  }
  
  // Merchant info validation
  if (!obj.merchantInfo || typeof obj.merchantInfo !== 'object') {
    errors.push({ field: 'merchantInfo', message: 'Merchant info is required and must be an object', code: 'REQUIRED_FIELD' });
  }
  
  return {
    success: errors.length === 0,
    data: errors.length === 0 ? obj as unknown as CouponPaymentData : undefined,
    errors
  };
}

// Format Validation Functions
export function validateVoucherCodeFormat(code: string): boolean {
  // Voucher code should be 8-12 characters, alphanumeric, uppercase
  const voucherCodeRegex = /^[A-Z0-9]{8,12}$/;
  return voucherCodeRegex.test(code);
}

export function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneFormat(phone: string): boolean {
  // Basic phone number validation (can be enhanced based on requirements)
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

export function validateCurrencyCode(currency: string): boolean {
  // ISO 4217 currency codes (basic validation)
  const currencyRegex = /^[A-Z]{3}$/;
  return currencyRegex.test(currency);
}

// Sanitization Functions
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeCouponCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function sanitizeVoucherCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// Validation Schema Classes
export class CouponValidationSchema implements ValidationSchema<Coupon> {
  validate(data: unknown): SchemaValidationResult<Coupon> {
    return validateCouponData(data);
  }
  
  validatePartial(data: unknown): SchemaValidationResult<Partial<Coupon>> {
    // For partial validation, we skip required field checks
    const errors: ValidationError[] = [];
    
    if (!data || typeof data !== 'object') {
      errors.push({ field: 'root', message: 'Data must be an object', code: 'INVALID_TYPE' });
      return { success: false, errors };
    }
    
    const obj = data as Record<string, unknown>;
    
    // Validate only provided fields
    if (obj.type !== undefined && obj.type !== 'free' && obj.type !== 'paid') {
      errors.push({ field: 'type', message: 'Type must be either "free" or "paid"', code: 'INVALID_VALUE' });
    }
    
    if (obj.expiryDate !== undefined && (!(obj.expiryDate instanceof Date) || isNaN(obj.expiryDate.getTime()))) {
      errors.push({ field: 'expiryDate', message: 'Expiry date must be a valid Date object', code: 'INVALID_DATE' });
    }
    
    return {
      success: errors.length === 0,
      data: errors.length === 0 ? obj as unknown as Partial<Coupon> : undefined,
      errors
    };
  }
}

export class VoucherValidationSchema implements ValidationSchema<Voucher> {
  validate(data: unknown): SchemaValidationResult<Voucher> {
    return validateVoucherData(data);
  }
  
  validatePartial(data: unknown): SchemaValidationResult<Partial<Voucher>> {
    const errors: ValidationError[] = [];
    
    if (!data || typeof data !== 'object') {
      errors.push({ field: 'root', message: 'Data must be an object', code: 'INVALID_TYPE' });
      return { success: false, errors };
    }
    
    const obj = data as Record<string, unknown>;
    
    // Validate only provided fields
    if (obj.status !== undefined && !['active', 'used', 'expired'].includes(obj.status as string)) {
      errors.push({ field: 'status', message: 'Status must be "active", "used", or "expired"', code: 'INVALID_VALUE' });
    }
    
    if (obj.code !== undefined && typeof obj.code === 'string' && !validateVoucherCodeFormat(obj.code)) {
      errors.push({ field: 'code', message: 'Voucher code format is invalid', code: 'INVALID_FORMAT' });
    }
    
    return {
      success: errors.length === 0,
      data: errors.length === 0 ? obj as unknown as Partial<Voucher> : undefined,
      errors
    };
  }
}

// Export validation schema instances
export const couponValidationSchema = new CouponValidationSchema();
export const voucherValidationSchema = new VoucherValidationSchema();