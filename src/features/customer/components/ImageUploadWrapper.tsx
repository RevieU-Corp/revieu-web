import React from 'react';
import { UploadProvider } from '../contexts/UploadContext';
import ImageUploadGrid, { ImageUploadGridProps } from './ImageUploadGrid';
import { CompressionOptions } from '../types';

interface ImageUploadWrapperProps extends ImageUploadGridProps {
  compressionOptions?: Partial<CompressionOptions>;
}

/**
 * Wrapper component that provides UploadContext to ImageUploadGrid
 * This ensures proper state management and upload handling
 */
const ImageUploadWrapper: React.FC<ImageUploadWrapperProps> = ({
  compressionOptions,
  maxImages = 9,
  ...props
}) => {
  return (
    <UploadProvider 
      maxImages={maxImages}
      compressionOptions={compressionOptions}
    >
      <ImageUploadGrid 
        {...props}
        maxImages={maxImages}
      />
    </UploadProvider>
  );
};

export default ImageUploadWrapper;