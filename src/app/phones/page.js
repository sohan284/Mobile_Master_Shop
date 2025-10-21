import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { CustomButton } from "@/components/ui/button";
import Link from "next/link";
import MotionFade from '@/components/animations/MotionFade';
import PageTransition from '@/components/animations/PageTransition';

export default function PhonesPage() {
    // Phone data from refurbished component
    const allPhones = [
        { id: 1, name: "iphone-11-noir.png", path: "/iphone-11-noir.png", price: 299 },
        { id: 2, name: "iPhone-12.png", path: "/iPhone-12.png", price: 399 },
        { id: 3, name: "iphone-13.png", path: "/iphone-13.png", price: 499 },
        { id: 4, name: "Iphone14.png", path: "/Iphone14.png", price: 599 },
        { id: 5, name: "Iphone14-Pro-Max.png", path: "/Iphone14-Pro-Max.png", price: 799 },
        { id: 6, name: "iphone-se-2020.png", path: "/iphone-se-2020.png", price: 199 },
        { id: 7, name: "iphone-xr.png", path: "/iphone-xr.png", price: 249 },
        { id: 8, name: "SAMSUNG_GalaxyS23Ultra.png", path: "/SAMSUNG_GalaxyS23Ultra.png", price: 899 },
        { id: 9, name: "samsung-galaxy-a40.png", path: "/samsung-galaxy-a40.png", price: 149 },
        { id: 10, name: "samsung-galaxy-s22.png", path: "/samsung-galaxy-s22.png", price: 699 },
        { id: 11, name: "iphone-11-noir.png", path: "/iphone-11-noir.png", price: 299 },
        { id: 12, name: "iPhone-12.png", path: "/iPhone-12.png", price: 399 },
        { id: 13, name: "iphone-13.png", path: "/iphone-13.png", price: 499 },
        { id: 14, name: "Iphone14.png", path: "/Iphone14.png", price: 599 },
        { id: 15, name: "Iphone14-Pro-Max.png", path: "/Iphone14-Pro-Max.png", price: 799 },
        { id: 16, name: "iphone-se-2020.png", path: "/iphone-se-2020.png", price: 199 },
        { id: 17, name: "iphone-xr.png", path: "/iphone-xr.png", price: 249 },
        { id: 18, name: "SAMSUNG_GalaxyS23Ultra.png", path: "/SAMSUNG_GalaxyS23Ultra.png", price: 899 },
        { id: 19, name: "samsung-galaxy-a40.png", path: "/samsung-galaxy-a40.png", price: 149 },
    ];

    // Shuffle array to show phones randomly
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const randomPhones = shuffleArray(allPhones);

    return (
        <PageTransition>
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    
                    {/* Header Section */}
                   

                    {/* Products Grid */}
                    <MotionFade delay={0.01}>
                        <div className="mb-12">
                            <h3 className="text-3xl font-bold text-center text-[#6B7E8D] mb-12">Featured New Phones</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {randomPhones.map((phone, idx) => (
                                    <MotionFade key={phone.id} delay={0.02 + idx * 0.05}>
                                        <Card className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-500  border border-gray-200 hover:border-[#00bfb2] h-full overflow-hidden">
                                            <CardContent className="p-3 text-center h-full flex flex-col relative">
                                                {/* Premium badge */}
                                                <div className="absolute top-3 right-3 bg-[#00bfb2] text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                                                    New Phone
                                                </div>
                                                
                                                <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 group-hover:from-[#00bfb2]/5 group-hover:to-[#00bfb2]/10 transition-all duration-500 relative overflow-hidden">
                                                    {/* Subtle background pattern */}
                                                    <div className="absolute inset-0 opacity-5">
                                                        <div className="absolute top-2 left-2 w-8 h-8 bg-[#00bfb2] rounded-full"></div>
                                                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#6B7E8D] rounded-full"></div>
                                                    </div>
                                                    <Image
                                                        src={phone.path}
                                                        alt={phone.name}
                                                        width={200}
                                                        height={144}
                                                        className="w-full h-36 object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
                                                    />
                                                </div>
                                                
                                                <div className="flex-grow flex flex-col justify-between">
                                                    <h3 className="font-bold capitalize text-sm text-[#6B7E8D]  line-clamp-2 group-hover:text-[#00bfb2] transition-colors duration-300">
                                                        {phone.name.replace('.png', '').replace(/[-_]/g, ' ')}
                                                    </h3>
                                                    
                                                    <div className="space-y-3">
                                                        <div className="text-center">
                                                            <p className="text-xs text-gray-600 mb-1">Starting from</p>
                                                            <p className="font-bold text-3xl text-[#00bfb2] mb-2">€{phone.price}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </MotionFade>
                                ))}
                            </div>
                        </div>
                    </MotionFade>

                    {/* Features Section */}
                    <MotionFade delay={0.02}>
                        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
                            <h2 className="text-2xl font-bold text-[#6B7E8D] mb-6 text-center">Why Choose New Phones?</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#00bfb2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🔧</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#6B7E8D] mb-2">Quality Assurance</h3>
                                    <p className="text-gray-600 text-sm">All phones are thoroughly tested and certified to work like new.</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#00bfb2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🛡️</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#6B7E8D] mb-2">Warranty Included</h3>
                                    <p className="text-gray-600 text-sm">24-month warranty on all new devices.</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#00bfb2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">💰</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#6B7E8D] mb-2">Best Prices</h3>
                                    <p className="text-gray-600 text-sm">Competitive pricing on all new phone models.</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#00bfb2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">⚡</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#6B7E8D] mb-2">Latest Technology</h3>
                                    <p className="text-gray-600 text-sm">Get the latest features and technology.</p>
                                </div>
                            </div>
                        </div>
                    </MotionFade>

                    {/* CTA Section */}
                    <MotionFade delay={0.03}>
                        <div className="text-center">
                            <Link href='/' className="">
                                <CustomButton className="bg-primary text-secondary hover:bg-primary/90">
                                    Back to Home
                                </CustomButton>
                            </Link>
                        </div>
                    </MotionFade>
                </div>
            </div>
        </PageTransition>
    );
}
