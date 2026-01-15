import { ValidationErrorCode, RedemptionError, Coupon } from '../types/coupons';

/**
 * Service for handling coupon validation and redemption errors
 * Provides specific error messages, retry logic, and suggested actions
 */
export class ErrorHandlingService {
  
  /**
   * Gets user-friendly error message for validation error codes
   */
  getValidationErrorMessage(errorCode: ValidationErrorCode, context?: any): string {
    switch (errorCode) {
      case 'EXPIRED':
        return context?.expiryDate 
          ? `This coupon expired on ${new Date(context.expiryDate).toLocaleDateString()}`
          : 'This coupon has expired';
          
      case 'OUT_OF_STOCK':
        return 'This coupon is no longer available (sold out)';
        
      case 'NOT_ELIGIBLE':
        return context?.requirements?.length > 0
          ? `You are not eligible for this coupon. ${context.requirements.join(', ')}`
          : 'You are not eligible for this coupon';
          
      case 'ALREADY_REDEEMED':
        return 'You have already redeemed this coupon';
        
      case 'INACTIVE':
        return 'This coupon is no longer available';
        
      case 'NETWORK_ERROR':
        return 'Network connection error. Please check your internet connection and try again.';
        
      case 'SERVER_ERROR':
        return 'Server error occurred. Please try again in a few moments.';
        
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  
  /**
   * Creates a RedemptionError object with appropriate retry and action suggestions
   */
  createRedemptionError(errorCode: ValidationErrorCode, message?: string, context?: any): RedemptionError {
    const baseMessage = message || this.getValidationErrorMessage(errorCode, context);
    
    return {
      code: errorCode,
      message: baseMessage,
      retryable: this.isRetryableError(errorCode),
      suggestedActions: this.getSuggestedActions(errorCode, context)
    };
  }
  
  /**
   * Determines if an error is retryable
   */
  isRetryableError(errorCode: ValidationErrorCode): boolean {
    const retryableErrors: ValidationErrorCode[] = [
      'NETWORK_ERROR',
      'SERVER_ERROR'
    ];
    
    return retryableErrors.includes(errorCode);
  }
  
  /**
   * Gets suggested actions for different error types
   */
  getSuggestedActions(errorCode: ValidationErrorCode, context?: any): string[] {
    switch (errorCode) {
      case 'EXPIRED':
        return [
          'Browse other available deals',
          'Check for similar offers from this merchant'
        ];
        
      case 'OUT_OF_STOCK':
        return [
          'Try again later as more may become available',
          'Browse other deals from this merchant',
          'Set up notifications for similar deals'
        ];
        
      case 'NOT_ELIGIBLE':
        const actions = ['Review eligibility requirements'];
        if (context?.requirements) {
          actions.push(...context.requirements.map((req: string) => `Ensure you meet: ${req}`));
        }
        actions.push('Browse deals you are eligible for');
        return actions;
        
      case 'ALREADY_REDEEMED':
        return [
          'Check your vouchers to use the existing one',
          'Browse other available deals'
        ];
        
      case 'INACTIVE':
        return [
          'Browse other available deals',
          'Contact merchant for more information'
        ];
        
      case 'NETWORK_ERROR':
        return [
          'Check your internet connection',
          'Try again in a few moments',
          'Switch to a different network if available'
        ];
        
      case 'SERVER_ERROR':
        return [
          'Try again in a few moments',
          'Contact support if the problem persists'
        ];
        
      default:
        return [
          'Try again',
          'Contact support if the problem persists'
        ];
    }
  }
  
  /**
   * Gets alternative coupon suggestions when validation fails
   */
  async getSuggestedAlternatives(
    _failedCoupon: Coupon, 
    _errorCode: ValidationErrorCode,
    _userId: string
  ): Promise<Coupon[]> {
    try {
      // This would typically call an API to get similar coupons
      // For now, return empty array as placeholder
      // TODO: Implement actual alternative suggestion logic
      return [];
    } catch (error) {
      console.error('Error fetching alternative coupons:', error);
      return [];
    }
  }
  
  /**
   * Implements exponential backoff retry logic
   */
  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }
        
        // Only retry for retryable errors
        const errorCode = this.extractErrorCode(error);
        if (!this.isRetryableError(errorCode)) {
          break;
        }
        
        // Calculate delay with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await this.delay(delay);
      }
    }
    
    throw lastError!;
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
    
    return 'SERVER_ERROR';
  }
  
  /**
   * Utility function to create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Logs error for debugging purposes
   */
  logError(error: any, context: string): void {
    console.error(`[CouponService] ${context}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
  }
  
  /**
   * Creates user-friendly error message with retry option
   */
  formatErrorWithRetry(error: RedemptionError, onRetry?: () => void): {
    message: string;
    actions: Array<{ label: string; action: () => void }>;
  } {
    const actions: Array<{ label: string; action: () => void }> = [];
    
    // Add retry action if error is retryable and callback is provided
    if (error.retryable && onRetry) {
      actions.push({
        label: 'Try Again',
        action: onRetry
      });
    }
    
    // Add other suggested actions
    error.suggestedActions.forEach(actionText => {
      actions.push({
        label: actionText,
        action: () => {
          // These would typically navigate to different pages or trigger specific actions
          console.log(`Action: ${actionText}`);
        }
      });
    });
    
    return {
      message: error.message,
      actions
    };
  }
  
  /**
   * Handles network timeout errors specifically
   */
  handleNetworkTimeout(timeoutMs: number): RedemptionError {
    return this.createRedemptionError(
      'NETWORK_ERROR',
      `Request timed out after ${timeoutMs / 1000} seconds. Please check your connection and try again.`
    );
  }
  
  /**
   * Handles server maintenance errors
   */
  handleServerMaintenance(): RedemptionError {
    return this.createRedemptionError(
      'SERVER_ERROR',
      'The service is temporarily unavailable for maintenance. Please try again later.',
      {
        maintenanceMode: true
      }
    );
  }
  
  /**
   * Handles rate limiting errors
   */
  handleRateLimit(retryAfterSeconds?: number): RedemptionError {
    const message = retryAfterSeconds
      ? `Too many requests. Please wait ${retryAfterSeconds} seconds before trying again.`
      : 'Too many requests. Please wait a moment before trying again.';
      
    return this.createRedemptionError('SERVER_ERROR', message, {
      rateLimited: true,
      retryAfter: retryAfterSeconds
    });
  }
}

// Export singleton instance
export const errorHandlingService = new ErrorHandlingService();