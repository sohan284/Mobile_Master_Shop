import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BannerCard() {
    const cardsData = [
        {
            id: 1,
            image: '/1.png',
            heading: 'Repair',
            buttonText: 'Make a quote',
            link: '/repair',
        },
        {
            id: 2,
            image: '/2.png',
            heading: 'Phone',
            buttonText: 'See the Phones Ones',
            link: '/phones',
        },
        {
            id: 3,
            image: '/3.png',
            heading: 'Accessories',
            buttonText: 'See the range',
            link: '/accessories',
        },
    ];

    return (
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 gap-6 py-20 max-w-[1200px] mx-auto">
            {cardsData.map((card) => (
                <Card key={card.id} className="shadow-lg overflow-visible w-80 md:w-96">
                    <CardContent className="px-6">
                        {/* Image (absolute positioned - overlapping top) */}
                        <div className='flex'>
                            <img
                                src={card.image}
                                alt={card.heading}
                                className="w-14 obeject-contain -mt-16 mb-2 ml-8"
                            />

                            {/* Heading */}
                            <h2 className="text-2xl font-bold text-blue-900 ml-6 mb-4">
                                {card.heading}
                            </h2>
                        </div>

                        {/* Button */}
                        <Link href={card.link}>
                            <Button
                                className="w-full cursor-pointer text-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-6"
                            >
                                {card.buttonText}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}