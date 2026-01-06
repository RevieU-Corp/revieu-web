import React, { useState, useCallback, useRef, DragEvent } from 'react';
import { Camera, X, Video, Upload, AlertCircle, RotateCcw } from 'lucide-react';
import { UploadedImage, ImageAnalysis } from '../types';
import { useUploadContext } from '../contexts/UploadContext';
import { compressImage } from '../utils/imageCompression';
import { createUploadManager } from '../utils/uploadManager';

export interface ImageUploadGridProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  onImageAnalysis?: (image: UploadedImage, tags: string[]) => void;
  className?: string;
  disabled?: boolean;
}

const ImageUploadGrid: React.FC<ImageUploadGridProps> = ({
  images,
  onImagesChange,
  maxImages = 9,
  onImageAnalysis,
  className = '',
  disabled = false,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use upload context for state management
  const { state: uploadState, actions: uploadActions } = useUploadContext();
  
  // Create upload manager instance
  const uploadManager = useCallback(() => {
    return createUploadManager(
      uploadState.compressionOptions,
      (event) => {
        // Handle upload progress events
        uploadActions.updateUploadProgress(event.imageId, event.progress);
        
        if (event.stage === 'error' && event.error) {
          uploadActions.failUpload(event.imageId, event.error);
        } else if (event.stage === 'complete') {
          // Mock completion - in real app, this would have actual URLs
          uploadActions.completeUpload(event.imageId, 'mock-url', 'mock-thumbnail');
        }
      }
    );
  }, [uploadState.compressionOptions, uploadActions]);

  // Generate unique ID for images
  const generateImageId = useCallback(() => {
    return `img_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }, []);

  // Create URL for file preview
  const createImagePreview = useCallback((file: File): string => {
    return URL.createObjectURL(file);
  }, []);

  // Handle file selection with compression and upload
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || disabled) return;

    const newImages: UploadedImage[] = [];
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        continue;
      }

      // Validate file size (before compression)
      const maxSizeMB = 50; // 50MB limit for original files
      if (file.size > maxSizeMB * 1024 * 1024) {
        continue;
      }

      const imageId = generateImageId();
      const previewUrl = createImagePreview(file);

      const newImage: UploadedImage = {
        id: imageId,
        file,
        url: previewUrl,
        thumbnail: previewUrl,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        uploadState: {
          status: 'pending',
          progress: 0,
          retryCount: 0,
        },
        originalSize: file.size,
        compressedSize: file.size,
        uploadProgress: 0,
      };

      newImages.push(newImage);

      // Start upload process with compression
      try {
        if (file.type.startsWith('image/')) {
          // Update state to show compression started
          newImage.uploadState = {
            ...newImage.uploadState,
            status: 'compressing',
          };
          
          // Compress image
          const compressionResult = await compressImage(file, uploadState.compressionOptions);
          
          // Update image with compression results
          newImage.compressedSize = compressionResult.compressedSize;
          newImage.compressionRatio = compressionResult.compressionRatio;
          newImage.uploadState.status = 'uploading';
          
          // Start upload process
          const manager = uploadManager();
          const uploadedImage = await manager.uploadImage(newImage);
          
          // Trigger analysis
          if (onImageAnalysis) {
            setTimeout(() => {
              const mockAnalysis: ImageAnalysis = {
                category: 'food',
                confidence: 0.85,
                detectedObjects: ['food', 'plate'],
                suggestedHashtags: ['#delicious', '#food'],
                containsPII: false,
                piiTypes: [],
                piiConfidence: 0,
              };
              
              onImageAnalysis({
                ...uploadedImage,
                analysisResults: mockAnalysis,
                suggestedTags: mockAnalysis.suggestedHashtags,
              }, mockAnalysis.suggestedHashtags);
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Upload failed:', error);
        newImage.uploadState = {
          ...newImage.uploadState,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
        };
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  }, [images, maxImages, disabled, onImagesChange, onImageAnalysis, generateImageId, createImagePreview, uploadState.compressionOptions, uploadManager]);

  // Handle file input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset input value to allow selecting the same file again
    if (e.target) {
      e.target.value = '';
    }
  }, [handleFileSelect]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    setDragOverIndex(null);
    
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [disabled, handleFileSelect]);

  // Handle image removal with proper cleanup
  const handleRemoveImage = useCallback((imageId: string) => {
    const imageToRemove = images.find(img => img.id === imageId);
    if (imageToRemove) {
      // Cancel any ongoing upload
      const manager = uploadManager();
      manager.cancelUpload(imageId);
      
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(imageToRemove.url);
      if (imageToRemove.thumbnail !== imageToRemove.url) {
        URL.revokeObjectURL(imageToRemove.thumbnail);
      }
    }
    
    onImagesChange(images.filter(img => img.id !== imageId));
  }, [images, onImagesChange, uploadManager]);

  // Handle retry upload
  const handleRetryUpload = useCallback(async (imageId: string) => {
    const imageToRetry = images.find(img => img.id === imageId);
    if (!imageToRetry) return;

    try {
      // Reset upload state
      const updatedImage: UploadedImage = {
        ...imageToRetry,
        uploadState: {
          ...imageToRetry.uploadState,
          status: 'compressing',
          progress: 0,
          error: undefined,
        },
      };

      // Update images array
      const updatedImages = images.map(img => 
        img.id === imageId ? updatedImage : img
      );
      onImagesChange(updatedImages);

      // Retry upload process
      if (imageToRetry.file.type.startsWith('image/')) {
        const compressionResult = await compressImage(imageToRetry.file, uploadState.compressionOptions);
        
        updatedImage.compressedSize = compressionResult.compressedSize;
        updatedImage.compressionRatio = compressionResult.compressionRatio;
        updatedImage.uploadState = {
          ...updatedImage.uploadState,
          status: 'uploading',
        };
        
        const manager = uploadManager();
        await manager.uploadImage(updatedImage);
      }
    } catch (error) {
      console.error('Retry failed:', error);
      const failedImage = {
        ...imageToRetry,
        uploadState: {
          ...imageToRetry.uploadState,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Retry failed',
          retryCount: imageToRetry.uploadState.retryCount + 1,
        },
      };
      
      const updatedImages = images.map(img => 
        img.id === imageId ? failedImage : img
      );
      onImagesChange(updatedImages);
    }
  }, [images, onImagesChange, uploadState.compressionOptions, uploadManager]);

  // Handle image reordering (drag and drop within grid)
  const handleImageDragStart = useCallback((e: DragEvent<HTMLDivElement>, imageId: string) => {
    e.dataTransfer.setData('text/plain', imageId);
  }, []);

  const handleImageDragOver = useCallback((e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleImageDrop = useCallback((e: DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    const draggedImageId = e.dataTransfer.getData('text/plain');
    const draggedIndex = images.findIndex(img => img.id === draggedImageId);
    
    if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
      const newImages = [...images];
      const [draggedImage] = newImages.splice(draggedIndex, 1);
      newImages.splice(targetIndex, 0, draggedImage);
      onImagesChange(newImages);
    }
  }, [images, onImagesChange]);

  // Render upload slot - Compact design like Dianping
  const renderUploadSlot = useCallback(() => (
    <div
      className={`
        w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center
        cursor-pointer transition-all duration-200 hover:bg-gray-50
        ${dragOver ? 'border-[#FF6600] bg-orange-50' : 'border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={() => !disabled && fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center">
        {dragOver ? (
          <Upload className="w-5 h-5 text-[#FF6600] mx-auto mb-1" />
        ) : (
          <Camera className="w-5 h-5 text-gray-400 mx-auto mb-1" />
        )}
        <p className="text-xs text-gray-500 leading-tight">
          {dragOver ? 'Drop' : 'Add'}
        </p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  ), [dragOver, disabled, maxImages, handleDragOver, handleDragLeave, handleDrop, handleInputChange]);

  // Render image slot - Compact design matching upload slot
  const renderImageSlot = useCallback((image: UploadedImage, index: number) => (
    <div
      key={image.id}
      className={`
        relative w-20 h-20 rounded-lg overflow-hidden group cursor-move
        ${dragOverIndex === index ? 'ring-2 ring-[#FF6600]' : ''}
      `}
      draggable={!disabled}
      onDragStart={(e) => handleImageDragStart(e, image.id)}
      onDragOver={(e) => handleImageDragOver(e, index)}
      onDrop={(e) => handleImageDrop(e, index)}
    >
      {/* Image/Video Preview */}
      {image.type === 'video' ? (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <Video className="w-4 h-4 text-gray-500" />
          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
            VIDEO
          </span>
        </div>
      ) : (
        <img
          src={image.thumbnail}
          alt={`Upload ${index + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {/* Upload Progress */}
      {image.uploadState.status === 'uploading' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-1" />
            <p className="text-xs">{image.uploadProgress}%</p>
          </div>
        </div>
      )}

      {/* Compression Progress */}
      {image.uploadState.status === 'compressing' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-1" />
            <p className="text-xs leading-tight">Comp...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {image.uploadState.status === 'error' && (
        <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
          <div className="text-white text-center">
            <AlertCircle className="w-4 h-4 mx-auto mb-1" />
            <p className="text-xs mb-1">Error</p>
            <button
              onClick={() => handleRetryUpload(image.id)}
              className="bg-white/20 hover:bg-white/30 text-white text-xs px-1 py-0.5 rounded flex items-center gap-1"
              disabled={disabled}
            >
              <RotateCcw className="w-2 h-2" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Remove Button */}
      <button
        onClick={() => handleRemoveImage(image.id)}
        className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        disabled={disabled}
      >
        <X className="w-3 h-3" />
      </button>

      {/* File Size Info */}
      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
        {(image.compressedSize / 1024 / 1024).toFixed(1)}MB
      </div>

      {/* Analysis Tags */}
      {image.suggestedTags && image.suggestedTags.length > 0 && (
        <div className="absolute top-1 left-1 bg-green-500/80 text-white text-xs px-1 rounded">
          AI
        </div>
      )}
    </div>
  ), [disabled, dragOverIndex, handleImageDragStart, handleImageDragOver, handleImageDrop, handleRemoveImage, handleRetryUpload]);

  // Create dynamic grid slots - only show uploaded images + one upload slot
  const gridSlots = [];
  
  // Add all uploaded images
  images.forEach((image, index) => {
    gridSlots.push(renderImageSlot(image, index));
  });
  
  // Add upload slot if we haven't reached the maximum
  if (images.length < maxImages) {
    gridSlots.push(
      <div key="upload-slot">
        {renderUploadSlot()}
      </div>
    );
  }

  // Determine grid layout for compact images
  const gridCols = 'grid-cols-6'; // More columns for smaller images

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Compact Grid */}
      <div className={`grid ${gridCols} gap-2`}>
        {gridSlots}
      </div>

      {/* Upload Info - Only show if there are images */}
      {images.length > 0 && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {images.length}/{maxImages} photos • Drag to reorder
          </p>
        </div>
      )}

      {/* File Format Info - Only show when upload slot is visible */}
      {images.length < maxImages && (
        <div className="text-xs text-gray-400 text-center">
          JPG, PNG, WebP, MP4 • Max 50MB
        </div>
      )}
    </div>
  );
};

export default ImageUploadGrid;