import { apiClient } from '../../../../api/apiClient';
import { mediaApi, uploadToR2 } from '../../../../api/media';

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

  // The backend rejects document_url unless it's an absolute http(s) URL, so
  // the picked file has to actually be uploaded first — a bare filename
  // fails validation.
  async uploadDocument(file: File): Promise<string> {
    const uploadUrlsResponse = await mediaApi.getUploadUrls({
      files: [{ filename: file.name, contentType: file.type || 'application/octet-stream' }],
    });
    const upload = uploadUrlsResponse.uploads[0];
    await uploadToR2(upload.uploadUrl, file);
    return upload.fileUrl;
  },
};
