"use client";
import React from 'react';
import MotionFade from '@/components/animations/MotionFade';

export default function SearchSection({
  title,
  description,
  placeholder,
  searchTerm,
  onSearchChange,
  className = ""
}) {
  return (
    <MotionFade delay={0.1} immediate={true}>
      <div className={`mb-16 ${className}`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full px-4 py-4 pl-12 pr-4 text-gray-700 bg-white/10  border-2 border-gray-200 rounded-md focus:outline-none focus:border-secondary transition-all duration-300 shadow hover:shadow-lg"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </MotionFade>
  );
}
