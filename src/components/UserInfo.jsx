'use client';
import { useAuth } from '@/contexts/AuthContext';

const UserInfo = () => {
  const { user, isAdmin, getUserRole } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm text-gray-600">
        <div className="font-medium text-gray-900 capitalize">
          {user.name || user.username || user.email || 'User'}
        </div>
        <div className="text-xs text-gray-500 capitalize">
          {getUserRole()}
        </div>
      </div>
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          {(user.name || user.username || user.email || 'U').charAt(0).toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default UserInfo;
