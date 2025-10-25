import React from 'react';
import Banner from '@/app/components/Banner';
import Repair from '@/app/components/Repair';
import Refurbished from '@/app/components/Refurbished';
import PageTransition from '@/components/animations/PageTransition';

export default function page() {
  return (
    <div>
      <Banner />
      <div className='max-w-[1200px] mx-auto'>
        <PageTransition>

          <Repair />
          <Refurbished />
        </PageTransition>
      </div>
    </div>
  )
}
