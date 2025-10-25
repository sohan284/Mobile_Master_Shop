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
            price: "From €29",
            time: "30-45 min",
            popular: true
        },
        { 
            id: 2, 
            src: "/battery.png", 
            alt: "Battery Replacement", 
            title: "Battery",
            description: "Poor battery life",
            price: "From €39",
            time: "20-30 min",
            popular: false
        },
        { 
            id: 3, 
            src: "/camera.png", 
            alt: "Camera Repair", 
            title: "Camera",
            description: "Blurry or damaged camera",
            price: "From €49",
            time: "45-60 min",
            popular: false
        },
        { 
            id: 4, 
            src: "/hood.png", 
            alt: "Back Cover", 
            title: "Back Cover",
            description: "Damaged back housing",
            price: "From €35",
            time: "25-35 min",
            popular: false
        }
    ];

    const features = [
        { icon: "🔧", text: "Expert Technicians", desc: "Certified professionals" },
        { icon: "⚡", text: "Same Day Service", desc: "Quick turnaround" },
        { icon: "🛡️", text: "12 Month Warranty", desc: "Quality guarantee" },
        { icon: "💰", text: "€25 Repair Bonus", desc: "Cash back offer" }
    ];

    return (
        <div className="pt-16 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-secondary/5 to-primary/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                
                {/* Hero Section - Unique Layout */}
                <div className="relative mb-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <MotionFade delay={0.02}>
                                <div className="inline-flex items-center gap-2 bg-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                                    <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                                    Professional Repair Services
                                </div>
                            </MotionFade>

                            <MotionFade delay={0.03}>
                                <h2 className="font-extrabold text-5xl lg:text-7xl text-primary leading-tight">
                                    Fix Your <span className="text-secondary relative">
                                        Device
                                        <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary/30" viewBox="0 0 200 12" fill="none">
                                            <path d="M2 6C2 6 50 2 100 6C150 10 198 6 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                        </svg>
                                    </span>
                                </h2>
                            </MotionFade>

                            <MotionFade delay={0.04}>
                                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                                    Expert technicians, premium parts, and a <span className="font-bold text-secondary">€25 repair bonus</span> 
                                    for every service. Get your device fixed with confidence.
                                </p>
                            </MotionFade>

                            <MotionFade delay={0.05}>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/repair">
                                        <CustomButton className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-4 font-bold shadow hover:shadow-lg transition-all duration-300 cursor-pointer">
                                            Get Instant Quote
                                        </CustomButton>
                                    </Link>
                                 
                                </div>
                            </MotionFade>
                        </div>

                        {/* Right Visual */}
                        <MotionFade delay={0.06}>
                            <div className="relative">
                                <div className="relative z-10">
                                    <img src="/1.png" alt="Phone Repair" className="w-full max-w-md mx-auto drop-shadow" />
                                </div>
                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary/20 rounded-full blur-sm animate-bounce"></div>
                                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full blur-sm animate-bounce" style={{animationDelay: '1s'}}></div>
                            </div>
                        </MotionFade>
                    </div>
                </div>

                {/* Features Section - Unique Card Layout */}
                <MotionFade delay={0.1}>
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-primary mb-4">Why Choose Us?</h3>
                            <p className="text-gray-600 max-w-2xl mx-auto">We provide exceptional repair services with unmatched quality and customer satisfaction.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, idx) => (
                                <MotionFade key={idx} delay={0.15 + idx * 0.1}>
                                    <div className="group relative">
                                        <div className="bg-white rounded-md p-6 shadow hover:shadow-lg transition-all duration-500 border border-gray-100 hover:border-secondary/50 h-full">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-md flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <span className="text-2xl">{feature.icon}</span>
                                                </div>
                                                <h4 className="font-bold text-primary mb-2">{feature.text}</h4>
                                                <p className="text-sm text-gray-600">{feature.desc}</p>
                                            </div>
                                        </div>
                                        {/* Hover Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                                    </div>
                                </MotionFade>
                            ))}
                        </div>
                    </div>
                </MotionFade>

                {/* Brand Trust Section */}
                <MotionFade delay={0.2}>
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h3 className="text-2xl font-bold text-primary mb-4">Trusted by Leading Brands</h3>
                            <p className="text-gray-600">We repair devices from all major manufacturers</p>
                        </div>
                        
                        <div className="rounded-md p-8 ">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                                {brandLogo.map((item, idx) => (
                                    <MotionFade key={item.id} delay={0.25 + idx * 0.1}>
                                        <div className="group flex justify-center">
                                            <div className="w-20 h-20 shadow rounded-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-secondary/10">
                                                <img
                                                    src={item.src}
                                                    alt={item.alt}
                                                    className="w-12 h-12 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                                />
                                            </div>
                                        </div>
                                    </MotionFade>
                                ))}
                            </div>
                        </div>
                    </div>
                </MotionFade>

                {/* Services Section - Unique Layout */}
                <MotionFade delay={0.3}>
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-primary mb-4">Our Repair Services</h3>
                            <p className="text-gray-600 max-w-2xl mx-auto">Professional repairs for all your device needs with premium parts and expert service.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {repairServices.map((service, idx) => (
                                <MotionFade key={service.id} delay={0.35 + idx * 0.1}>
                                    <div className="group relative">
                                        <div className="bg-white rounded-md p-6 shadow-lg hover:shadow transition-all duration-500 border border-gray-100 hover:border-secondary/50 h-full overflow-hidden">
                                            {/* Popular Badge */}
                                            {service.popular && (
                                                <div className="absolute -top-2 -right-2 bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full z-10">
                                                    Most Popular
                                                </div>
                                            )}
                                            
                                            <div className="text-center h-full flex flex-col">
                                                {/* Service Icon */}
                                                <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-md p-6 group-hover:from-secondary/5 group-hover:to-primary/5 transition-all duration-500 relative overflow-hidden">
                                                    <img
                                                        src={service.src}
                                                        alt={service.alt}
                                                        className="w-full h-20 object-contain group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                
                                                <div className="flex-grow flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-lg text-primary mb-2 group-hover:text-secondary transition-colors duration-300">
                                                            {service.title}
                                                        </h4>
                                                        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                                                    </div>
                                                    
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-2xl font-bold text-secondary">{service.price}</span>
                                                            <span className="text-sm text-gray-500">{service.time}</span>
                                                        </div>
                                                        
                                                        <div className="bg-gradient-to-r from-secondary/10 to-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full border border-secondary/20">
                                                            12 Month Warranty
                                                        </div>
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

                {/* CTA Section - Unique Design */}
                <MotionFade delay={0.4}>
                    <div className="relative">
                        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-md p-12 shadow relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-4 left-4 w-32 h-32 bg-secondary rounded-full blur-2xl"></div>
                                <div className="absolute bottom-4 right-4 w-24 h-24 bg-white rounded-full blur-xl"></div>
                            </div>
                            
                            <div className="relative z-10 text-center">
                                <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Your Device Fixed?</h3>
                                <p className="text-white/90 mb-8 text-lg">Get an instant quote and book your repair today. Same-day service available!</p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/repair">
                                        <CustomButton className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-4 font-bold shadow hover:shadow-lg transition-all duration-300  cursor-pointer">
                                            Get Instant Quote
                                        </CustomButton>
                                    </Link>
                                  
                                </div>
                                
                                <div className="mt-8 flex justify-center items-center gap-8 text-white/80 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                        Free Diagnosis
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                        Same Day Service
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                        12 Month Warranty
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MotionFade>
            </div>
        </div>
    );
}