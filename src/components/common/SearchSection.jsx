"use client";
import React, { memo } from "react";
import MotionFade from "@/components/animations/MotionFade";

function SearchSection({
  title,
  description,
  placeholder,
  searchTerm,
  onSearchChange,
  className = "",
}) {
  return (
    <MotionFade delay={0.1} immediate={true}>
      <div
        className={`flex flex-col items-center justify-center text-center ${className}`}
      >
        {/* Heading */}
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
            {title}
          </h2>
          <p className="text-accent/80 text-xs md:text-xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full my-3 flex justify-end">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full py-1 pl-12 pr-4 text-accent text-lg bg-white/10 backdrop-blur-md border-2 border-accent/30 rounded-2xl focus:outline-none focus:border-secondary transition-all duration-300 shadow-sm hover:shadow-lg placeholder:text-accent/60"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              className="w-6 h-6 text-accent/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </MotionFade>
  );
}

export default memo(SearchSection);
