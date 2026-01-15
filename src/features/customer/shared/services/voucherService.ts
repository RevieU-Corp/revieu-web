import { apiClient } from '../../../../api/apiClient';
import QRCode from 'qrcode';
import {
  Voucher,
  VoucherResult,
  VoucherCollection,
  VoucherFilter,
  VoucherShareOptions,
  VoucherExportData,
  Coupon
} from '../types/coupons';
import { VoucherService } from '../types/services';
import { errorHandlingService } from './errorHandlingService';

/**
 * Implementation of the VoucherService interface
 * Handles voucher generation, QR code creation, and voucher management
 */
export class VoucherServiceImpl implements VoucherService {
  
  /**
   * Generates a unique voucher code and creates voucher record
   * Implements unique voucher code generation, QR code generation, and persistence
   */
  async generateVoucher(couponData: Coupon, paymentId?: string): Promise<VoucherResult> {
    return errorHandlingService.retryWithBackoff(async () => {
      try {
        // Generate unique voucher code
        const voucherCode = await this.generateUniqueVoucherCode(couponData);
        
        // Calculate expiry date based on coupon
        const expiryDate = this.calculateVoucherExpiry(couponData);
        
        // Create voucher object
        const voucherData = {
          couponId: couponData.id,
          merchantId: couponData.merchantId,
          code: voucherCode,
          expiryDate,
          paymentId,
          usageInstructions: couponData.usageInstructions,
          dealTitle: couponData.title,
          dealValue: couponData.value,
          merchantName: '', // Will be populated by API
        };
        
        // Call API to create voucher
        const response = await apiClient.post('/vouchers', voucherData);
        const voucher: Voucher = response.data;
        
        // Generate QR code
        const qrCodeDataUrl = await this.generateQRCode(voucherCode);
        
        return {
          voucher,
          qrCodeDataUrl,
          success: true,
          message: 'Voucher generated successfully'
        };
        
      } catch (error) {
        errorHandlingService.logError(error as Error, 'generateVoucher');
        
        // Return failed result with error message
        return {
          voucher: {} as Voucher,
          qrCodeDataUrl: '',
          success: false,
          message: this.getErrorMessage(error)
        };
      }
    }, 3, 1000); // 3 retries with 1 second base delay
  }
  
  /**
   * Retrieves voucher by ID
   */
  async getVoucherById(voucherId: string): Promise<Voucher> {
    try {
      const response = await apiClient.get(`/vouchers/${voucherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching voucher by ID:', error);
      throw error;
    }
  }
  
  /**
   * Retrieves voucher by code
   */
  async getVoucherByCode(voucherCode: string): Promise<Voucher> {
    try {
      const response = await apiClient.get(`/vouchers/code/${voucherCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching voucher by code:', error);
      throw error;
    }
  }
  
  /**
   * Gets all vouchers for a user with optional filtering
   */
  async getUserVouchers(userId: string, filter?: VoucherFilter): Promise<VoucherCollection> {
    try {
      const params = {
        userId,
        ...filter
      };
      
      const response = await apiClient.get('/vouchers', { params });
      const vouchers: Voucher[] = response.data;
      
      // Categorize vouchers by status
      const active = vouchers.filter(v => v.status === 'active');
      const used = vouchers.filter(v => v.status === 'used');
      const expired = vouchers.filter(v => v.status === 'expired');
      
      return {
        active,
        used,
        expired,
        total: vouchers.length
      };
      
    } catch (error) {
      console.error('Error fetching user vouchers:', error);
      throw error;
    }
  }
  
  /**
   * Marks a voucher as used
   */
  async markVoucherAsUsed(voucherId: string, merchantId: string): Promise<Voucher> {
    try {
      const response = await apiClient.patch(`/vouchers/${voucherId}/use`, {
        merchantId,
        usedAt: new Date()
      });
      return response.data;
    } catch (error) {
      console.error('Error marking voucher as used:', error);
      throw error;
    }
  }
  
  /**
   * Generates QR code for a voucher code
   * Creates a data URL that can be displayed as an image
   */
  async generateQRCode(voucherCode: string): Promise<string> {
    try {
      // Generate QR code with appropriate options
      const qrCodeDataUrl = await QRCode.toDataURL(voucherCode, {
        errorCorrectionLevel: 'H', // High error correction
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256 // 256x256 pixels
      });
      
      return qrCodeDataUrl;
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      
      // Fallback: return a placeholder or throw error
      throw new Error('Failed to generate QR code');
    }
  }
  
  /**
   * Shares a voucher via specified method
   */
  async shareVoucher(voucherId: string, shareOptions: VoucherShareOptions): Promise<boolean> {
    try {
      // Get voucher details
      const voucher = await this.getVoucherById(voucherId);
      
      // Generate share content
      const shareContent = this.generateShareContent(voucher, shareOptions);
      
      switch (shareOptions.method) {
        case 'email':
          return await this.shareViaEmail(shareContent, shareOptions.recipient!);
          
        case 'sms':
          return await this.shareViaSMS(shareContent, shareOptions.recipient!);
          
        case 'social':
          return await this.shareViaSocial(shareContent);
          
        case 'copy':
          return await this.copyToClipboard(shareContent.text);
          
        default:
          throw new Error('Unsupported share method');
      }
      
    } catch (error) {
      console.error('Error sharing voucher:', error);
      return false;
    }
  }
  
  /**
   * Exports voucher data for external use
   */
  async exportVoucher(voucherId: string, format: 'pdf' | 'image' | 'wallet'): Promise<VoucherExportData> {
    try {
      const voucher = await this.getVoucherById(voucherId);
      const qrCodeDataUrl = await this.generateQRCode(voucher.code);
      
      // Get merchant info (this would typically come from the voucher or a separate API call)
      const merchantInfo = {
        id: voucher.merchantId,
        name: voucher.merchantName,
        logo: '', // Would be fetched from merchant service
        address: '',
        phone: ''
      };
      
      return {
        voucher,
        qrCodeDataUrl,
        merchantInfo,
        exportFormat: format
      };
      
    } catch (error) {
      console.error('Error exporting voucher:', error);
      throw error;
    }
  }
  
  /**
   * Updates voucher status (for system use)
   */
  async updateVoucherStatus(voucherId: string, status: Voucher['status']): Promise<Voucher> {
    try {
      const response = await apiClient.patch(`/vouchers/${voucherId}/status`, {
        status,
        updatedAt: new Date()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating voucher status:', error);
      throw error;
    }
  }
  
  /**
   * Generates a unique voucher code
   * Uses timestamp, random characters, and merchant prefix for uniqueness
   */
  private async generateUniqueVoucherCode(couponData: Coupon): Promise<string> {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const merchantPrefix = couponData.merchantId.substring(0, 3).toUpperCase();
    
    // Format: MER-TIMESTAMP-RANDOM (e.g., ABC-1K2L3M-X7Y9Z2)
    const voucherCode = `${merchantPrefix}-${timestamp}-${randomPart}`;
    
    // Verify uniqueness by checking if code already exists
    try {
      await this.getVoucherByCode(voucherCode);
      // If we get here, the code already exists, so generate a new one
      return await this.generateUniqueVoucherCode(couponData);
    } catch (error: any) {
      // If we get a 404, the code is unique
      if (error.response?.status === 404) {
        return voucherCode;
      }
      // For other errors, still return the code (API might be down)
      return voucherCode;
    }
  }
  
  /**
   * Calculates voucher expiry date based on coupon settings
   */
  private calculateVoucherExpiry(couponData: Coupon): Date {
    // Use coupon expiry date, but ensure it's not more than 1 year from now
    const maxExpiry = new Date();
    maxExpiry.setFullYear(maxExpiry.getFullYear() + 1);
    
    return couponData.expiryDate < maxExpiry ? couponData.expiryDate : maxExpiry;
  }
  
  /**
   * Generates share content for different sharing methods
   */
  private generateShareContent(voucher: Voucher, shareOptions: VoucherShareOptions) {
    const baseText = `🎟️ ${voucher.dealTitle}\n` +
                    `💰 Value: ${voucher.dealValue}\n` +
                    `🏪 ${voucher.merchantName}\n` +
                    `📅 Expires: ${voucher.expiryDate.toLocaleDateString()}\n` +
                    `🔢 Code: ${voucher.code}`;
    
    const customMessage = shareOptions.message ? `\n\n${shareOptions.message}` : '';
    
    return {
      text: baseText + customMessage,
      subject: `Voucher: ${voucher.dealTitle}`,
      html: this.generateHTMLShareContent(voucher, shareOptions.message)
    };
  }
  
  /**
   * Generates HTML content for email sharing
   */
  private generateHTMLShareContent(voucher: Voucher, customMessage?: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>🎟️ ${voucher.dealTitle}</h2>
        <p><strong>Value:</strong> ${voucher.dealValue}</p>
        <p><strong>Merchant:</strong> ${voucher.merchantName}</p>
        <p><strong>Expires:</strong> ${voucher.expiryDate.toLocaleDateString()}</p>
        <p><strong>Voucher Code:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${voucher.code}</code></p>
        ${customMessage ? `<p><em>${customMessage}</em></p>` : ''}
        <p><small>Present this voucher code to the merchant to redeem your offer.</small></p>
      </div>
    `;
  }
  
  /**
   * Shares voucher via email
   */
  private async shareViaEmail(content: any, recipient: string): Promise<boolean> {
    try {
      await apiClient.post('/vouchers/share/email', {
        to: recipient,
        subject: content.subject,
        html: content.html
      });
      return true;
    } catch (error) {
      console.error('Error sharing via email:', error);
      return false;
    }
  }
  
  /**
   * Shares voucher via SMS
   */
  private async shareViaSMS(content: any, recipient: string): Promise<boolean> {
    try {
      await apiClient.post('/vouchers/share/sms', {
        to: recipient,
        message: content.text
      });
      return true;
    } catch (error) {
      console.error('Error sharing via SMS:', error);
      return false;
    }
  }
  
  /**
   * Shares voucher via social media
   */
  private async shareViaSocial(content: any): Promise<boolean> {
    try {
      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: content.subject,
          text: content.text
        });
        return true;
      } else {
        // Fallback to copying to clipboard
        return await this.copyToClipboard(content.text);
      }
    } catch (error) {
      console.error('Error sharing via social:', error);
      return false;
    }
  }
  
  /**
   * Copies content to clipboard
   */
  private async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
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
    return 'Failed to generate voucher. Please try again.';
  }
}

// Export singleton instance
export const voucherService = new VoucherServiceImpl();