'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import logo from "@/assets/mlkLogo.png";

export default function LoginPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Prevent page reload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handleKeyDown = (e) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // useEffect(() => {
  //   if (isAuthenticated()) {
  //     router.push('/dashboard');
  //   }
  // }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    console.log('Login attempt started');
    
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Prevent multiple submissions
    if (isSubmitting || isLoading) {
      return;
    }
    
    setIsSubmitting(true);
    setIsLoading(true);

    // Basic validation - check if input is not empty
    if (!userName.trim()) {
      toast.error('Please enter your username or email');
      setIsLoading(false);
      setIsSubmitting(false);
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter your password');
      setIsLoading(false);
      setIsSubmitting(false);
      return;
    }

    const loadingToast = toast.loading('Signing you in...');

    try {
      console.log('Calling login API...');
      const result = await login(userName, password);
      console.log('Login result:', result);
      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success('Welcome back! Redirecting ...');
        // Use setTimeout to ensure toast is visible before redirect
        setTimeout(() => {
          const user = result.user;
          if (user && user.role === 'admin') {
            router.push('/dashboard');
          } else {
            router.push('/');
          }
        }, 1000);
      } else {
        const errorMessage = result.error || 'Login failed. Please check your credentials.';
        console.log('Login failed:', errorMessage);
        
        toast.error(errorMessage, {
          duration: 5000, // 5 seconds
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            fontSize: '14px',
            padding: '12px 16px',
          }
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      
      // Show error toast with longer duration
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
     
      // Temporary alert to test if error is caught
      alert(`Login Error: ${errorMessage}`);
      
      toast.error(errorMessage, {
        duration: 5000, // 5 seconds
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '14px',
          padding: '12px 16px',
        }
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    } 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/80 via-primary/90 to-primary flex pt-[10vh] justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src={logo} 
              alt="Logo" 
              width={80} 
              height={80} 
              onClick={() => router.push('/')}
              className="rounded-full bg-white p-2 cursor-pointer"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-6" role="form" aria-label="Login form">
            {/* Username or Email Field */}
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="userName"
                  name="login-username"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B7E8D] focus:border-transparent"
                  placeholder="Enter your userName or email"
                  autoComplete="off"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                You can use either your userName or email address to sign in
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  name="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B7E8D] focus:border-transparent"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={(e) => {
                console.log('Button clicked');
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(e);
              }}
              disabled={isLoading || isSubmitting}
              className="w-full bg-primary/90 cursor-pointer text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary/95 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/signup')}
                className="text-[#6B7E8D] hover:text-[#0d416e] font-medium transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </p>
          </div>

          {/* Admin Access Info */}
         
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-secondary text-sm">
            © 2024 Mobile Shop Repair. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
