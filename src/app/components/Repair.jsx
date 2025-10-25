import React from 'react';
import { CustomButton } from '@/components/ui/button';
import MotionFade from '@/components/animations/MotionFade';
import Link from 'next/link';
import HeroSection from '@/components/common/HeroSection';
import FeaturesSection from '@/components/common/FeaturesSection';
import CTASection from '@/components/common/CTASection';

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

            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                
                {/* Hero Section - Unique Layout */}
                <HeroSection
                    title="Fix Your"
                    subtitle="Device"
                    description="Expert technicians, premium parts, and a €25 repair bonus for every service. Get your device fixed with confidence."
                    image="/1.png"
                    imageAlt="Phone Repair"
                    badgeText="Professional Repair Services"
                    ctaText="Get Instant Quote"
                    ctaHref="/repair"
                    layout="image-left"
                />

                {/* Features Section - Unique Card Layout */}
                <FeaturesSection
                    title="Why Choose Us?"
                    description="We provide exceptional repair services with unmatched quality and customer satisfaction."
                    features={features.map(feature => ({
                        title: feature.text,
                        description: feature.desc,
                        icon: feature.icon
                    }))}
                />

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
                <CTASection
                    title="Ready to Get Your Device Fixed?"
                    description="Get an instant quote and book your repair today. Same-day service available!"
                    primaryAction={{
                        text: "Get Instant Quote",
                        href: "/repair"
                    }}
                    features={["Free Diagnosis", "Same Day Service", "12 Month Warranty"]}
                />
            </div>
        </div>
    );
}