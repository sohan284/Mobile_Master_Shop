'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Instagram, Linkedin, Facebook } from 'lucide-react';

export default function ContactPage() {
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
      alert('Please fill in all fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Message sent successfully! We will get back to you soon.');
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: 'Repair Paris, France',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+33 1 XX XX XX XX',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@mlkphone.com',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon - Sat: 9:00 AM - 7:00 PM',
    },
  ];

  // helper classes for enter animation (fast durations)
  const baseEnter = "transform-gpu transition-all duration-300 ease-out motion-safe:";
  const heroAnim = mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3";
  const formAnim = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2";
  const cardsAnim = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1";

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        {/* Hero Section */}
        <div className={`${baseEnter} ${heroAnim} delay-75 text-center mb-20`}>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
          </p>
        </div>

        {/* Contact Form - Centered */}
        <div className={`max-w-2xl mx-auto mb-20 ${baseEnter} ${formAnim} delay-150`}>
          <div className="space-y-6">
            
            {/* Name & Email Row */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 transform-gpu hover:scale-[1.01]"
                  placeholder="John Doe"
                />
              </div>

              <div className="flex-1">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 transform-gpu hover:scale-[1.01]"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 transform-gpu hover:scale-[1.01]"
                placeholder="How can we help?"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 transform-gpu hover:scale-[1.01] resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="cursor-pointer w-full px-8 py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform-gpu active:scale-95"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </div>

        {/* Contact Info - Below Form */}
        <div className={`max-w-4xl mx-auto ${baseEnter} ${cardsAnim} delay-200`}>
          
          {/* Contact Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.title} className="flex flex-col items-center text-center group">
                  <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-amber-500/10 transition-colors duration-200 mb-3 transform-gpu group-hover:scale-105">
                    <Icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-semibold text-white mb-1 text-sm">
                    {info.title}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {info.content}
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