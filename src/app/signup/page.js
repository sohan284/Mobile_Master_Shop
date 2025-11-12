'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import logo from "@/assets/logoMlk.png";
import OTPVerificationPopup from './components/OTPVerificationPopup';
import CredentialsSetupPopup from './components/CredentialsSetupPopup';
import { sendOTP } from '@/lib/api.js';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function SignupPage() {
  const t = useTranslations('auth');
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
      toast.error(t('pleaseEnterEmail'));
      return;
    }

    if (!validateEmail(email)) {
      toast.error(t('pleaseEnterValidEmail'));
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading(t('sendingVerificationCode'));

    try {
      await sendOTP(email);
      toast.dismiss(loadingToast);
      toast.success(t('verificationCodeSent'));
      setUserEmail(email);
      setShowOTPPopup(true);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || t('failedToSendOTP'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerified = () => {
    toast.success(t('emailVerifiedSuccessfully'));
    setShowOTPPopup(false);
    setShowCredentialsPopup(true);
  };

  const handleCredentialsSubmitted = () => {
    toast.success(t('accountCreatedSuccessfully'));
    setShowCredentialsPopup(false);
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-primary flex pt-[10vh] justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/" className="group relative text-secondary">
              <Image className="cursor-pointer" src={logo} alt="MLKPHONE" width={100} height={100} />
            </Link>
          </div>

        </div>

        {/* Signup Form */}
        <div className="bg-gradient-to-br from-gray-100/40 to-gray-300/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" name="signup-form">
            <h1 className="text-3xl font-bold text-secondary mb-2">{t('createAccountTitle')}</h1>
            <p className="text-gray-600">{t('getStarted')}</p>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  name="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-secondary placeholder:text-gray-400"
                  placeholder={t('enterEmailAddress')}
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
                t('sendVerificationCode')
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="flex items-center cursor-pointer justify-center text-gray-600 hover:text-secondary transition-colors duration-200"
            >
              <ArrowLeft size={16} className="mr-2" />
              {t('backToLogin')}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {t('copyright')}
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
