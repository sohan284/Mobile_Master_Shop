'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Instagram, Linkedin, Facebook } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // new: mounted flag to trigger fast enter animations
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // use requestAnimationFrame for immediate next-frame activation (perceived faster)
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
      alert(t('fillAllFields'));
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(t('messageSent'));

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

    } catch (error) {
      alert(t('messageFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('address'),
      content: 'MLKPHONE\n11 Avenue of Marshal de Lattre de Tassigny\n88000 Épinal',
    },
    {
      icon: Phone,
      title: t('phone'),
      content: '+33 06 46 08 53 80',
    },
    {
      icon: Mail,
      title: t('email'),
      content: 'mlkphone.88000@gmail.com',
    },
    {
      icon: Clock,
      title: t('businessHours'),
      content: 'day',
    },
  ];

  // helper classes for enter animation (fast durations)
  const baseEnter = "transform-gpu transition-all duration-300 ease-out motion-safe:";
  const heroAnim = mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3";
  const formAnim = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2";
  const cardsAnim = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1";

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6  py-16 sm:py-24">

        {/* Hero Section */}
        <div className={`${baseEnter} ${heroAnim} delay-75 text-center mb-20`}>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            {t('getInTouch')}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t('haveQuestions')}
          </p>
        </div>

        {/* Contact Form - Centered */}
        <div className={`max-w-2xl mx-auto mb-20 ${baseEnter} ${formAnim} delay-150`}>
          <div className="space-y-6">

            {/* Name & Email Row */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('name')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 transform-gpu hover:scale-[1.01]"
                  placeholder={t('namePlaceholder')}
                />
              </div>

              <div className="flex-1">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 transform-gpu hover:scale-[1.01]"
                  placeholder={t('emailPlaceholder')}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                {t('subject')}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 transform-gpu hover:scale-[1.01]"
                placeholder={t('howCanWeHelp')}
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                {t('message')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 transform-gpu hover:scale-[1.01] resize-none"
                placeholder={t('tellUsMore')}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="cursor-pointer w-full px-8 py-3 bg-white/90 text-slate-900 hover:text-white font-semibold rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform-gpu active:scale-95"
            >
              {isSubmitting ? (
                t('sending')
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t('sendMessage')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Contact Info - Below Form */}
        <div className={` mx-auto ${baseEnter} ${cardsAnim} delay-200`}>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.title} className="flex flex-col items-center text-center group">
                  <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-white/15 transition-colors duration-200 mb-3 transform-gpu group-hover:scale-105">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-white mb-1 text-sm">
                    {info.title}
                  </h3>
                  <p className="text-slate-400 text-sm whitespace-pre-line leading-relaxed">
                    {info.content === "day" ? <div className="flex flex-col gap-2">
                      <p className="text-slate-400 text-nowrap">{t('monday')} : 2-7 pm</p>
                      <p className="text-slate-400 text-nowrap">{t('tuesday')} to {t('saturday')}: </p>
                      <p>10 am-1 pm and 2-7 pm</p>
                      <p className="text-slate-400 text-nowrap">{t('sunday')} : 10 am-1 pm</p>
                    </div> : info.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}