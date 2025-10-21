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
            className=' bg-primary'
            style={{
                clipPath: 'ellipse(100% 55% at 48% 44%)',
                WebkitClipPath: 'ellipse(100% 55% at 48% 44%)',
            }}
        >
            <div className='max-w-[1200px] mx-auto px-4 py-12 md:py-10 md:pt-4'>
               
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
                                        <CustomButton>
                                            {slides[index].ctaText}
                                        </CustomButton>
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right: Visual */}
                    <div className='relative'>
                        <div className='aspect-[4/3] md:aspect-[5/4] rounded-2xl flex items-center justify-center overflow-hidden'>
                            <AnimatePresence mode="wait">
                                <Link href={slides[index].ctaHref} className='inline-block group'>
                                <motion.div className='inline-block group'>
                                    <img
                                        src={slides[index].image}
                                        alt={slides[index].title}
                                        className='w-full object-bottom'
                                    />
                                </motion.div>
                                </Link>
                               
                            </AnimatePresence>
                        </div>

                        {/* Controls */}
                        <div className='mt-4 flex items-center justify-between'>
                            <button onClick={prev} className='text-white/80 hover:text-white transition-colors'>
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
                            <button onClick={next} className='text-white/80 hover:text-white transition-colors'>
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
