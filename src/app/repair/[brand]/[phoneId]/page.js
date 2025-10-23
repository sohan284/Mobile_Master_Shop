'use client';   
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageTransition from '@/components/animations/PageTransition';
import { CustomButton } from '@/components/ui/button';

// Phone models data (same as in parent page)
const phoneModels = [
    // Apple Models
    { id: 1, name: 'iPhone 15 Pro Max', brand: 'apple', image: '/Apple.png', price: 'From $89', storage: '256GB/512GB/1TB' },
    { id: 2, name: 'iPhone 15 Pro', brand: 'apple', image: '/Apple.png', price: 'From $79', storage: '128GB/256GB/512GB/1TB' },
    { id: 3, name: 'iPhone 15', brand: 'apple', image: '/Apple.png', price: 'From $69', storage: '128GB/256GB/512GB' },
    { id: 4, name: 'iPhone 14 Pro Max', brand: 'apple', image: '/Apple.png', price: 'From $79', storage: '128GB/256GB/512GB/1TB' },
    { id: 5, name: 'iPhone 14 Pro', brand: 'apple', image: '/Apple.png', price: 'From $69', storage: '128GB/256GB/512GB/1TB' },
    { id: 6, name: 'iPhone 14', brand: 'apple', image: '/Apple.png', price: 'From $59', storage: '128GB/256GB/512GB' },
    { id: 7, name: 'iPhone 13 Pro Max', brand: 'apple', image: '/Apple.png', price: 'From $69', storage: '128GB/256GB/512GB/1TB' },
    { id: 8, name: 'iPhone 13 Pro', brand: 'apple', image: '/Apple.png', price: 'From $59', storage: '128GB/256GB/512GB/1TB' },
    
    // Samsung Models
    { id: 9, name: 'Galaxy S24 Ultra', brand: 'samsung', image: '/Samsung.png', price: 'From $79', storage: '256GB/512GB/1TB' },
    { id: 10, name: 'Galaxy S24+', brand: 'samsung', image: '/Samsung.png', price: 'From $69', storage: '256GB/512GB' },
    { id: 11, name: 'Galaxy S24', brand: 'samsung', image: '/Samsung.png', price: 'From $59', storage: '128GB/256GB/512GB' },
    { id: 12, name: 'Galaxy S23 Ultra', brand: 'samsung', image: '/Samsung.png', price: 'From $69', storage: '256GB/512GB/1TB' },
    { id: 13, name: 'Galaxy S23+', brand: 'samsung', image: '/Samsung.png', price: 'From $59', storage: '256GB/512GB' },
    { id: 14, name: 'Galaxy A54', brand: 'samsung', image: '/Samsung.png', price: 'From $39', storage: '128GB/256GB' },
    { id: 15, name: 'Galaxy A34', brand: 'samsung', image: '/Samsung.png', price: 'From $35', storage: '128GB/256GB' },
    
    // Huawei Models
    { id: 16, name: 'Huawei P60 Pro', brand: 'huawei', image: '/Huawei.png', price: 'From $69', storage: '256GB/512GB' },
    { id: 17, name: 'Huawei Mate 50', brand: 'huawei', image: '/Huawei.png', price: 'From $59', storage: '128GB/256GB/512GB' },
    { id: 18, name: 'Huawei Nova 11', brand: 'huawei', image: '/Huawei.png', price: 'From $49', storage: '128GB/256GB' },
    { id: 19, name: 'Huawei P50 Pro', brand: 'huawei', image: '/Huawei.png', price: 'From $59', storage: '128GB/256GB/512GB' },
    
    // Xiaomi Models
    { id: 20, name: 'Xiaomi 13 Pro', brand: 'xiaomi', image: '/Xiaomi.png', price: 'From $59', storage: '128GB/256GB/512GB' },
    { id: 21, name: 'Xiaomi 12T Pro', brand: 'xiaomi', image: '/Xiaomi.png', price: 'From $49', storage: '128GB/256GB' },
    { id: 22, name: 'Redmi Note 12', brand: 'xiaomi', image: '/Xiaomi.png', price: 'From $29', storage: '64GB/128GB/256GB' },
    { id: 23, name: 'Redmi 12', brand: 'xiaomi', image: '/Xiaomi.png', price: 'From $25', storage: '64GB/128GB' },
    
    // Oppo Models
    { id: 24, name: 'Oppo Find X6', brand: 'oppo', image: '/Oppo.png', price: 'From $65', storage: '256GB/512GB' },
    { id: 25, name: 'Oppo Reno 10', brand: 'oppo', image: '/Oppo.png', price: 'From $45', storage: '128GB/256GB' },
    { id: 26, name: 'Oppo A78', brand: 'oppo', image: '/Oppo.png', price: 'From $32', storage: '128GB/256GB' },
    { id: 27, name: 'Oppo A58', brand: 'oppo', image: '/Oppo.png', price: 'From $28', storage: '128GB/256GB' },
    
    // Honor Models
    { id: 28, name: 'Honor Magic 5', brand: 'honor', image: '/Honor.png', price: 'From $62', storage: '256GB/512GB' },
    { id: 29, name: 'Honor 90 Pro', brand: 'honor', image: '/Honor.png', price: 'From $52', storage: '256GB/512GB' },
    { id: 30, name: 'Honor 70', brand: 'honor', image: '/Honor.png', price: 'From $42', storage: '128GB/256GB' },
    { id: 31, name: 'Honor X9a', brand: 'honor', image: '/Honor.png', price: 'From $35', storage: '128GB/256GB' }
];

export default function PhoneModelPage({ params }) {
    const { brand, phoneId } = params;
    const phoneIdNum = parseInt(phoneId);
    const phone = phoneModels.find(p => p.id === phoneIdNum && p.brand === brand);
    const [selectedServices, setSelectedServices] = useState([]);

    // If phone not found, show 404
    if (!phone) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-gray-800 mb-4">Phone Model Not Found</h1>
                    <p className="text-gray-600 mb-6">The requested phone model is not available.</p>
                    <Link href={`/repair/${brand}`} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                        Back to {brand.charAt(0).toUpperCase() + brand.slice(1)} Repair
                    </Link>
                </div>
            </div>
        );
    }

    const repairServices = [
        {
            id: 1,
            service: 'Screen Repair',
            description: `Cracked screen, broken display, or touch issues`,
            time: '2-3 hours',
            icon: '📱'
        },
        {
            id: 2,
            service: 'Battery Issues',
            description: `Battery drains quickly, won't charge, or phone shuts down unexpectedly`,
            time: '1-2 hours',
            icon: '🔋'
        },
        {
            id: 3,
            service: 'Camera Problems',
            description: `Blurry photos, camera won't focus, or camera app crashes`,
            time: '2-3 hours',
            icon: '📷'
        },
        {
            id: 4,
            service: phone.brand === 'apple' ? 'Water Damage' : 'Charging Issues',
            description: phone.brand === 'apple' 
                ? `Phone exposed to water, moisture damage, or liquid contact`
                : `Charging port not working, cable issues, or slow charging`,
            time: '3-4 hours',
            icon: phone.brand === 'apple' ? '💧' : '🔌'
        },
        {
            id: 5,
            service: 'Audio Problems',
            description: `No sound, distorted audio, or speaker not working`,
            time: '1-2 hours',
            icon: '🔊'
        },
        {
            id: 6,
            service: 'Button Issues',
            description: `Home button, power button, or volume buttons not responding`,
            time: '2-3 hours',
            icon: '🔘'
        },
        {
            id: 7,
            service: 'Back Glass Damage',
            description: `Cracked back panel, glass damage, or cosmetic issues`,
            time: '2-3 hours',
            icon: '🪟'
        },
        {
            id: 8,
            service: 'Performance Issues',
            description: `Phone running slow, apps crashing, or freezing`,
            time: '1-2 hours',
            icon: '⚡'
        },
        {
            id: 9,
            service: 'Software Problems',
            description: `System errors, update issues, or software glitches`,
            time: '30-60 minutes',
            icon: '💻'
        }
    ];

    const handleServiceSelect = (serviceId) => {
        setSelectedServices(prev => {
            if (prev.includes(serviceId)) {
                // If already selected, remove it
                return prev.filter(id => id !== serviceId);
            } else {
                // If not selected and we have less than 3, add it
                if (prev.length < 3) {
                    return [...prev, serviceId];
                }
                // If already 3 selected, don't add more
                return prev;
            }
        });
    };

    return (
        <PageTransition>
        <div className="min-h-screen ">
          <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Link href="/repair" className="text-primary hover:text-blue-800">
                            ← Back to Repair Services
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <Link href={`/repair/${brand}`} className="text-primary hover:text-blue-800">
                            {brand.charAt(0).toUpperCase() + brand.slice(1)} Repair
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="flex items-center mb-8">
                        <Image
                            src={phone.image}
                            alt={phone.name}
                            width={64}
                            height={64}
                            className="mr-4"
                        />
                        <div>
                            <h1 className="title text-primary">
                                {phone.name} Repair Services
                            </h1>
                            <p className="subtitle">
                                Professional repair services for {phone.name}
                            </p>
                            <div className="mt-2 paragraph">
                                Storage: {phone.storage} • Starting from {phone.price}
                            </div>
                        </div>
                    </div>
                    
                    {/* Step System */}
                    <div className="mb-12 bg-white p-8 rounded shadow-xl border border-gray-100 relative overflow-hidden">
                        <div className="bg-primary text-white w-30 h-30 absolute -top-10 pl-14 pt-8 -left-10 font-serif rounded-full text-7xl font-extrabold shadow-md">
                            3
                        </div>
                        <h2 className="title text-primary mb-8 text-center">
                            Choose your repair service
                        </h2>
                             {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {repairServices.map((service) => {
                            const isSelected = selectedServices.includes(service.id);
                            const isDisabled = !isSelected && selectedServices.length >= 3;
                            return (
                                <div 
                                    key={service.id} 
                                    onClick={() => handleServiceSelect(service.id)}
                                    className={` p-3 pb-1 rounded-xl shadow transition-all duration-300 border-2 cursor-pointer ${
                                        isSelected 
                                            ? ' border-primary shadow-primary' 
                                            : isDisabled
                                            ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                                            : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-xl'
                                    }`}
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="text-xl mr-3">{service.icon}</div>
                                        <h3 className={`subtitle ${
                                            isSelected ? 'text-primary' : 'text-gray-800'
                                        }`}>
                                            {service.service}
                                        </h3>
                                        {isSelected && (
                                            <div className="ml-auto">
                                                <div className="w-6 h-6  bg-primary rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm">✓</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className={`mb-4 paragraph ${
                                        isSelected ? 'text-primary' : isDisabled ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {service.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Warning Message */}
                    {selectedServices.length >= 3 && (
                        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="text-yellow-400 text-xl">⚠️</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        <strong>Maximum limit reached:</strong> You can select up to 3 services. 
                                        Deselect a service to choose a different one.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Continue Button */}
                    {selectedServices.length > 0 && (
                        <div className="text-center mb-8">
                            <CustomButton className='bg-primary text-secondary hover:bg-primary/90'>
                            Continue with {selectedServices.length} selected service{selectedServices.length > 1 ? 's' : ''}
                            </CustomButton>
                        </div>
                    )}
                    </div>
                    
                    
                    {/* Phone Specifications */}
                    <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                        <h2 className="title text-gray-800 mb-4">Phone Specifications</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="subtitle text-gray-800 mb-2">Model Information</h3>
                                <p className="paragraph">Brand: {phone.brand.charAt(0).toUpperCase() + phone.brand.slice(1)}</p>
                                <p className="paragraph">Model: {phone.name}</p>
                                <p className="paragraph">Storage Options: {phone.storage}</p>
                            </div>
                            <div>
                                <h3 className="subtitle text-gray-800 mb-2">Repair Information</h3>
                                <p className="paragraph">Repair Price Range: {phone.price}</p>
                                <p className="paragraph">Warranty: 90 days on all repairs</p>
                                <p className="paragraph">Turnaround: Same day available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
        </PageTransition>
    );
}


