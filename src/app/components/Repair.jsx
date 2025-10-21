import React from 'react';
import { CustomButton } from '@/components/ui/button';
import MotionFade from '@/components/animations/MotionFade';
import Link from 'next/link';

export default function Repair() {
    const brandLogo = [
        { id: 1, src: "/Apple.png", alt: "Apple logo" },
        { id: 2, src: "/Samsung.png", alt: "Samsung logo" },
        { id: 3, src: "/Xiaomi.png", alt: "Xiaomi logo" },
        { id: 4, src: "/Huawei.png", alt: "Huawei logo" },
        { id: 5, src: "/Honor.png", alt: "Honor logo" },
        { id: 6, src: "/Oppo.png", alt: "Oppo logo" },
    ];

    const repairServices = [
        { 
            id: 1, 
            src: "/screen.png", 
            alt: "Screen Repair", 
            title: "Screen Repair",
            description: "Cracked or broken screens",
            price: "From €29"
        },
        { 
            id: 2, 
            src: "/battery.png", 
            alt: "Battery Replacement", 
            title: "Battery",
            description: "Poor battery life",
            price: "From €39"
        },
        { 
            id: 3, 
            src: "/camera.png", 
            alt: "Camera Repair", 
            title: "Camera",
            description: "Blurry or damaged camera",
            price: "From €49"
        },
        { 
            id: 4, 
            src: "/hood.png", 
            alt: "Back Cover", 
            title: "Back Cover",
            description: "Damaged back housing",
            price: "From €35"
        }
    ];

    const features = [
        { icon: "🔧", text: "Expert Technicians" },
        { icon: "⚡", text: "Same Day Service" },
        { icon: "🛡️", text: "12 Month Warranty" },
        { icon: "💰", text: "€25 Repair Bonus" }
    ];

    return (
        <div className="pt-16">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <MotionFade delay={0.02}>
                        <div className="relative inline-block mb-8">
                            <div className="absolute -inset-4 bg-gradient-to-r from-[#6B7E8D] to-[#00bfb2] rounded-full blur-lg opacity-20"></div>
                            <img src="/1.png" alt="Phone" className="relative w-20 sm:w-24 drop-shadow-lg" />
                        </div>
                    </MotionFade>

                    <MotionFade delay={0.03}>
                        <h2 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#6B7E8D] mb-6">
                            Professional <span className="text-[#00bfb2]">Repairs</span>
                        </h2>
                    </MotionFade>

                    <MotionFade delay={0.04}>
                        <div className="relative inline-block">
                            <div className="absolute -inset-2 bg-gradient-to-r from-[#6B7E8D] to-[#00bfb2] rounded-2xl blur-sm opacity-30"></div>
                            <div className="relative bg-[#6B7E8D] px-8 py-4 rounded-2xl shadow-2xl">
                                <p className="text-xl font-bold text-white">
                                    All Brands • 12-Month Warranty • €25 Bonus
                                </p>
                            </div>
                        </div>
                    </MotionFade>

                    <MotionFade delay={0.05}>
                        <p className="text-lg sm:text-xl text-gray-600 mt-8 max-w-3xl mx-auto leading-relaxed">
                            Got a broken screen or dead battery? Our expert technicians will repair your device 
                            with <span className="font-semibold text-[#00bfb2]">premium parts</span> and give you a 
                            <span className="font-bold text-[#00bfb2]"> €25 repair bonus</span>.
                        </p>
                    </MotionFade>
                </div>

                {/* Features Grid */}
                <MotionFade delay={0.25}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="text-3xl mb-2">{feature.icon}</div>
                                <p className="font-semibold text-gray-800 text-sm">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </MotionFade>

                {/* Brand Logos */}
                <MotionFade delay={0.1}>
                    <div className="text-center mb-16">
                        <h3 className="text-2xl font-bold text-gray-800 mb-8">Trusted by All Major Brands</h3>
                        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
                            {brandLogo.map((item, idx) => (
                                <MotionFade key={item.id} delay={0.15 + idx * 0.1}>
                                    <div className="group">
                                        <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                            <img
                                                src={item.src}
                                                alt={item.alt}
                                                className="w-10 h-10 object-contain"
                                            />
                                        </div>
                                    </div>
                                </MotionFade>
                            ))}
                        </div>
                    </div>
                </MotionFade>

                {/* Repair Services Grid */}
                <MotionFade delay={0.2}>
                    <div className="mb-16">
                        <h3 className="text-3xl font-bold text-center text-[#6B7E8D] mb-12">Our Repair Services</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {repairServices.map((service, idx) => (
                                <MotionFade key={service.id} delay={0.5 + idx * 0.1}>
                                    <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500  border border-gray-200 hover:border-[#00bfb2] h-full overflow-hidden">
                                        <div className="text-center h-full flex flex-col">
                                            {/* Service badge */}
                                            <div className="inline-block bg-[#00bfb2] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                                                {service.title}
                                            </div>
                                            
                                            <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 group-hover:from-[#00bfb2]/5 group-hover:to-[#00bfb2]/10 transition-all duration-500 relative overflow-hidden">
                                                {/* Subtle background pattern */}
                                                <div className="absolute inset-0 opacity-5">
                                                    <div className="absolute top-2 left-2 w-8 h-8 bg-[#00bfb2] rounded-full"></div>
                                                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#6B7E8D] rounded-full"></div>
                                                </div>
                                                <img
                                                    src={service.src}
                                                    alt={service.alt}
                                                    className="w-full h-24 object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
                                                />
                                            </div>
                                            
                                            <div className="flex-grow flex flex-col justify-between">
                                                <h4 className="font-bold text-lg text-[#6B7E8D] mb-3 line-clamp-2 group-hover:text-[#00bfb2] transition-colors duration-300">
                                                    {service.title}
                                                </h4>
                                                
                                                <div className="space-y-3">
                                                    <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                                                    
                                                    <div className="text-center">
                                                        <p className="text-sm text-gray-500 mb-1">Starting from</p>
                                                        <p className="font-bold text-2xl text-[#00bfb2] mb-2">{service.price}</p>
                                                    </div>
                                                    
                                                    <div className="bg-gradient-to-r from-[#00bfb2]/10 to-[#6B7E8D]/10 text-[#6B7E8D] text-sm font-semibold px-4 py-2 rounded-full border border-[#00bfb2]/20">
                                                        12 Month Warranty
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </MotionFade>
                            ))}
                        </div>
                    </div>
                </MotionFade>

                {/* CTA Section */}
                <MotionFade delay={0.55}>
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-[#6B7E8D] to-[#00bfb2] rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Your Device Fixed?</h3>
                            <p className="text-white/90 mb-6">Get an instant quote and book your repair today</p>
                          <Link href="/repair">
                          <CustomButton className="bg-white text-[#6B7E8D] hover:bg-white/90 text-lg px-8 py-4 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                Get Instant Quote
                            </CustomButton>
                          </Link>
                        
                        </div>
                    </div>
                </MotionFade>
            </div>
        </div>
    );
}