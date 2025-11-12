'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { apiFetcher } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // mounted flag to trigger fast enter animations
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !validateEmail(formData.email) ||
      !formData.subject.trim() || !formData.message.trim()) {
      toast.error(t('fillAllFields') || 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(t('sending') || 'Sending message...');

    try {
      // Prepare the request body
      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      // Make POST request to auth/contact
      await apiFetcher.post('/auth/contact/', requestBody);

      toast.dismiss(loadingToast);
      toast.success(t('messageSent') || 'Message sent successfully!');

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.message || error.message || t('messageFailed') || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('address'),
      content: 'MLKPHONE\n11 Avenue of Marshal de Lattre de Tassigny\n88000 Épinal',
      color: 'from-blue-500/20 to-blue-600/20',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      icon: Phone,
      title: t('phone'),
      content: '+33 06 46 08 53 80',
      color: 'from-green-500/20 to-green-600/20',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-400',
    },
    {
      icon: Mail,
      title: t('email'),
      content: 'mlkphone.88000@gmail.com',
      color: 'from-purple-500/20 to-purple-600/20',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
    {
      icon: Clock,
      title: t('businessHours'),
      content: 'day',
      color: 'from-amber-500/20 to-amber-600/20',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
    },
  ];

  // helper classes for enter animation
  const baseEnter = "transform-gpu transition-all duration-500 ease-out motion-safe:";
  const heroAnim = mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4";
  const formAnim = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";
  const cardsAnim = mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95";

  return (
    <div className="min-h-screen bg-primary text-secondary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-14 left-1/4 w-96  h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        
        {/* Hero Section */}
        <div className={`${baseEnter} ${heroAnim} text-center mb-12 lg:mb-16`}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary backdrop-blur-sm border border-accent/20 mb-6">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight bg-secondary bg-clip-text text-transparent">
            {t('getInTouch')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('haveQuestions')}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:gap-12">
          
          {/* Left Side - Contact Form */}
          <div className={`max-w-2xl mx-auto w-full ${baseEnter} ${formAnim} delay-150`}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-accent/20 p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Send className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-secondary">Send us a Message</h2>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-secondary">
                      {t('name')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border-2 border-gray-400 rounded-xl text-secondary placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/50 transition-all duration-200 hover:bg-white/10"
                      placeholder={t('namePlaceholder')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-secondary">
                      {t('email')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border-2 border-gray-400 rounded-xl text-secondary placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/50 transition-all duration-200 hover:bg-white/10"
                      placeholder={t('emailPlaceholder')}
                      required
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-semibold text-secondary">
                    {t('subject')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border-2 border-gray-400 rounded-xl text-secondary placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/50 transition-all duration-200 hover:bg-white/10"
                    placeholder={t('howCanWeHelp')}
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-secondary">
                    {t('message')} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border-2 border-gray-400 rounded-xl text-secondary placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/50 transition-all duration-200 hover:bg-white/10 resize-none"
                    placeholder={t('tellUsMore')}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-secondary to-secondary/90 text-primary font-bold rounded-xl hover:from-secondary/90 hover:to-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform-gpu active:scale-95 shadow-lg shadow-secondary/20"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('sending')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t('sendMessage')}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Contact Information */}
          <div className={`${baseEnter} ${cardsAnim} delay-300  `}>
            <div className="space-y-6">
              <div className=" rounded-2xl  p-6 sm:p-8">
             
                <div className="space-y-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div 
                        key={info.title} 
                        className={`${baseEnter} ${cardsAnim}`}
                        style={{ transitionDelay: `${400 + index * 100}ms` }}
                      >
                        <div className={` backdrop-blur-sm rounded-xl p-5   hover:border-accent/40 transition-all duration-300 group`}>
                          <div className="flex items-start gap-4">
                            <div className={` w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-secondary mb-2 text-base">
                                {info.title}
                              </h3>
                              <div className="text-secondary/90 text-sm leading-relaxed">
                                {info.content === "day" ? (
                                  <div className="space-y-1">
                                    <p className="text-secondary/90">{t('monday')}: <span className="text-secondary">2-7 pm</span></p>
                                    <p className="text-secondary/90">{t('tuesday')} to {t('saturday')}: <span className="text-secondary">10 am-1 pm and 2-7 pm</span></p>
                                    <p className="text-secondary/90">{t('sunday')}: <span className="text-secondary">10 am-1 pm</span></p>
                                  </div>
                                ) : (
                                  <p className="whitespace-pre-line text-secondary/90">{info.content}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
