'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ApiErrorMessage({ 
  error, 
  title = 'Error Loading Data',
  onRetry,
  retryLabel = 'Try Again',
  showReload = false,
  className = '',
  size = 'default', // 'default' or 'compact'
  showGoBack = false,
}) {
  const router = useRouter();
  if (!error) return null;

  // Extract error message from various possible locations
  const getErrorMessage = () => {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.detail) return error.response.data.detail;
    if (error.response?.data?.error) return error.response.data.error;
    if (error.message) return error.message;
    return 'An error occurred. Please try again.';
  };

  const errorMessage = getErrorMessage();
  const statusCode = error.response?.status;

  // Size variants
  const isCompact = size === 'compact';
  const iconSize = isCompact ? 'w-6 h-6' : 'w-8 h-8';
  const containerSize = isCompact ? 'w-12 h-12' : 'w-16 h-16';
  const titleSize = isCompact ? 'text-base' : 'text-lg';
  const messageSize = isCompact ? 'text-xs' : 'text-sm';
  const padding = isCompact ? 'p-4' : 'p-8';

  return (
    <div className={`${padding} h-full flex items-center justify-center text-center bg-white rounded-lg shadow-sm border border-red-200 ${className}`}>
      <div className="flex flex-col items-center justify-center text-center max-w-md">
        {/* Error Icon */}
        <div className={`${containerSize} bg-red-100 rounded-full flex items-center justify-center mb-4`}>
          <AlertCircle className={`${iconSize} text-red-600`} />
        </div>

        {/* Error Title */}
        <h3 className={`${titleSize} font-semibold text-gray-900 mb-2`}>
          {title}
        </h3>

        {/* Error Message */}
        <p className={`${messageSize} text-red-600 mb-4`}>
          {errorMessage}
        </p>

        {/* Status Code (if available) */}
        {statusCode && (
          <p className={`text-xs text-gray-500 mb-4`}>
            Status Code: {statusCode}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {retryLabel}
            </button>
          )}
          {showReload && (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reload Page
            </button>
          )}
          {showGoBack && (
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

