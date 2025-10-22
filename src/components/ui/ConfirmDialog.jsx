'use client';

import { useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './dialog';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Yes, delete it!",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-16 w-16 text-amber-500" />;
      case 'danger':
      default:
        return <AlertTriangle className="h-16 w-16 text-red-500" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-white';
      case 'danger':
      default:
        return 'bg-red-500 hover:bg-red-600 text-white';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex justify-center mb-4">
              {getIcon()}
            </div>
            <div className="text-xl font-bold text-gray-900 mb-3">
              {title}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed font-normal">
              {message}
            </p>
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 border-2 border-gray-300 hover:bg-gray-50 font-medium cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 ${getConfirmButtonStyle()} font-medium cursor-pointer transition-colors`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}