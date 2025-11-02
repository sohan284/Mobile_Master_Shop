'use client';
import React, { useState, useRef, useEffect } from 'react';
import { X, Mail, RotateCcw } from 'lucide-react';
import { verifyOTP, sendOTP } from '@/lib/api.js';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function OTPVerificationPopup({ email, onVerified, onClose }) {
  const t = useTranslations('auth');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error(t('pleaseEnterCompleteCode'));
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading(t('verifyingCode'));

    try {
      await verifyOTP(email, otpCode);
      toast.dismiss(loadingToast);
      onVerified();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || t('invalidVerificationCode'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading(t('resendingCode'));
    
    try {
      await sendOTP(email);
      toast.dismiss(loadingToast);
      toast.success(t('newCodeSent'));
      setTimeLeft(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || t('failedToSendOTP'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[75]">
      <div className="bg-[#39404D] backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-secondary rounded-full p-2 mr-3">
              <Mail className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-accent">{t('verifyEmail')}</h2>
              <p className="text-sm text-accent/80">{t('enterCodeSentToEmail')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-accent/60 hover:text-accent transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Email Display */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6">
          <p className="text-sm text-accent/80">{t('codeSentTo')}</p>
          <p className="font-medium text-accent">{email}</p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-accent mb-3">
              {t('enter6DigitCode')}
            </label>
            <div className="flex space-x-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-bold border border-accent/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/5 text-accent"
                />
              ))}
            </div>
          </div>

          {/* Resend Code */}
          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="text-secondary hover:text-secondary/80 font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RotateCcw size={16} className="inline mr-1" />
                {t('resendCode')}
              </button>
            ) : (
              <p className="text-accent/60 text-sm cursor-pointer">
                {t('resendCodeIn', { seconds: timeLeft })}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full cursor-pointer bg-secondary text-primary py-3 px-4 rounded-xl font-semibold hover:bg-secondary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            ) : (
              t('verifyCode')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
