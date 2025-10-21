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
    background: #00bfb2;
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
        { id: 1, name: "iphone-11-noir.png", path: "/iphone-11-noir.png", price: 299 },
        { id: 2, name: "iPhone-12.png", path: "/iPhone-12.png", price: 399 },
        { id: 3, name: "iphone-13.png", path: "/iphone-13.png", price: 499 },
        { id: 4, name: "Iphone14.png", path: "/Iphone14.png", price: 599 },
        { id: 5, name: "Iphone14-Pro-Max.png", path: "/Iphone14-Pro-Max.png", price: 799 },
        { id: 6, name: "iphone-se-2020.png", path: "/iphone-se-2020.png", price: 199 },
        { id: 7, name: "iphone-xr.png", path: "/iphone-xr.png", price: 249 },
        { id: 8, name: "SAMSUNG_GalaxyS23Ultra.png", path: "/SAMSUNG_GalaxyS23Ultra.png", price: 899 },
        { id: 9, name: "samsung-galaxy-a40.png", path: "/samsung-galaxy-a40.png", price: 149 },
        { id: 10, name: "samsung-galaxy-s22.png", path: "/samsung-galaxy-s22.png", price: 699 }
    ];

    return (
        <div className=" py-16">
            <style dangerouslySetInnerHTML={{ __html: swiperStyles }} />
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                
                {/* Header Section */}
                <div className="text-center mb-12">
                    <MotionFade delay={0.02}>
                        <img src="/2.png" alt="Phone" className="w-16 sm:w-20 mx-auto mb-6" />
                    </MotionFade>
                    
                    <MotionFade delay={0.03}>
                        <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#6B7E8D] mb-6">
                            MLK New Phones
                        </h2>
                    </MotionFade>

                    <MotionFade delay={0.04}>
                        <div className="p-4 bg-[#6B7E8D] shadow-[10px_10px_0px_#a8c2d9] mb-6">
                            <p className="text-center text-lg max-w-3xl font-bold text-white">
                                New phones guaranteed for 24 months
                            </p>
                        </div>
                    </MotionFade>

                    <MotionFade delay={0.05}>
                        <p className="text-base sm:text-lg md:text-xl font-semibold text-center px-2 max-w-3xl leading-relaxed text-gray-800">
                            Discover our selection of new phones with a wide choice of Apple, Samsung, Xiaomi models… And much more!
                        </p>
                    </MotionFade>
                </div>

                {/* Products Swiper */}
                <MotionFade delay={0.1} className="relative">
                    <div className="mb-4">
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
                        {images.map(({ id, path, name, price }) => (
                            <SwiperSlide key={id}>
                                <Card className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-[#00bfb2] h-full overflow-hidden">
                                    <CardContent className="p-6 text-center h-full flex flex-col relative">
                                        {/* Premium badge */}
                                        <div className="absolute top-3 right-3 bg-[#00bfb2] text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                                            New Phone
                                        </div>
                                        
                                        <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 group-hover:from-[#00bfb2]/5 group-hover:to-[#00bfb2]/10 transition-all duration-500 relative overflow-hidden">
                                            {/* Subtle background pattern */}
                                            <div className="absolute inset-0 opacity-5">
                                                <div className="absolute top-2 left-2 w-8 h-8 bg-[#00bfb2] rounded-full"></div>
                                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#6B7E8D] rounded-full"></div>
                                            </div>
                                            <img
                                                src={path}
                                                alt={name}
                                                className="w-full h-36 object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
                                            />
                                        </div>
                                        
                                        <div className="flex-grow flex flex-col justify-between">
                                            <h3 className="font-bold text-lg text-[#6B7E8D] line-clamp-2 group-hover:text-[#00bfb2] transition-colors duration-300">
                                                {name.replace('.png', '').replace(/[-_]/g, ' ')}
                                            </h3>
                                            
                                            <div className="space-y-3">
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-600 mb-1">Starting from</p>
                                                    <p className="font-bold text-3xl text-[#00bfb2] mb-2">€{price}</p>
                                                </div>
                                                
                                                <div className="bg-gradient-to-r from-[#00bfb2]/10 to-[#6B7E8D]/10 text-[#6B7E8D] text-sm font-semibold px-4 py-2 rounded-full border border-[#00bfb2]/20">
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
                    <div className="absolute flex -top-12 right-0 justify-center items-center mt-2 ">
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

                {/* CTA Section */}
                <MotionFade delay={0.2}>
                    <div className="text-center">
                    <Link 
                        href='/phones' 
                        className=""
                    >
                        <CustomButton className="bg-primary text-secondary hover:bg-primary/90">
                        See All Phones
                        </CustomButton>
                    </Link>
                    </div>
                </MotionFade>
            </div>
        </div>
    );
}
