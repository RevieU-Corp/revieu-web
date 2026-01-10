import React, { useState, useCallback, useRef, DragEvent } from 'react';
import { Camera, X, Video, Upload, AlertCircle } from 'lucide-react';
import { UploadedImage } from '../types';

// ============================================================================
// IMAGE UPLOAD GRID COMPONENT
// ============================================================================

export interface ImageUploadGridProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  onImageAnalysis?: (image: UploadedImage, tags: string[]) => void;
  className?: string;
  disabled?: boolean;
}

export const ImageUploadGrid: React.FC<ImageUploadGridProps> = ({
  images,
  onImagesChange,
  maxImages = 9,
  // onImageAnalysis,
  className = '',
  disabled = false,
}) => {
  const [dragOver, setDragOver] = useState(false);
  // const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique ID for images
  const generateImageId = useCallback(() => {
    return `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || disabled) return;

    const newImages: UploadedImage[] = [];
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const imageId = generateImageId();
        const newImage: UploadedImage = {
          id: imageId,
          file,
          url: URL.createObjectURL(file),
          thumbnail: URL.createObjectURL(file),
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
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  }, [images, maxImages, disabled, onImagesChange, generateImageId]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // setDragOverIndex(null);
    
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [disabled, handleFileSelect]);

  // Remove image
  const removeImage = useCallback((imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  // Open file picker
  const openFilePicker = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  // Calculate grid layout
  const getGridLayout = () => {
    const count = images.length;
    if (count === 0) return 'grid-cols-1';
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-3';
    return 'grid-cols-3';
  };

  const canAddMore = images.length < maxImages && !disabled;

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      {images.length === 0 ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
            dragOver
              ? 'border-[#990000] bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFilePicker}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Add Photos/Videos</p>
              <p className="text-xs text-gray-500 mt-1">
                Drag & drop or click to upload (max {maxImages})
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`grid gap-2 ${getGridLayout()}`}>
          {/* Existing Images */}
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
            >
              {/* Image/Video Preview */}
              {image.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
              ) : (
                <img
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Upload Progress */}
              {image.uploadState.status === 'uploading' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-sm">
                    {image.uploadProgress}%
                  </div>
                </div>
              )}

              {/* Error State */}
              {image.uploadState.status === 'error' && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              )}

              {/* Remove Button */}
              <button
                onClick={() => removeImage(image.id)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add More Button */}
          {canAddMore && (
            <div
              className={`aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors duration-200 ${
                dragOver ? 'border-[#990000] bg-red-50' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFilePicker}
            >
              <div className="text-center">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Add More</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={disabled}
      />

      {/* Image Count */}
      {images.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {images.length} of {maxImages} images
        </div>
      )}
    </div>
  );
};

// ============================================================================
// IMAGE UPLOAD WRAPPER COMPONENT
// ============================================================================

export interface ImageUploadWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ImageUploadWrapper: React.FC<ImageUploadWrapperProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-[#990000] to-[#FFD700] rounded-full"></div>
        <label className="text-sm font-medium text-gray-700">Add Photos/Videos</label>
      </div>
      {children}
    </div>
  );
};