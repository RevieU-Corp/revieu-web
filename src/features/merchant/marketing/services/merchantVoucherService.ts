import { apiClient } from '../../../../api/apiClient';

export interface MerchantVoucherPreview {
  voucher_id: number;
  voucher_code: string;
  voucher_status: string;
  redeemed_at?: string;
  coupon_id: number;
  coupon_title: string;
  store_id?: number;
  store_name?: string;
  merchant_id: number;
  merchant_name: string;
  can_redeem: boolean;
  reason?: 'used' | 'expired' | 'not_redeemable' | string;
}

type VoucherInput =
  | { kind: 'token'; value: string }
  | { kind: 'code'; value: string };

const parseVoucherInput = (input: string): VoucherInput => {
  const value = input.trim();

  try {
    const parsed = new URL(value, window.location.origin);
    const scanToken = parsed.searchParams.get('t')?.trim();
    if (scanToken) {
      return { kind: 'token', value: scanToken };
    }
  } catch {
    // Treat non-URL input as a human-entered voucher code.
  }

  if (value.startsWith('vst_')) {
    return { kind: 'token', value };
  }

  return { kind: 'code', value };
};

export const merchantVoucherService = {
  async preview(input: string): Promise<MerchantVoucherPreview> {
    const parsed = parseVoucherInput(input);
    const response = parsed.kind === 'token'
      ? await apiClient.get<MerchantVoucherPreview>('/merchant/vouchers/scan', {
          params: { t: parsed.value },
        })
      : await apiClient.get<MerchantVoucherPreview>(
          `/merchant/vouchers/code/${encodeURIComponent(parsed.value)}`,
        );

    return response.data;
  },

  async redeem(input: string): Promise<void> {
    const parsed = parseVoucherInput(input);
    if (parsed.kind === 'token') {
      await apiClient.post('/merchant/vouchers/redeem-by-token', {
        scan_token: parsed.value,
      });
      return;
    }

    await apiClient.post('/merchant/vouchers/redeem-by-code', {
      code: parsed.value,
    });
  },
};

export { parseVoucherInput };
