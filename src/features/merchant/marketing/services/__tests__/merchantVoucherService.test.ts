import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../../../../api/apiClient';
import { merchantVoucherService, parseVoucherInput } from '../merchantVoucherService';

vi.mock('../../../../../api/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedApiClient = {
  get: apiClient.get as unknown as ReturnType<typeof vi.fn>,
  post: apiClient.post as unknown as ReturnType<typeof vi.fn>,
};

describe('merchantVoucherService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('treats a human-entered value as a voucher code', () => {
    expect(parseVoucherInput('  CODE-123  ')).toEqual({
      kind: 'code',
      value: 'CODE-123',
    });
  });

  it('extracts the signed scan token from a QR URL', () => {
    expect(parseVoucherInput('https://revieu.test/merchant/vouchers/scan?t=vst_123')).toEqual({
      kind: 'token',
      value: 'vst_123',
    });
  });

  it('uses merchant-scoped code preview and redeem endpoints', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { can_redeem: true, coupon_title: 'Lunch Coupon' },
    } as never);
    mockedApiClient.post.mockResolvedValueOnce({ data: { status: 'ok' } } as never);

    await merchantVoucherService.preview('CODE-123');
    await merchantVoucherService.redeem('CODE-123');

    expect(mockedApiClient.get).toHaveBeenCalledWith('/merchant/vouchers/code/CODE-123');
    expect(mockedApiClient.post).toHaveBeenCalledWith('/merchant/vouchers/redeem-by-code', {
      code: 'CODE-123',
    });
  });

  it('uses token endpoints for QR scan URLs', async () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: { can_redeem: true } } as never);
    mockedApiClient.post.mockResolvedValueOnce({ data: { status: 'ok' } } as never);

    const input = 'https://revieu.test/merchant/vouchers/scan?t=vst_abc';
    await merchantVoucherService.preview(input);
    await merchantVoucherService.redeem(input);

    expect(mockedApiClient.get).toHaveBeenCalledWith('/merchant/vouchers/scan', {
      params: { t: 'vst_abc' },
    });
    expect(mockedApiClient.post).toHaveBeenCalledWith('/merchant/vouchers/redeem-by-token', {
      scan_token: 'vst_abc',
    });
  });
});
