import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateCouponData,
  validateVoucherData,
  validatePaymentData,
  isCoupon,
  isVoucher,
  isEligibilityRule,
  couponValidationSchema,
  voucherValidationSchema
} from '../validation';
// import { Coupon, Voucher, EligibilityRule, CouponPaymentData } from '../coupons';

/**
 * Property-Based Tests for Data Model Validation
 * Feature: coupon-redemption-flow, Property 1: Coupon validation consistency
 * Validates: Requirements 1.1, 1.4
 */

describe('Data Model Validation Properties', () => {
  // Generators for property-based testing

  const eligibilityRuleArb = fc.record({
    type: fc.constantFrom('new_user', 'membership_level', 'previous_purchase', 'location', 'age_restriction', 'single_use'),
    value: fc.oneof(fc.string(), fc.integer(), fc.boolean(), fc.object()),
    description: fc.string({ minLength: 1 })
  });

  const validCouponArb = fc.record({
    id: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'id'),
    merchantId: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'merchant'),
    title: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim() || 'title'),
    description: fc.string({ minLength: 1, maxLength: 500 }).map(s => s.trim() || 'description'),
    type: fc.constantFrom('free', 'paid'),
    value: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'value'),
    price: fc.option(fc.float({ min: Math.fround(0.01), max: Math.fround(10000) })),
    expiryDate: fc.date({ min: new Date(Date.now() + 86400000), noInvalidDate: true }), // Future date
    maxRedemptions: fc.option(fc.integer({ min: 1, max: 10000 })),
    currentRedemptions: fc.integer({ min: 0, max: 1000 }),
    eligibilityRules: fc.array(eligibilityRuleArb, { minLength: 0, maxLength: 5 }),
    usageInstructions: fc.string({ minLength: 1, maxLength: 500 }).map(s => s.trim() || 'instructions'),
    isActive: fc.boolean(),
    createdAt: fc.date({ max: new Date(), noInvalidDate: true }),
    updatedAt: fc.date({ max: new Date(), noInvalidDate: true })
  });

  const validVoucherArb = fc.record({
    id: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'id'),
    code: fc.string({ minLength: 8, maxLength: 12 }).map(s => {
      const cleaned = s.toUpperCase().replace(/[^A-Z0-9]/g, 'A');
      return cleaned.padEnd(8, 'A').slice(0, 12);
    }),
    couponId: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'coupon'),
    userId: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'user'),
    merchantId: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'merchant'),
    status: fc.constantFrom('active', 'used', 'expired'),
    generatedAt: fc.date({ max: new Date(), noInvalidDate: true }),
    expiryDate: fc.date({ min: new Date(), noInvalidDate: true }),
    usedAt: fc.option(fc.date({ noInvalidDate: true })),
    qrCode: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim() || 'qr'),
    paymentId: fc.option(fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'payment')),
    usageInstructions: fc.string({ minLength: 1, maxLength: 500 }).map(s => s.trim() || 'instructions'),
    merchantName: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim() || 'merchant'),
    dealTitle: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim() || 'deal'),
    dealValue: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'value')
  });

  const validPaymentDataArb = fc.record({
    couponId: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'coupon'),
    dealInfo: fc.record({
      id: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'deal'),
      title: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim() || 'title'),
      description: fc.string({ minLength: 1, maxLength: 500 }).map(s => s.trim() || 'description'),
      value: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'value'),
      type: fc.constantFrom('free', 'paid'),
      price: fc.option(fc.float({ min: Math.fround(0.01) })),
      expiryDate: fc.date({ min: new Date(), noInvalidDate: true }),
      usageInstructions: fc.string({ minLength: 1, maxLength: 500 }).map(s => s.trim() || 'instructions')
    }),
    merchantInfo: fc.record({
      id: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'merchant'),
      name: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim() || 'name'),
      logo: fc.string({ minLength: 1, maxLength: 200 }).map(s => s.trim() || 'logo.png'),
      address: fc.string({ minLength: 1, maxLength: 200 }).map(s => s.trim() || 'address'),
      phone: fc.string({ minLength: 1, maxLength: 20 }).map(s => s.trim() || '1234567890')
    }),
    paymentAmount: fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
    currency: fc.constantFrom('USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD'),
    userId: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'user')
  });

  describe('Property 1: Coupon validation consistency', () => {
    it('should consistently validate valid coupon data structures', () => {
      fc.assert(
        fc.property(validCouponArb, (couponData) => {
          // Ensure paid coupons have prices
          if (couponData.type === 'paid' && !couponData.price) {
            couponData.price = 10.0;
          }

          const validationResult = validateCouponData(couponData);
          const typeGuardResult = isCoupon(couponData);
          const schemaResult = couponValidationSchema.validate(couponData);

          // All validation methods should agree on valid data
          expect(validationResult.success).toBe(true);
          expect(typeGuardResult).toBe(true);
          expect(schemaResult.success).toBe(true);

          // Valid data should be returned
          expect(validationResult.data).toBeDefined();
          expect(schemaResult.data).toBeDefined();

          // No errors should be present
          expect(validationResult.errors).toHaveLength(0);
          expect(schemaResult.errors).toHaveLength(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should consistently reject invalid coupon data with missing required fields', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.option(fc.string()),
            merchantId: fc.option(fc.string()),
            title: fc.option(fc.string()),
            type: fc.option(fc.constantFrom('free', 'paid', 'invalid')),
            expiryDate: fc.option(fc.oneof(fc.date(), fc.string(), fc.integer()))
          }),
          (invalidData) => {
            const validationResult = validateCouponData(invalidData);
            const typeGuardResult = isCoupon(invalidData);

            // Both should reject invalid data
            expect(validationResult.success).toBe(false);
            expect(typeGuardResult).toBe(false);

            // Should have validation errors
            expect(validationResult.errors.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should consistently validate coupon eligibility rules', () => {
      fc.assert(
        fc.property(eligibilityRuleArb, (rule) => {
          const isValidRule = isEligibilityRule(rule);

          // Valid eligibility rules should pass type guard
          expect(isValidRule).toBe(true);

          // Rule should have required properties
          expect(rule.type).toBeDefined();
          expect(rule.description).toBeDefined();
          expect(typeof rule.description).toBe('string');
          expect(rule.description.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should consistently handle expired coupons', () => {
      fc.assert(
        fc.property(
          validCouponArb.map(coupon => ({
            ...coupon,
            expiryDate: fc.sample(fc.date({
              min: new Date('2000-01-01'),
              max: new Date(Date.now() - 86400000),
              noInvalidDate: true
            }), 1)[0] // Past date
          })),
          (expiredCoupon) => {
            const validationResult = validateCouponData(expiredCoupon);

            // Expired coupons should fail validation
            expect(validationResult.success).toBe(false);

            // Should have specific error about expiry
            const hasExpiryError = validationResult.errors.some(
              error => error.field === 'expiryDate' && error.code === 'EXPIRED_DATE'
            );
            expect(hasExpiryError).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should consistently validate paid coupons require prices', () => {
      fc.assert(
        fc.property(
          validCouponArb.map(coupon => ({
            ...coupon,
            type: 'paid' as const,
            price: undefined
          })),
          (paidCouponWithoutPrice) => {
            const validationResult = validateCouponData(paidCouponWithoutPrice);

            // Paid coupons without price should fail
            expect(validationResult.success).toBe(false);

            // Should have specific error about price
            const hasPriceError = validationResult.errors.some(
              error => error.field === 'price' && error.code === 'INVALID_PRICE'
            );
            expect(hasPriceError).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Voucher validation consistency', () => {
    it('should consistently validate valid voucher data structures', () => {
      fc.assert(
        fc.property(validVoucherArb, (voucherData) => {
          const validationResult = validateVoucherData(voucherData);
          const typeGuardResult = isVoucher(voucherData);
          const schemaResult = voucherValidationSchema.validate(voucherData);

          // All validation methods should agree on valid data
          expect(validationResult.success).toBe(true);
          expect(typeGuardResult).toBe(true);
          expect(schemaResult.success).toBe(true);

          // Valid data should be returned
          expect(validationResult.data).toBeDefined();
          expect(schemaResult.data).toBeDefined();

          // No errors should be present
          expect(validationResult.errors).toHaveLength(0);
          expect(schemaResult.errors).toHaveLength(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should consistently validate voucher code formats', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            validVoucherArb,
            fc.string({ minLength: 8, maxLength: 12 }).map(s => {
              const cleaned = s.toUpperCase().replace(/[^A-Z0-9]/g, 'A');
              return cleaned.padEnd(8, 'A').slice(0, 12);
            })
          ),
          ([voucher, validCode]) => {
            voucher.code = validCode;

            const validationResult = validateVoucherData(voucher);

            // Valid voucher codes should pass validation
            expect(validationResult.success).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Payment data validation consistency', () => {
    it('should consistently validate valid payment data structures', () => {
      fc.assert(
        fc.property(validPaymentDataArb, (paymentData) => {
          const validationResult = validatePaymentData(paymentData);

          // Valid payment data should pass validation
          expect(validationResult.success).toBe(true);
          expect(validationResult.data).toBeDefined();
          expect(validationResult.errors).toHaveLength(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should consistently reject payment data with invalid amounts', () => {
      fc.assert(
        fc.property(
          validPaymentDataArb.map(data => ({
            ...data,
            paymentAmount: fc.sample(fc.oneof(
              fc.constant(0),
              fc.float({ max: Math.fround(-0.01) }),
              fc.constant(null),
              fc.constant(undefined)
            ), 1)[0]
          })),
          (invalidPaymentData) => {
            const validationResult = validatePaymentData(invalidPaymentData);

            // Invalid payment amounts should fail validation
            expect(validationResult.success).toBe(false);

            // Should have specific error about payment amount
            const hasAmountError = validationResult.errors.some(
              error => error.field === 'paymentAmount' && error.code === 'INVALID_AMOUNT'
            );
            expect(hasAmountError).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Cross-validation consistency', () => {
    it('should maintain consistency between coupon and voucher validation states', () => {
      fc.assert(
        fc.property(
          fc.tuple(validCouponArb, validVoucherArb),
          ([coupon, voucher]) => {
            // Link voucher to coupon
            voucher.couponId = coupon.id;
            voucher.merchantId = coupon.merchantId;

            const couponValidation = validateCouponData(coupon);
            const voucherValidation = validateVoucherData(voucher);

            // If coupon is valid, voucher should also be valid when properly linked
            if (couponValidation.success) {
              expect(voucherValidation.success).toBe(true);
            }

            // Both should have consistent merchant IDs
            if (couponValidation.success && voucherValidation.success) {
              expect(couponValidation.data?.merchantId).toBe(voucherValidation.data?.merchantId);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain validation consistency across partial and full validation', () => {
      fc.assert(
        fc.property(validCouponArb, (coupon) => {
          const fullValidation = couponValidationSchema.validate(coupon);
          const partialValidation = couponValidationSchema.validatePartial(coupon);

          // If full validation passes, partial should also pass
          if (fullValidation.success) {
            expect(partialValidation.success).toBe(true);
          }

          // Both should agree on data structure when valid
          if (fullValidation.success && partialValidation.success) {
            expect(fullValidation.data?.id).toBe(partialValidation.data?.id);
            expect(fullValidation.data?.type).toBe(partialValidation.data?.type);
          }
        }),
        { numRuns: 100 }
      );
    });
  });
});