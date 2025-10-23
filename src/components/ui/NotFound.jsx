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
    <div className="text-center py-12">
      <div className="mb-6">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {icon || (
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        
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
              {primaryAction}
            </div>
          )}
          
          {/* Secondary Action */}
          {secondaryAction && (
            <div className="text-sm text-gray-500">
              {secondaryAction}
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
