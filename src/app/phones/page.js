import React from 'react';
import Image from 'next/image';

export default function PhonesPage() {
    const phoneBrands = [
        { name: 'iPhone', image: '/Apple.png', models: ['iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12'] },
        { name: 'Samsung', image: '/Samsung.png', models: ['Galaxy S24', 'Galaxy S23', 'Galaxy A54', 'Galaxy A34'] },
        { name: 'Huawei', image: '/Huawei.png', models: ['P60 Pro', 'Mate 50', 'Nova 11', 'P50 Pro'] },
        { name: 'Xiaomi', image: '/Xiaomi.png', models: ['13 Pro', '12T Pro', 'Redmi Note 12', 'Redmi 12'] },
        { name: 'Oppo', image: '/Oppo.png', models: ['Find X6', 'Reno 10', 'A78', 'A58'] },
        { name: 'Honor', image: '/Honor.png', models: ['Magic 5', '90 Pro', '70', 'X9a'] }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
           <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
                        Refurbished Phones
                    </h1>
                    
                    <p className="text-center text-gray-600 mb-12 text-lg">
                        High-quality refurbished phones with warranty and excellent condition
                    </p>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {phoneBrands.map((brand, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center mb-4">
                                    <Image 
                                        src={brand.image} 
                                        alt={brand.name}
                                        width={48}
                                        height={48}
                                        className="object-contain mr-4"
                                    />
                                    <h3 className="text-xl font-semibold text-gray-800">{brand.name}</h3>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                    {brand.models.map((model, modelIndex) => (
                                        <div key={modelIndex} className="text-gray-600 hover:text-blue-600 cursor-pointer">
                                            {model}
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="text-sm text-gray-500">
                                    Starting from $299
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Refurbished Phones?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Quality Assurance</h3>
                                <p className="text-gray-600">All phones are thoroughly tested and certified to work like new.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Warranty Included</h3>
                                <p className="text-gray-600">12-month warranty on all refurbished devices.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Cost Effective</h3>
                                <p className="text-gray-600">Save up to 50% compared to brand new devices.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Environmentally Friendly</h3>
                                <p className="text-gray-600">Reduce electronic waste by giving devices a second life.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
