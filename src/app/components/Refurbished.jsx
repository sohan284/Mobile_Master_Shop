"use client";
import React from "react";
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button, CustomButton } from "@/components/ui/button";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import MotionFade from '@/components/animations/MotionFade';
import HeroSection from '@/components/common/HeroSection';
import FeaturesSection from '@/components/common/FeaturesSection';
import CTASection from '@/components/common/CTASection';
import Image from "next/image";

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
    const images = [
        { id: 1, name: "iphone-11-noir.png", path: "/iphone-11-noir.png", price: 299, brand: "Apple", condition: "Excellent" },
        { id: 2, name: "iPhone-12.png", path: "/iPhone-12.png", price: 399, brand: "Apple", condition: "Like New" },
        { id: 3, name: "iphone-13.png", path: "/iphone-13.png", price: 499, brand: "Apple", condition: "Excellent" },
        { id: 4, name: "Iphone14.png", path: "/Iphone14.png", price: 599, brand: "Apple", condition: "Like New" },
        { id: 5, name: "Iphone14-Pro-Max.png", path: "/Iphone14-Pro-Max.png", price: 799, brand: "Apple", condition: "Excellent" },
        { id: 6, name: "iphone-se-2020.png", path: "/iphone-se-2020.png", price: 199, brand: "Apple", condition: "Good" },
        { id: 7, name: "iphone-xr.png", path: "/iphone-xr.png", price: 249, brand: "Apple", condition: "Good" },
        { id: 8, name: "SAMSUNG_GalaxyS23Ultra.png", path: "/SAMSUNG_GalaxyS23Ultra.png", price: 899, brand: "Samsung", condition: "Like New" },
        { id: 9, name: "samsung-galaxy-a40.png", path: "/samsung-galaxy-a40.png", price: 149, brand: "Samsung", condition: "Good" },
        { id: 10, name: "samsung-galaxy-s22.png", path: "/samsung-galaxy-s22.png", price: 699, brand: "Samsung", condition: "Excellent" }
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
                        Discover our selection of new phones with a wide choice of Apple, Samsung, Xiaomi models and much more!
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
                        <p className="text-gray-300 max-w-2xl mx-auto">Handpicked selection of the latest smartphones from top brands.</p>
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
                        {images.map(({ id, path, name, price, brand, condition }) => (
                            <SwiperSlide key={id}>
                                <Card className="group bg-white/10 /10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20 hover:border-secondary/50 h-full overflow-hidden">
                                    <CardContent className="p-6 text-center h-full flex flex-col relative">
                                        {/* Brand Badge */}
                                        {/* <div className="absolute top-3 left-3 bg-secondary text-primary text-xs font-bold px-2 py-1 rounded-full z-10 shadow">
                                            {brand}
                                        </div> */}
                                        
                                        {/* Condition Badge */}
                                        {/* <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow">
                                            {condition}
                                        </div> */}
                                        
                                        <div className="mb-4 bg-gradient-to-br from-white/10 to-white/5 rounded-md p-2 group-hover:from-secondary/20 group-hover:to-primary/20 transition-all duration-500 relative overflow-hidden">
                                            {/* Subtle background pattern */}
                                            <div className="absolute inset-0 opacity-10">
                                                <div className="absolute top-2 left-2 w-8 h-8 bg-secondary rounded-full"></div>
                                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-primary rounded-full"></div>
                                            </div>
                                            <Image
                                                src={path}
                                                alt={name}
                                                width={160}
                                                height={160}
                                                // className="w-42 h-48 object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
                                            />
                                        </div>
                                        
                                        <div className="flex-grow flex flex-col justify-between">
                                            <h3 className="font-bold text-lg text-white group-hover:text-secondary transition-colors duration-300">
                                                {name.replace('.png', '').replace(/[-_]/g, ' ')}
                                            </h3>
                                            
                                            <div className="space-y-2">
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-300 mb-1">Starting from</p>
                                                    <p className="font-bold text-3xl text-secondary mb-2">€{price}</p>
                                                </div>
                                                
                                                <div className="bg-gradient-to-r from-secondary/20 to-primary/20 text-white text-sm font-semibold px-4 py-2 rounded-full border border-secondary/30">
                                                    24 Month Warranty
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation */}
                    <div className="absolute flex -top-12 right-0 justify-center items-center mt-2">
                        <button className="swiper-button-prev-custom cursor-pointer bg-white/10 /10 backdrop-blur-sm text-white w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 hover:bg-secondary group">
                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <div className="swiper-pagination-custom flex gap-3"></div>
                        
                        <button className="swiper-button-next-custom cursor-pointer bg-white/10 /10 backdrop-blur-sm text-white w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 hover:bg-secondary group">
                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
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
                        <h3 className="text-3xl font-bold mb-4">Why Choose Our New Phones?</h3>
                        <p className="text-gray-300 text-lg">Premium quality phones with comprehensive warranty and support.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "24 Month Warranty", description: "Full coverage for peace of mind", icon: "🛡️" },
                            { title: "Latest Models", description: "Brand new, never used", icon: "📱" },
                            { title: "Best Prices", description: "Competitive pricing guaranteed", icon: "💰" }
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                                <p className="text-gray-300">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
              
            </div>
        </div>
    );
}
