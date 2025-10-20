import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Accessories() {
    return (
        <div className='px-48 py-12'>
            <div className='flex flex-col md:flex-row'>
                <div className='flex-1'>
                    <div className='flex flex-col items-center'>
                        <Image
                            src="/3.png"
                            alt="Accessory"
                            width={120}
                            height={120}
                        />
                        <h2 className='font-bold text-3xl mt-3'>
                            Accessories
                        </h2>
                        <h4 className='text-lg mt-3'>
                            The best accessories for your smartphone are available in our stores.
                            Don't wait any longer and come discover all our Save brand accessories with a lifetime guarantee!
                        </h4>
                        <Link href='#' className="bg-[#00bfb2] hover:bg-[#0d3e6c] text-white text-lg font-semibold px-6 py-2 mt-4 rounded-md shadow-md">
                            See the full range
                        </Link>
                    </div>
                </div>
                <div className='flex-1'>
                    <h2>Hello</h2>
                </div>
            </div>
        </div>
    )
}
