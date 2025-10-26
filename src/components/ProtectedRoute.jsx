'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAccess = () => {
      if (!loading) {
        if (!isAuthenticated()) {
          router.push('/login');
        } else if (requireAdmin && !isAdmin()) {
          // If admin access is required but user is not admin, redirect to home
          router.push('/');
        }
      }
    };

    checkAccess();
  }, [isAuthenticated, isAdmin, loading, router, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
