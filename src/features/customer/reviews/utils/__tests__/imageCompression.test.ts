import { describe, expect, it, vi } from 'vitest';
import imageCompression from 'browser-image-compression';
import { compressImageToLimit } from '../imageCompression';

vi.mock('browser-image-compression', () => ({
  default: vi.fn(),
}));

describe('compressImageToLimit', () => {
  it('returns compressed file and metadata', async () => {
    const input = new File([new Uint8Array([1, 2, 3])], 'a.jpg', { type: 'image/jpeg' });
    const output = new File([new Uint8Array([4, 5])], 'a.jpg', { type: 'image/jpeg' });
    (imageCompression as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(output);

    const result = await compressImageToLimit(input, { maxSizeMB: 10 });

    expect(result.file).toBe(output);
    expect(result.originalSize).toBe(input.size);
    expect(result.compressedSize).toBe(output.size);
  });

  it('throws if compressed file still exceeds limit', async () => {
    const input = new File([new Uint8Array([1])], 'a.jpg', { type: 'image/jpeg' });
    const output = new File([new Uint8Array([2])], 'a.jpg', { type: 'image/jpeg' });
    Object.defineProperty(output, 'size', { value: 11 * 1024 * 1024 });
    (imageCompression as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(output);

    await expect(compressImageToLimit(input, { maxSizeMB: 10 })).rejects.toThrow();
  });
});
