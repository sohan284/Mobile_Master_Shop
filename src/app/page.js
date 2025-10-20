import React from 'react';
import Banner from '@/app/components/Banner';
import Repair from '@/app/components/Repair';
import Refurbished from '@/app/components/Refurbished';

export default function page() {
  return (
    <div>
    <Banner />
        <Repair />
        <Refurbished />
    </div>
  )
}
