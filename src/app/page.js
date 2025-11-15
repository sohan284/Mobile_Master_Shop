import React from 'react';
import Banner from '@/app/components/Banner';
import Repair from '@/app/components/Repair';
import Refurbished from '@/app/components/Refurbished';
import PageTransition from '@/components/animations/PageTransition';
import { getTranslations } from 'next-intl/server';

// SEO Metadata
export async function generateMetadata() {
  const t = await getTranslations('metadata');
  
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    keywords: t('homeKeywords'),
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('homeTitle'),
      description: t('homeDescription'),
    },
  };
}

export default function page() {
  return (
    <div className='bg-primary'>
      <div className='bg-gradient-to-t from-primary via-gray-300/5 via-20% to-primary/10 '>
        <Banner />
      </div>
      <div className='max-w-[1200px] mx-auto'>
        <PageTransition>
          <Repair />
          <Refurbished />
        </PageTransition>
      </div>
    </div>
  )
}
