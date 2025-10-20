import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import PageTransition from '@/components/animations/PageTransition';

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

    // If phone not found, show 404
    if (!phone) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Phone Model Not Found</h1>
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
            description: `Professional screen replacement for ${phone.name}`,
            price: phone.brand === 'apple' ? 'From $89' : 'From $69',
            time: '2-3 hours'
        },
        {
            id: 2,
            service: 'Battery Replacement',
            description: `High-quality battery replacement for ${phone.name}`,
            price: phone.brand === 'apple' ? 'From $49' : 'From $35',
            time: '1-2 hours'
        },
        {
            id: 3,
            service: 'Camera Repair',
            description: `Camera module replacement for ${phone.name}`,
            price: phone.brand === 'apple' ? 'From $79' : 'From $59',
            time: '2-3 hours'
        },
        {
            id: 4,
            service: phone.brand === 'apple' ? 'Water Damage Repair' : 'Charging Port Repair',
            description: phone.brand === 'apple' 
                ? `Professional water damage assessment for ${phone.name}`
                : `USB-C charging port replacement for ${phone.name}`,
            price: phone.brand === 'apple' ? 'From $99' : 'From $45',
            time: '3-4 hours'
        }
    ];

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
                        <span className="mx-2 text-gray-400">/</span>
                        <Link href={`/repair/${brand}`} className="text-blue-600 hover:text-blue-800">
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
                            <h1 className="text-4xl font-bold text-blue-900">
                                {phone.name} Repair Services
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Professional repair services for {phone.name}
                            </p>
                            <div className="mt-2 text-sm text-gray-500">
                                Storage: {phone.storage} • Starting from {phone.price}
                            </div>
                        </div>
                    </div>
                    
                    {/* Step System */}
                    <div className="mb-12 bg-white p-8 rounded shadow-xl border border-gray-100 relative overflow-hidden">
                        <div className="bg-[#134B81] text-white w-30 h-30 absolute -top-10 pl-14 pt-8 -left-10 font-serif rounded-full text-7xl font-extrabold shadow-md">
                            3
                        </div>
                        <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">
                            Choose your repair service
                        </h2>
                    </div>
                    
                    {/* Services Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {repairServices.map((service) => (
                            <div key={service.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                    {service.service}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {service.description}
                                </p>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {service.price}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {service.time}
                                    </div>
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
                                    Get Quote for {phone.name}
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    {/* Phone Specifications */}
                    <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Phone Specifications</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Model Information</h3>
                                <p className="text-gray-600">Brand: {phone.brand.charAt(0).toUpperCase() + phone.brand.slice(1)}</p>
                                <p className="text-gray-600">Model: {phone.name}</p>
                                <p className="text-gray-600">Storage Options: {phone.storage}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Repair Information</h3>
                                <p className="text-gray-600">Repair Price Range: {phone.price}</p>
                                <p className="text-gray-600">Warranty: 90 days on all repairs</p>
                                <p className="text-gray-600">Turnaround: Same day available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
        </PageTransition>
    );
}
