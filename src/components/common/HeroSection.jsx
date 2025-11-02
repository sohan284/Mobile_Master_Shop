"use client";
import React from 'react';
import SafeImage from '@/components/ui/SafeImage';
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
  const VisualComponent = () => {
    console.log('HeroSection - Image prop:', image);
    console.log('HeroSection - ImageAlt prop:', imageAlt);

    // align image center on small screens, on large screens position based on layout
    const justifyClass = layout === "image-left" ? "lg:justify-start" : "lg:justify-end";

    return (
      <MotionFade delay={0.06} immediate={true}>
        <div className={`relative flex justify-center ${justifyClass}`}>
          <div className="relative z-10">
            {image ? (
              <SafeImage
                src={image}
                alt={imageAlt || 'Hero image'}
                width={380}
                height={380}
                className="max-w-[380px] w-full h-auto mx-auto drop-shadow hover:scale-105 transition-transform duration-500 object-contain"
                fallbackSrc="/Apple.png"
              />
            ) : (
              <div className="max-w-[380px] w-full h-[240px] sm:h-[280px] md:h-[320px] lg:h-[380px] mx-auto bg-accent/20 rounded-lg flex items-center justify-center">
                <span className="text-accent/60 text-lg">No Image</span>
              </div>
            )}
          </div>
        </div>
      </MotionFade>
    );
  };

  const ContentComponent = () => (
    <div className="space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
      <MotionFade delay={0.02} immediate={true}>
        <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-semibold">
          <span className="w-2 h-2 bg-secondary text-secondary rounded-full animate-pulse"></span>
          {badgeText}
        </div>
      </MotionFade>

      <MotionFade delay={0.03} immediate={true}>
        <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-accent leading-tight">
          {title} <span className="text-secondary relative block lg:inline">
            {subtitle}
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary/30" viewBox="0 0 200 12" fill="none" aria-hidden="true">
              <path d="M2 6C2 6 50 2 100 6C150 10 198 6 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
      </MotionFade>

      <MotionFade delay={0.04} immediate={true}>
        <p className="text-lg sm:text-xl text-accent/80 leading-relaxed max-w-lg">
          {description}
        </p>
      </MotionFade>

      <MotionFade delay={0.05} immediate={true}>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
          {showBackButton && (
            <Link href={backButtonHref}>
              <CustomButton className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-6 sm:px-8 py-3 sm:py-4 font-bold shadow hover:shadow-lg transition-all duration-300 cursor-pointer">
                {backButtonText}
              </CustomButton>
            </Link>
          )}
          {ctaText && ctaHref && (
            <Link href={ctaHref}>
              <CustomButton className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-6 sm:px-8 py-3 sm:py-4 font-bold shadow hover:shadow-lg transition-all duration-300 cursor-pointer">
                {ctaText}
              </CustomButton>
            </Link>
          )}
        </div>
      </MotionFade>
    </div>
  );

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
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
