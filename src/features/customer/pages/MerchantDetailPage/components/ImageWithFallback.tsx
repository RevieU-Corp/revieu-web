import React from 'react';
import { ImageWithFallback as BaseImageWithFallback } from '../../../../../components/common';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className 
}) => {
  return (
    <BaseImageWithFallback
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
};
