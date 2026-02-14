import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ImageUploadGrid } from '../ImageUpload';
import { UploadedImage } from '../../types';
import { prepareUploadEntry } from '../../utils/filePreparation';

vi.mock('../../utils/filePreparation', () => ({
  prepareUploadEntry: vi.fn(),
}));

describe('ImageUploadGrid', () => {
  it('uses prepareUploadEntry before adding files', async () => {
    const file = new File([new Uint8Array([1, 2, 3])], 'a.jpg', { type: 'image/jpeg' });
    const mockEntry: UploadedImage = {
      id: 'img_1',
      file,
      url: 'blob:mock',
      thumbnail: 'blob:mock',
      type: 'image',
      uploadState: { status: 'pending', progress: 0, retryCount: 0 },
      originalSize: file.size,
      compressedSize: file.size,
      uploadProgress: 0,
    };

    (prepareUploadEntry as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ entry: mockEntry });

    const onImagesChange = vi.fn();
    const { container } = render(
      <ImageUploadGrid images={[]} onImagesChange={onImagesChange} />
    );

    const input = container.querySelector('input[type="file"]');
    expect(input).toBeTruthy();
    const fileList = {
      0: file,
      length: 1,
      item: () => file,
    } as unknown as FileList;

    fireEvent.change(input as HTMLInputElement, { target: { files: fileList } });

    await waitFor(() => {
      expect(prepareUploadEntry).toHaveBeenCalled();
    });
  });
});
