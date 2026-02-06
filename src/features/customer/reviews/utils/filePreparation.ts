import { compressImageToLimit } from './imageCompression';
import { UploadedImage } from '../types';

const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/webm']);

export async function prepareUploadEntry(
  file: File,
  options: { maxSizeMB: number }
): Promise<{ entry?: UploadedImage; error?: string }> {
  const maxBytes = options.maxSizeMB * 1024 * 1024;

  if (file.type.startsWith('video/')) {
    if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
      return { error: 'Unsupported video type' };
    }
    if (file.size > maxBytes) {
      return { error: 'Video exceeds 10MB limit' };
    }
    return { entry: buildEntry(file) };
  }

  if (file.type.startsWith('image/')) {
    const compressed = await compressImageToLimit(file, { maxSizeMB: options.maxSizeMB });
    return { entry: buildEntry(compressed.file, compressed) };
  }

  return { error: 'Unsupported file type' };
}

function buildEntry(
  file: File,
  compression?: { originalSize: number; compressedSize: number; compressionRatio?: number }
): UploadedImage {
  return {
    id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    file,
    url: URL.createObjectURL(file),
    thumbnail: URL.createObjectURL(file),
    type: file.type.startsWith('video/') ? 'video' : 'image',
    uploadState: { status: 'pending', progress: 0, retryCount: 0 },
    originalSize: compression?.originalSize ?? file.size,
    compressedSize: compression?.compressedSize ?? file.size,
    compressionRatio: compression?.compressionRatio,
    uploadProgress: 0,
  };
}
