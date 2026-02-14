import imageCompression from 'browser-image-compression';

const BYTES_PER_MB = 1024 * 1024;

export async function compressImageToLimit(
  file: File,
  options: { maxSizeMB: number; maxWidthOrHeight?: number }
) {
  const compressed = await imageCompression(file, {
    maxSizeMB: options.maxSizeMB,
    maxWidthOrHeight: options.maxWidthOrHeight ?? 1920,
    useWebWorker: true,
  });

  const maxBytes = options.maxSizeMB * BYTES_PER_MB;
  if (compressed.size > maxBytes) {
    throw new Error('Compressed image exceeds size limit');
  }

  return {
    file: compressed,
    originalSize: file.size,
    compressedSize: compressed.size,
    compressionRatio: compressed.size / file.size,
  };
}
