"use client";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image'; 
import { CustomButton } from '@/components/ui/button';
import { Award, Clock, ShieldCheck, Wrench } from 'lucide-react';
import { apiFetcher } from '@/lib/api';
import { useApiGet } from '@/hooks/useApi';
import { useTranslations } from 'next-intl';


export default function Repair() {
  const t = useTranslations('repair');


  const repairServices = useMemo(() => [
        {
            id: 1,
            src: "/screen.png",
            alt: t('screenRepair'),
            title: t('screenRepair'),
            description: t('crackedOrBroken'),
            price: "From €29",
            time: "30-45 min",
            popular: true
        },
        {
            id: 2,
            src: "/battery.png",
            alt: t('batteryReplacement'),
            title: t('batteryReplacement'),
            description: t('poorBatteryLife'),
            price: "From €39",
            time: "20-30 min",
            popular: false
        },
        {
            id: 3,
            src: "/camera.png",
            alt: t('cameraRepair'),
            title: t('cameraRepair'),
            description: t('blurryOrDamaged'),
            price: "From €49",
            time: "45-60 min",
            popular: false
        },
        {
            id: 4,
            src: "/backshell.png",
            alt: t('backShellRepair'),
            title: t('backShellRepair'),
            description: t('damagedBackHousing'),
            price: "From €35",
            time: "25-35 min",
            popular: false
        }
    ], [t]);

   const features = useMemo(() => [
    { 
      text: t('expertTechniciansFeature'), 
      desc: t('certifiedProfessionals'), 
      icon: Wrench,
      gradient: "from-orange-500 to-red-500"
    },
    { 
      text: t('quickTurnaround'), 
      desc: t('mostRepairs24Hours'), 
      icon: Clock,
      gradient: "from-blue-500 to-indigo-500"
    },
    { 
      text: t('warrantyGuarantee'), 
      desc: t('qualityGuarantee'), 
      icon: ShieldCheck,
      gradient: "from-green-500 to-teal-500"
    },
    { 
      text: t('premiumQuality'), 
      desc: t('genuineParts'), 
      icon: Award,
      gradient: "from-purple-500 to-pink-500"
    }
  ], [t]);
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
                        {t('fixYourDevice')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4 text-lg md:text-xl text-gray-300"
                    >
                        {t('expertTechnicians')}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8 flex justify-center gap-4"
                    >
                        <Link href="/repair">
                            <CustomButton variant="outline" className="border-secondary bg-secondary text-primary hover:bg-secondary hover:text-primary">
                                {t('bookRepair')}
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
                        <h3 className="text-3xl font-bold mb-4">{t('ourRepairServices')}</h3>
                        <p className="text-gray-300 max-w-2xl mx-auto">{t('professionalRepairs')}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {repairServices.map((service, idx) => (
                         <motion.div
                         key={service.id}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.5, delay: 1.1 + idx * 0.1 }}
                         className="group relative"
                     >       <div className="bg-white/10 /10 backdrop-blur-sm rounded-md p-2 shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20 hover:border-secondary/50 h-full overflow-hidden">
                                    {/* Popular Badge */}
                                 

                                    <div className="text-center h-full flex flex-col">
                                        {/* Service Icon */}
                                        <div className="mb-6 bg-gradient-to-br p-3 from-white/10 to-white/5 rounded-md group-hover:from-secondary/20 group-hover:to-primary/20 transition-all duration-500 relative overflow-hidden">
                                            <Image
                                                width={400}
                                                height={400}
                                                src={service.src}
                                                alt={service.alt}
                                                className="w-full rounded-md object-contain group-hover:scale-110 transition-transform duration-500"
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
                        <h3 className="text-2xl font-bold mb-4">{t('trustedByBrands')}</h3>
                        <p className="text-gray-300">{t('weRepairDevices')}</p>
                    </div>

                    <div className="relative overflow-hidden backdrop-blur-sm rounded-lg py-8">
                        <div className="flex animate-marquee">
                            {/* First set of logos */}
                            {brands.map((item, idx) => (
                                <div key={`first-${item.id}`} className="flex-shrink-0 mx-6 group">
                                    <div className="w-16 h-16 shadow-lg rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/5 bg-white/3">
                                        <img
                                            src={item.logo}
                                            alt={item.name}
                                            className="w-12 h-12 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                </div>
                            ))}
                            {/* Duplicate set for seamless loop */}
                            {brands.map((item, idx) => (
                                <div key={`second-${item.id}`} className="flex-shrink-0 mx-6 group">
                                    <div className="w-16 h-16 shadow-lg rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/5 bg-white/3">
                                        <img
                                            src={item.logo}
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
        <h3 className="text-3xl font-bold mb-4 text-white">{t('whyChooseUs')}</h3>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          {t('weProvideExceptional')}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
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