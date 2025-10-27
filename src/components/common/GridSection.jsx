"use client";
import React from 'react';
import Link from 'next/link';
import MotionFade from '@/components/animations/MotionFade';
import { Skeleton } from '@/components/ui/skeleton';
import NotFound from '@/components/ui/NotFound';
import SafeImage from '@/components/ui/SafeImage';

export default function GridSection({
  title,
  description,
  items = [],
  isLoading = false,
  loadingCount = 6,
  onItemClick,
  onItemClickHandler,
  renderItem,
  className = "",
  gridCols = "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  notFoundTitle = "No Items Found",
  notFoundDescription = "No items available at the moment.",
  searchTerm = "",
  onClearSearch,
  primaryAction,
  secondaryAction
}) {
  // Helper function to get the correct image source
  const getImageSrc = (item) => {
    const imageSrc = item.image || item.logo || item.icon || '/Apple.png';
    
    // If it's a remote URL and starts with http, use it directly
    if (imageSrc.startsWith('http')) {
      return imageSrc;
    }
    
    // If it's a local path, ensure it starts with /
    return imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
  };
  const defaultRenderItem = (item, index) => (
    <Link 
      key={item.id || index} 
      href={onItemClick ? onItemClick(item) : '#'}
      onClick={() => {
        // Call the click handler when user actually clicks
        if (onItemClickHandler) {
          onItemClickHandler(item);
        }
      }}
    >
      <div className="group relative bg-white/10 backdrop-blur-sm h-full p-6 rounded-md shadow hover:shadow-lg transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center border border-accent/20 hover:border-secondary/50 hover:-translate-y-2 overflow-hidden">
        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-md border-2 border-transparent group-hover:border-secondary/20 transition-all duration-300"></div>
        
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <SafeImage
              src={getImageSrc(item)}
              alt={item.name || item.title}
              width={64}
              height={64}
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              fallbackSrc="/Apple.png"
            />
          </div>
          <h3 className="font-semibold text-accent group-hover:text-secondary transition-colors duration-300">
            {item.name || item.title}
          </h3>
        </div>
      </div>
    </Link>
  );

  return (
    <div className={`mb-16 ${className}`}>
      {title && (
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-secondary mb-4">{title}</h3>
          <p className="text-accent/80 max-w-2xl mx-auto">{description}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <MotionFade delay={0.15} immediate={true}>
          <div className={`grid ${gridCols} gap-6`}>
            {Array.from({ length: loadingCount }).map((_, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-md shadow hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col items-center justify-center">
                  <Skeleton className="w-16 h-16 rounded mb-4" />
                  <Skeleton className="w-20 h-4" />
                </div>
              </div>
            ))}
          </div>
        </MotionFade>
      )}

      {/* Items Grid */}
      {!isLoading && items.length > 0 && (
        <MotionFade delay={0.2} immediate={true}>
          <div className={`grid ${gridCols} gap-6`}>
            {items.map((item, index) => (
              <MotionFade key={item.id || index} delay={0.25 + index * 0.1} immediate={true}>
                {renderItem ? renderItem(item, index) : defaultRenderItem(item, index)}
              </MotionFade>
            ))}
          </div>
        </MotionFade>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <MotionFade delay={0.15} immediate={true}>
          <NotFound
            title={notFoundTitle}
            description={notFoundDescription}
            showSearch={!!searchTerm}
            searchTerm={searchTerm}
            onClearSearch={onClearSearch}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
          />
        </MotionFade>
      )}
    </div>
  );
}
