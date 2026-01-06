import { UploadedImage, CompressionOptions } from '../types';
import { compressImage, CompressionProgress } from './imageCompression';

export interface UploadProgressEvent {
  imageId: string;
  stage: 'compression' | 'upload' | 'analysis' | 'complete' | 'error';
  progress: number; // 0-100
  error?: string;
}

export type UploadProgressCallback = (event: UploadProgressEvent) => void;

export interface UploadManagerOptions {
  compressionOptions: CompressionOptions;
  maxRetries: number;
  retryDelay: number; // milliseconds
  onProgress?: UploadProgressCallback;
}

/**
 * Upload Manager for handling image uploads with compression, progress tracking, and retry logic
 */
export class UploadManager {
  private options: UploadManagerOptions;
  private activeUploads = new Map<string, AbortController>();

  constructor(options: UploadManagerOptions) {
    this.options = options;
  }

  /**
   * Upload a single image with compression and progress tracking
   */
  async uploadImage(image: UploadedImage): Promise<UploadedImage> {
    const { id: imageId, file } = image;
    const abortController = new AbortController();
    this.activeUploads.set(imageId, abortController);

    try {
      // Stage 1: Compression
      this.notifyProgress(imageId, 'compression', 0);
      
      const compressionResult = await compressImage(
        file,
        this.options.compressionOptions,
        (progress: CompressionProgress) => {
          const progressPercent = Math.round(progress.progress * 0.3); // Compression is 30% of total
          this.notifyProgress(imageId, 'compression', progressPercent);
        }
      );

      if (abortController.signal.aborted) {
        throw new Error('Upload cancelled');
      }

      // Stage 2: Upload
      this.notifyProgress(imageId, 'upload', 30);
      
      const uploadResult = await this.simulateUpload(
        compressionResult.compressedFile,
        imageId,
        abortController.signal
      );

      if (abortController.signal.aborted) {
        throw new Error('Upload cancelled');
      }

      // Stage 3: Analysis
      this.notifyProgress(imageId, 'analysis', 80);
      
      const analysisResult = await this.simulateImageAnalysis(
        compressionResult.compressedFile,
        abortController.signal
      );

      if (abortController.signal.aborted) {
        throw new Error('Upload cancelled');
      }

      // Stage 4: Complete
      this.notifyProgress(imageId, 'complete', 100);

      const updatedImage: UploadedImage = {
        ...image,
        url: uploadResult.url,
        thumbnail: uploadResult.thumbnail,
        uploadState: {
          status: 'complete',
          progress: 100,
          retryCount: image.uploadState.retryCount,
        },
        compressionRatio: compressionResult.compressionRatio,
        compressedSize: compressionResult.compressedSize,
        uploadProgress: 100,
        analysisResults: analysisResult.analysis,
        suggestedTags: analysisResult.tags,
      };

      this.activeUploads.delete(imageId);
      return updatedImage;

    } catch (error) {
      this.activeUploads.delete(imageId);
      
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      this.notifyProgress(imageId, 'error', 0, errorMessage);
      
      throw error;
    }
  }

  /**
   * Upload multiple images with queue management
   */
  async uploadImages(images: UploadedImage[]): Promise<UploadedImage[]> {
    const results: UploadedImage[] = [];
    const maxConcurrent = 3; // Limit concurrent uploads
    
    for (let i = 0; i < images.length; i += maxConcurrent) {
      const batch = images.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(image => this.uploadWithRetry(image));
      
      try {
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            // Handle failed upload
            const failedImage = batch[index];
            results.push({
              ...failedImage,
              uploadState: {
                ...failedImage.uploadState,
                status: 'error',
                error: result.reason?.message || 'Upload failed',
              },
            });
          }
        });
      } catch (error) {
        console.error('Batch upload error:', error);
      }
    }
    
    return results;
  }

  /**
   * Cancel upload for a specific image
   */
  cancelUpload(imageId: string): void {
    const abortController = this.activeUploads.get(imageId);
    if (abortController) {
      abortController.abort();
      this.activeUploads.delete(imageId);
    }
  }

  /**
   * Cancel all active uploads
   */
  cancelAllUploads(): void {
    this.activeUploads.forEach((controller) => {
      controller.abort();
    });
    this.activeUploads.clear();
  }

  /**
   * Retry upload with exponential backoff
   */
  private async uploadWithRetry(image: UploadedImage): Promise<UploadedImage> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
      try {
        return await this.uploadImage(image);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Upload failed');
        
        if (attempt < this.options.maxRetries) {
          // Wait before retry with exponential backoff
          const delay = this.options.retryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Update retry count
          image.uploadState.retryCount = attempt + 1;
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Simulate file upload (replace with actual upload logic)
   */
  private async simulateUpload(
    _file: File,
    imageId: string,
    signal: AbortSignal
  ): Promise<{ url: string; thumbnail: string }> {
    return new Promise((resolve, reject) => {
      let progress = 30;
      const interval = setInterval(() => {
        if (signal.aborted) {
          clearInterval(interval);
          reject(new Error('Upload cancelled'));
          return;
        }

        progress += Math.random() * 10;
        if (progress >= 80) {
          progress = 80;
        }
        
        this.notifyProgress(imageId, 'upload', Math.round(progress));
        
        if (progress >= 80) {
          clearInterval(interval);
          
          // Simulate successful upload
          const mockUrl = URL.createObjectURL(_file);
          resolve({
            url: mockUrl,
            thumbnail: mockUrl,
          });
        }
      }, 200);

      // Simulate network delay
      setTimeout(() => {
        if (!signal.aborted) {
          clearInterval(interval);
          const mockUrl = URL.createObjectURL(_file);
          resolve({
            url: mockUrl,
            thumbnail: mockUrl,
          });
        }
      }, 2000);
    });
  }

  /**
   * Simulate image analysis (replace with actual AI analysis)
   */
  private async simulateImageAnalysis(
    _file: File,
    signal: AbortSignal
  ): Promise<{ analysis: any; tags: string[] }> {
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new Error('Analysis cancelled'));
        return;
      }

      setTimeout(() => {
        if (signal.aborted) {
          reject(new Error('Analysis cancelled'));
          return;
        }

        // Mock analysis results
        const mockAnalysis = {
          category: 'food',
          confidence: 0.85 + Math.random() * 0.15,
          detectedObjects: ['food', 'plate', 'table'],
          suggestedHashtags: ['#delicious', '#food', '#restaurant'],
          containsPII: false,
          piiTypes: [],
          piiConfidence: 0,
        };

        resolve({
          analysis: mockAnalysis,
          tags: mockAnalysis.suggestedHashtags,
        });
      }, 1000);
    });
  }

  /**
   * Notify progress callback
   */
  private notifyProgress(
    imageId: string,
    stage: UploadProgressEvent['stage'],
    progress: number,
    error?: string
  ): void {
    if (this.options.onProgress) {
      this.options.onProgress({
        imageId,
        stage,
        progress,
        error,
      });
    }
  }
}

/**
 * Create upload manager with default options
 */
export function createUploadManager(
  compressionOptions: CompressionOptions,
  onProgress?: UploadProgressCallback
): UploadManager {
  return new UploadManager({
    compressionOptions,
    maxRetries: 3,
    retryDelay: 1000,
    onProgress,
  });
}

/**
 * Utility to estimate upload time based on file size and connection speed
 */
export function estimateUploadTime(fileSizeBytes: number, connectionSpeedMbps: number = 10): number {
  const fileSizeMb = fileSizeBytes / (1024 * 1024);
  const uploadTimeSeconds = (fileSizeMb * 8) / connectionSpeedMbps; // Convert to bits and divide by speed
  return Math.ceil(uploadTimeSeconds);
}

/**
 * Get upload statistics
 */
export function getUploadStats(images: UploadedImage[]): {
  total: number;
  pending: number;
  uploading: number;
  complete: number;
  failed: number;
  totalSize: number;
  compressedSize: number;
  savedBytes: number;
} {
  const stats = {
    total: images.length,
    pending: 0,
    uploading: 0,
    complete: 0,
    failed: 0,
    totalSize: 0,
    compressedSize: 0,
    savedBytes: 0,
  };

  images.forEach(image => {
    stats.totalSize += image.originalSize;
    stats.compressedSize += image.compressedSize;

    switch (image.uploadState.status) {
      case 'pending':
        stats.pending++;
        break;
      case 'compressing':
      case 'uploading':
      case 'analyzing':
        stats.uploading++;
        break;
      case 'complete':
        stats.complete++;
        break;
      case 'error':
        stats.failed++;
        break;
    }
  });

  stats.savedBytes = stats.totalSize - stats.compressedSize;

  return stats;
}