'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Linkedin } from 'lucide-react';
import { CustomButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import PageTransition from '@/components/animations/PageTransition';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!formData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Please enter your message');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Sending message...');

    try {
      // TODO: Replace with actual API endpoint when available
      // await apiFetcher.post('/api/contact/', formData);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.dismiss(loadingToast);
      toast.success('Message sent successfully! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: 'Repair Paris, France',
      link: '#',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+33 1 XX XX XX XX',
      link: 'tel:+331XXXXXXXX',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@mlkphone.com',
      link: 'mailto:contact@mlkphone.com',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon - Sat: 9:00 AM - 7:00 PM',
      link: '#',
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden bg-primary text-secondary">
        <div className="container mx-auto px-4 py-8">
          
          {/* Hero Section - Banner Style */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-extrabold tracking-wider text-white"
            >
              CONTACT US
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-lg md:text-xl text-gray-300"
            >
              Have a question or need assistance? We're here to help! Get in touch with us and we'll respond as soon as possible.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-white/20 hover:border-secondary/50 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white font-medium">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:border-secondary focus-visible:ring-secondary/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:border-secondary focus-visible:ring-secondary/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-white font-medium">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:border-secondary focus-visible:ring-secondary/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white font-medium">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:border-secondary focus-visible:ring-secondary/50 resize-none"
                      required
                    />
                  </div>

                  <CustomButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary text-primary hover:bg-secondary/90 font-semibold py-4 text-base"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </CustomButton>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="space-y-6"
            >
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-all duration-300 border border-white/20 hover:border-secondary/50 h-full">
                        <a
                          href={info.link}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 group"
                        >
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors duration-300">
                            <Icon className="h-6 w-6 text-secondary group-hover:text-white transition-colors duration-300" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1 group-hover:text-secondary transition-colors duration-300">
                              {info.title}
                            </h3>
                            <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                              {info.content}
                            </p>
                          </div>
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      aria-label="Instagram"
                      className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center hover:bg-secondary/30 transition-all duration-300 hover:scale-110 group"
                    >
                      <Instagram className="w-6 h-6 text-secondary group-hover:text-white transition-colors duration-300" />
                    </a>
                    <a
                      href="#"
                      aria-label="LinkedIn"
                      className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center hover:bg-secondary/30 transition-all duration-300 hover:scale-110 group"
                    >
                      <Linkedin className="w-6 h-6 text-secondary group-hover:text-white transition-colors duration-300" />
                    </a>
                    <a
                      href="#"
                      aria-label="Facebook"
                      className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center hover:bg-secondary/30 transition-all duration-300 hover:scale-110 group"
                    >
                      <Facebook className="w-6 h-6 text-secondary group-hover:text-white transition-colors duration-300" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

