"use client";
import React from "react";
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
        <div className="py-16 relative overflow-hidden">

            <style dangerouslySetInnerHTML={{ __html: swiperStyles }} />
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                
                {/* Header Section - Redesigned */}
                <HeroSection
                    title="Latest"
                    subtitle="Phones"
                    description="Discover our selection of new phones with a wide choice of Apple, Samsung, Xiaomi models and much more!"
                    image="/2.png"
                    imageAlt="New Phones"
                    badgeText="Premium New Phones"
                    ctaText="Browse All Phones"
                    ctaHref="/phones"
                    layout="image-left"
                />

                {/* Features Section */}
                <FeaturesSection
                    title="Why Choose Our New Phones?"
                    description="Premium quality phones with comprehensive warranty and support."
                    features={[
                        { title: "24 Month Warranty", description: "Full coverage for peace of mind", icon: "🛡️" },
                        { title: "Latest Models", description: "Brand new, never used", icon: "📱" },
                        { title: "Best Prices", description: "Competitive pricing guaranteed", icon: "💰" }
                    ]}
                />

                {/* Products Swiper - Redesigned */}
                <MotionFade delay={0.2} className="relative">
                    <div className="mb-4">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-primary mb-4">Featured New Phones</h3>
                            <p className="text-gray-600 max-w-2xl mx-auto">Handpicked selection of the latest smartphones from top brands.</p>
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
                                <Card className="group bg-white shadow-lg hover:shadow transition-all duration-500 border border-gray-200 hover:border-secondary/50 h-full overflow-hidden">
                                    <CardContent className="p-6 text-center h-full flex flex-col relative">
                                        {/* Brand Badge */}
                                        <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow">
                                            {brand}
                                        </div>
                                        
                                        {/* Condition Badge */}
                                        <div className="absolute top-3 right-3 bg-secondary text-primary text-xs font-bold px-2 py-1 rounded-full z-10 shadow">
                                            {condition}
                                        </div>
                                        
                                        <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-md p-6 group-hover:from-secondary/5 group-hover:to-primary/5 transition-all duration-500 relative overflow-hidden">
                                            {/* Subtle background pattern */}
                                            <div className="absolute inset-0 opacity-5">
                                                <div className="absolute top-2 left-2 w-8 h-8 bg-secondary rounded-full"></div>
                                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-primary rounded-full"></div>
                                            </div>
                                            <img
                                                src={path}
                                                alt={name}
                                                className="w-full h-36 object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
                                            />
                                        </div>
                                        
                                        <div className="flex-grow flex flex-col justify-between">
                                            <h3 className="font-bold text-lg text-primary line-clamp-2 group-hover:text-secondary transition-colors duration-300">
                                                {name.replace('.png', '').replace(/[-_]/g, ' ')}
                                            </h3>
                                            
                                            <div className="space-y-3">
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-600 mb-1">Starting from</p>
                                                    <p className="font-bold text-3xl text-secondary mb-2">€{price}</p>
                                                </div>
                                                
                                                <div className="bg-gradient-to-r from-secondary/10 to-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full border border-secondary/20">
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
                        <button className="swiper-button-prev-custom cursor-pointer bg-transparent text-primary w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 group">
                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <div className="swiper-pagination-custom flex gap-3"></div>
                        
                        <button className="swiper-button-next-custom cursor-pointer bg-transparent text-primary w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 group">
                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    </div>
                </MotionFade>

                {/* CTA Section - Redesigned */}
                <CTASection
                    title="Ready to Get Your New Phone?"
                    description="Browse our complete collection of new smartphones with the best prices and warranty!"
                    primaryAction={{
                        text: "See All Phones",
                        href: "/phones"
                    }}
                    features={["Free Shipping", "24 Month Warranty", "Best Prices"]}
                />
            </div>
        </div>
    );
}
