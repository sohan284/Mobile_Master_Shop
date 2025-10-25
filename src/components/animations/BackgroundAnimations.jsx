"use client";
import React from 'react';

export default function BackgroundAnimations() {
    return (
        <div className="fixed inset-0 -z-50 pointer-events-none">
            {/* Animated gradient background with wave effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-primary/8"></div>
            
            {/* Floating orbs with glow effect */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-secondary/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-secondary/12 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-secondary/6 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2.5s'}}></div>
            <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-secondary/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.8s'}}></div>
            
            {/* Additional floating orbs */}
            <div className="absolute top-1/6 left-1/6 w-20 h-20 bg-secondary/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.2s'}}></div>
            <div className="absolute top-2/3 right-1/6 w-16 h-16 bg-secondary/8 rounded-full blur-xl animate-pulse" style={{animationDelay: '2.2s'}}></div>
            <div className="absolute bottom-1/6 left-2/3 w-24 h-24 bg-secondary/7 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.4s'}}></div>
            <div className="absolute bottom-2/3 right-2/3 w-18 h-18 bg-secondary/9 rounded-full blur-xl animate-pulse" style={{animationDelay: '1.8s'}}></div>
            
            {/* Animated flowing lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/15 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/12 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-secondary/10 to-transparent animate-pulse" style={{animationDelay: '1.5s'}}></div>
            
            {/* Floating light beams */}
            <div className="absolute top-1/2 left-1/6 w-1 h-16 bg-gradient-to-b from-secondary/20 to-transparent animate-pulse" style={{animationDelay: '0.3s', transform: 'rotate(15deg)'}}></div>
            <div className="absolute top-1/2 right-1/6 w-1 h-12 bg-gradient-to-b from-secondary/18 to-transparent animate-pulse" style={{animationDelay: '1.8s', transform: 'rotate(-20deg)'}}></div>
            <div className="absolute top-1/3 left-1/2 w-1 h-8 bg-gradient-to-b from-secondary/15 to-transparent animate-pulse" style={{animationDelay: '2.3s', transform: 'rotate(45deg)'}}></div>
            <div className="absolute bottom-1/3 right-1/2 w-1 h-10 bg-gradient-to-b from-secondary/16 to-transparent animate-pulse" style={{animationDelay: '0.9s', transform: 'rotate(-30deg)'}}></div>
            
            {/* Additional light streaks */}
            <div className="absolute top-1/4 left-1/3 w-1 h-6 bg-gradient-to-b from-secondary/12 to-transparent animate-pulse" style={{animationDelay: '1.4s', transform: 'rotate(60deg)'}}></div>
            <div className="absolute bottom-1/4 right-1/3 w-1 h-8 bg-gradient-to-b from-secondary/14 to-transparent animate-pulse" style={{animationDelay: '2.1s', transform: 'rotate(-45deg)'}}></div>
            <div className="absolute top-2/3 left-1/4 w-1 h-4 bg-gradient-to-b from-secondary/11 to-transparent animate-pulse" style={{animationDelay: '0.7s', transform: 'rotate(75deg)'}}></div>
            <div className="absolute bottom-2/3 right-1/4 w-1 h-6 bg-gradient-to-b from-secondary/13 to-transparent animate-pulse" style={{animationDelay: '1.9s', transform: 'rotate(-60deg)'}}></div>
            
            {/* Floating energy dots */}
            <div className="absolute top-1/6 left-1/6 w-1 h-1 bg-secondary/30 rounded-full animate-ping" style={{animationDelay: '1.2s'}}></div>
            <div className="absolute top-1/6 right-1/6 w-1 h-1 bg-secondary/25 rounded-full animate-ping" style={{animationDelay: '2.2s'}}></div>
            <div className="absolute bottom-1/6 left-1/6 w-1 h-1 bg-secondary/20 rounded-full animate-ping" style={{animationDelay: '0.8s'}}></div>
            <div className="absolute bottom-1/6 right-1/6 w-1 h-1 bg-secondary/22 rounded-full animate-ping" style={{animationDelay: '1.8s'}}></div>
            <div className="absolute top-1/2 left-1/8 w-1 h-1 bg-secondary/18 rounded-full animate-ping" style={{animationDelay: '2.5s'}}></div>
            <div className="absolute top-1/2 right-1/8 w-1 h-1 bg-secondary/24 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-1/2 left-1/8 w-1 h-1 bg-secondary/16 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute bottom-1/2 right-1/8 w-1 h-1 bg-secondary/26 rounded-full animate-ping" style={{animationDelay: '2.8s'}}></div>
            
            {/* Subtle mesh pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: 'linear-gradient(90deg, rgba(243, 203, 165, 0.05) 1px, transparent 1px), linear-gradient(rgba(243, 203, 165, 0.05) 1px, transparent 1px)',
                    backgroundSize: '25px 25px'
                }}></div>
            </div>
            
            {/* Animated circuit pattern */}
            <div className="absolute inset-0 opacity-3">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: 'linear-gradient(45deg, rgba(243, 203, 165, 0.03) 1px, transparent 1px), linear-gradient(-45deg, rgba(243, 203, 165, 0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>
        </div>
    );
}
