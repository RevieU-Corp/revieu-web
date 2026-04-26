import React, { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import {
  ReviewContextState,
  ReviewContextActions,
  ReviewData,
  ValidationErrors,
  DraftState,
  UploadState,
  AIStreamingState,
  AIAssistantState,
  BusinessCategory,
  UploadedImage
} from '../types';
import { generateReviewSuggestions } from '../services/aiAssist';
import { mediaApi, uploadToR2 } from '../../../../api/media';
import { reviewsApi, CreateReviewRequest } from '../../../../api/reviews';
import { loadDraft as loadDraftFromStorage, saveDraft as saveDraftToStorage } from '../utils/draftStorage';

// Initial states
const initialReviewData: Partial<ReviewData> = {
  overallRating: 0,
  detailedRatings: {
    quality: 0,
    environment: 0,
    service: 0,
    value: 0,
  },
  reviewText: '',
  images: [],
  priceInfo: {
    amount: 0,
    currency: 'USD',
    type: 'per_person',
  },
  visitDate: new Date(),
  isAnonymous: false,
  syncToFeed: true,
  locationVerified: false,
  aiAssisted: false,
  tags: [],
  characterCount: 0,
};

const initialDraftState: DraftState = {
  currentDraft: null,
  isAutoSaving: false,
  lastSaved: null,
  hasUnsavedChanges: false,
};

const initialUploadState: UploadState = {
  status: 'pending',
  progress: 0,
  retryCount: 0,
};

const initialAIState: AIStreamingState = {
  isStreaming: false,
  currentChunk: '',
  accumulatedText: '',
  error: null,
  progress: 0,
};

const initialAIAssistantState: AIAssistantState = {
  isGenerating: false,
  suggestions: [],
  currentSuggestion: '',
  error: null,
  isVisible: false,
  useStyle: true,
  styleApplied: false,
};

const initialState: ReviewContextState = {
  reviewData: initialReviewData,
  draftState: initialDraftState,
  uploadState: initialUploadState,
  aiState: initialAIState,
  aiAssistantState: initialAIAssistantState,
  validationErrors: {},
  isSubmitting: false,
  submitError: undefined,
  draftNotice: undefined,
};

type StoredReviewDraft = {
  reviewText?: string;
  overallRating?: number;
  detailedRatings?: ReviewData['detailedRatings'];
  tags?: string[];
  locationVerified?: boolean;
  imageUrls?: string[];
  visitDate?: string;
};

const DRAFT_SAVE_DELAY_MS = 800;

const buildDraftPayload = (reviewData: Partial<ReviewData>): StoredReviewDraft => ({
  reviewText: reviewData.reviewText,
  overallRating: reviewData.overallRating,
  detailedRatings: reviewData.detailedRatings,
  tags: reviewData.tags,
  locationVerified: reviewData.locationVerified,
  imageUrls: reviewData.images
    ?.filter(image => image.fileUrl)
    .map(image => image.fileUrl!) ?? [],
  visitDate: reviewData.visitDate ? reviewData.visitDate.toISOString() : undefined,
});

const buildDraftImages = (imageUrls: string[]): UploadedImage[] => {
  return imageUrls.map((url, index) => {
    const placeholderFile = new File([], `draft-${index}.jpg`, { type: 'image/jpeg' });
    return {
      id: `draft_${Date.now()}_${index}`,
      file: placeholderFile,
      url,
      thumbnail: url,
      type: 'image',
      uploadState: {
        status: 'complete',
        progress: 100,
        retryCount: 0,
      },
      originalSize: 0,
      compressedSize: 0,
      uploadProgress: 100,
      fileUrl: url,
    };
  });
};

// Action types
type ReviewAction =
  | { type: 'UPDATE_RATING'; payload: number }
  | { type: 'UPDATE_DETAILED_RATING'; payload: { type: 'quality' | 'environment' | 'service' | 'value'; rating: number } }
  | { type: 'UPDATE_TEXT'; payload: string }
  | { type: 'ADD_TAG'; payload: string }
  | { type: 'REMOVE_TAG'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: { isAnonymous?: boolean; syncToFeed?: boolean } }
  | { type: 'UPDATE_PRICE_INFO'; payload: Partial<ReviewData['priceInfo']> }
  | { type: 'ADD_IMAGE'; payload: File }
  | { type: 'REMOVE_IMAGE'; payload: string }
  | { type: 'UPDATE_IMAGE_ORDER'; payload: string[] }
  | { type: 'UPDATE_IMAGES'; payload: UploadedImage[] }
  | { type: 'RETRY_IMAGE'; payload: { imageId: string } }
  | { type: 'START_AI_STREAMING'; payload: string }
  | { type: 'AI_CHUNK_RECEIVED'; payload: string }
  | { type: 'AI_STREAMING_COMPLETE' }
  | { type: 'AI_STREAMING_ERROR'; payload: string }
  | { type: 'GENERATE_AI_SUGGESTIONS_START' }
  | { type: 'GENERATE_AI_SUGGESTIONS_SUCCESS'; payload: { candidates: string[]; styleApplied: boolean } }
  | { type: 'GENERATE_AI_SUGGESTIONS_ERROR'; payload: string }
  | { type: 'SELECT_AI_SUGGESTION'; payload: string }
  | { type: 'TOGGLE_AI_ASSISTANT' }
  | { type: 'CLEAR_AI_SUGGESTIONS' }
  | { type: 'SET_USE_STYLE'; payload: boolean }
  | { type: 'SAVE_DRAFT_START' }
  | { type: 'SAVE_DRAFT_SUCCESS'; payload: Date }
  | { type: 'SAVE_DRAFT_ERROR'; payload: string }
  | { type: 'LOAD_DRAFT'; payload: any }
  | { type: 'VALIDATE_FORM' }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET' }
  | { type: 'UPDATE_IMAGE_UPLOAD_STATUS'; payload: { imageId: string; status: UploadState['status']; progress?: number; error?: string; fileUrl?: string } }
  | { type: 'SET_UPLOAD_ERROR'; payload: string }
  | { type: 'CLEAR_UPLOAD_ERROR' }
  | { type: 'SET_SUBMIT_ERROR'; payload: string }
  | { type: 'CLEAR_SUBMIT_ERROR' }
  | { type: 'CLEAR_DRAFT_NOTICE' };

// Reducer
const reviewReducer = (state: ReviewContextState, action: ReviewAction): ReviewContextState => {
  switch (action.type) {
    case 'UPDATE_RATING':
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          overallRating: action.payload,
        },
        draftState: {
          ...state.draftState,
          hasUnsavedChanges: true,
        },
      };

    case 'UPDATE_DETAILED_RATING':
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          detailedRatings: {
            ...state.reviewData.detailedRatings!,
            [action.payload.type]: action.payload.rating,
          },
        },
        draftState: {
          ...state.draftState,
          hasUnsavedChanges: true,
        },
      };

    case 'UPDATE_TEXT':
      const characterCount = action.payload.length;
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          reviewText: action.payload,
          characterCount,
        },
        draftState: {
          ...state.draftState,
          hasUnsavedChanges: true,
        },
      };

    case 'ADD_TAG':
      const currentTags = state.reviewData.tags || [];
      if (!currentTags.includes(action.payload)) {
        return {
          ...state,
          reviewData: {
            ...state.reviewData,
            tags: [...currentTags, action.payload],
          },
          draftState: {
            ...state.draftState,
            hasUnsavedChanges: true,
          },
        };
      }
      return state;

    case 'REMOVE_TAG':
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          tags: state.reviewData.tags?.filter(tag => tag !== action.payload) || [],
        },
        draftState: {
          ...state.draftState,
          hasUnsavedChanges: true,
        },
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          ...action.payload,
        },
        draftState: {
          ...state.draftState,
          hasUnsavedChanges: true,
        },
      };

    case 'UPDATE_PRICE_INFO':
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          priceInfo: {
            ...state.reviewData.priceInfo!,
            ...action.payload,
          },
        },
        draftState: {
          ...state.draftState,
          hasUnsavedChanges: true,
        },
      };

    case 'ADD_IMAGE':
      const newImageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const newImage: UploadedImage = {
        id: newImageId,
        file: action.payload,
        url: URL.createObjectURL(action.payload),
        thumbnail: URL.createObjectURL(action.payload),
        type: action.payload.type.startsWith('video/') ? 'video' : 'image',
        uploadState: {
          status: 'pending',
          progress: 0,
          retryCount: 0,
        },
        originalSize: action.payload.size,
        compressedSize: action.payload.size,
        uploadProgress: 0,
      };

      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          images: [...(state.reviewData.images || []), newImage],
        },
        draftState: {
          ...state.draftState,
          hasUnsavedChanges: true,
        },
      };

    case 'REMOVE_IMAGE':
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          images: state.reviewData.images?.filter(img => img.id !== action.payload) || [],
        },
        draftState: {
          ...state.draftState,
          hasUnsavedChanges: true,
        },
      };

    case 'UPDATE_IMAGES':
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          images: action.payload,
        },
        draftState: {
          ...state.draftState,
          hasUnsavedChanges: true,
        },
      };

    case 'RETRY_IMAGE':
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          images: state.reviewData.images?.map(img =>
            img.id === action.payload.imageId
              ? {
                ...img,
                uploadState: {
                  ...img.uploadState,
                  status: 'pending',
                  progress: 0,
                  error: undefined,
                  retryCount: img.uploadState.retryCount + 1,
                },
                uploadProgress: 0,
                fileUrl: undefined,
              }
              : img
          ) || [],
        },
      };

    case 'START_AI_STREAMING':
      return {
        ...state,
        aiState: {
          ...state.aiState,
          isStreaming: true,
          currentChunk: '',
          accumulatedText: '',
          error: null,
          progress: 0,
        },
      };

    case 'AI_CHUNK_RECEIVED':
      return {
        ...state,
        aiState: {
          ...state.aiState,
          currentChunk: action.payload,
          accumulatedText: state.aiState.accumulatedText + action.payload,
        },
      };

    case 'AI_STREAMING_COMPLETE':
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          reviewText: state.aiState.accumulatedText,
          aiAssisted: true,
          characterCount: state.aiState.accumulatedText.length,
        },
        aiState: {
          ...state.aiState,
          isStreaming: false,
          progress: 100,
        },
        draftState: {
          ...state.draftState,
          hasUnsavedChanges: true,
        },
      };

    case 'AI_STREAMING_ERROR':
      return {
        ...state,
        aiState: {
          ...state.aiState,
          isStreaming: false,
          error: action.payload,
        },
      };

    case 'GENERATE_AI_SUGGESTIONS_START':
      return {
        ...state,
        aiAssistantState: {
          ...state.aiAssistantState,
          isGenerating: true,
          error: null,
        },
      };

    case 'GENERATE_AI_SUGGESTIONS_SUCCESS':
      return {
        ...state,
        aiAssistantState: {
          ...state.aiAssistantState,
          isGenerating: false,
          suggestions: action.payload.candidates,
          styleApplied: action.payload.styleApplied,
          error: null,
          isVisible: true,
        },
      };

    case 'GENERATE_AI_SUGGESTIONS_ERROR':
      return {
        ...state,
        aiAssistantState: {
          ...state.aiAssistantState,
          isGenerating: false,
          error: action.payload,
        },
      };

    case 'SELECT_AI_SUGGESTION':
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          reviewText: action.payload,
          aiAssisted: true,
          characterCount: action.payload.length,
        },
        aiAssistantState: {
          ...state.aiAssistantState,
          currentSuggestion: action.payload,
        },
        draftState: {
          ...state.draftState,
          hasUnsavedChanges: true,
        },
      };

    case 'TOGGLE_AI_ASSISTANT':
      return {
        ...state,
        aiAssistantState: {
          ...state.aiAssistantState,
          isVisible: !state.aiAssistantState.isVisible,
        },
      };

    case 'CLEAR_AI_SUGGESTIONS':
      return {
        ...state,
        aiAssistantState: {
          ...state.aiAssistantState,
          suggestions: [],
          currentSuggestion: '',
          error: null,
          styleApplied: false,
        },
      };

    case 'SET_USE_STYLE':
      return {
        ...state,
        aiAssistantState: {
          ...state.aiAssistantState,
          useStyle: action.payload,
        },
      };

    case 'SAVE_DRAFT_START':
      return {
        ...state,
        draftState: {
          ...state.draftState,
          isAutoSaving: true,
        },
      };

    case 'SAVE_DRAFT_SUCCESS':
      return {
        ...state,
        draftState: {
          ...state.draftState,
          isAutoSaving: false,
          lastSaved: action.payload,
          hasUnsavedChanges: false,
        },
      };

    case 'LOAD_DRAFT': {
      const draft = action.payload as StoredReviewDraft;
      const draftImages = draft.imageUrls ? buildDraftImages(draft.imageUrls) : undefined;
      const reviewText = draft.reviewText ?? state.reviewData.reviewText;

      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          reviewText,
          overallRating: draft.overallRating ?? state.reviewData.overallRating,
          detailedRatings: draft.detailedRatings ?? state.reviewData.detailedRatings,
          tags: draft.tags ?? state.reviewData.tags,
          locationVerified: draft.locationVerified ?? state.reviewData.locationVerified,
          images: draftImages ?? state.reviewData.images,
          characterCount: reviewText ? reviewText.length : state.reviewData.characterCount,
          visitDate: draft.visitDate ? new Date(draft.visitDate) : state.reviewData.visitDate,
        },
        draftState: {
          ...state.draftState,
          hasUnsavedChanges: false,
        },
        draftNotice: 'Draft restored',
      };
    }

    case 'VALIDATE_FORM':
      const errors: ValidationErrors = {};

      if (!state.reviewData.overallRating || state.reviewData.overallRating < 0.5) {
        errors.rating = 'Please provide a rating';
      }

      if (state.reviewData.reviewText && state.reviewData.reviewText.length > 200) {
        errors.text = 'Review must be less than 200 characters';
      }

      return {
        ...state,
        validationErrors: errors,
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case 'RESET':
      return initialState;

    case 'UPDATE_IMAGE_UPLOAD_STATUS':
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          images: state.reviewData.images?.map(img =>
            img.id === action.payload.imageId
              ? {
                ...img,
                uploadState: {
                  ...img.uploadState,
                  status: action.payload.status,
                  progress: action.payload.progress ?? img.uploadState.progress,
                  error: action.payload.error,
                },
                uploadProgress: action.payload.progress ?? img.uploadProgress,
                fileUrl: action.payload.fileUrl ?? img.fileUrl,
              }
              : img
          ) || [],
        },
      };

    case 'SET_UPLOAD_ERROR':
      return {
        ...state,
        uploadState: {
          ...state.uploadState,
          status: 'error',
          error: action.payload,
        },
      };

    case 'CLEAR_UPLOAD_ERROR':
      return {
        ...state,
        uploadState: {
          ...state.uploadState,
          status: 'pending',
          error: undefined,
        },
      };

    case 'SET_SUBMIT_ERROR':
      return {
        ...state,
        submitError: action.payload,
      };

    case 'CLEAR_SUBMIT_ERROR':
      return {
        ...state,
        submitError: undefined,
      };

    case 'CLEAR_DRAFT_NOTICE':
      return {
        ...state,
        draftNotice: undefined,
      };

    default:
      return state;
  }
};

// Context
const ReviewContext = createContext<{
  state: ReviewContextState;
  actions: ReviewContextActions;
} | null>(null);

// Provider component
interface ReviewProviderProps {
  children: ReactNode;
  merchantId?: string;
  storeId?: string;
  storeName?: string;
  venueId?: string;
  merchantName?: string;
  merchantCategory?: BusinessCategory;
}

export const ReviewProvider: React.FC<ReviewProviderProps> = ({
  children,
  merchantId,
  storeId,
  storeName,
  venueId,
  merchantName,
  merchantCategory,
}) => {
  const [state, dispatch] = useReducer(reviewReducer, {
    ...initialState,
    reviewData: {
      ...initialState.reviewData,
      merchantId,
      merchantName,
      storeId,
      storeName,
      venueId,
      merchantCategory,
    },
  });

  useEffect(() => {
    const draft = loadDraftFromStorage<StoredReviewDraft>();
    if (draft) {
      dispatch({ type: 'LOAD_DRAFT', payload: draft });
    }
  }, []);

  useEffect(() => {
    if (!state.draftState.hasUnsavedChanges) return;

    const timer = window.setTimeout(() => {
      dispatch({ type: 'SAVE_DRAFT_START' });
      const payload = buildDraftPayload(state.reviewData);
      saveDraftToStorage(payload);
      dispatch({ type: 'SAVE_DRAFT_SUCCESS', payload: new Date() });
    }, DRAFT_SAVE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [state.reviewData, state.draftState.hasUnsavedChanges]);

  const uploadPendingImages = useCallback(async (pendingImages: UploadedImage[]): Promise<boolean> => {
    if (pendingImages.length === 0) {
      return true;
    }

    try {
      dispatch({ type: 'CLEAR_UPLOAD_ERROR' });

      const uploadUrlsResponse = await mediaApi.getUploadUrls({
        files: pendingImages.map(img => ({
          filename: img.file.name,
          contentType: img.file.type,
        })),
      });

      await Promise.all(
        uploadUrlsResponse.uploads.map(async (upload, index) => {
          const image = pendingImages[index];

          dispatch({
            type: 'UPDATE_IMAGE_UPLOAD_STATUS',
            payload: { imageId: image.id, status: 'uploading', progress: 0 },
          });

          try {
            await uploadToR2(upload.uploadUrl, image.file, (progress) => {
              dispatch({
                type: 'UPDATE_IMAGE_UPLOAD_STATUS',
                payload: { imageId: image.id, status: 'uploading', progress },
              });
            });

            dispatch({
              type: 'UPDATE_IMAGE_UPLOAD_STATUS',
              payload: {
                imageId: image.id,
                status: 'complete',
                progress: 100,
                fileUrl: upload.fileUrl,
              },
            });
          } catch (error) {
            dispatch({
              type: 'UPDATE_IMAGE_UPLOAD_STATUS',
              payload: {
                imageId: image.id,
                status: 'error',
                error: error instanceof Error ? error.message : 'Upload failed',
              },
            });
            throw error;
          }
        })
      );

      return true;
    } catch (error) {
      dispatch({
        type: 'SET_UPLOAD_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to upload images',
      });
      return false;
    }
  }, [dispatch]);

  const actions: ReviewContextActions = {
    updateRating: useCallback((rating: number) => {
      dispatch({ type: 'UPDATE_RATING', payload: rating });
    }, []),

    updateDetailedRating: useCallback((type: 'quality' | 'environment' | 'service' | 'value', rating: number) => {
      dispatch({ type: 'UPDATE_DETAILED_RATING', payload: { type, rating } });
    }, []),

    updateText: useCallback((text: string) => {
      dispatch({ type: 'UPDATE_TEXT', payload: text });
    }, []),

    addTag: useCallback((tag: string) => {
      dispatch({ type: 'ADD_TAG', payload: tag });
    }, []),

    removeTag: useCallback((tag: string) => {
      dispatch({ type: 'REMOVE_TAG', payload: tag });
    }, []),

    updateSettings: useCallback((settings: { isAnonymous?: boolean; syncToFeed?: boolean }) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    }, []),

    updatePriceInfo: useCallback((priceInfo: Partial<ReviewData['priceInfo']>) => {
      dispatch({ type: 'UPDATE_PRICE_INFO', payload: priceInfo });
    }, []),

    addImage: useCallback((image: File) => {
      dispatch({ type: 'ADD_IMAGE', payload: image });
    }, []),

    removeImage: useCallback((imageId: string) => {
      dispatch({ type: 'REMOVE_IMAGE', payload: imageId });
    }, []),

    updateImageOrder: useCallback((imageIds: string[]) => {
      dispatch({ type: 'UPDATE_IMAGE_ORDER', payload: imageIds });
    }, []),

    updateImages: useCallback((images: UploadedImage[]) => {
      dispatch({ type: 'UPDATE_IMAGES', payload: images });
    }, []),

    retryImage: useCallback(async (imageId: string): Promise<boolean> => {
      const images = state.reviewData.images || [];
      const targetImage = images.find(img => img.id === imageId);

      if (!targetImage) {
        return false;
      }

      if (targetImage.uploadState.status !== 'error') {
        return true;
      }

      const nextRetryCount = targetImage.uploadState.retryCount + 1;
      const pendingImage: UploadedImage = {
        ...targetImage,
        uploadState: {
          ...targetImage.uploadState,
          status: 'pending',
          progress: 0,
          error: undefined,
          retryCount: nextRetryCount,
        },
        uploadProgress: 0,
        fileUrl: undefined,
      };

      dispatch({ type: 'RETRY_IMAGE', payload: { imageId } });
      return uploadPendingImages([pendingImage]);
    }, [dispatch, state.reviewData.images, uploadPendingImages]),

    streamAIText: useCallback((prompt: string) => {
      dispatch({ type: 'START_AI_STREAMING', payload: prompt });
    }, []),

    generateAISuggestions: useCallback(async () => {
      dispatch({ type: 'GENERATE_AI_SUGGESTIONS_START' });
      try {
        const response = await generateReviewSuggestions({
          reviewText: state.reviewData.reviewText || '',
          overallRating: state.reviewData.overallRating || 0,
          detailedRatings: state.reviewData.detailedRatings || {
            quality: 0,
            environment: 0,
            service: 0,
            value: 0,
          },
          merchantName: state.reviewData.merchantName,
          storeName: state.reviewData.storeName,
          businessCategory: state.reviewData.merchantCategory || BusinessCategory.RESTAURANT,
          images: state.reviewData.images || [],
          language: state.reviewData.preferredLanguage,
          useStyle: state.aiAssistantState.useStyle,
        });
        if (response.error) {
          dispatch({ type: 'GENERATE_AI_SUGGESTIONS_ERROR', payload: response.error });
        } else {
          dispatch({
            type: 'GENERATE_AI_SUGGESTIONS_SUCCESS',
            payload: { candidates: response.candidates, styleApplied: response.styleApplied },
          });
        }
      } catch (error) {
        dispatch({ type: 'GENERATE_AI_SUGGESTIONS_ERROR', payload: 'Failed to generate suggestions' });
      }
    }, [state.reviewData, state.aiAssistantState.useStyle]),

    selectAISuggestion: useCallback((suggestion: string) => {
      dispatch({ type: 'SELECT_AI_SUGGESTION', payload: suggestion });
    }, []),

    toggleAIAssistant: useCallback(() => {
      dispatch({ type: 'TOGGLE_AI_ASSISTANT' });
    }, []),

    clearAISuggestions: useCallback(() => {
      dispatch({ type: 'CLEAR_AI_SUGGESTIONS' });
    }, []),

    setUseStyle: useCallback((value: boolean) => {
      dispatch({ type: 'SET_USE_STYLE', payload: value });
    }, []),

    saveDraft: useCallback(() => {
      dispatch({ type: 'SAVE_DRAFT_START' });
      const payload = buildDraftPayload(state.reviewData);
      saveDraftToStorage(payload);
      dispatch({ type: 'SAVE_DRAFT_SUCCESS', payload: new Date() });
    }, [state.reviewData]),

    loadDraft: useCallback((_draftId: string) => {
      const draft = loadDraftFromStorage<StoredReviewDraft>();
      if (draft) {
        dispatch({ type: 'LOAD_DRAFT', payload: draft });
      }
    }, []),

    validateForm: useCallback(() => {
      dispatch({ type: 'VALIDATE_FORM' });
    }, []),

    reset: useCallback(() => {
      dispatch({ type: 'RESET' });
    }, []),

    setUploadError: useCallback((message: string) => {
      dispatch({ type: 'SET_UPLOAD_ERROR', payload: message });
    }, []),

    clearUploadError: useCallback(() => {
      dispatch({ type: 'CLEAR_UPLOAD_ERROR' });
    }, []),

    clearSubmitError: useCallback(() => {
      dispatch({ type: 'CLEAR_SUBMIT_ERROR' });
    }, []),

    clearDraftNotice: useCallback(() => {
      dispatch({ type: 'CLEAR_DRAFT_NOTICE' });
    }, []),

    // Upload images to R2 using presigned URLs, returns uploaded URLs
    uploadImages: useCallback(async (): Promise<string[] | null> => {
      const images = state.reviewData.images || [];
      console.log('[uploadImages] Total images:', images.length);
      console.log('[uploadImages] Images:', images.map(img => ({ id: img.id, status: img.uploadState.status, fileUrl: img.fileUrl })));
      const pendingImages = images.filter(img => img.uploadState.status === 'pending');
      console.log('[uploadImages] Pending images:', pendingImages.length);
      const alreadyUploadedUrls = images
        .filter(img => img.uploadState.status === 'complete' && img.fileUrl)
        .map(img => img.fileUrl!);
      console.log('[uploadImages] Already uploaded URLs:', alreadyUploadedUrls);

      if (pendingImages.length === 0) {
        return alreadyUploadedUrls;
      }

      try {
        dispatch({ type: 'CLEAR_UPLOAD_ERROR' });

        const uploadUrlsResponse = await mediaApi.getUploadUrls({
          files: pendingImages.map(img => ({
            filename: img.file.name,
            contentType: img.file.type,
          })),
        });

        const newUrls: string[] = [];
        console.log('[uploadImages] Starting upload for', pendingImages.length, 'images');
        await Promise.all(
          uploadUrlsResponse.uploads.map(async (upload, index) => {
            const image = pendingImages[index];

            dispatch({
              type: 'UPDATE_IMAGE_UPLOAD_STATUS',
              payload: { imageId: image.id, status: 'uploading', progress: 0 },
            });

            await uploadToR2(upload.uploadUrl, image.file, (progress) => {
              dispatch({
                type: 'UPDATE_IMAGE_UPLOAD_STATUS',
                payload: { imageId: image.id, status: 'uploading', progress },
              });
            });

            dispatch({
              type: 'UPDATE_IMAGE_UPLOAD_STATUS',
              payload: {
                imageId: image.id,
                status: 'complete',
                progress: 100,
                fileUrl: upload.fileUrl,
              },
            });

            newUrls.push(upload.fileUrl);
            console.log('[uploadImages] Uploaded image, fileUrl:', upload.fileUrl);
          })
        );

        const result = [...alreadyUploadedUrls, ...newUrls];
        console.log('[uploadImages] Final URLs:', result);
        return result;
      } catch (error) {
        dispatch({
          type: 'SET_UPLOAD_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to upload images',
        });
        return null;
      }
    }, [state.reviewData.images]),

    // Submit review to backend
    submitReview: useCallback(async (uploadedImageUrls?: string[]): Promise<boolean> => {
      console.log('[submitReview] Called with uploadedImageUrls:', uploadedImageUrls);
      dispatch({ type: 'SET_SUBMITTING', payload: true });
      dispatch({ type: 'CLEAR_SUBMIT_ERROR' });

      try {
        const merchantId = state.reviewData.merchantId?.trim();
        const storeId = state.reviewData.storeId?.trim();

        if (!merchantId) {
          dispatch({ type: 'SET_SUBMITTING', payload: false });
          dispatch({
            type: 'SET_SUBMIT_ERROR',
            payload: 'Merchant context is missing. Please start your review from a merchant page.',
          });
          return false;
        }

        if (!storeId) {
          dispatch({ type: 'SET_SUBMITTING', payload: false });
          dispatch({
            type: 'SET_SUBMIT_ERROR',
            payload: 'Store context is missing. Please start your review from a merchant page.',
          });
          return false;
        }

        // Use provided URLs or get from state
        const imageUrls = uploadedImageUrls ?? state.reviewData.images
          ?.filter(img => img.uploadState.status === 'complete' && img.fileUrl)
          .map(img => img.fileUrl!) ?? [];

        const request: CreateReviewRequest = {
          merchantId,
          storeId,
          overallRating: state.reviewData.overallRating || 0,
          detailedRatings: state.reviewData.detailedRatings,
          text: state.reviewData.reviewText,
          images: imageUrls,
          tags: state.reviewData.tags,
          visitDate: state.reviewData.visitDate
            ? state.reviewData.visitDate.toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          locationVerified: state.reviewData.locationVerified,
        };
        console.log('[submitReview] Request:', JSON.stringify(request, null, 2));

        await reviewsApi.create(request);

        dispatch({ type: 'SET_SUBMITTING', payload: false });
        return true;
      } catch (error) {
        dispatch({ type: 'SET_SUBMITTING', payload: false });
        dispatch({
          type: 'SET_SUBMIT_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to submit review',
        });
        return false;
      }
    }, [state.reviewData]),
  };

  return (
    <ReviewContext.Provider value={{ state, actions }}>
      {children}
    </ReviewContext.Provider>
  );
};

// Hook to use the context
export const useReviewContext = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviewContext must be used within a ReviewProvider');
  }
  return context;
};

export default ReviewContext;
