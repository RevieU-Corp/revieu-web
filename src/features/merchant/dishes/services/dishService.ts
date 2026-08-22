import { apiClient } from '../../../../api/apiClient';
import { mediaApi, uploadToR2 } from '../../../../api/media';

export interface Dish {
  id: number;
  merchant_id: number;
  name: string;
  image_url: string;
  description: string;
  original_price: number;
  category: string;
  status: 'active' | 'disabled';
}

export interface UpsertDishPayload {
  name: string;
  image_url?: string;
  description?: string;
  original_price: number;
  category?: string;
}

export const dishService = {
  async list(): Promise<Dish[]> {
    const response = await apiClient.get<{ data: Dish[] }>('/merchant/dishes');
    return response.data.data;
  },

  async create(payload: UpsertDishPayload): Promise<Dish> {
    const response = await apiClient.post<{ data: Dish }>('/merchant/dishes', payload);
    return response.data.data;
  },

  async update(id: number, payload: Partial<UpsertDishPayload>): Promise<Dish> {
    const response = await apiClient.patch<{ data: Dish }>(`/merchant/dishes/${id}`, payload);
    return response.data.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/merchant/dishes/${id}`);
  },

  async setEnabled(id: number, enabled: boolean): Promise<Dish> {
    const response = await apiClient.post<{ data: Dish }>(`/merchant/dishes/${id}/${enabled ? 'enable' : 'disable'}`);
    return response.data.data;
  },

  async uploadImage(file: File): Promise<string> {
    const uploadUrlsResponse = await mediaApi.getUploadUrls({
      files: [{ filename: file.name, contentType: file.type || 'application/octet-stream' }],
    });
    const upload = uploadUrlsResponse.uploads[0];
    await uploadToR2(upload.uploadUrl, file);
    return upload.fileUrl;
  },
};
