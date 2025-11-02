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
          <h3 className="text-3xl font-bold text-secondary mb-4">{title}</h3>
          <p className="text-accent/80 max-w-2xl mx-auto">{description}</p>
        </div>
        
        {/* Responsive grid: 1 / 2 / 3 / 4 cols
            - items-stretch + auto-rows ensures each grid cell takes equal height
            - gap remains responsive
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch auto-rows-[1fr]">
          {features?.map((feature, idx) => (
            <MotionFade key={idx} delay={0.35 + idx * 0.1} immediate={true}>
              <div className="group relative h-full">
                {/* Card:
                    - h-full + flex + flex-1 ensures consistent height across different content
                    - responsive min-heights keep cards balanced on larger screens
                    - overflow-hidden prevents children from expanding card unexpectedly
                */}
                <div className="bg-white/10 backdrop-blur-sm rounded-md p-4 sm:p-6 shadow hover:shadow-lg transition-all duration-500 border border-accent/20 hover:border-secondary/50 h-full flex flex-col justify-between flex-1 min-h-[160px] sm:min-h-[200px] lg:min-h-[220px] overflow-hidden">
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-md flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl sm:text-2xl">{feature.icon || "🔧"}</span>
                    </div>
                    <h4 className="font-bold text-accent mb-2 text-sm sm:text-base">{feature.title}</h4>
                    {/* clamp/overflow so descriptions cannot push layout */}
                    <p className="text-sm text-accent/80 line-clamp-3 break-words">{feature.description}</p>
                  </div>

                  {/* optional footer area (keeps spacing consistent if you add actions) */}
                  {feature.cta ? (
                    <div className="mt-4 text-center">
                      <a
                        className="text-sm text-secondary hover:underline inline-block max-w-full truncate"
                        href={feature.cta.href}
                        aria-label={feature.cta.label}
                      >
                        {feature.cta.label}
                      </a>
                    </div>
                  ) : (
                    // keep a small spacer so content distribution is consistent
                    <div className="mt-4" aria-hidden="true" />
                  )}
                </div>

                {/* Hover overlay: placed above background but not blocking pointer events */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </MotionFade>
          ))}
        </div>
      </div>
    </MotionFade>
  );
}
