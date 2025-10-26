import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/button';
import Link from 'next/link';
import MotionFade from '@/components/animations/MotionFade';

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
            {cardsData.map((card, idx) => (
                <MotionFade key={card.id} delay={idx * 0.05}>
              <Card className="group relative shadow-xl overflow-visible w-64 md:w-80 transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1 bg-white/10  border-2 border-slate-200 hover:border-blue-400">
    <CardContent className="px-5 pb-5 pt-16">
        {/* Floating Image Container */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-600 rounded-2xl shadow-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
            <div className="w-full h-full bg-white/10  rounded-xl p-2.5 flex items-center justify-center">
                <img
                    src={card.image}
                    alt={card.heading}
                    className="w-full h-full object-contain"
                />
            </div>
        </div>

        {/* Decorative accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>

        {/* Content Section */}
        <div className="text-center space-y-4">
            {/* Heading */}
            <h2 className="text-xl md:text-2xl font-bold text-primary leading-tight transition-all duration-300 group-hover:scale-105">
                {card.heading}
            </h2>

            {/* Decorative divider */}
            <div className="h-1 w-16 mx-auto bg-primary rounded-full"></div>

            {/* Button */}
            <Link href={card.link} className="block mt-5 group rounded-none">
                <CustomButton>
                    {card.buttonText}
                </CustomButton>
            </Link>
        </div>
    </CardContent>
</Card></MotionFade>
            ))}
        </div>
    );
}