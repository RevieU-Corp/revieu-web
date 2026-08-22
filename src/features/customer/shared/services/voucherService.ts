import QRCode from 'qrcode';
import { apiClient } from '../../../../api/apiClient';
import {
  Coupon,
  Voucher,
  VoucherCollection,
  VoucherExportData,
  VoucherFilter,
  VoucherResult,
  VoucherShareOptions,
} from '../types/coupons';
import { VoucherService } from '../types/services';

type BackendVoucher = {
  id: number | string;
  code: string;
  coupon_id: number | string;
  user_id: number | string;
  merchant_id?: number | string | null;
  order_id?: number | string | null;
  status: string;
  expiry_date?: string | null;
  valid_from?: string | null;
  valid_until?: string | null;
  redeemed_at?: string | null;
  qr_code?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  scan_url?: string | null;
  coupon_title?: string | null;
  merchant_name?: string | null;
};

type VoucherContext = {
  coupon?: Coupon;
  paymentId?: string;
};

const ZERO_TIME_PREFIX = '0001-01-01T00:00:00';

const parseOptionalDate = (value?: string | null): Date | undefined => {
  if (!value || value.startsWith(ZERO_TIME_PREFIX)) {
    return undefined;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export const mapVoucherResponse = (raw: BackendVoucher, context?: VoucherContext): Voucher => {
  const coupon = context?.coupon;
  const generatedAt = parseOptionalDate(raw.created_at) ?? new Date();
  const expiryDate =
    parseOptionalDate(raw.expiry_date) ??
    parseOptionalDate(raw.valid_until) ??
    coupon?.expiryDate ??
    generatedAt;

  const status: Voucher['status'] =
    raw.status === 'used' || raw.status === 'expired' ? raw.status : 'active';

  return {
    id: String(raw.id),
    code: raw.code,
    couponId: String(raw.coupon_id),
    userId: String(raw.user_id),
    merchantId:
      raw.merchant_id !== null && raw.merchant_id !== undefined
        ? String(raw.merchant_id)
        : coupon?.merchantId ?? '',
    status,
    generatedAt,
    expiryDate,
    usedAt: parseOptionalDate(raw.redeemed_at),
    qrCode: raw.qr_code ?? '',
    paymentId: context?.paymentId,
    orderId:
      raw.order_id !== null && raw.order_id !== undefined ? String(raw.order_id) : undefined,
    scanUrl: raw.scan_url ?? undefined,
    usageInstructions: coupon?.usageInstructions ?? '',
    merchantName: raw.merchant_name ?? '',
    dealTitle: raw.coupon_title ?? coupon?.title ?? '',
    dealValue: coupon?.value ?? '',
  };
};

export class VoucherServiceImpl implements VoucherService {
  async generateVoucher(couponData: Coupon, _userId: string, paymentId?: string): Promise<VoucherResult> {
    try {
      const response = await apiClient.post('/vouchers', {
        couponId: couponData.id,
      });

      const voucher = mapVoucherResponse(response.data, {
        coupon: couponData,
        paymentId,
      });
      const qrCodeDataUrl = await this.generateQRCode(voucher.code);

      return {
        voucher,
        qrCodeDataUrl,
        success: true,
        message: 'Voucher generated successfully',
      };
    } catch (error) {
      console.error('Error generating voucher:', error);
      return {
        voucher: {} as Voucher,
        qrCodeDataUrl: '',
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  async getVoucherById(voucherId: string): Promise<Voucher> {
    const response = await apiClient.get(`/vouchers/${voucherId}`);
    return mapVoucherResponse(response.data);
  }

  async getVoucherByCode(voucherCode: string): Promise<Voucher> {
    const response = await apiClient.get(`/vouchers/code/${voucherCode}`);
    return mapVoucherResponse(response.data);
  }

  async getUserVouchers(_userId: string, _filter?: VoucherFilter): Promise<VoucherCollection> {
    const response = await apiClient.get('/vouchers');
    const rawVouchers = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
    const vouchers = (rawVouchers as BackendVoucher[]).map((voucher) => mapVoucherResponse(voucher));

    return {
      active: vouchers.filter((voucher: Voucher) => voucher.status === 'active'),
      used: vouchers.filter((voucher: Voucher) => voucher.status === 'used'),
      expired: vouchers.filter((voucher: Voucher) => voucher.status === 'expired'),
      total: vouchers.length,
    };
  }

  async markVoucherAsUsed(voucherId: string, _merchantId: string): Promise<Voucher> {
    await apiClient.patch(`/vouchers/${voucherId}/use`);
    return this.getVoucherById(voucherId);
  }

  async generateQRCode(voucherCode: string): Promise<string> {
    return QRCode.toDataURL(voucherCode, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 256,
    });
  }

  async deleteVoucher(voucherId: string): Promise<void> {
    try {
      await apiClient.delete(`/vouchers/${voucherId}`);
    } catch (error) {
      console.error('Failed to delete voucher:', error);
      throw error;
    }
  }

  async shareVoucher(voucherId: string, shareOptions: VoucherShareOptions): Promise<boolean> {
    try {
      const voucher = await this.getVoucherById(voucherId);
      const shareContent = this.generateShareContent(voucher, shareOptions);

      switch (shareOptions.method) {
        case 'email':
          return this.shareViaEmail(shareContent, shareOptions.recipient ?? '');
        case 'sms':
          return this.shareViaSMS(shareContent, shareOptions.recipient ?? '');
        case 'social':
          return this.shareViaSocial(shareContent);
        case 'copy':
          return this.copyToClipboard(shareContent.text);
        default:
          return false;
      }
    } catch (error) {
      console.error('Error sharing voucher:', error);
      return false;
    }
  }

  async exportVoucher(voucherId: string, format: 'pdf' | 'image' | 'wallet'): Promise<VoucherExportData> {
    const voucher = await this.getVoucherById(voucherId);
    const qrCodeDataUrl = await this.generateQRCode(voucher.code);

    return {
      voucher,
      qrCodeDataUrl,
      merchantInfo: {
        id: voucher.merchantId,
        name: voucher.merchantName,
        logo: '',
        address: '',
        phone: '',
      },
      exportFormat: format,
    };
  }

  async updateVoucherStatus(voucherId: string, status: Voucher['status']): Promise<Voucher> {
    await apiClient.patch(`/vouchers/${voucherId}/status`, { status });
    return this.getVoucherById(voucherId);
  }

  private generateShareContent(voucher: Voucher, shareOptions: VoucherShareOptions) {
    const expiryLabel = voucher.expiryDate.toLocaleDateString();
    const baseText =
      `${voucher.dealTitle}\n` +
      `Value: ${voucher.dealValue}\n` +
      `${voucher.merchantName}\n` +
      `Expires: ${expiryLabel}\n` +
      `Code: ${voucher.code}`;
    const customMessage = shareOptions.message ? `\n\n${shareOptions.message}` : '';

    return {
      text: baseText + customMessage,
      subject: `Voucher: ${voucher.dealTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${voucher.dealTitle}</h2>
          <p><strong>Value:</strong> ${voucher.dealValue}</p>
          <p><strong>Merchant:</strong> ${voucher.merchantName}</p>
          <p><strong>Expires:</strong> ${expiryLabel}</p>
          <p><strong>Voucher Code:</strong> <code>${voucher.code}</code></p>
          ${shareOptions.message ? `<p><em>${shareOptions.message}</em></p>` : ''}
        </div>
      `,
    };
  }

  private async shareViaEmail(content: { subject: string; html: string }, recipient: string): Promise<boolean> {
    try {
      await apiClient.post('/vouchers/share/email', {
        to: recipient,
        subject: content.subject,
        html: content.html,
      });
      return true;
    } catch (error) {
      console.error('Error sharing via email:', error);
      return false;
    }
  }

  private async shareViaSMS(content: { text: string }, recipient: string): Promise<boolean> {
    try {
      await apiClient.post('/vouchers/share/sms', {
        to: recipient,
        message: content.text,
      });
      return true;
    } catch (error) {
      console.error('Error sharing via SMS:', error);
      return false;
    }
  }

  private async shareViaSocial(content: { subject: string; text: string }): Promise<boolean> {
    try {
      if (navigator.share) {
        await navigator.share({
          title: content.subject,
          text: content.text,
        });
        return true;
      }

      return this.copyToClipboard(content.text);
    } catch (error) {
      console.error('Error sharing via social:', error);
      return false;
    }
  }

  private async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }

  private getErrorMessage(error: unknown): string {
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

    return 'Failed to generate voucher. Please try again.';
  }
}

export const voucherService = new VoucherServiceImpl();
