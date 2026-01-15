import { describe, it, expect, beforeEach } from 'vitest';
import { ErrorHandlingService } from '../errorHandlingService';

describe('ErrorHandlingService', () => {
  let errorHandlingService: ErrorHandlingService;

  beforeEach(() => {
    errorHandlingService = new ErrorHandlingService();
  });

  describe('getValidationErrorMessage', () => {
    it('should return appropriate message for EXPIRED error', () => {
      const message = errorHandlingService.getValidationErrorMessage('EXPIRED');
      expect(message).toBe('This coupon has expired');
    });

    it('should return appropriate message for OUT_OF_STOCK error', () => {
      const message = errorHandlingService.getValidationErrorMessage('OUT_OF_STOCK');
      expect(message).toBe('This coupon is no longer available (sold out)');
    });

    it('should return appropriate message for NOT_ELIGIBLE error', () => {
      const message = errorHandlingService.getValidationErrorMessage('NOT_ELIGIBLE');
      expect(message).toBe('You are not eligible for this coupon');
    });

    it('should include context in EXPIRED error message', () => {
      const expiryDate = new Date('2024-01-01');
      const message = errorHandlingService.getValidationErrorMessage('EXPIRED', { expiryDate });
      expect(message).toContain('expired on');
    });
  });

  describe('isRetryableError', () => {
    it('should return true for NETWORK_ERROR', () => {
      expect(errorHandlingService.isRetryableError('NETWORK_ERROR')).toBe(true);
    });

    it('should return true for SERVER_ERROR', () => {
      expect(errorHandlingService.isRetryableError('SERVER_ERROR')).toBe(true);
    });

    it('should return false for EXPIRED', () => {
      expect(errorHandlingService.isRetryableError('EXPIRED')).toBe(false);
    });

    it('should return false for NOT_ELIGIBLE', () => {
      expect(errorHandlingService.isRetryableError('NOT_ELIGIBLE')).toBe(false);
    });
  });

  describe('createRedemptionError', () => {
    it('should create error with correct properties', () => {
      const error = errorHandlingService.createRedemptionError('EXPIRED', 'Custom message');
      
      expect(error.code).toBe('EXPIRED');
      expect(error.message).toBe('Custom message');
      expect(error.retryable).toBe(false);
      expect(error.suggestedActions).toContain('Browse other available deals');
    });

    it('should use default message when none provided', () => {
      const error = errorHandlingService.createRedemptionError('OUT_OF_STOCK');
      
      expect(error.message).toBe('This coupon is no longer available (sold out)');
    });
  });

  describe('getSuggestedActions', () => {
    it('should return appropriate actions for EXPIRED error', () => {
      const actions = errorHandlingService.getSuggestedActions('EXPIRED');
      
      expect(actions).toContain('Browse other available deals');
      expect(actions).toContain('Check for similar offers from this merchant');
    });

    it('should return appropriate actions for NETWORK_ERROR', () => {
      const actions = errorHandlingService.getSuggestedActions('NETWORK_ERROR');
      
      expect(actions).toContain('Check your internet connection');
      expect(actions).toContain('Try again in a few moments');
    });

    it('should include requirements in NOT_ELIGIBLE actions', () => {
      const context = {
        requirements: ['Must be a new user', 'Must have premium membership']
      };
      const actions = errorHandlingService.getSuggestedActions('NOT_ELIGIBLE', context);
      
      expect(actions).toContain('Review eligibility requirements');
      expect(actions.some(action => action.includes('Must be a new user'))).toBe(true);
      expect(actions.some(action => action.includes('Must have premium membership'))).toBe(true);
    });
  });
});