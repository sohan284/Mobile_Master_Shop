'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import logo from "@/assets/mlkLogo.png";
import OTPVerificationPopup from './components/OTPVerificationPopup';
import CredentialsSetupPopup from './components/CredentialsSetupPopup';
import { sendOTP } from '@/lib/api.js';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const [showCredentialsPopup, setShowCredentialsPopup] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const router = useRouter();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Sending verification code...');
    
    try {
      await sendOTP(email);
      toast.dismiss(loadingToast);
      toast.success('Verification code sent to your email!');
      setUserEmail(email);
      setShowOTPPopup(true);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerified = () => {
    toast.success('Email verified successfully!');
    setShowOTPPopup(false);
    setShowCredentialsPopup(true);
  };

  const handleCredentialsSubmitted = () => {
    toast.success('Account created successfully! Redirecting to login...');
    setShowCredentialsPopup(false);
    setTimeout(() => {
      router.push('/login');
    }, 1500);
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

        {/* Signup Form */}
        <div className="bg-white/10  rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" name="signup-form">
          <h1 className="text-3xl font-bold text-accent mb-2">Create Account</h1>
          <p className="text-secondary">Get started with your new account</p>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-accent mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" size={20} />
                <input
                  id="email"
                  name="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-accent/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/5 text-accent placeholder:text-accent/60"
                  placeholder="Enter your email address"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary cursor-pointer text-primary py-3 px-4 rounded-xl font-semibold hover:bg-secondary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              ) : (
                'Send Verification Code'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="flex items-center cursor-pointer justify-center text-accent hover:text-secondary transition-colors duration-200"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-secondary text-sm">
            © 2024 Mobile Shop Repair. All rights reserved.
          </p>
        </div>
      </div>

      {/* OTP Verification Popup */}
      {showOTPPopup && (
        <OTPVerificationPopup
          email={userEmail}
          onVerified={handleOTPVerified}
          onClose={() => setShowOTPPopup(false)}
        />
      )}

      {/* Credentials Setup Popup */}
      {showCredentialsPopup && (
        <CredentialsSetupPopup
          email={userEmail}
          onSubmit={handleCredentialsSubmitted}
          onClose={() => setShowCredentialsPopup(false)}
        />
      )}
    </div>
  );
}
