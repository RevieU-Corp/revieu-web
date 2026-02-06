import { describe, expect, it, vi } from 'vitest';
import { prepareUploadEntry } from '../filePreparation';
import * as compression from '../imageCompression';

describe('prepareUploadEntry', () => {
  it('rejects oversized videos', async () => {
    const video = new File([new Uint8Array([1])], 'a.mp4', { type: 'video/mp4' });
    Object.defineProperty(video, 'size', { value: 12 * 1024 * 1024 });

    const result = await prepareUploadEntry(video, { maxSizeMB: 10 });
    expect(result.error).toBeTruthy();
  });

  it('compresses images and returns pending entry', async () => {
    const image = new File([new Uint8Array([1, 2, 3])], 'a.jpg', { type: 'image/jpeg' });
    vi.spyOn(compression, 'compressImageToLimit').mockResolvedValue({
      file: image,
      originalSize: image.size,
      compressedSize: image.size,
      compressionRatio: 1,
    });

    const result = await prepareUploadEntry(image, { maxSizeMB: 10 });
    expect(result.entry?.uploadState.status).toBe('pending');
  });
});
