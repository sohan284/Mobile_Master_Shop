'use client';
import React, { useState } from 'react';
import { X, Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
import { createAccount } from '@/lib/api.js';
import toast from 'react-hot-toast';

export default function CredentialsSetupPopup({ email, onSubmit, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = (username) => {
    if (username.length < 6) {
      return 'Username must be at least 3 characters long';
    }
    if (username.length > 20) {
      return 'Username must be less than 20 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
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
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Creating your account...');

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
      toast.error(error.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[85]">
      <div className="bg-[#39404D] backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-accent">Complete Your Account</h2>
            <p className="text-sm text-accent/80">Set up your username and password</p>
          </div>
          <button
            onClick={onClose}
            className="text-accent/60 hover:text-accent transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Email Display (Read-only) */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex items-center">
            <Mail className="text-accent/60 mr-2" size={16} />
            <div>
              <p className="text-sm text-accent/80">Email address</p>
              <p className="font-medium text-accent">{email}</p>
            </div>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" name="credentials-form">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-accent mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent/60" size={20} />
              <input
                id="username"
                name="credentials-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-accent/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/5 text-accent placeholder:text-accent/60"
                placeholder="Choose a username"
                autoComplete="off"
                required
              />
            </div>
            <p className="mt-1 text-xs text-accent/60">
              3-20 characters, letters, numbers, and underscores only
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-accent mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent/60" size={20} />
              <input
                id="password"
                name="credentials-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-accent/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/5 text-accent placeholder:text-accent/60"
                placeholder="Create a strong password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent/60 hover:text-accent"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-accent/60">
              At least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-accent mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent/60" size={20} />
              <input
                id="confirmPassword"
                name="credentials-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-accent/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/5 text-accent placeholder:text-accent/60"
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent/60 hover:text-accent"
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
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
