import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { CustomButton } from "@/components/ui/button";
import Link from "next/link";
import MotionFade from '@/components/animations/MotionFade';
import PageTransition from '@/components/animations/PageTransition';

export default function PhonesPage() {
    // Brand data (logos should be in public/brands/)
    const brands = [
        { id: 1, name: "Apple", logo: "/apple.png" },
        { id: 2, name: "Samsung", logo: "/samsung.png" },
        { id: 3, name: "Google", logo: "/google.png" },
        { id: 4, name: "OnePlus", logo: "/oneplus.png" },
        { id: 5, name: "Xiaomi", logo: "/xiaomi.png" },
        { id: 6, name: "Huawei", logo: "/huawei.png" },
        { id: 7, name: "Honor", logo: "/honor.png" },
        { id: 8, name: "Realme", logo: "/realme.png" },
        { id: 9, name: "Oppo", logo: "/oppo.png" },
        { id: 10, name: "Motorola", logo: "/motorola.png" },
        { id: 11, name: "Sony", logo: "/sony.png" },
    ];

    // Shuffle array to show brands randomly
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const randomBrands = shuffleArray(brands);

    return (
        <PageTransition>
            <div className="py-8 bg-primary">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    {/* Header Section */}
                    {/* Brands Grid */}
                    <MotionFade delay={0.01}>
                        <div className="mb-12">
                            <h3 className="text-3xl font-bold text-center text-[#6B7E8D] mb-12">Featured Brands</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {randomBrands.map((brand, idx) => (
                                    <Link href={`/phones/${brand.name}`} key={brand.id}>
                                        <MotionFade delay={0.02 + idx * 0.05}>
                                            <Card className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-[#00bfb2] h-full overflow-hidden">
                                                <CardContent className="p-3 text-center h-full flex flex-col relative">
                                                    <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 group-hover:from-[#00bfb2]/5 group-hover:to-[#00bfb2]/10 transition-all duration-500 relative overflow-hidden">
                                                        <Image
                                                            src={brand.logo}
                                                            alt={brand.name}
                                                            width={160}
                                                            height={96}
                                                            className="w-full h-28 object-contain group-hover:scale-105 transition-transform duration-300 relative z-10"
                                                        />
                                                    </div>

                                                    <div className="flex-grow flex flex-col justify-between">
                                                        <h3 className="font-bold text-sm text-[#6B7E8D] group-hover:text-[#00bfb2] transition-colors duration-300">
                                                            {brand.name}
                                                        </h3>

                                                        <div className="mt-3">
                                                            <p className="text-xs text-gray-600">Official brand</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </MotionFade>
                                    </Link>
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
