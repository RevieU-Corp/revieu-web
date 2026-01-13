import React from 'react';

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
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        // Fallback image on error
        const target = e.target as HTMLImageElement;
        target.src = '/api/placeholder/96/96';
      }}
    />
  );
};