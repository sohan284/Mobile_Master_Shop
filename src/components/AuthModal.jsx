'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import logo from "@/assets/mlkLogo.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OTPVerificationPopup from '@/app/signup/components/OTPVerificationPopup';
import CredentialsSetupPopup from '@/app/signup/components/CredentialsSetupPopup';

const AuthModal = ({ isOpen, onClose, onSuccess, redirectPath }) => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const [showCredentialsPopup, setShowCredentialsPopup] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleClose = () => {
    setActiveTab('login');
    setUserName('');
    setPassword('');
    setEmail('');
    setShowPassword(false);
    setIsLoading(false);
    setIsSubmitting(false);
    setShowOTPPopup(false);
    setShowCredentialsPopup(false);
    onClose();
  };

  const handleLogin = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isSubmitting || isLoading) return;
    
    setIsSubmitting(true);
    setIsLoading(true);

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
      const result = await login(userName, password);
      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success('Welcome back!');
        handleClose();
        if (onSuccess) {
          onSuccess(result.user);
        }
        if (redirectPath) {
          router.push(redirectPath);
        }
      } else {
        const errorMessage = result.error || 'Login failed. Please check your credentials.';
        toast.error(errorMessage, {
          duration: 5000,
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
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      toast.error(errorMessage, {
        duration: 5000,
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

  const handleSignup = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isSubmitting || isLoading) return;
    
    setIsSubmitting(true);
    setIsLoading(true);

    if (!email.trim()) {
      toast.error('Please enter your email');
      setIsLoading(false);
      setIsSubmitting(false);
      return;
    }

    const loadingToast = toast.loading('Sending verification code...');

    try {
      // Import sendOTP function
      const { sendOTP } = await import('@/lib/api');
      
      // Send OTP to email
      await sendOTP(email);
      
      toast.dismiss(loadingToast);
      toast.success('Verification code sent to your email!');
      
      // Store email for OTP verification
      sessionStorage.setItem('signupEmail', email);
      
      // Close main modal and show OTP popup
      setShowOTPPopup(true);
      // Close the main AuthModal by setting isOpen to false
      onClose();
      
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send verification code. Please try again.';
      toast.error(errorMessage, {
        duration: 5000,
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

  const handleOTPVerified = () => {
    setShowOTPPopup(false);
    setShowCredentialsPopup(true);
  };

  const handleCredentialsSubmitted = () => {
    setShowCredentialsPopup(false);
    // Reset form and show login tab
    setActiveTab('login');
    setUserName(email); // Pre-fill with email for login
    setPassword('');
    setEmail('');
    setShowPassword(false);
    setIsLoading(false);
    setIsSubmitting(false);
    
    // Show success message and prompt for login
    toast.success('Account created successfully! Please login to continue.');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src={logo} 
                alt="Logo" 
                width={60} 
                height={60}
                className="rounded-full bg-primary/10 p-2"
              />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {activeTab === 'login' ? 'Login' : 'Sign Up'}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6" role="form" aria-label={`${activeTab} form`}>
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin}>
                {/* Username or Email Field */}
                <div>
                  <label htmlFor="modal-userName" className="block text-sm font-medium text-gray-700 mb-2">
                    Username or Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="modal-userName"
                      name="login-username"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="modal-password"
                      name="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    e.preventDefault();
                    e.stopPropagation();
                    handleLogin(e);
                  }}
                  disabled={isLoading || isSubmitting}
                  className="w-full mt-4 bg-primary/90 cursor-pointer text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary/95 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup}>
                {/* Email Field */}
                <div>
                  <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="modal-email"
                      name="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSignup(e)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your email address"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    We'll send you a verification code
                  </p>
                </div>

                {/* Signup Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSignup(e);
                  }}
                  disabled={isLoading || isSubmitting}
                  className="w-full mt-4 bg-primary/90 cursor-pointer text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary/95 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Send Verification Code'
                  )}
                </button>
              </form>
            )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {activeTab === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setActiveTab('signup')}
                    className="text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                  >
                    Create Account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </DialogContent>
      
      {/* OTP Verification Popup - Higher z-index */}
      {showOTPPopup && (
        <div className="fixed inset-0 z-[70]">
          <OTPVerificationPopup
            email={email}
            onVerified={handleOTPVerified}
            onClose={() => {
              setShowOTPPopup(false);
              // Reopen main modal if user closes OTP popup
              if (isOpen) {
                onClose();
              }
            }}
          />
        </div>
      )}
      
      {/* Credentials Setup Popup - Highest z-index */}
      {showCredentialsPopup && (
        <div className="fixed inset-0 z-[80]">
          <CredentialsSetupPopup
            email={email}
            onSubmit={handleCredentialsSubmitted}
            onClose={() => setShowCredentialsPopup(false)}
          />
        </div>
      )}
    </Dialog>
  );
};

export default AuthModal;
