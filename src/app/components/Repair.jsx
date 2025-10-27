"use client";
import React from 'react';
import MotionFade from '@/components/animations/MotionFade';
import { motion } from 'framer-motion';
import Link from 'next/link';
import HeroSection from '@/components/common/HeroSection';
import FeaturesSection from '@/components/common/FeaturesSection';
import CTASection from '@/components/common/CTASection';
import Image from 'next/image'; 
import { CustomButton } from '@/components/ui/button';
import { Award, Clock, ShieldCheck, Wrench } from 'lucide-react';
import { apiFetcher } from '@/lib/api';
import { useApiGet } from '@/hooks/useApi';


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
            title: "Battery Replacement",
            description: "Poor battery life",
            price: "From €39",
            time: "20-30 min",
            popular: false
        },
        {
            id: 3,
            src: "/camera.png",
            alt: "Camera Repair",
            title: "Camera Repair",
            description: "Blurry or damaged camera",
            price: "From €49",
            time: "45-60 min",
            popular: false
        },
        {
            id: 4,
            src: "/backshell.png",
            alt: "Back Cover",
            title: "Back Shell Repair",
            description: "Damaged back housing",
            price: "From €35",
            time: "25-35 min",
            popular: false
        }
    ];

   const features = [
    { 
      text: "Expert Technicians", 
      desc: "Certified professionals with years of experience", 
      icon: Wrench,
      gradient: "from-orange-500 to-red-500"
    },
    { 
      text: "Quick Turnaround", 
      desc: "Most repairs completed within 24 hours", 
      icon: Clock,
      gradient: "from-blue-500 to-indigo-500"
    },
    { 
      text: "Warranty Guarantee", 
      desc: "All repairs backed by our quality guarantee", 
      icon: ShieldCheck,
      gradient: "from-green-500 to-teal-500"
    },
    { 
      text: "Premium Quality", 
      desc: "Only genuine parts and materials used", 
      icon: Award,
      gradient: "from-purple-500 to-pink-500"
    }
  ];
  const { data: brandsResponse, isLoading: brandsLoading, error: brandsError } = useApiGet(
    ['brands'],
    () => apiFetcher.get('/api/repair/brands/')
  );
  const brands = brandsResponse?.data || [];
    return (
        <div className="pt-16 relative overflow-hidden text-secondary">

            <div className="container  mx-auto px-4 lg:px-8">

                {/* Hero Section - Banner Style */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-6xl font-extrabold tracking-wider text-white"
                    >
                        FIX YOUR DEVICE
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4 text-lg md:text-xl text-gray-300"
                    >
                        Expert technicians, premium parts, and a €25 repair bonus for every service. Get your device fixed with confidence.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8 flex justify-center gap-4"
                    >
                        <Link href="/repair">
                            <CustomButton variant="outline" className="border-secondary bg-secondary text-primary hover:bg-secondary hover:text-primary">
                                Book Repair
                            </CustomButton>
                        </Link>
                    </motion.div>
                </div>





                {/* Services Section - Banner Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="mb-16"
                >
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold mb-4">Our Repair Services</h3>
                        <p className="text-gray-300 max-w-2xl mx-auto">Professional repairs for all your device needs with premium parts and expert service.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {repairServices.map((service, idx) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.1 + idx * 0.1 }}
                                className="group relative"
                            >
                                <div className="bg-white/10 /10 backdrop-blur-sm rounded-md p-2 shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20 hover:border-secondary/50 h-full overflow-hidden">
                                    {/* Popular Badge */}
                                    {service.popular && (
                                        <div className="absolute top-2 -right-2 bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full z-50">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="text-center h-full flex flex-col">
                                        {/* Service Icon */}
                                        <div className="mb-6 bg-gradient-to-br from-white/10 to-white/5 rounded-md p-6 group-hover:from-secondary/20 group-hover:to-primary/20 transition-all duration-500 relative overflow-hidden">
                                            <Image
                                                width={100}
                                                height={100}
                                                src={service.src}
                                                alt={service.alt}
                                                className="w-full h-40 object-contain group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-lg text-white mb-2 group-hover:text-secondary transition-colors duration-300">
                                                    {service.title}
                                                </h4>
                                                <p className="text-gray-300 text-sm mb-4">{service.description}</p>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-2xl font-bold text-secondary">{service.price}</span>
                                                    <span className="text-sm text-gray-300">{service.time}</span>
                                                </div>

                                                <div className="bg-gradient-to-r from-secondary/20 to-primary/20 text-white text-sm font-semibold px-4 py-2 rounded-full border border-secondary/30">
                                                    12 Month Warranty
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
                {/* Brand Trust Section - Marquee Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mb-16"
                >
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-bold mb-4">Trusted by Leading Brands</h3>
                        <p className="text-gray-300">We repair devices from all major manufacturers</p>
                    </div>

                    <div className="relative overflow-hidden backdrop-blur-sm rounded-lg py-8">
                        <div className="flex animate-marquee">
                            {/* First set of logos */}
                            {brands.map((item, idx) => (
                                <div key={`first-${item.id}`} className="flex-shrink-0 mx-6 group">
                                    <div className="w-16 h-16 shadow-lg rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10 bg-white/5">
                                        <img
                                            src={item.icon}
                                            alt={item.name}
                                            className="w-12 h-12 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                </div>
                            ))}
                            {/* Duplicate set for seamless loop */}
                            {brands.map((item, idx) => (
                                <div key={`second-${item.id}`} className="flex-shrink-0 mx-6 group">
                                    <div className="w-16 h-16 shadow-lg rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10 bg-white/5">
                                        <img
                                            src={item.icon}
                                            alt={item.name}
                                            className="w-12 h-12 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
                {/* Features Section - Banner Style */}
                <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mb-16"
    >
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold mb-4 text-white">Why Choose Us?</h3>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          We provide exceptional repair services with unmatched quality and customer satisfaction.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 lg:gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="group relative"
            >
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                
                {/* Icon container with gradient background */}
                <div className="relative mb-5 inline-flex mx-auto">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`}></div>
                  <div className={`relative bg-gradient-to-br ${feature.gradient} p-3.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                
                <h4 className="text-lg font-bold mb-2 text-white">{feature.text}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
            </div>
        </div>
    );
}