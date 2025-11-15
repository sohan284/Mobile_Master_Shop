'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, logoutUser } from '@/lib/api.js';

// Simple encryption/decryption for user data security
const encryptData = (data) => {
  const key = 'mlkPhone2024';
  const encrypted = btoa(JSON.stringify(data) + key);
  return encrypted;
};

const decryptData = (encryptedData) => {
  try {
    const key = 'mlkPhone2024';
    const decrypted = atob(encryptedData);
    const dataString = decrypted.replace(key, '');
    return JSON.parse(dataString);
  } catch {
    return null;
  }
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on app load
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const encryptedUserData = localStorage.getItem('userData');
      
      if (token && encryptedUserData) {
        try {
          const decryptedUser = decryptData(encryptedUserData);
          
          if (!decryptedUser) {
            // Data tampered or corrupted, clear auth data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setUser(null);
            return;
          }
          
          setUser({ 
            authenticated: true, 
            ...decryptedUser,
            role: decryptedUser.role || 'user',
            email: decryptedUser.email,
            name: decryptedUser.name || decryptedUser.username
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid data
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (userName, password) => {
    try {
      setLoading(true);
      
      // Create credentials object with email_or_username field
      const credentials = { 
        email_or_username: userName, 
        password: password 
      };
      
      // Make API call to auth/login endpoint
      const response = await loginUser(credentials);
      
      // Handle different response formats
   
      const authToken = response?.tokens?.access || response.access_token || response.data?.token;
      const userData = response.user || response.data?.user;
      
      if (authToken && userData) {
        const encryptedUserData = encryptData(userData);
        
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userData', encryptedUserData);
        
        setUser({ 
          authenticated: true, 
          ...userData,
          role: userData.role || 'user',
          email: userData.email,
          name: userData.name || userData.username
        });
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           error.response.data?.detail ||
                           error.response.data?.non_field_errors?.[0] ||
                           `Login failed (${error.response.status})`;
        return { success: false, error: errorMessage };
      } else if (error.request) {
        // Network error
        return { success: false, error: 'Network error. Please check your connection.' };
      } else {
        // Other error
        return { success: false, error: error.message || 'Login failed. Please try again.' };
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API endpoint
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local storage and state
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      router.push('/login');
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const getUserRole = () => {
    return user?.role || 'user';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    getUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
