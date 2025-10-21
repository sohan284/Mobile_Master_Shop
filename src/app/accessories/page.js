import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageTransition from '@/components/animations/PageTransition';

export default function AccessoriesPage() {
    const accessories = [
        {
            category: 'Cases & Protection',
            items: [
                { name: 'Clear Phone Cases', price: '$15', image: '/hood.png' },
                { name: 'Leather Cases', price: '$25', image: '/hood.png' },
                { name: 'Screen Protectors', price: '$8', image: '/screen.png' },
                { name: 'Tempered Glass', price: '$12', image: '/screen.png' }
            ]
        },
        {
            category: 'Charging & Power',
            items: [
                { name: 'Wireless Chargers', price: '$20', image: '/battery.png' },
                { name: 'Fast Chargers', price: '$18', image: '/battery.png' },
                { name: 'Power Banks', price: '$30', image: '/battery.png' },
                { name: 'Cables & Adapters', price: '$10', image: '/battery.png' }
            ]
        },
        {
            category: 'Audio & Camera',
            items: [
                { name: 'Bluetooth Headphones', price: '$35', image: '/camera.png' },
                { name: 'Phone Stands', price: '$12', image: '/camera.png' },
                { name: 'Camera Lenses', price: '$25', image: '/camera.png' },
                { name: 'Selfie Sticks', price: '$15', image: '/camera.png' }
            ]
        }
    ];

    return (
        <PageTransition>
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-primary mb-8 text-center">
                        Phone Accessories
                    </h1>
                    
                    <p className="text-center text-gray-600 mb-12 text-lg">
                        Premium accessories to enhance and protect your mobile devices
                    </p>
                    
                    {accessories.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">{category.category}</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {category.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                        <div className="flex justify-center mb-3">
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className="w-16 h-16 object-contain"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                                            {item.name}
                                        </h3>
                                        <div className="text-xl font-bold text-primary text-center">
                                            {item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Our Accessories?</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl">🛡️</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Premium Quality</h3>
                                <p className="text-gray-600">High-quality materials and construction for durability.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Great Value</h3>
                                <p className="text-gray-600">Competitive prices without compromising on quality.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl">🚚</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Fast Shipping</h3>
                                <p className="text-gray-600">Quick delivery to your doorstep.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </PageTransition>
    );
}
