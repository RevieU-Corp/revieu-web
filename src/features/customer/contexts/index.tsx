// Context exports
export { ReviewProvider, useReviewContext } from './ReviewContext';
export { DraftProvider, useDraftContext } from './DraftContext';
export { UploadProvider, useUploadContext } from './UploadContext';

// Combined provider for convenience
import React from 'react';
import { ReviewProvider } from './ReviewContext';
import { DraftProvider } from './DraftContext';
import { UploadProvider } from './UploadContext';
import { BusinessCategory } from '../types';

interface SmartReviewProviderProps {
  children: React.ReactNode;
  merchantId?: string;
  merchantName?: string;
  merchantCategory?: BusinessCategory;
  maxImages?: number;
}

export const SmartReviewProvider: React.FC<SmartReviewProviderProps> = ({
  children,
  merchantId,
  merchantName,
  merchantCategory,
  maxImages = 9,
}) => {
  return (
    <DraftProvider>
      <UploadProvider maxImages={maxImages}>
        <ReviewProvider 
          merchantId={merchantId}
          merchantName={merchantName}
          merchantCategory={merchantCategory}
        >
          {children}
        </ReviewProvider>
      </UploadProvider>
    </DraftProvider>
  );
};