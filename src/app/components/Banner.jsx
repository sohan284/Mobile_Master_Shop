"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CustomButton } from '@/components/ui/button';

export default function Banner() {
    const slides = [
        {
            id: 1,
            title: 'Fast, reliable phone repairs',
            ctaText: 'Get a repair quote',
            ctaHref: '/repair',
            image: '/1.png',
        },
        {
            id: 2,
            title: 'Shop New Phones',
            ctaText: 'Browse phones',
            ctaHref: '/phones',
            image: '/2.png',
        },
        {
            id: 3,
            title: 'Explore accessories',
            ctaText: 'Shop accessories',
            ctaHref: '/accessories',
            image: '/3.png',
        },
    ];

    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const goTo = (i) => setIndex(i % slides.length);
    const next = () => goTo((index + 1) % slides.length);
    const prev = () => goTo((index - 1 + slides.length) % slides.length);

    return (
        <div
            className='relative bg-primary overflow-hidden'
            style={{
                clipPath: 'ellipse(100% 55% at 48% 44%)',
                WebkitClipPath: 'ellipse(100% 55% at 48% 44%)',
            }}
        >
            {/* Background Visual Elements */}
            <div className="absolute inset-0 -z-10">
                {/* Main background gradients */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-primary to-primary/80"></div>
                
                {/* Floating animated circles */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-20 right-20 w-24 h-24 bg-secondary/15 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-10 right-1/3 w-28 h-28 bg-secondary/25 rounded-full blur-lg animate-pulse" style={{animationDelay: '0.5s'}}></div>
                
                {/* Floating particles */}
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-secondary/30 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-secondary/40 rounded-full animate-bounce" style={{animationDelay: '1.3s'}}></div>
                <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-secondary/50 rounded-full animate-bounce" style={{animationDelay: '2.3s'}}></div>
                <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-secondary/35 rounded-full animate-bounce" style={{animationDelay: '0.8s'}}></div>
                <div className="absolute top-1/2 left-1/5 w-2 h-2 bg-secondary/45 rounded-full animate-bounce" style={{animationDelay: '1.8s'}}></div>
                <div className="absolute bottom-1/2 right-1/5 w-4 h-4 bg-secondary/25 rounded-full animate-bounce" style={{animationDelay: '2.8s'}}></div>
                
         
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(243, 203, 165, 0.3) 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                    }}></div>
                </div>
            </div>

            <div className='max-w-[1200px] mx-auto px-4 py-12 md:py-10 md:pt-4 relative z-10'>
               
                <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-8'>
                    {/* Left: Title + CTA updates per slide */}
                    <div className='text-secondary'>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={slides[index].id + '-text'}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                            >
                                <h2 className='font-extrabold text-3xl md:text-5xl leading-tight'>
                                    {slides[index].title}
                                </h2>
                                <div className='mt-6'>
                                    <Link href={slides[index].ctaHref} className='inline-block group'>
                                        <CustomButton className='bg-secondary text-primary hover:bg-secondary/90 cursor-pointer' >
                                            {slides[index].ctaText}
                                        </CustomButton>
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right: Visual */}
                    <div className='relative'>
                        <div className='aspect-[4/3] md:aspect-[5/4] rounded-2xl flex items-center justify-center overflow-hidden relative'>
                            {/* Floating elements around the image */}
                            <div className="absolute -top-4 -left-4 w-8 h-8 bg-secondary/30 rounded-full blur-sm animate-bounce" style={{animationDelay: '0.5s'}}></div>
                            <div className="absolute -top-2 -right-6 w-6 h-6 bg-secondary/40 rounded-full blur-sm animate-bounce" style={{animationDelay: '1.5s'}}></div>
                            <div className="absolute -bottom-4 -left-2 w-10 h-10 bg-secondary/25 rounded-full blur-sm animate-bounce" style={{animationDelay: '2.5s'}}></div>
                            <div className="absolute -bottom-2 -right-4 w-4 h-4 bg-secondary/35 rounded-full blur-sm animate-bounce" style={{animationDelay: '0.8s'}}></div>
                            
                            {/* Additional floating particles */}
                            <div className="absolute top-1/4 -left-2 w-2 h-2 bg-secondary/50 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                            <div className="absolute bottom-1/4 -right-2 w-1 h-1 bg-secondary/60 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                            <div className="absolute top-1/2 -right-3 w-1 h-1 bg-secondary/45 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
                            
                            <AnimatePresence mode="wait">
                                <Link href={slides[index].ctaHref} className='inline-block group'>
                                <motion.div className='inline-block group relative z-10'>
                                    <img
                                        src={slides[index].image}
                                        alt={slides[index].title}
                                        className='w-full object-bottom hover:scale-105 transition-transform duration-500'
                                    />
                                </motion.div>
                                </Link>
                               
                            </AnimatePresence>
                        </div>

                        {/* Controls */}
                        <div className='mt-4 flex items-center justify-between'>
                            <button onClick={prev} className='text-white/80 hover:text-white transition-colors cursor-pointer'>
                                ‹
                            </button>
                            <div className='flex items-center gap-2'>
                                {slides.map((s, i) => (
                                    <button
                                        key={s.id}
                                        aria-label={`Go to slide ${i + 1}`}
                                        onClick={() => goTo(i)}
                                        className={`h-2.5 w-2.5 rounded-full transition-all ${i === index ? 'bg-white w-6' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                            <button onClick={next} className='text-white/80 hover:text-white transition-colors cursor-pointer'>
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
