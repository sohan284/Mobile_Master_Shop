import React from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Banner from '@/app/components/Banner';

export default function page() {
  return (
    <div>
      <Header />
      <main>
        {/* Main content goes here */}
        <Banner />
        <div>
          Another components can be added here.
        </div>
      </main>
      <Footer />
    </div>
  )
}
