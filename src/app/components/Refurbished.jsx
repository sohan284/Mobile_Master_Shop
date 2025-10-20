import React from "react";
import { Card, CardContent, } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function Refurbished() {
    const images = [
        { id: 1, name: "iphone-11-noir.png", path: "/iphone-11-noir.png", price: 299 },
        { id: 2, name: "iPhone-12.png", path: "/iPhone-12.png", price: 399 },
        { id: 3, name: "iphone-13.png", path: "/iphone-13.png", price: 499 },
        { id: 4, name: "Iphone14.png", path: "/Iphone14.png", price: 599 },
        { id: 5, name: "Iphone14-Pro-Max.png", path: "/Iphone14-Pro-Max.png", price: 799 },
        { id: 6, name: "iphone-se-2020.png", path: "/iphone-se-2020.png", price: 199 },
        { id: 7, name: "iphone-xr.png", path: "/iphone-xr.png", price: 249 },
        { id: 8, name: "SAMSUNG_GalaxyS23Ultra.png", path: "/SAMSUNG_GalaxyS23Ultra.png", price: 899 },
        { id: 9, name: "samsung-galaxy-a40.png", path: "/samsung-galaxy-a40.png", price: 149 },
        { id: 10, name: "samsung-galaxy-s22.png", path: "/samsung-galaxy-s22.png", price: 699 }
    ];


    return (
        <div className="bg-[#eceff8] py-12">
            <div className="max-w-7xl mx-auto flex flex-col justify-center items-center gap-8 px-4 lg:px-8">

                {/* Phone icon */}
                <img src="/2.png" alt="Phone" className="w-16 sm:w-20" />

                {/* Title */}
                <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#6B7E8D] text-center">
                    Save Refurbished
                </h2>

                {/* Keep this second div's UI exactly the same */}
                <div className="p-4 bg-[#6B7E8D] shadow-[10px_10px_0px_#a8c2d9]">
                    <p className="text-center text-lg max-w-3xl font-bold text-white">
                        Refurbished smartphones guaranteed for 24 months
                    </p>
                </div>

                {/* Subtext */}
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-center px-2 max-w-2xl leading-relaxed text-gray-800">
                    Discover our selection of refurbished Save smartphones with a wide choice of Apple, Samsung, Xiaomi models… And much more!
                </h2>
                <div className="max-w-5xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {images.map(({ id, path, name, price }) => (
                        <Card
                            key={id}
                            className="flex flex-col items-center shadow-lg hover:shadow-2xl transition-shadow bg-white w-40 py-4 px-4"
                        >
                            <CardContent className="flex flex-col justify-center items-center w-full px-0">

                                <img
                                    src={path}
                                    alt={name}
                                    className="w-full object-contain"
                                />
                                <p className="text-xs text-center mt-2">
                                    {name.replace('.png', '').replace(/[-_]/g, ' ')}
                                </p>
                                <p className="text-xs text-[#0f4c81] mt-2">
                                    starting from <span className="font-bold text-sm">€{price}</span>
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-center items-center mt-6">
                    <Link href='#' className="bg-[#00bfb2] hover:bg-[#0d3e6c] text-white text-lg px-6 py-2 rounded-md shadow-md">
                        See All Refurbished
                    </Link>
                </div>
            </div>
        </div>
    );
}
