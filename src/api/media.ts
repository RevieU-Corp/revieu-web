import { apiClient } from './apiClient';

// Request types
export interface UploadFileInfo {
    filename: string;
    contentType: string;
    size: number;
}

export interface GetUploadUrlsRequest {
    files: UploadFileInfo[];
}

// Response types
export interface UploadInfo {
    id: string;
    filename: string;
    uploadUrl: string;
    fileUrl: string;
    expiresAt: string;
}

export interface GetUploadUrlsResponse {
    uploads: UploadInfo[];
}

/**
 * Media API service for handling file uploads to R2
 */
export const mediaApi = {
    /**
     * Get presigned URLs for uploading files to R2
     */
    getUploadUrls: async (request: GetUploadUrlsRequest): Promise<GetUploadUrlsResponse> => {
        const response = await apiClient.post<GetUploadUrlsResponse>('/media/uploads', request);
        return response.data;
    },
};

/**
 * Upload a file directly to R2 using presigned URL
 * Uses XMLHttpRequest for progress tracking
 */
export const uploadToR2 = (
    uploadUrl: string,
    file: File,
    onProgress?: (progress: number) => void
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable && onProgress) {
                const progress = Math.round((event.loaded / event.total) * 100);
                onProgress(progress);
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('abort', () => {
            reject(new Error('Upload aborted'));
        });

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
    });
};

export default mediaApi;
