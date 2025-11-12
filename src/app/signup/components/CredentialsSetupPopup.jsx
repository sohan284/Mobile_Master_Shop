'use client';
import React, { useState } from 'react';
import { X, Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
import { createAccount } from '@/lib/api.js';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function CredentialsSetupPopup({ email, onSubmit, onClose }) {
  const t = useTranslations('auth');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = (username) => {
    if (username.length < 3) {
      return t('usernameMustBeAtLeast');
    }
    if (username.length > 20) {
      return t('usernameMustBeLessThan');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return t('usernameOnlyLettersNumbers');
    }
    return null;
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return t('passwordMustBeAtLeast');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return t('passwordMustContainLowercase');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return t('passwordMustContainUppercase');
    }
    if (!/(?=.*\d)/.test(password)) {
      return t('passwordMustContainNumber');
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate username
    const usernameError = validateUsername(username);
    if (usernameError) {
      toast.error(usernameError);
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading(t('creatingYourAccount'));

    try {
      await createAccount({
        email,
        username,
        password
      });
      toast.dismiss(loadingToast);
      onSubmit();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || t('failedToCreateAccount'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[85]">
      <div className="bg-white backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-300 p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-secondary">{t('completeYourAccount')}</h2>
            <p className="text-sm text-gray-600">{t('setUpUsernamePassword')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Email Display (Read-only) */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center">
            <Mail className="text-gray-400 mr-2" size={16} />
            <div>
              <p className="text-sm text-gray-600">{t('emailAddressLabel')}</p>
              <p className="font-medium text-secondary">{email}</p>
            </div>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" name="credentials-form">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-2">
              {t('username')}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="username"
                name="credentials-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-secondary placeholder:text-gray-400"
                placeholder={t('chooseUsername')}
                autoComplete="off"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {t('usernameRequirements')}
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
                name="credentials-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-secondary placeholder:text-gray-400"
                placeholder={t('createStrongPassword')}
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
            <p className="mt-1 text-xs text-gray-500">
              {t('passwordRequirements')}
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-2">
              {t('confirmPassword')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="confirmPassword"
                name="credentials-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-secondary placeholder:text-gray-400"
                placeholder={t('confirmYourPassword')}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-secondary text-primary py-3 px-4 rounded-xl font-semibold hover:bg-secondary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            ) : (
              t('createAccount')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
