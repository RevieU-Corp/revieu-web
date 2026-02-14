import { apiClient } from './apiClient';

// Request types (matches backend snake_case)
export interface UploadFileInfo {
    filename: string;
    contentType: string;
}

export interface GetUploadUrlsRequest {
    files: UploadFileInfo[];
}

// Backend response types (snake_case)
interface BackendUploadInfo {
    id: string;
    upload_url: string;
    file_url: string;
    expires_at: string;
}

interface BackendGetUploadUrlsResponse {
    uploads: BackendUploadInfo[];
}

// Frontend response types (camelCase)
export interface UploadInfo {
    id: string;
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
        // Transform request to snake_case for backend
        const backendRequest = {
            files: request.files.map(f => ({
                filename: f.filename,
                content_type: f.contentType,
            })),
        };

        const response = await apiClient.post<BackendGetUploadUrlsResponse>(
            '/media/presigned-urls',
            backendRequest
        );

        // Transform response to camelCase for frontend
        return {
            uploads: response.data.uploads.map(u => ({
                id: u.id,
                uploadUrl: u.upload_url,
                fileUrl: u.file_url,
                expiresAt: u.expires_at,
            })),
        };
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
