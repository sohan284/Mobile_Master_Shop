import React from 'react';
import BannerCard from './Banner Card/BannerCard';

export default function Banner() {
    return (
        <div
            className='bg-[#0f4c81]'
            style={{
                clipPath: 'ellipse(100% 55% at 48% 44%)',
                WebkitClipPath: 'ellipse(100% 55% at 48% 44%)', // for Safari support
            }}
        >
            <div className='flex flex-col justify-center items-center pt-10 px-4 '>
                <h2 className='font-extrabold text-2xl leading-relaxed md:text-4xl text-white text-center'>
                    Having trouble with your smartphone?{' '}
                    <span className='bg-[#00bfb2] px-2 py-0.5 rounded-lg'>Save</span> has the solution!
                </h2>
                <BannerCard />
            </div>
        </div>
    );
}
