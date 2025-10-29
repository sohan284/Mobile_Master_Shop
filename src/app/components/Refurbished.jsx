'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button, CustomButton } from '@/components/ui/button';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import MotionFade from '@/components/animations/MotionFade';
import HeroSection from '@/components/common/HeroSection';
import FeaturesSection from '@/components/common/FeaturesSection';
import CTASection from '@/components/common/CTASection';
import Image from 'next/image';
import { Shield, Smartphone, TrendingDown } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';

// Custom styles for swiper
const swiperStyles = `
  .swiper {
    padding: 20px 0 40px 0;
  }
  .swiper-pagination-custom .swiper-pagination-bullet {
    opacity: 0.3;
    width: 12px;
    height: 12px;
    margin: 0 6px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
  .swiper-pagination-custom .swiper-pagination-bullet-active {
    background: #F3CBA5;
    opacity: 1;
  }
  .swiper-button-next-custom,
  .swiper-button-prev-custom {
    position: relative !important;
    margin: 0 !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    width: 48px !important;
    height: 48px !important;
    margin-top: 0 !important;
    transform: none !important;
  }
  .swiper-button-next-custom:after,
  .swiper-button-prev-custom:after {
    display: none;
  }
  .swiper-slide {
    height: auto;
  }
`;

export default function Refurbished() {
  const { data: modelsResponse, isLoading, error, refetch } = useApiGet(
    ['new-phone-models'],
    () => apiFetcher.get('/api/brandnew/models/')
  );
  const models = modelsResponse?.data || [];

  const images = [
    {
      id: 1,
      name: 'iphone-11-noir.png',
      path: '/iphone-11-noir.png',
      price: 299,
      brand: 'Apple',
      condition: 'Excellent',
    },
    {
      id: 2,
      name: 'iPhone-12.png',
      path: '/iPhone-12.png',
      price: 399,
      brand: 'Apple',
      condition: 'Like New',
    },
    {
      id: 3,
      name: 'iphone-13.png',
      path: '/iphone-13.png',
      price: 499,
      brand: 'Apple',
      condition: 'Excellent',
    },
    {
      id: 4,
      name: 'Iphone14.png',
      path: '/Iphone14.png',
      price: 599,
      brand: 'Apple',
      condition: 'Like New',
    },
    {
      id: 5,
      name: 'Iphone14-Pro-Max.png',
      path: '/Iphone14-Pro-Max.png',
      price: 799,
      brand: 'Apple',
      condition: 'Excellent',
    },
    {
      id: 6,
      name: 'iphone-se-2020.png',
      path: '/iphone-se-2020.png',
      price: 199,
      brand: 'Apple',
      condition: 'Good',
    },
    {
      id: 7,
      name: 'iphone-xr.png',
      path: '/iphone-xr.png',
      price: 249,
      brand: 'Apple',
      condition: 'Good',
    },
    {
      id: 8,
      name: 'SAMSUNG_GalaxyS23Ultra.png',
      path: '/SAMSUNG_GalaxyS23Ultra.png',
      price: 899,
      brand: 'Samsung',
      condition: 'Like New',
    },
    {
      id: 9,
      name: 'samsung-galaxy-a40.png',
      path: '/samsung-galaxy-a40.png',
      price: 149,
      brand: 'Samsung',
      condition: 'Good',
    },
    {
      id: 10,
      name: 'samsung-galaxy-s22.png',
      path: '/samsung-galaxy-s22.png',
      price: 699,
      brand: 'Samsung',
      condition: 'Excellent',
    },
  ];
  const features = [
    {
      title: '24 Month Warranty',
      description: 'Full coverage for peace of mind',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Latest Models',
      description: 'Brand new, never used',
      icon: Smartphone,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Best Prices',
      description: 'Competitive pricing guaranteed',
      icon: TrendingDown,
      gradient: 'from-green-500 to-emerald-500',
    },
  ];
  return (
    <div className="relative  text-white py-20 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: swiperStyles }} />
      <div className="container mx-auto px-4 z-10 relative">
        {/* Header Section - Banner Style */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold tracking-wider"
          >
            LATEST PHONES
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-gray-300"
          >
            Discover our selection of new phones with a wide choice of Apple,
            Samsung, Xiaomi models and much more!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex justify-center gap-4"
          >
            <Link href="/phones">
              <CustomButton className="bg-secondary text-primary hover:bg-secondary/90">
                Browse All Phones
              </CustomButton>
            </Link>
          </motion.div>
        </div>

        {/* Products Swiper - Banner Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="relative mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Featured New Phones</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Handpicked selection of the latest smartphones from top brands.
            </p>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            speed={800}
            loop={true}
            grabCursor={true}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination-custom',
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
            }}
            className="relative overflow-visible"
          >
            {models.map((model) => (
              <SwiperSlide key={model.id}>
                <Card className="group bg-white/10 /10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20 hover:border-secondary/50 h-full overflow-hidden">
                  <CardContent className="p-4 py-0 text-center h-full flex flex-col relative">
                    {/* Brand Badge */}
                    {/* <div className="absolute top-3 left-3 bg-secondary text-primary text-xs font-bold px-2 py-1 rounded-full z-10 shadow">
                                            {brand}
                                        </div> */}

                    {/* Condition Badge */}
                    <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow">
                                            New
                                        </div>

                    <div className="mb-4 bg-gradient-to-br from-white/10 to-white/5 rounded-md p-2 group-hover:from-secondary/20 group-hover:to-primary/20 transition-all duration-500 relative overflow-hidden">
                      {/* Subtle background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-2 left-2 w-8 h-8 bg-secondary rounded-full"></div>
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-primary rounded-full"></div>
                      </div>
                      <div className='flex justify-center items-center'>
                  
                           <Image
                                                width={400}
                                                height={400}
                                                src={model.icon}
                                                alt={model.name}
                                                className="w-full rounded-md object-contain group-hover:scale-110 transition-transform duration-500"
                                            />
                      </div>
                    </div>

                    <div className="flex-grow flex flex-col justify-between">
                      <h3 className="font-bold text-lg text-white group-hover:text-secondary transition-colors duration-300">
                        {model.name.replace('.png', '').replace(/[-_]/g, ' ')}
                      </h3>

                      <div className="space-y-2">
                        <div className="text-center">
                          <p className="text-sm text-gray-300 mb-1">
                            Starting from
                          </p>
                          <p className="font-bold text-3xl text-secondary mb-2">
                              €{model.main_amount}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-secondary/20 to-primary/20 text-white text-sm font-semibold px-4 py-2 rounded-full border border-secondary/30">
                          {model.warranty} Month Warranty
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <div className="absolute top-24 md:top-16 right-0 flex gap-2">
            <button className="swiper-button-prev-custom cursor-pointer bg-white/10 /10 backdrop-blur-sm text-white w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 hover:bg-secondary group">
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button className="swiper-button-next-custom cursor-pointer bg-white/10 /10 backdrop-blur-sm text-white w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 hover:bg-secondary group">
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Features Section - Banner Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-white">Why Choose Our New Phones?</h3>
            <p className="text-gray-300 text-lg">Premium quality phones with comprehensive warranty and support.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>

                    {/* Icon container with gradient background */}
                    <div className="relative mb-6 inline-flex">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`}></div>
                      <div className={`relative bg-gradient-to-br ${feature.gradient} p-4 rounded-2xl shadow-lg`}>
                        <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                      </div>
                    </div>

                    <h4 className="text-xl font-bold mb-3 text-white">{feature.title}</h4>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
