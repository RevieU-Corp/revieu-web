import { CompressionOptions, CompressionResult } from '../types';

/**
 * Client-side image compression utility
 * Compresses images while maintaining quality and reducing file size
 */

export interface CompressionProgress {
  stage: 'loading' | 'resizing' | 'compressing' | 'complete';
  progress: number; // 0-100
}

export type CompressionProgressCallback = (progress: CompressionProgress) => void;

/**
 * Compress an image file with configurable options
 */
export async function compressImage(
  file: File,
  options: CompressionOptions,
  onProgress?: CompressionProgressCallback
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    // Validate input
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        onProgress?.({ stage: 'loading', progress: 25 });
        
        const img = new Image();
        img.onload = async () => {
          try {
            onProgress?.({ stage: 'resizing', progress: 50 });
            
            // Calculate new dimensions
            const { width: newWidth, height: newHeight } = calculateDimensions(
              img.width,
              img.height,
              options.maxWidth,
              options.maxHeight
            );

            // Create canvas for compression
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            // Apply image smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Draw and compress image
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            onProgress?.({ stage: 'compressing', progress: 75 });

            // Convert to blob with quality setting
            canvas.toBlob(
              async (blob) => {
                if (!blob) {
                  reject(new Error('Failed to compress image'));
                  return;
                }

                onProgress?.({ stage: 'complete', progress: 100 });

                // Check if compression meets size requirements
                let finalBlob = blob;
                let finalQuality = options.quality;
                
                // If still too large, reduce quality further
                if (blob.size > options.maxSizeKB * 1024 && finalQuality > 0.1) {
                  finalBlob = await reduceQualityUntilSizeLimit(
                    canvas,
                    options.maxSizeKB * 1024,
                    finalQuality
                  );
                }

                // Create compressed file
                const compressedFile = new File(
                  [finalBlob],
                  file.name,
                  {
                    type: finalBlob.type,
                    lastModified: Date.now(),
                  }
                );

                const result: CompressionResult = {
                  originalFile: file,
                  compressedFile,
                  originalSize: file.size,
                  compressedSize: finalBlob.size,
                  compressionRatio: finalBlob.size / file.size,
                  quality: finalQuality,
                  dimensions: {
                    original: { width: img.width, height: img.height },
                    compressed: { width: newWidth, height: newHeight },
                  },
                };

                resolve(result);
              },
              getOutputFormat(file.type),
              options.quality
            );
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = e.target?.result as string;
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let { width, height } = { width: originalWidth, height: originalHeight };

  // If image is smaller than max dimensions, don't upscale
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  // Calculate scaling factor
  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;
  const scalingFactor = Math.min(widthRatio, heightRatio);

  return {
    width: Math.round(width * scalingFactor),
    height: Math.round(height * scalingFactor),
  };
}

/**
 * Determine optimal output format
 */
function getOutputFormat(originalType: string): string {
  // Convert PNG to JPEG for better compression (unless transparency is needed)
  if (originalType === 'image/png') {
    return 'image/jpeg';
  }
  
  // Keep WebP as is (excellent compression)
  if (originalType === 'image/webp') {
    return 'image/webp';
  }
  
  // Default to JPEG for best compression
  return 'image/jpeg';
}

/**
 * Reduce quality until file size meets requirements
 */
async function reduceQualityUntilSizeLimit(
  canvas: HTMLCanvasElement,
  maxSizeBytes: number,
  initialQuality: number
): Promise<Blob> {
  let quality = initialQuality;
  let blob: Blob | null = null;
  
  while (quality > 0.1) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });
    
    if (blob && blob.size <= maxSizeBytes) {
      break;
    }
    
    quality -= 0.1;
  }
  
  return blob || new Blob();
}

/**
 * Batch compress multiple images
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions,
  onProgress?: (fileIndex: number, progress: CompressionProgress) => void
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (file.type.startsWith('image/')) {
      try {
        const result = await compressImage(
          file,
          options,
          (progress) => onProgress?.(i, progress)
        );
        results.push(result);
      } catch (error) {
        console.error(`Failed to compress image ${file.name}:`, error);
        // Create a "failed" result
        results.push({
          originalFile: file,
          compressedFile: file, // Use original file as fallback
          originalSize: file.size,
          compressedSize: file.size,
          compressionRatio: 1,
          quality: 1,
          dimensions: {
            original: { width: 0, height: 0 },
            compressed: { width: 0, height: 0 },
          },
        });
      }
    } else {
      // For non-image files (like videos), return as-is
      results.push({
        originalFile: file,
        compressedFile: file,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 1,
        quality: 1,
        dimensions: {
          original: { width: 0, height: 0 },
          compressed: { width: 0, height: 0 },
        },
      });
    }
  }
  
  return results;
}

/**
 * Get image dimensions without loading the full image
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Create thumbnail from image file
 */
export async function createThumbnail(
  file: File,
  maxSize: number = 200
): Promise<string> {
  const thumbnailOptions: CompressionOptions = {
    maxWidth: maxSize,
    maxHeight: maxSize,
    quality: 0.7,
    maxSizeKB: 100, // 100KB max for thumbnails
  };

  try {
    const result = await compressImage(file, thumbnailOptions);
    return URL.createObjectURL(result.compressedFile);
  } catch (error) {
    console.error('Failed to create thumbnail:', error);
    // Fallback to original file URL
    return URL.createObjectURL(file);
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check file type
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    errors.push('File must be an image or video');
  }
  
  // Check file size (50MB limit)
  const maxSizeMB = 50;
  if (file.size > maxSizeMB * 1024 * 1024) {
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }
  
  // Check supported formats
  const supportedFormats = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/mov',
    'video/avi',
  ];
  
  if (!supportedFormats.includes(file.type.toLowerCase())) {
    errors.push('Unsupported file format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Calculate compression savings
 */
export function getCompressionSavings(originalSize: number, compressedSize: number): {
  savedBytes: number;
  savedPercentage: number;
  compressionRatio: number;
} {
  const savedBytes = originalSize - compressedSize;
  const savedPercentage = (savedBytes / originalSize) * 100;
  const compressionRatio = compressedSize / originalSize;
  
  return {
    savedBytes,
    savedPercentage,
    compressionRatio,
  };
}