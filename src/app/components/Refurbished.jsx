import React from 'react'

export default function Refurbished() {
    return (
        <div className='bg-[#eceff8] py-8'>
            <div className="max-w-7xl mx-auto flex flex-col justify-center items-center gap-8 px-4 lg:px-8">
                {/* Phone icon */}
                <img src="/2.png" alt="Phone" className="w-16 sm:w-20" />

                {/* Title */}
                <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0f4c81] text-center">
                    Save Refurbished
                </h2>

                {/* Keep this second div's UI exactly the same */}
                <div className="p-4 bg-[#0f4c81] shadow-[10px_10px_0px_#a8c2d9]">
                    <p className="text-center text-lg max-w-3xl font-bold text-white">
                        Refurbished smartphones guaranteed for 24 months
                    </p>
                </div>

                {/* Subtext */}
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-center px-2 max-w-2xl leading-relaxed">
                    Discover our selection of refurbished Save smartphones with a wide choice of Apple, Samsung, Xiaomi models… And much more!
                </h2>
            </div>
        </div>
    )
}
