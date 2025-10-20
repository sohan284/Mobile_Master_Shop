import React from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Banner from '@/app/components/Banner';
import Repair from '@/app/components/Repair';
import Refurbished from '@/app/components/Refurbished';

export default function page() {
  return (
    <div>
      <Header />
      <main>
        {/* Main content goes here */}
        <Banner />
        <Repair />
        <Refurbished />
      </main>
      <Footer />
    </div>
  )
}
