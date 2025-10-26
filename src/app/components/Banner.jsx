"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CustomButton } from '@/components/ui/button';
import Image from 'next/image';
import hero from '../../../public/banner.png'
import Link from 'next/link';
import repair from '../../../public/repair.png';
import accessories from '../../../public/Accessories.png';

export default function Banner() {
    return (
        <div className="relative dark-blue-vignette text-white py-20 overflow-hidden">
            <div className="container mx-auto px-4 z-10 relative">
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-6xl font-extrabold tracking-wider"
                    >
                        REPAIR. SELL. BUY.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4 text-lg md:text-xl text-gray-300"
                    >
                        Experience Premium at MLKPHONE
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8 flex justify-center gap-4"
                    >
                        <Link href='/repair'>
                            <CustomButton className="bg-secondary text-primary hover:bg-secondary/90">
                                Shop Now
                            </CustomButton>
                        </Link>
                        <Link href='phones'>
                            <CustomButton variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-primary">
                                Book a Repair
                            </CustomButton>
                        </Link>
                    </motion.div>
                </div>

                <div className="mt-16 flex justify-center items-end gap-8">
                    <Link href='/repair'>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                            className="w-40 h-40 bg-gray-800/50 rounded-lg shadow-lg text-2xl flex flex-col space-y-2 items-center justify-center border"
                        >
                            <Image src={repair} className='w-20' alt='repair logo' />
                            <h2>Repair</h2>
                        </motion.div>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                    >
                        <Image
                            src={hero}
                            alt="iPhone 14 Pro Max"
                            width={300}
                            height={300}
                            className="object-contain flex-1"
                        />
                    </motion.div>

                    <Link href='/accessories'>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                            className="w-40 h-40 bg-gray-800/50 rounded-lg shadow-lg text-2xl flex flex-col space-y-2 items-center justify-center border"
                        >
                            <Image src={accessories} className='w-20' alt='Accessories logo' />
                            <h2>Accessories</h2>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
