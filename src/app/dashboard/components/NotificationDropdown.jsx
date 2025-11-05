'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import ApiErrorMessage from '@/components/ui/ApiErrorMessage';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications from API
  const { data: notificationsData, isLoading, error, refetch } = useApiGet(
    ['notifications'],
    () => apiFetcher.get('/auth/webhook/stripe'),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Extract notifications from API response
  const notifications = Array.isArray(notificationsData?.data) ? notificationsData.data :
                       Array.isArray(notificationsData?.results) ? notificationsData.results :
                       Array.isArray(notificationsData) ? notificationsData :
                       [];

  // Count unread notifications (assuming they have an 'is_read' or 'read' field)
  const unreadCount = notifications.filter(notif => !notif.is_read && !notif.read).length;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      refetch(); // Refetch notifications when opening
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Icon Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 mr-3 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Close notifications"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="p-4">
                <ApiErrorMessage
                  error={error}
                  title="Failed to load notifications"
                  onRetry={() => refetch()}
                  retryLabel="Try Again"
                  size="compact"
                />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id || index}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.is_read && !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title || notification.type || 'Notification'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message || notification.description || notification.data || 'No message'}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(notification.created_at || notification.createdAt || notification.timestamp)}
                        </p>
                      </div>
                      {(!notification.is_read && !notification.read) && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

