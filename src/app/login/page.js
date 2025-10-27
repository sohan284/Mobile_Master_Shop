'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import logo from "@/assets/mlkLogo.png";
import Link from 'next/link';

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
    <div className="min-h-screen bg-gradient-to-br from-primary/90 via-primary/95 to-primary flex pt-[10vh] justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
          <Link href="/" className="group relative text-secondary">
             <div className="flex items-center gap-2">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span className="text-xl font-semibold tracking-wide">MLKPHONE</span>
          </div>
          </Link>
          </div>
         
        </div>

        {/* Login Form */}
        <div className="bg-white/10  rounded-2xl shadow-2xl p-8">
          <div className="space-y-6" role="form" aria-label="Login form">
            {/* Username or Email Field */}
             <h1 className="text-3xl font-bold text-accent mb-2">Login</h1>
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-accent mb-2">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" size={20} />
                <input
                  id="userName"
                  name="login-username"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="w-full pl-10 pr-4 py-3 border border-accent/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/5 text-accent placeholder:text-accent/60"
                  placeholder="Enter your userName or email"
                  autoComplete="off"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-accent/80">
                You can use either your userName or email address to sign in
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-accent mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" size={20} />
                <input
                  id="password"
                  name="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="w-full pl-10 pr-12 py-3 border border-accent/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/5 text-accent placeholder:text-accent/60"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent hover:text-accent/80"
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
              className="w-full bg-secondary cursor-pointer text-primary py-3 px-4 rounded-xl font-semibold hover:bg-secondary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-accent text-sm">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/signup')}
                className="text-secondary hover:text-secondary/80 font-medium transition-colors cursor-pointer"
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
