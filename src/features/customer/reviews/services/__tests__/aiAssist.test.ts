import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BusinessCategory, UploadedImage } from '../../types';

const { generateAiReviewCandidatesMock, compressImageToLimitMock } = vi.hoisted(() => ({
  generateAiReviewCandidatesMock: vi.fn(),
  compressImageToLimitMock: vi.fn(),
}));

vi.mock('../../../../../api/reviews', () => ({
  reviewsApi: {
    generateAiReviewCandidates: generateAiReviewCandidatesMock,
  },
}));

vi.mock('../../utils/imageCompression', () => ({
  compressImageToLimit: compressImageToLimitMock,
}));

import {
  buildAiReviewFormData,
  generateReviewSuggestions,
  inferReviewLanguage,
} from '../aiAssist';

const MB = 1024 * 1024;

function setNavigatorLanguage(language: string) {
  Object.defineProperty(window.navigator, 'language', {
    configurable: true,
    value: language,
  });
}

function createUploadedImage(file: File, type: UploadedImage['type'] = 'image'): UploadedImage {
  return {
    id: `img-${file.name}`,
    file,
    url: `blob:${file.name}`,
    thumbnail: `blob:${file.name}`,
    type,
    uploadState: { status: 'pending', progress: 0, retryCount: 0 },
    originalSize: file.size,
    compressedSize: file.size,
    uploadProgress: 0,
  };
}

describe('aiAssist service', () => {
  beforeEach(() => {
    generateAiReviewCandidatesMock.mockReset();
    compressImageToLimitMock.mockReset();
    setNavigatorLanguage('en-US');
  });

  it('infers zh when the browser language is Chinese', () => {
    setNavigatorLanguage('zh-CN');

    expect(inferReviewLanguage()).toBe('zh');
  });

  it('builds multipart form data with backend field names and only image attachments', async () => {
    const image = new File([new Uint8Array([1, 2, 3])], 'dish.jpg', { type: 'image/jpeg' });
    const video = new File([new Uint8Array([4, 5, 6])], 'walkthrough.mp4', { type: 'video/mp4' });

    const formData = await buildAiReviewFormData({
      reviewText: 'Loved the broth, but the wait was long.',
      overallRating: 4,
      detailedRatings: {
        quality: 4.5,
        environment: 4,
        service: 3.5,
        value: 4,
      } as any,
      merchantName: 'Mission Street Ramen',
      storeName: 'Mission Street Ramen - Downtown',
      businessCategory: BusinessCategory.RESTAURANT,
      images: [
        createUploadedImage(image),
        createUploadedImage(video, 'video'),
      ],
    });

    expect(formData.get('text')).toBe('Loved the broth, but the wait was long.');
    expect(formData.get('merchantName')).toBe('Mission Street Ramen');
    expect(formData.get('storeName')).toBe('Mission Street Ramen - Downtown');
    expect(formData.get('businessCategory')).toBe(BusinessCategory.RESTAURANT);
    expect(formData.get('language')).toBe('en');
    expect(formData.get('ratingOverall')).toBe('4');
    expect(formData.get('ratingFood')).toBe('4.5');
    expect(formData.get('ratingEnvironment')).toBe('4');
    expect(formData.get('ratingService')).toBe('3.5');
    expect(formData.get('ratingValue')).toBe('4');
    expect(formData.getAll('images')).toHaveLength(1);
    expect(formData.getAll('images')[0]).toBeInstanceOf(File);
  });

  it('recompresses oversized images to the backend AI size limit', async () => {
    const oversizedImage = new File([new Uint8Array([1])], 'large.webp', { type: 'image/webp' });
    Object.defineProperty(oversizedImage, 'size', { value: 6 * MB });

    const compressedImage = new File([new Uint8Array([2])], 'large.webp', { type: 'image/webp' });
    compressImageToLimitMock.mockResolvedValue({
      file: compressedImage,
      originalSize: oversizedImage.size,
      compressedSize: compressedImage.size,
      compressionRatio: compressedImage.size / oversizedImage.size,
    });

    const formData = await buildAiReviewFormData({
      reviewText: 'Worth the wait for the soup dumplings.',
      overallRating: 4.5,
      detailedRatings: {
        quality: 4.5,
        environment: 4,
        service: 4,
        value: 3.5,
      } as any,
      merchantName: 'Golden Spoon',
      businessCategory: BusinessCategory.RESTAURANT,
      images: [createUploadedImage(oversizedImage)],
    });

    expect(compressImageToLimitMock).toHaveBeenCalledWith(
      oversizedImage,
      expect.objectContaining({ maxSizeMB: 5 })
    );
    expect(formData.getAll('images')).toHaveLength(1);
  });

  it('returns backend candidates without altering them', async () => {
    generateAiReviewCandidatesMock.mockResolvedValue({
      candidates: [
        'Candidate one',
        'Candidate two',
        'Candidate three',
      ],
    });

    const response = await generateReviewSuggestions({
      reviewText: 'Pretty good noodles overall.',
      overallRating: 4,
      detailedRatings: {
        quality: 4,
        environment: 3.5,
        service: 3.5,
        value: 4,
      } as any,
      merchantName: 'Northern Cafe',
      businessCategory: BusinessCategory.RESTAURANT,
      images: [],
    });

    expect(response).toEqual({
      candidates: ['Candidate one', 'Candidate two', 'Candidate three'],
    });
  });

  it('surfaces backend error messages when AI suggestion generation fails', async () => {
    generateAiReviewCandidatesMock.mockRejectedValue({
      response: {
        status: 422,
        data: {
          error: 'ai: content blocked by safety filter',
        },
      },
    });

    const response = await generateReviewSuggestions({
      reviewText: 'Need help polishing this draft review.',
      overallRating: 4,
      detailedRatings: {
        quality: 4,
        environment: 4,
        service: 4,
        value: 4,
      } as any,
      merchantName: 'Cafe 101',
      businessCategory: BusinessCategory.RESTAURANT,
      images: [],
    });

    expect(response).toEqual({
      candidates: [],
      error: 'ai: content blocked by safety filter',
    });
  });
});
