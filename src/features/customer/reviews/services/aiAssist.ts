import { reviewsApi } from '../../../../api/reviews';
import { BusinessCategory, UploadedImage } from '../types';
import { compressImageToLimit } from '../utils/imageCompression';

const AI_ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const AI_MAX_IMAGES = 6;
const AI_MAX_IMAGE_MB = 5;
const AI_MAX_IMAGE_BYTES = AI_MAX_IMAGE_MB * 1024 * 1024;

type DetailedRatings = {
  quality: number;
  environment: number;
  service: number;
  value: number;
};

export type ReviewLanguage = 'en' | 'zh';

export interface AIAssistRequest {
  reviewText: string;
  overallRating: number;
  detailedRatings: DetailedRatings;
  businessCategory: BusinessCategory;
  merchantName?: string;
  storeName?: string;
  images?: UploadedImage[];
  language?: ReviewLanguage;
  // useStyle controls whether the backend should apply the caller's saved writing
  // style profile to this polish request. Defaults to true when omitted; the
  // backend treats missing as "opt in".
  useStyle?: boolean;
}

export interface AIAssistResponse {
  candidates: string[];
  styleApplied: boolean;
  error?: string;
}

export function inferReviewLanguage(): ReviewLanguage {
  const browserLanguage = window.navigator.language.trim().toLowerCase();
  return browserLanguage.startsWith('zh') ? 'zh' : 'en';
}

async function toAiReadyImageFile(image: UploadedImage): Promise<File | null> {
  if (image.type !== 'image') {
    return null;
  }

  const mimeType = image.file.type.toLowerCase();
  if (!AI_ALLOWED_IMAGE_TYPES.has(mimeType)) {
    throw new Error('Unsupported image type for AI Assist');
  }

  if (image.file.size <= AI_MAX_IMAGE_BYTES) {
    return image.file;
  }

  const compressed = await compressImageToLimit(image.file, { maxSizeMB: AI_MAX_IMAGE_MB });
  return compressed.file;
}

export async function buildAiReviewFormData(request: AIAssistRequest): Promise<FormData> {
  const formData = new FormData();

  formData.append('text', request.reviewText.trim());
  formData.append('businessCategory', request.businessCategory);
  formData.append('language', request.language ?? inferReviewLanguage());
  formData.append('ratingOverall', String(request.overallRating));
  formData.append('ratingFood', String(request.detailedRatings.quality));
  formData.append('ratingEnvironment', String(request.detailedRatings.environment));
  formData.append('ratingService', String(request.detailedRatings.service));
  formData.append('ratingValue', String(request.detailedRatings.value));

  if (request.merchantName?.trim()) {
    formData.append('merchantName', request.merchantName.trim());
  }

  if (request.storeName?.trim()) {
    formData.append('storeName', request.storeName.trim());
  }

  // Only emit useStyle when the user has explicitly opted out — sending nothing keeps
  // the field absent so the backend's default-true behavior applies and old clients
  // continue to work.
  if (request.useStyle === false) {
    formData.append('useStyle', 'false');
  }

  const images = request.images ?? [];
  for (const image of images.slice(0, AI_MAX_IMAGES)) {
    const aiImage = await toAiReadyImageFile(image);
    if (aiImage) {
      formData.append('images', aiImage);
    }
  }

  return formData;
}

function normalizeAiError(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'error' in error.response.data &&
    typeof error.response.data.error === 'string'
  ) {
    return error.response.data.error;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'Failed to generate suggestions';
}

export async function generateReviewSuggestions(request: AIAssistRequest): Promise<AIAssistResponse> {
  try {
    const formData = await buildAiReviewFormData(request);
    const response = await reviewsApi.generateAiReviewCandidates(formData);

    return {
      candidates: response.candidates,
      styleApplied: response.styleApplied,
    };
  } catch (error) {
    return {
      candidates: [],
      styleApplied: false,
      error: normalizeAiError(error),
    };
  }
}
