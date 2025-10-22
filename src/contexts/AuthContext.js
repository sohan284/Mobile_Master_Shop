'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, logoutUser } from '@/lib/api.js';

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
      
      if (token) {
        // Set a basic user object since we only have the token
        setUser({ authenticated: true });
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
      console.log(response)
      const authToken = response?.tokens?.access || response.access_token || response.data?.token;
      if (authToken) {
        localStorage.setItem('authToken', authToken);
        
        // Set a basic user object since we only have the token
        setUser({ authenticated: true });
        return { success: true };
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
      setUser(null);
      router.push('/login');
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
