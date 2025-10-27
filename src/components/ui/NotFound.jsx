import React from 'react';
import Link from 'next/link';

const NotFound = ({ 
  title = "No Items Found", 
  description = "We couldn't find any items matching your search.",
  showSearch = false,
  searchTerm = "",
  onClearSearch = () => {},
  primaryAction = null,
  secondaryAction = null,
  icon = null
}) => {
  return (
    <div className="text-center py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-1/4 w-20 h-20 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-16 h-16 bg-secondary/5 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/6 w-12 h-12 bg-primary/3 rounded-full blur-md animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 mb-6">
        {/* Animated Icon */}
        <div className="mx-auto w-32 h-32 mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br  from-secondary/20 to-secondary/40 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-secondary/20  rounded-full flex items-center justify-center shadow-lg">
            {icon || (
              <div className="relative">
                {/* Phone icon with pulse effect */}
                <svg className="w-16 h-16 text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {/* Warning icon in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
                  </svg>
                </div>
                {/* Floating particles with pulse effect */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-secondary rounded-full animate-pulse opacity-60"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-full animate-pulse opacity-40" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-1/2 -right-3 w-1 h-1 bg-secondary rounded-full animate-pulse opacity-30" style={{animationDelay: '1s'}}></div>
              </div>
            )}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-secondary mb-2">{title}</h3>
        
        {/* Description */}
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {description}
        </p>
        
        {/* Search Term Display */}
        {showSearch && searchTerm && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              No results found for <span className="font-medium text-gray-700">"{searchTerm}"</span>
            </p>
          </div>
        )}
        
        {/* Actions */}
        <div className="space-y-3">
          {/* Primary Action */}
          {primaryAction && (
            <div>
              {typeof primaryAction === 'object' && primaryAction.text ? (
                <Link 
                  href={primaryAction.href || '#'} 
                  onClick={primaryAction.onClick}
                  className="inline-block bg-secondary text-primary px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  {primaryAction.text}
                </Link>
              ) : (
                primaryAction
              )}
            </div>
          )}
          
          {/* Secondary Action */}
          {secondaryAction && (
            <div className="text-sm text-gray-500">
              {typeof secondaryAction === 'object' && secondaryAction.text ? (
                <Link 
                  href={secondaryAction.href || '#'} 
                  onClick={secondaryAction.onClick}
                  className="text-primary hover:text-primary/90 underline"
                >
                  {secondaryAction.text}
                </Link>
              ) : (
                secondaryAction
              )}
            </div>
          )}
          
          {/* Clear Search Button */}
          {showSearch && searchTerm && onClearSearch && (
            <button
              onClick={onClearSearch}
              className="text-primary hover:text-primary/90 underline text-sm"
            >
              Clear search
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
