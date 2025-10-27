'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function SafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  fallbackSrc = '/Apple.png',
  ...props 
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // If it's a remote URL, we need to handle it differently
  const isRemoteUrl = imgSrc && imgSrc.startsWith('http');
  
  if (isRemoteUrl) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        {...props}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}
