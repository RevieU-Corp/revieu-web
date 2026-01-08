import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { 
  ReviewContextState, 
  ReviewContextActions, 
  ReviewData, 
  ValidationErrors,
  DraftState,
  UploadState,
  AIStreamingState,
  BusinessCategory,
  UploadedImage
} from '../types';

// Initial states
const initialReviewData: Partial<ReviewData> = {
  overallRating: 0,
  detailedRatings: {
    quality: 0,
    environment: 0,
    service: 0,
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

const initialState: ReviewContextState = {
  reviewData: initialReviewData,
  draftState: initialDraftState,
  uploadState: initialUploadState,
  aiState: initialAIState,
  validationErrors: {},
  isSubmitting: false,
};

// Action types
type ReviewAction =
  | { type: 'UPDATE_RATING'; payload: number }
  | { type: 'UPDATE_DETAILED_RATING'; payload: { type: 'quality' | 'environment' | 'service'; rating: number } }
  | { type: 'UPDATE_TEXT'; payload: string }
  | { type: 'ADD_IMAGE'; payload: File }
  | { type: 'REMOVE_IMAGE'; payload: string }
  | { type: 'UPDATE_IMAGE_ORDER'; payload: string[] }
  | { type: 'START_AI_STREAMING'; payload: string }
  | { type: 'AI_CHUNK_RECEIVED'; payload: string }
  | { type: 'AI_STREAMING_COMPLETE' }
  | { type: 'AI_STREAMING_ERROR'; payload: string }
  | { type: 'SAVE_DRAFT_START' }
  | { type: 'SAVE_DRAFT_SUCCESS'; payload: Date }
  | { type: 'SAVE_DRAFT_ERROR'; payload: string }
  | { type: 'LOAD_DRAFT'; payload: any }
  | { type: 'VALIDATE_FORM' }
  | { type: 'UPDATE_PRICE_INFO'; payload: Partial<ReviewData['priceInfo']> }
  | { type: 'UPDATE_SETTINGS'; payload: { isAnonymous?: boolean; syncToFeed?: boolean } }
  | { type: 'ADD_TAG'; payload: string }
  | { type: 'REMOVE_TAG'; payload: string }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'UPDATE_IMAGES'; payload: UploadedImage[] }
  | { type: 'RESET' };

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

    case 'ADD_IMAGE':
      const newImageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
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

    case 'RESET':
      return initialState;

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
  merchantName?: string;
  merchantCategory?: BusinessCategory;
}

export const ReviewProvider: React.FC<ReviewProviderProps> = ({ 
  children, 
  merchantId, 
  // merchantName, 
  // merchantCategory 
}) => {
  const [state, dispatch] = useReducer(reviewReducer, {
    ...initialState,
    reviewData: {
      ...initialState.reviewData,
      merchantId,
    },
  });

  const actions: ReviewContextActions = {
    updateRating: useCallback((rating: number) => {
      dispatch({ type: 'UPDATE_RATING', payload: rating });
    }, []),

    updateDetailedRating: useCallback((type: 'quality' | 'environment' | 'service', rating: number) => {
      dispatch({ type: 'UPDATE_DETAILED_RATING', payload: { type, rating } });
    }, []),

    updateText: useCallback((text: string) => {
      dispatch({ type: 'UPDATE_TEXT', payload: text });
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

    streamAIText: useCallback((prompt: string) => {
      dispatch({ type: 'START_AI_STREAMING', payload: prompt });
      // AI streaming implementation will be added later
    }, []),

    saveDraft: useCallback(() => {
      dispatch({ type: 'SAVE_DRAFT_START' });
      // Draft saving implementation will be added later
      setTimeout(() => {
        dispatch({ type: 'SAVE_DRAFT_SUCCESS', payload: new Date() });
      }, 1000);
    }, []),

    loadDraft: useCallback((draftId: string) => {
      dispatch({ type: 'LOAD_DRAFT', payload: draftId });
    }, []),

    validateForm: useCallback(() => {
      dispatch({ type: 'VALIDATE_FORM' });
    }, []),

    updatePriceInfo: useCallback((priceInfo: Partial<ReviewData['priceInfo']>) => {
      dispatch({ type: 'UPDATE_PRICE_INFO', payload: priceInfo });
    }, []),

    updateSettings: useCallback((settings: { isAnonymous?: boolean; syncToFeed?: boolean }) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    }, []),

    addTag: useCallback((tag: string) => {
      dispatch({ type: 'ADD_TAG', payload: tag });
    }, []),

    removeTag: useCallback((tag: string) => {
      dispatch({ type: 'REMOVE_TAG', payload: tag });
    }, []),

    updateImages: useCallback((images: UploadedImage[]) => {
      dispatch({ type: 'UPDATE_IMAGES', payload: images });
    }, []),

    reset: useCallback(() => {
      dispatch({ type: 'RESET' });
    }, []),
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