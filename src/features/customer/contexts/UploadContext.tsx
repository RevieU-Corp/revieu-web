import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { UploadedImage, CompressionOptions } from '../types';

interface UploadContextState {
  uploads: UploadedImage[];
  activeUploads: number;
  totalProgress: number;
  compressionOptions: CompressionOptions;
  maxImages: number;
}

interface UploadContextActions {
  startUpload: (file: File) => string;
  updateUploadProgress: (imageId: string, progress: number) => void;
  completeUpload: (imageId: string, url: string, thumbnail: string) => void;
  failUpload: (imageId: string, error: string) => void;
  retryUpload: (imageId: string) => void;
  removeUpload: (imageId: string) => void;
  reorderUploads: (imageIds: string[]) => void;
  updateCompressionOptions: (options: Partial<CompressionOptions>) => void;
  compressImage: (imageId: string) => void;
  analyzeImage: (imageId: string) => void;
}

const defaultCompressionOptions: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  maxSizeKB: 2048, // 2MB
};

const initialState: UploadContextState = {
  uploads: [],
  activeUploads: 0,
  totalProgress: 0,
  compressionOptions: defaultCompressionOptions,
  maxImages: 9,
};

type UploadAction =
  | { type: 'START_UPLOAD'; payload: { imageId: string; file: File } }
  | { type: 'UPDATE_PROGRESS'; payload: { imageId: string; progress: number } }
  | { type: 'COMPLETE_UPLOAD'; payload: { imageId: string; url: string; thumbnail: string } }
  | { type: 'FAIL_UPLOAD'; payload: { imageId: string; error: string } }
  | { type: 'RETRY_UPLOAD'; payload: string }
  | { type: 'REMOVE_UPLOAD'; payload: string }
  | { type: 'REORDER_UPLOADS'; payload: string[] }
  | { type: 'UPDATE_COMPRESSION_OPTIONS'; payload: Partial<CompressionOptions> }
  | { type: 'START_COMPRESSION'; payload: string }
  | { type: 'COMPLETE_COMPRESSION'; payload: { imageId: string; compressionRatio: number; compressedSize: number } }
  | { type: 'START_ANALYSIS'; payload: string }
  | { type: 'COMPLETE_ANALYSIS'; payload: { imageId: string; analysis: any; suggestedTags: string[] } };

const uploadReducer = (state: UploadContextState, action: UploadAction): UploadContextState => {
  switch (action.type) {
    case 'START_UPLOAD':
      const newUpload: UploadedImage = {
        id: action.payload.imageId,
        file: action.payload.file,
        url: '',
        thumbnail: '',
        type: action.payload.file.type.startsWith('video/') ? 'video' : 'image',
        uploadState: {
          status: 'pending',
          progress: 0,
          retryCount: 0,
        },
        originalSize: action.payload.file.size,
        compressedSize: action.payload.file.size,
        uploadProgress: 0,
      };

      return {
        ...state,
        uploads: [...state.uploads, newUpload],
        activeUploads: state.activeUploads + 1,
      };

    case 'UPDATE_PROGRESS':
      const updatedUploads = state.uploads.map(upload =>
        upload.id === action.payload.imageId
          ? {
              ...upload,
              uploadProgress: action.payload.progress,
            }
          : upload
      );

      const totalProgress = updatedUploads.reduce((sum, upload) => sum + upload.uploadProgress, 0) / updatedUploads.length;

      return {
        ...state,
        uploads: updatedUploads,
        totalProgress,
      };

    case 'COMPLETE_UPLOAD':
      return {
        ...state,
        uploads: state.uploads.map(upload =>
          upload.id === action.payload.imageId
            ? {
                ...upload,
                url: action.payload.url,
                thumbnail: action.payload.thumbnail,
                uploadState: {
                  ...upload.uploadState,
                  status: 'complete',
                  progress: 100,
                },
                uploadProgress: 100,
              }
            : upload
        ),
        activeUploads: Math.max(0, state.activeUploads - 1),
      };

    case 'FAIL_UPLOAD':
      return {
        ...state,
        uploads: state.uploads.map(upload =>
          upload.id === action.payload.imageId
            ? {
                ...upload,
                uploadState: {
                  ...upload.uploadState,
                  status: 'error',
                  error: action.payload.error,
                  retryCount: upload.uploadState.retryCount + 1,
                },
              }
            : upload
        ),
        activeUploads: Math.max(0, state.activeUploads - 1),
      };

    case 'RETRY_UPLOAD':
      return {
        ...state,
        uploads: state.uploads.map(upload =>
          upload.id === action.payload
            ? {
                ...upload,
                uploadState: {
                  ...upload.uploadState,
                  status: 'pending',
                  error: undefined,
                  progress: 0,
                },
                uploadProgress: 0,
              }
            : upload
        ),
        activeUploads: state.activeUploads + 1,
      };

    case 'REMOVE_UPLOAD':
      const remainingUploads = state.uploads.filter(upload => upload.id !== action.payload);
      const wasActive = state.uploads.find(upload => 
        upload.id === action.payload && 
        ['pending', 'compressing', 'uploading', 'analyzing'].includes(upload.uploadState.status)
      );

      return {
        ...state,
        uploads: remainingUploads,
        activeUploads: wasActive ? Math.max(0, state.activeUploads - 1) : state.activeUploads,
        totalProgress: remainingUploads.length > 0 
          ? remainingUploads.reduce((sum, upload) => sum + upload.uploadProgress, 0) / remainingUploads.length
          : 0,
      };

    case 'REORDER_UPLOADS':
      const reorderedUploads = action.payload.map(id => 
        state.uploads.find(upload => upload.id === id)!
      ).filter(Boolean);

      return {
        ...state,
        uploads: reorderedUploads,
      };

    case 'UPDATE_COMPRESSION_OPTIONS':
      return {
        ...state,
        compressionOptions: {
          ...state.compressionOptions,
          ...action.payload,
        },
      };

    case 'START_COMPRESSION':
      return {
        ...state,
        uploads: state.uploads.map(upload =>
          upload.id === action.payload
            ? {
                ...upload,
                uploadState: {
                  ...upload.uploadState,
                  status: 'compressing',
                  progress: 0,
                },
              }
            : upload
        ),
      };

    case 'COMPLETE_COMPRESSION':
      return {
        ...state,
        uploads: state.uploads.map(upload =>
          upload.id === action.payload.imageId
            ? {
                ...upload,
                compressionRatio: action.payload.compressionRatio,
                compressedSize: action.payload.compressedSize,
                uploadState: {
                  ...upload.uploadState,
                  status: 'uploading',
                  progress: 0,
                },
              }
            : upload
        ),
      };

    case 'START_ANALYSIS':
      return {
        ...state,
        uploads: state.uploads.map(upload =>
          upload.id === action.payload
            ? {
                ...upload,
                uploadState: {
                  ...upload.uploadState,
                  status: 'analyzing',
                },
              }
            : upload
        ),
      };

    case 'COMPLETE_ANALYSIS':
      return {
        ...state,
        uploads: state.uploads.map(upload =>
          upload.id === action.payload.imageId
            ? {
                ...upload,
                analysisResults: action.payload.analysis,
                suggestedTags: action.payload.suggestedTags,
              }
            : upload
        ),
      };

    default:
      return state;
  }
};

const UploadContext = createContext<{
  state: UploadContextState;
  actions: UploadContextActions;
} | null>(null);

interface UploadProviderProps {
  children: ReactNode;
  maxImages?: number;
  compressionOptions?: Partial<CompressionOptions>;
}

export const UploadProvider: React.FC<UploadProviderProps> = ({ 
  children, 
  maxImages = 9,
  compressionOptions = {} 
}) => {
  const [state, dispatch] = useReducer(uploadReducer, {
    ...initialState,
    maxImages,
    compressionOptions: { ...defaultCompressionOptions, ...compressionOptions },
  });

  const actions: UploadContextActions = {
    startUpload: useCallback((file: File) => {
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      dispatch({ type: 'START_UPLOAD', payload: { imageId, file } });
      return imageId;
    }, []),

    updateUploadProgress: useCallback((imageId: string, progress: number) => {
      dispatch({ type: 'UPDATE_PROGRESS', payload: { imageId, progress } });
    }, []),

    completeUpload: useCallback((imageId: string, url: string, thumbnail: string) => {
      dispatch({ type: 'COMPLETE_UPLOAD', payload: { imageId, url, thumbnail } });
    }, []),

    failUpload: useCallback((imageId: string, error: string) => {
      dispatch({ type: 'FAIL_UPLOAD', payload: { imageId, error } });
    }, []),

    retryUpload: useCallback((imageId: string) => {
      dispatch({ type: 'RETRY_UPLOAD', payload: imageId });
    }, []),

    removeUpload: useCallback((imageId: string) => {
      dispatch({ type: 'REMOVE_UPLOAD', payload: imageId });
    }, []),

    reorderUploads: useCallback((imageIds: string[]) => {
      dispatch({ type: 'REORDER_UPLOADS', payload: imageIds });
    }, []),

    updateCompressionOptions: useCallback((options: Partial<CompressionOptions>) => {
      dispatch({ type: 'UPDATE_COMPRESSION_OPTIONS', payload: options });
    }, []),

    compressImage: useCallback((imageId: string) => {
      dispatch({ type: 'START_COMPRESSION', payload: imageId });
      
      // Simulate compression process
      setTimeout(() => {
        dispatch({ 
          type: 'COMPLETE_COMPRESSION', 
          payload: { 
            imageId, 
            compressionRatio: 0.7, 
            compressedSize: 1024 * 1024 // 1MB 
          } 
        });
      }, 2000);
    }, []),

    analyzeImage: useCallback((imageId: string) => {
      dispatch({ type: 'START_ANALYSIS', payload: imageId });
      
      // Simulate image analysis
      setTimeout(() => {
        dispatch({ 
          type: 'COMPLETE_ANALYSIS', 
          payload: { 
            imageId, 
            analysis: { category: 'food', confidence: 0.9 },
            suggestedTags: ['#delicious', '#food'] 
          } 
        });
      }, 1500);
    }, []),
  };

  return (
    <UploadContext.Provider value={{ state, actions }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUploadContext = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUploadContext must be used within an UploadProvider');
  }
  return context;
};

export default UploadContext;