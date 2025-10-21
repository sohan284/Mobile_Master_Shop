import React from 'react';
import { CustomButton } from '@/components/ui/button';
import MotionFade from '@/components/animations/MotionFade';

export default function Repair() {
    const brandLogo = [
        { id: 1, src: "/Apple.png", alt: "Apple logo" },
        { id: 2, src: "/Samsung.png", alt: "Samsung logo" },
        { id: 3, src: "/Xiaomi.png", alt: "Xiaomi logo" },
        { id: 4, src: "/Huawei.png", alt: "Huawei logo" },
        { id: 5, src: "/Honor.png", alt: "Honor logo" },
        { id: 6, src: "/Oppo.png", alt: "Oppo logo" },
    ];

    const imagePath = [
        { id: 1, src: "/screen.png", alt: "Screen" },
        { id: 2, src: "/battery.png", alt: "Battery" },
        { id: 3, src: "/camera.png", alt: "Camera" },
        { id: 4, src: "/hood.png", alt: "Hood" }
    ];

    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto flex flex-col justify-center items-center gap-8 px-4 lg:px-8">

                {/* Phone icon */}
                <img src="/1.png" alt="Phone" className="w-16 sm:w-20" />

                {/* Title */}
                <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#6B7E8D] text-center">
                    Repairs
                </h2>

                {/* Keep this second div's UI exactly the same */}
                <div className="p-4 bg-[#6B7E8D] shadow-[10px_10px_0px_#a8c2d9]">
                    <p className="text-center text-lg max-w-3xl font-bold text-white">
                        Repairs to all brands, 12-month warranty
                    </p>
                </div>

                {/* Subtext */}
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-center px-2 max-w-2xl leading-relaxed">
                    Got a broken screen or a dead battery? Save will repair your product and give you a
                    <span className="underline text-[#00bfb2]"> €25 repair bonus.</span>
                </h2>

                {/* Brand logos */}
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 pt-4">
                    {brandLogo.map((item, idx) => (
                        <MotionFade key={item.id} delay={idx * 0.04}>
                            <div className="w-12 sm:w-14 md:w-16 flex items-center justify-center transition-transform duration-200 ease-out hover:scale-110">
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </MotionFade>
                    ))}
                </div>

                {/* Repair categories grid */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-4 mr-2 md:m-0'>
                    {imagePath.map((item, idx) => (
                        <MotionFade key={item.id} delay={idx * 0.05}>
                            <div className="mb-6 flex items-center transition-all duration-200 ease-out hover:-translate-y-0.5">
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className="w-16 object-contain transition-transform duration-200 ease-out group-hover:scale-110"
                                />
                                <h3 className="text-2xl w-32 font-bold text-center bg-white p-6 rounded-r-lg">{item.alt}</h3>
                            </div>
                        </MotionFade>
                    ))}
                </div>

                {/* CTA Button */}
                <CustomButton className='bg-primary text-secondary hover:bg-primary/90' >
                    Get the price of my repair
                </CustomButton>
            </div>
        </div>
    );
}
