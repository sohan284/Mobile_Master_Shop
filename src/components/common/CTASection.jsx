"use client";
import React from 'react';
import Link from 'next/link';
import MotionFade from '@/components/animations/MotionFade';
import { CustomButton } from '@/components/ui/button';

export default function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
  features = [],
  className = ""
}) {
  return (
    <MotionFade delay={0.4}>
      <div className={`relative ${className}`}>
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-md p-12 shadow relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-32 h-32 bg-secondary rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-white rounded-full blur-xl"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
            <p className="text-white/90 mb-8 text-lg">{description}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryAction && (
                <Link href={primaryAction.href}>
                  <CustomButton className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-4 font-bold shadow hover:shadow-lg transition-all duration-300 cursor-pointer">
                    {primaryAction.text}
                  </CustomButton>
                </Link>
              )}
              {secondaryAction && (
                <Link href={secondaryAction.href}>
                  <CustomButton className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4 font-bold shadow hover:shadow-lg transition-all duration-300 cursor-pointer">
                    {secondaryAction.text}
                  </CustomButton>
                </Link>
              )}
            </div>
            
            {features.length > 0 && (
              <div className="mt-8 flex justify-center items-center gap-8 text-white/80 text-sm">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    {feature}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MotionFade>
  );
}
