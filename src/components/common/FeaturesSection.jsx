"use client";
import React from 'react';
import MotionFade from '@/components/animations/MotionFade';

export default function FeaturesSection({
  title,
  description,
  features,
  className = ""
}) {
  return (
    <MotionFade delay={0.3} immediate={true}>
      <div className={`mb-16 ${className}`}>
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-primary mb-4">{title}</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features?.map((feature, idx) => (
            <MotionFade key={idx} delay={0.35 + idx * 0.1} immediate={true}>
              <div className="group relative">
                <div className="bg-white rounded-md p-6 shadow hover:shadow-lg transition-all duration-500 border border-gray-100 hover:border-secondary/50 h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-md flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">{feature.icon || "🔧"}</span>
                    </div>
                    <h4 className="font-bold text-primary mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            </MotionFade>
          ))}
        </div>
      </div>
    </MotionFade>
  );
}
