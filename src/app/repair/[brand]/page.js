"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageTransition from '@/components/animations/PageTransition';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Phone models data with brand property
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

// Brand configuration data
const brandData = {
    apple: {
        name: 'Apple',
        logo: '/Apple.png',
        fullName: 'Apple iPhone',
        description: 'Professional repair services for all iPhone models',
        services: [
            {
                id: 1,
                service: 'iPhone Screen Repair',
                description: 'Professional iPhone screen replacement with genuine Apple parts',
                price: 'From $89',
                models: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Series', 'iPhone 13 Series']
            },
            {
                id: 2,
                service: 'iPhone Battery Replacement',
                description: 'High-quality battery replacement to restore your iPhone\'s battery life',
                price: 'From $49',
                models: ['All iPhone Models']
            },
            {
                id: 3,
                service: 'iPhone Camera Repair',
                description: 'Camera module replacement for all iPhone models',
                price: 'From $79',
                models: ['iPhone 15 Series', 'iPhone 14 Series', 'iPhone 13 Series']
            },
            {
                id: 4,
                service: 'iPhone Water Damage Repair',
                description: 'Professional water damage assessment and repair services',
                price: 'From $99',
                models: ['All iPhone Models']
            }
        ],
        features: [
            {
                title: 'Genuine Parts',
                description: 'We use only genuine Apple parts and components for all repairs.'
            },
            {
                title: 'Certified Technicians',
                description: 'Our technicians are Apple-certified with years of experience.'
            },
            {
                title: 'Warranty',
                description: '90-day warranty on all Apple iPhone repairs.'
            },
            {
                title: 'Same-Day Service',
                description: 'Most repairs completed the same day you bring your device.'
            }
        ]
    },
    samsung: {
        name: 'Samsung',
        logo: '/Samsung.png',
        fullName: 'Samsung Galaxy',
        description: 'Professional repair services for all Samsung Galaxy models',
        services: [
            {
                id: 1,
                service: 'Samsung Galaxy Screen Repair',
                description: 'Professional Samsung Galaxy screen replacement with genuine parts',
                price: 'From $79',
                models: ['Galaxy S24 Series', 'Galaxy S23 Series', 'Galaxy A54', 'Galaxy A34']
            },
            {
                id: 2,
                service: 'Samsung Battery Replacement',
                description: 'High-quality battery replacement for all Samsung Galaxy models',
                price: 'From $39',
                models: ['All Galaxy Models']
            },
            {
                id: 3,
                service: 'Samsung Camera Repair',
                description: 'Camera module replacement for Samsung Galaxy phones',
                price: 'From $69',
                models: ['Galaxy S24 Series', 'Galaxy S23 Series', 'Galaxy A Series']
            },
            {
                id: 4,
                service: 'Samsung Charging Port Repair',
                description: 'USB-C charging port replacement and repair',
                price: 'From $49',
                models: ['All Galaxy Models']
            }
        ],
        features: [
            {
                title: 'Genuine Samsung Parts',
                description: 'We use only genuine Samsung parts and components for all repairs.'
            },
            {
                title: 'Expert Technicians',
                description: 'Our technicians are Samsung-certified with extensive experience.'
            },
            {
                title: 'Warranty',
                description: '90-day warranty on all Samsung Galaxy repairs.'
            },
            {
                title: 'Fast Turnaround',
                description: 'Most Samsung repairs completed within 24 hours.'
            }
        ]
    },
    huawei: {
        name: 'Huawei',
        logo: '/Huawei.png',
        fullName: 'Huawei',
        description: 'Professional repair services for all Huawei models',
        services: [
            {
                id: 1,
                service: 'Huawei Screen Repair',
                description: 'Professional Huawei screen replacement with genuine parts',
                price: 'From $69',
                models: ['P60 Pro', 'Mate 50', 'Nova 11', 'P50 Pro']
            },
            {
                id: 2,
                service: 'Huawei Battery Replacement',
                description: 'High-quality battery replacement for all Huawei models',
                price: 'From $35',
                models: ['All Huawei Models']
            },
            {
                id: 3,
                service: 'Huawei Camera Repair',
                description: 'Camera module replacement for Huawei phones',
                price: 'From $59',
                models: ['P60 Pro', 'Mate 50', 'Nova 11']
            },
            {
                id: 4,
                service: 'Huawei Charging Port Repair',
                description: 'USB-C charging port replacement and repair',
                price: 'From $45',
                models: ['All Huawei Models']
            }
        ],
        features: [
            {
                title: 'Genuine Huawei Parts',
                description: 'We use only genuine Huawei parts and components for all repairs.'
            },
            {
                title: 'Expert Technicians',
                description: 'Our technicians are Huawei-certified with extensive experience.'
            },
            {
                title: 'Warranty',
                description: '90-day warranty on all Huawei repairs.'
            },
            {
                title: 'Fast Service',
                description: 'Most Huawei repairs completed within 24 hours.'
            }
        ]
    },
    xiaomi: {
        name: 'Xiaomi',
        logo: '/Xiaomi.png',
        fullName: 'Xiaomi',
        description: 'Professional repair services for all Xiaomi models',
        services: [
            {
                id: 1,
                service: 'Xiaomi Screen Repair',
                description: 'Professional Xiaomi screen replacement with genuine parts',
                price: 'From $59',
                models: ['13 Pro', '12T Pro', 'Redmi Note 12', 'Redmi 12']
            },
            {
                id: 2,
                service: 'Xiaomi Battery Replacement',
                description: 'High-quality battery replacement for all Xiaomi models',
                price: 'From $29',
                models: ['All Xiaomi Models']
            },
            {
                id: 3,
                service: 'Xiaomi Camera Repair',
                description: 'Camera module replacement for Xiaomi phones',
                price: 'From $49',
                models: ['13 Pro', '12T Pro', 'Redmi Note 12']
            },
            {
                id: 4,
                service: 'Xiaomi Charging Port Repair',
                description: 'USB-C charging port replacement and repair',
                price: 'From $35',
                models: ['All Xiaomi Models']
            }
        ],
        features: [
            {
                title: 'Genuine Xiaomi Parts',
                description: 'We use only genuine Xiaomi parts and components for all repairs.'
            },
            {
                title: 'Expert Technicians',
                description: 'Our technicians are Xiaomi-certified with extensive experience.'
            },
            {
                title: 'Warranty',
                description: '90-day warranty on all Xiaomi repairs.'
            },
            {
                title: 'Fast Service',
                description: 'Most Xiaomi repairs completed within 24 hours.'
            }
        ]
    },
    oppo: {
        name: 'Oppo',
        logo: '/Oppo.png',
        fullName: 'Oppo',
        description: 'Professional repair services for all Oppo models',
        services: [
            {
                id: 1,
                service: 'Oppo Screen Repair',
                description: 'Professional Oppo screen replacement with genuine parts',
                price: 'From $65',
                models: ['Find X6', 'Reno 10', 'A78', 'A58']
            },
            {
                id: 2,
                service: 'Oppo Battery Replacement',
                description: 'High-quality battery replacement for all Oppo models',
                price: 'From $32',
                models: ['All Oppo Models']
            },
            {
                id: 3,
                service: 'Oppo Camera Repair',
                description: 'Camera module replacement for Oppo phones',
                price: 'From $55',
                models: ['Find X6', 'Reno 10', 'A78']
            },
            {
                id: 4,
                service: 'Oppo Charging Port Repair',
                description: 'USB-C charging port replacement and repair',
                price: 'From $42',
                models: ['All Oppo Models']
            }
        ],
        features: [
            {
                title: 'Genuine Oppo Parts',
                description: 'We use only genuine Oppo parts and components for all repairs.'
            },
            {
                title: 'Expert Technicians',
                description: 'Our technicians are Oppo-certified with extensive experience.'
            },
            {
                title: 'Warranty',
                description: '90-day warranty on all Oppo repairs.'
            },
            {
                title: 'Fast Service',
                description: 'Most Oppo repairs completed within 24 hours.'
            }
        ]
    },
    honor: {
        name: 'Honor',
        logo: '/Honor.png',
        fullName: 'Honor',
        description: 'Professional repair services for all Honor models',
        services: [
            {
                id: 1,
                service: 'Honor Screen Repair',
                description: 'Professional Honor screen replacement with genuine parts',
                price: 'From $62',
                models: ['Magic 5', '90 Pro', '70', 'X9a']
            },
            {
                id: 2,
                service: 'Honor Battery Replacement',
                description: 'High-quality battery replacement for all Honor models',
                price: 'From $33',
                models: ['All Honor Models']
            },
            {
                id: 3,
                service: 'Honor Camera Repair',
                description: 'Camera module replacement for Honor phones',
                price: 'From $52',
                models: ['Magic 5', '90 Pro', '70']
            },
            {
                id: 4,
                service: 'Honor Charging Port Repair',
                description: 'USB-C charging port replacement and repair',
                price: 'From $40',
                models: ['All Honor Models']
            }
        ],
        features: [
            {
                title: 'Genuine Honor Parts',
                description: 'We use only genuine Honor parts and components for all repairs.'
            },
            {
                title: 'Expert Technicians',
                description: 'Our technicians are Honor-certified with extensive experience.'
            },
            {
                title: 'Warranty',
                description: '90-day warranty on all Honor repairs.'
            },
            {
                title: 'Fast Service',
                description: 'Most Honor repairs completed within 24 hours.'
            }
        ]
    }
};

export default function BrandRepairPage({ params }) {
    const { brand } = params;
    const brandInfo = brandData[brand];
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filter phone models by brand
    const brandPhones = phoneModels.filter(phone => phone.brand === brand);
    
    // Filter phones based on search term
    const filteredPhones = brandPhones.filter(phone =>
        phone.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // If brand not found, show 404
    if (!brandInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Brand Not Found</h1>
                    <p className="text-gray-600 mb-6">The requested brand repair service is not available.</p>
                    <Link href="/repair" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                        Back to Repair Services
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <PageTransition>
        <div className="min-h-screen ">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Link href="/repair" className="text-blue-600 hover:text-blue-800">
                            ← Back to Repair Services
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="flex items-center mb-8">
                        <Image
                            src={brandInfo.logo}
                            alt={brandInfo.name}
                            width={64}
                            height={64}
                            className="mr-4"
                        />
                        <div>
                            <h1 className="text-4xl font-bold text-blue-900">
                                {brandInfo.fullName} Repair Services
                            </h1>
                            <p className="text-gray-600 text-lg">
                                {brandInfo.description}
                            </p>
                        </div>
                    </div>
                    
                    {/* Step System */}
                    <div className="mb-12 bg-white p-8 rounded shadow-xl border border-gray-100 relative overflow-hidden">
                        <div className="bg-[#134B81] text-white w-30 h-30 absolute -top-10 pl-14 pt-8 -left-10 font-serif rounded-full text-7xl font-extrabold shadow-md">
                            2
                        </div>
                        <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">
                            Choose your phone model
                        </h2>
                        
                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative mx-auto">
                                <input
                                    type="text"
                                    placeholder={`Search ${brandInfo.name} phones...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 rounded-none focus:outline-none focus:border-blue-500"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                          {/* Phone Models Section */}
                    <div className="mb-12">
                        {filteredPhones.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredPhones.map((phone) => (
                                    <Link key={phone.id} href={`/repair/${brand}/${phone.id}`}>
                                        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                                            <div className="flex items-center mb-3">
                                                <Image
                                                    src={phone.image}
                                                    alt={phone.name}
                                                    width={32}
                                                    height={32}
                                                    className="object-contain mr-3"
                                                />
                                                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                                                    {phone.name}
                                                </h3>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs text-gray-500">
                                                    Storage: {phone.storage}
                                                </div>
                                                <div className="text-sm font-bold text-blue-600">
                                                    {phone.price}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-500 text-lg mb-4">
                                    No phones found matching &quot;{searchTerm}&quot;
                                </div>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Clear search
                                </button>
                            </div>
                        )}
                    </div>
                    
                    </div>
                
                  
                    {/* Why Choose Us */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Our {brandInfo.name} Repair Services?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {brandInfo.features.map((feature, index) => (
                                <div key={index}>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </PageTransition>
    );
}
