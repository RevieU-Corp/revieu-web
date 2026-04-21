import { apiClient } from '../../../../api/apiClient';

export interface MerchantVerificationStatus {
  id?: string;
  merchantId?: string;
  status: 'unverified' | 'pending' | 'verified' | 'rejected';
  merchantStatus?: string;
  documentType?: string;
  documentUrl?: string;
  businessLicense?: string;
  rejectionReason?: string;
}

export interface SubmitMerchantVerificationInput {
  documentType: string;
  documentUrl: string;
  businessLicense: string;
}

const mapStatus = (payload: any): MerchantVerificationStatus => ({
  id: payload?.id !== undefined ? String(payload.id) : undefined,
  merchantId: payload?.merchant_id !== undefined ? String(payload.merchant_id) : undefined,
  status: (payload?.status || 'unverified') as MerchantVerificationStatus['status'],
  merchantStatus: payload?.merchant_status,
  documentType: payload?.document_type,
  documentUrl: payload?.document_url,
  businessLicense: payload?.business_license,
  rejectionReason: payload?.rejection_reason,
});

export const verificationService = {
  async getVerificationStatus(): Promise<MerchantVerificationStatus> {
    const response = await apiClient.get('/merchant/verification');
    return mapStatus(response.data?.data ?? {});
  },

  async submitVerification(
    input: SubmitMerchantVerificationInput
  ): Promise<MerchantVerificationStatus> {
    const response = await apiClient.post('/merchant/verification', {
      document_type: input.documentType,
      document_url: input.documentUrl,
      business_license: input.businessLicense,
    });
    return mapStatus(response.data?.data ?? {});
  },
};
