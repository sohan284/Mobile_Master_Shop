"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MotionFade from '@/components/animations/MotionFade';
import { CustomButton } from '@/components/ui/button';

export default function HeroSection({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  ctaText,
  ctaHref,
  badgeText,
  showBackButton = false,
  backButtonText = "← Back",
  backButtonHref = "/repair",
  layout = "image-left" // "image-left" or "content-left"
}) {
  const VisualComponent = () => (
    <MotionFade delay={0.06} immediate={true}>
      <div className="relative">
        <div className="relative z-10">
          <Image 
            src={image} 
            alt={imageAlt} 
            width={100} 
            height={80} 
            className="w-full max-w-xs mx-auto drop-shadow hover:scale-105 transition-transform duration-500" 
          />
        </div>
        {/* Floating Elements */}
        <div className="absolute top-10 -left-4 w-20 h-20 bg-secondary/30 rounded-full blur animate-bounce"></div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary/30 rounded-full blur animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/4 -right-8 w-12 h-12 bg-secondary/25 rounded-full blur animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute -top-8 right-1/4 w-8 h-8 bg-primary/25 rounded-full blur animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/4 -left-8 w-10 h-10 bg-secondary/20 rounded-full blur animate-bounce" style={{animationDelay: '1.5s'}}></div>
        
        {/* Additional floating particles */}
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-secondary/40 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-primary/40 rounded-full animate-ping" style={{animationDelay: '1.3s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-secondary/50 rounded-full animate-ping" style={{animationDelay: '2.3s'}}></div>
        <div className="absolute bottom-2/3 left-1/3 w-1 h-1 bg-primary/50 rounded-full animate-ping" style={{animationDelay: '3.3s'}}></div>
      </div>
    </MotionFade>
  );

  const ContentComponent = () => (
    <div className="space-y-8">
      <MotionFade delay={0.02} immediate={true}>
        <div className="inline-flex items-center gap-2 bg-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
          <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
          {badgeText}
        </div>
      </MotionFade>

      <MotionFade delay={0.03} immediate={true}>
        <h1 className="font-extrabold text-5xl lg:text-7xl text-primary leading-tight">
          {title} <span className="text-secondary relative">
            {subtitle}
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary/30" viewBox="0 0 200 12" fill="none">
              <path d="M2 6C2 6 50 2 100 6C150 10 198 6 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </span>
        </h1>
      </MotionFade>

      <MotionFade delay={0.04} immediate={true}>
        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
          {description}
        </p>
      </MotionFade>

      <MotionFade delay={0.05} immediate={true}>
        <div className="flex flex-col sm:flex-row gap-4">
          {showBackButton && (
            <Link href={backButtonHref}>
              <CustomButton className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-4 font-bold shadow hover:shadow-lg transition-all duration-300 cursor-pointer">
                {backButtonText}
              </CustomButton>
            </Link>
          )}
          {ctaText && ctaHref && (
            <Link href={ctaHref}>
              <CustomButton className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-4 font-bold shadow hover:shadow-lg transition-all duration-300 cursor-pointer">
                {ctaText}
              </CustomButton>
            </Link>
          )}
        </div>
      </MotionFade>
    </div>
  );

  return (
    <div className="relative mb-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {layout === "image-left" ? (
          <>
            <VisualComponent />
            <ContentComponent />
          </>
        ) : (
          <>
            <ContentComponent />
            <VisualComponent />
          </>
        )}
      </div>
    </div>
  );
}
