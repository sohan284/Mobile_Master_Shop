'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import logo from "@/assets/logoMlk.png";
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth');
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
      toast.error(t('pleaseEnterUsername'));
      setIsLoading(false);
      setIsSubmitting(false);
      return;
    }

    if (!password.trim()) {
      toast.error(t('pleaseEnterPassword'));
      setIsLoading(false);
      setIsSubmitting(false);
      return;
    }

    const loadingToast = toast.loading(t('signingYouIn'));

    try {
      console.log('Calling login API...');
      const result = await login(userName, password);
      console.log('Login result:', result);
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(t('welcomeBack'));
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
        const errorMessage = result.error || t('loginFailed');
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
      const errorMessage = error.response?.data?.message || error.message || t('loginFailedTryAgain');

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
    <div className="min-h-screen bg-primary flex pt-[10vh] justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="text-2xl font-bold text-center">
              <Link href="/">
                <Image className="cursor-pointer" src={logo} alt="MLKPHONE" width={100} height={100} />
              </Link>
            </div>
          </div>

        </div>

        {/* Login Form */}
        <div className="bg-gradient-to-br from-gray-100/40 to-gray-300/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/20 p-8">
          <div className="space-y-6" role="form" aria-label="Login form">
            {/* Username or Email Field */}
            <h1 className="text-3xl font-bold text-secondary mb-2">{t('login')}</h1>
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-600 mb-2">
                {t('usernameOrEmail')}
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-secondary placeholder:text-gray-400"
                  placeholder={t('enterUsernameOrEmail')}
                  autoComplete="off"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {t('canUseEither')}
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
                {t('password')}
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
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-secondary placeholder:text-gray-400"
                  placeholder={t('enterPassword')}
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
              className="w-full bg-secondary cursor-pointer text-primary py-3 px-4 rounded-xl font-semibold hover:bg-secondary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              ) : (
                t('signIn')
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {t('dontHaveAccount')}{' '}
              <button
                onClick={() => router.push('/signup')}
                className="text-secondary hover:text-secondary/80 font-medium transition-colors cursor-pointer"
              >
                {t('createAccount')}
              </button>
            </p>
          </div>

          {/* Admin Access Info */}

        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm">
            {t('copyright')}
          </p>
        </div>
      </div>
    </div>
  );
}
