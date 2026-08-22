import { apiClient } from '../../../../api/apiClient';
import { mediaApi, uploadToR2 } from '../../../../api/media';

export interface MerchantStoreRecord {
  id: number;
  name?: string | null;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  phone?: string | null;
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  cover_image_url?: string | null;
  images?: string[] | string | null;
  menu_images?: string[] | string | null;
  hours?: StoreHourRecord[] | null;
  status?: number | null;
}

export interface StoreHourRecord {
  id?: number;
  day_of_week: number;
  open_time?: string | null;
  close_time?: string | null;
  is_closed?: boolean;
}

export interface StoreHourPayload {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export interface UpdateMerchantStorePayload {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  cover_image_url?: string;
  images?: string[];
  menu_images?: string[];
  hours?: StoreHourPayload[];
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const parseStringArray = (value: string[] | string | null | undefined): string[] => {
  if (Array.isArray(value)) {
    return value.filter(isNonEmptyString);
  }

  if (typeof value !== 'string') {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter(isNonEmptyString);
    }
  } catch {
    // Some existing responses may already contain a plain URL string.
  }

  return trimmed ? [trimmed] : [];
};

export const uploadMerchantImages = async (files: File[]): Promise<string[]> => {
  if (files.length === 0) {
    return [];
  }

  const uploadUrlsResponse = await mediaApi.getUploadUrls({
    files: files.map((file) => ({
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
    })),
  });

  const uploadedUrls = new Array<string>(uploadUrlsResponse.uploads.length);

  await Promise.all(
    uploadUrlsResponse.uploads.map(async (upload, index) => {
      await uploadToR2(upload.uploadUrl, files[index]);
      uploadedUrls[index] = upload.fileUrl;
    })
  );

  return uploadedUrls.filter(isNonEmptyString);
};

export const storeProfileService = {
  async getPrimaryStore(): Promise<MerchantStoreRecord | null> {
    const response = await apiClient.get<{ data: MerchantStoreRecord[] }>('/merchant/stores?limit=1');
    return response.data.data[0] ?? null;
  },

  async createStore(payload: UpdateMerchantStorePayload): Promise<MerchantStoreRecord> {
    const response = await apiClient.post<{ data: MerchantStoreRecord }>('/merchant/stores', payload);
    return response.data.data;
  },

  async activateStore(storeId: string): Promise<void> {
    await apiClient.post(`/merchant/stores/${storeId}/activate`);
  },

  async deactivateStore(storeId: string): Promise<void> {
    await apiClient.post(`/merchant/stores/${storeId}/deactivate`);
  },

  async updateStore(
    storeId: string,
    payload: UpdateMerchantStorePayload
  ): Promise<MerchantStoreRecord> {
    const response = await apiClient.patch<{ data: MerchantStoreRecord }>(
      `/merchant/stores/${storeId}`,
      payload
    );

    return response.data.data;
  },
};
