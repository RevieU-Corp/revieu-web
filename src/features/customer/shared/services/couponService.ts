import { apiClient } from '../../../../api/apiClient';
import {
  Coupon,
  ValidationResult,
  VoucherResult,
  PaymentFlowResult,
  ValidationErrorCode
} from '../types/coupons';
import { CouponService } from '../types/services';
import { errorHandlingService } from './errorHandlingService';

/**
 * Implementation of the CouponService interface
 * Handles coupon validation, redemption, and payment flow initiation
 */
export class CouponServiceImpl implements CouponService {
  
  /**
   * Validates a coupon for a specific user with retry logic
   * Checks availability, expiry, stock, and user eligibility
   */
  async validateCoupon(couponId: string, userId: string): Promise<ValidationResult> {
    return errorHandlingService.retryWithBackoff(async () => {
      try {
        // First, get the coupon data
        const coupon = await this.getCouponById(couponId);
        
        // Check basic availability
        const availabilityResult = await this.validateCouponAvailability(coupon);
        if (!availabilityResult.isValid) {
          // Add suggested alternatives for failed validation
          const alternatives = await errorHandlingService.getSuggestedAlternatives(
            coupon, 
            availabilityResult.errorCode!, 
            userId
          );
          return {
            ...availabilityResult,
            suggestedAlternatives: alternatives
          };
        }
        
        // Check user eligibility
        const eligibilityResult = await this.validateUserEligibility(coupon, userId);
        if (!eligibilityResult.isValid) {
          const alternatives = await errorHandlingService.getSuggestedAlternatives(
            coupon, 
            eligibilityResult.errorCode!, 
            userId
          );
          return {
            ...eligibilityResult,
            suggestedAlternatives: alternatives
          };
        }
        
        // Check if user has already redeemed this coupon (for single-use coupons)
        const hasRedeemed = await this.hasUserRedeemedCoupon(couponId, userId);
        if (hasRedeemed && this.isSingleUseCoupon(coupon)) {
          const alternatives = await errorHandlingService.getSuggestedAlternatives(
            coupon, 
            'ALREADY_REDEEMED', 
            userId
          );
          
          return {
            isValid: false,
            errorCode: 'ALREADY_REDEEMED',
            errorMessage: errorHandlingService.getValidationErrorMessage('ALREADY_REDEEMED'),
            eligibilityInfo: {
              isEligible: false,
              failedRules: [{
                type: 'single_use',
                value: true,
                description: 'This coupon can only be redeemed once per user'
              }],
              requirements: ['This coupon can only be used once per user']
            },
            suggestedAlternatives: alternatives
          };
        }
        
        // All validations passed
        return {
          isValid: true,
          eligibilityInfo: {
            isEligible: true,
            failedRules: [],
            requirements: []
          }
        };
        
      } catch (error) {
        errorHandlingService.logError(error, 'validateCoupon');
        return this.handleValidationError(error);
      }
    }, 3, 1000); // 3 retries with 1 second base delay
  }
  
  /**
   * Redeems a free coupon and generates a voucher with retry logic
   * Using mock implementation for development until backend is ready
   */
  async redeemFreeCoupon(couponId: string, userId: string): Promise<VoucherResult> {
    return errorHandlingService.retryWithBackoff(async () => {
      try {
        // Validate the coupon first
        const validationResult = await this.validateCoupon(couponId, userId);
        if (!validationResult.isValid) {
          throw new Error(validationResult.errorMessage || 'Coupon validation failed');
        }
        
        // Get coupon data
        const coupon = await this.getCouponById(couponId);
        
        // Ensure it's a free coupon
        if (coupon.type !== 'free') {
          throw new Error('This coupon requires payment');
        }
        
        // Mock voucher generation for development
        const mockVoucher = {
          id: `voucher-${Date.now()}`,
          code: this.generateVoucherCode(),
          couponId: couponId,
          userId: userId,
          merchantId: coupon.merchantId,
          status: 'active' as const,
          generatedAt: new Date(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          usedAt: undefined,
          qrCode: '',
          paymentId: undefined,
          usageInstructions: coupon.usageInstructions,
          merchantName: 'Sample Merchant',
          dealTitle: coupon.title,
          dealValue: coupon.value
        };
        
        // Generate QR code data URL (mock)
        const qrCodeDataUrl = this.generateMockQRCode(mockVoucher.code);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          voucher: mockVoucher,
          qrCodeDataUrl: qrCodeDataUrl,
          success: true,
          message: 'Coupon redeemed successfully'
        };
        
        // TODO: Replace with real API call when backend is ready
        // const response = await apiClient.post(`/coupons/${couponId}/redeem`, {
        //   userId,
        //   type: 'free'
        // });
        // return {
        //   voucher: response.data.voucher,
        //   qrCodeDataUrl: response.data.qrCodeDataUrl,
        //   success: true,
        //   message: 'Coupon redeemed successfully'
        // };
        
      } catch (error) {
        errorHandlingService.logError(error, 'redeemFreeCoupon');
        return {
          voucher: {} as any,
          qrCodeDataUrl: '',
          success: false,
          message: errorHandlingService.getValidationErrorMessage(
            this.extractErrorCode(error),
            { originalMessage: this.getErrorMessage(error) }
          )
        };
      }
    }, 3, 1000);
  }
  
  /**
   * Initiates the payment flow for a paid coupon with retry logic
   */
  async initiatePaidCouponFlow(couponId: string, userId: string): Promise<PaymentFlowResult> {
    return errorHandlingService.retryWithBackoff(async () => {
      try {
        // Validate the coupon first
        const validationResult = await this.validateCoupon(couponId, userId);
        if (!validationResult.isValid) {
          throw new Error(validationResult.errorMessage || 'Coupon validation failed');
        }
        
        // Get coupon data
        const coupon = await this.getCouponById(couponId);
        
        // Ensure it's a paid coupon
        if (coupon.type !== 'paid' || !coupon.price) {
          throw new Error('This coupon does not require payment');
        }
        
        // Call API to initiate payment flow
        const response = await apiClient.post(`/coupons/${couponId}/payment/initiate`, {
          userId
        });
        
        return {
          paymentUrl: response.data.paymentUrl,
          paymentData: response.data.paymentData,
          sessionId: response.data.sessionId
        };
        
      } catch (error) {
        errorHandlingService.logError(error, 'initiatePaidCouponFlow');
        throw error;
      }
    }, 3, 1000);
  }
  
  /**
   * Retrieves coupon details by ID
   * Using mock data for development until backend is ready
   */
  async getCouponById(couponId: string): Promise<Coupon> {
    try {
      // Mock data for development - replace with real API call when backend is ready
      const mockCoupon: Coupon = {
        id: couponId,
        merchantId: 'merchant-123',
        title: 'Sample Deal',
        description: 'This is a sample coupon for testing',
        type: 'free',
        value: '20% OFF',
        price: undefined,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        maxRedemptions: 100,
        currentRedemptions: 5,
        eligibilityRules: [],
        usageInstructions: 'Present this voucher to the merchant to redeem your discount.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockCoupon;
      
      // TODO: Replace with real API call when backend is ready
      // const response = await apiClient.get(`/coupons/${couponId}`);
      // return response.data;
    } catch (error) {
      console.error('Error fetching coupon:', error);
      throw error;
    }
  }
  
  /**
   * Gets available coupons for a merchant
   */
  async getAvailableCoupons(merchantId: string, userId: string): Promise<Coupon[]> {
    try {
      const response = await apiClient.get(`/merchants/${merchantId}/coupons`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available coupons:', error);
      throw error;
    }
  }
  
  /**
   * Checks if a user has already redeemed a specific coupon
   * Using mock implementation for development until backend is ready
   */
  async hasUserRedeemedCoupon(_couponId: string, _userId: string): Promise<boolean> {
    try {
      // Mock implementation - always return false for development
      // This allows testing the redemption flow
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
      return false;
      
      // TODO: Replace with real API call when backend is ready
      // const response = await apiClient.get(`/coupons/${couponId}/redemptions/${userId}`);
      // return response.data.hasRedeemed;
    } catch (error: any) {
      // If the endpoint returns 404, assume not redeemed
      if (error.response?.status === 404) {
        return false;
      }
      console.error('Error checking coupon redemption:', error);
      throw error;
    }
  }
  
  /**
   * Validates coupon availability (expiry, stock, active status)
   */
  private async validateCouponAvailability(coupon: Coupon): Promise<ValidationResult> {
    // Check if coupon is active
    if (!coupon.isActive) {
      return {
        isValid: false,
        errorCode: 'INACTIVE',
        errorMessage: errorHandlingService.getValidationErrorMessage('INACTIVE')
      };
    }
    
    // Check expiry
    const now = new Date();
    if (coupon.expiryDate <= now) {
      return {
        isValid: false,
        errorCode: 'EXPIRED',
        errorMessage: errorHandlingService.getValidationErrorMessage('EXPIRED', {
          expiryDate: coupon.expiryDate
        })
      };
    }
    
    // Check stock availability
    if (coupon.maxRedemptions && coupon.currentRedemptions >= coupon.maxRedemptions) {
      return {
        isValid: false,
        errorCode: 'OUT_OF_STOCK',
        errorMessage: errorHandlingService.getValidationErrorMessage('OUT_OF_STOCK')
      };
    }
    
    return {
      isValid: true
    };
  }
  
  /**
   * Validates user eligibility based on coupon rules
   */
  private async validateUserEligibility(coupon: Coupon, userId: string): Promise<ValidationResult> {
    try {
      // Get user profile for eligibility checking
      const userProfile = await this.getUserProfile(userId);
      
      const failedRules = [];
      const requirements = [];
      
      for (const rule of coupon.eligibilityRules) {
        const ruleResult = await this.validateEligibilityRule(rule, userProfile);
        if (!ruleResult.isValid) {
          failedRules.push(rule);
          requirements.push(ruleResult.requirement);
        }
      }
      
      if (failedRules.length > 0) {
        return {
          isValid: false,
          errorCode: 'NOT_ELIGIBLE',
          errorMessage: errorHandlingService.getValidationErrorMessage('NOT_ELIGIBLE', {
            requirements
          }),
          eligibilityInfo: {
            isEligible: false,
            failedRules,
            requirements
          }
        };
      }
      
      return {
        isValid: true,
        eligibilityInfo: {
          isEligible: true,
          failedRules: [],
          requirements: []
        }
      };
      
    } catch (error) {
      errorHandlingService.logError(error as Error, 'validateUserEligibility');
      return {
        isValid: false,
        errorCode: 'SERVER_ERROR',
        errorMessage: errorHandlingService.getValidationErrorMessage('SERVER_ERROR')
      };
    }
  }
  
  /**
   * Validates a specific eligibility rule against user profile
   */
  private async validateEligibilityRule(rule: any, userProfile: any): Promise<{ isValid: boolean; requirement: string }> {
    switch (rule.type) {
      case 'new_user':
        const isNewUser = userProfile.createdAt && 
          (new Date().getTime() - new Date(userProfile.createdAt).getTime()) < (rule.value * 24 * 60 * 60 * 1000);
        return {
          isValid: isNewUser,
          requirement: `Must be a new user (registered within ${rule.value} days)`
        };
        
      case 'membership_level':
        return {
          isValid: userProfile.membershipLevel === rule.value,
          requirement: `Must have ${rule.value} membership level`
        };
        
      case 'previous_purchase':
        const hasPreviousPurchase = userProfile.totalPurchases >= rule.value;
        return {
          isValid: hasPreviousPurchase,
          requirement: `Must have made at least ${rule.value} previous purchases`
        };
        
      case 'location':
        // This would require location checking logic
        return {
          isValid: true, // Placeholder - implement based on requirements
          requirement: `Must be in ${rule.value} location`
        };
        
      case 'age_restriction':
        const age = userProfile.age || 0;
        return {
          isValid: age >= rule.value,
          requirement: `Must be at least ${rule.value} years old`
        };
        
      case 'single_use':
        // This is handled separately in the main validation
        return {
          isValid: true,
          requirement: 'Can only be used once per user'
        };
        
      default:
        return {
          isValid: true,
          requirement: rule.description
        };
    }
  }
  
  /**
   * Gets user profile for eligibility checking
   * Using mock implementation for development until backend is ready
   */
  private async getUserProfile(userId: string): Promise<any> {
    try {
      // Mock user profile for development
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
      
      return {
        id: userId,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        membershipLevel: 'basic',
        totalPurchases: 2,
        age: 25
      };
      
      // TODO: Replace with real API call when backend is ready
      // const response = await apiClient.get(`/users/${userId}/profile`);
      // return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Return minimal profile to avoid blocking validation
      return {
        id: userId,
        createdAt: new Date(),
        membershipLevel: 'basic',
        totalPurchases: 0,
        age: 18
      };
    }
  }
  
  /**
   * Checks if a coupon is single-use
   */
  private isSingleUseCoupon(coupon: Coupon): boolean {
    return coupon.eligibilityRules.some(rule => rule.type === 'single_use');
  }
  
  /**
   * Extracts error code from error object
   */
  private extractErrorCode(error: any): ValidationErrorCode {
    if (error.response?.data?.errorCode) {
      return error.response.data.errorCode;
    }
    
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return 'NETWORK_ERROR';
    }
    
    // Check for specific HTTP status codes
    if (error.response?.status) {
      switch (error.response.status) {
        case 404:
          return 'INACTIVE';
        case 400:
          return 'INVALID_REQUEST' as ValidationErrorCode;
        case 429:
          return 'SERVER_ERROR'; // Rate limiting
        case 503:
          return 'SERVER_ERROR'; // Service unavailable
        default:
          return 'SERVER_ERROR';
      }
    }
    
    return 'SERVER_ERROR';
  }
  
  /**
   * Handles validation errors and returns appropriate ValidationResult
   */
  private handleValidationError(error: any): ValidationResult {
    const errorCode = this.extractErrorCode(error);
    const redemptionError = errorHandlingService.createRedemptionError(
      errorCode,
      undefined,
      { originalError: error }
    );
    
    return {
      isValid: false,
      errorCode: redemptionError.code,
      errorMessage: redemptionError.message
    };
  }
  
  /**
   * Gets user-friendly error message from error object
   */
  private getErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  /**
   * Generates a random voucher code for mock implementation
   */
  private generateVoucherCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates a mock QR code data URL
   */
  private generateMockQRCode(code: string): string {
    // Create a simple SVG QR code placeholder
    const size = 200;
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="white"/>
        <rect x="20" y="20" width="20" height="20" fill="black"/>
        <rect x="60" y="20" width="20" height="20" fill="black"/>
        <rect x="100" y="20" width="20" height="20" fill="black"/>
        <rect x="140" y="20" width="20" height="20" fill="black"/>
        <rect x="20" y="60" width="20" height="20" fill="black"/>
        <rect x="100" y="60" width="20" height="20" fill="black"/>
        <rect x="160" y="60" width="20" height="20" fill="black"/>
        <rect x="20" y="100" width="20" height="20" fill="black"/>
        <rect x="60" y="100" width="20" height="20" fill="black"/>
        <rect x="140" y="100" width="20" height="20" fill="black"/>
        <rect x="20" y="140" width="20" height="20" fill="black"/>
        <rect x="80" y="140" width="20" height="20" fill="black"/>
        <rect x="120" y="140" width="20" height="20" fill="black"/>
        <rect x="160" y="140" width="20" height="20" fill="black"/>
        <text x="${size/2}" y="${size/2 + 30}" text-anchor="middle" font-family="monospace" font-size="12" fill="black">${code}</text>
      </svg>
    `;
    
    // Convert SVG to data URL
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${base64}`;
  }
}

// Export singleton instance
export const couponService = new CouponServiceImpl();