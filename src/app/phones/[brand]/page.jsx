import React from 'react';
import { getPhoneModelsByBrandServer } from '@/lib/api-server';
import { getTranslations } from 'next-intl/server';
import BrandPhonesClient from './BrandPhonesClient';

// SEO Metadata
export async function generateMetadata({ params }) {
  const { brand } = await params;
  const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);
  
  return {
    title: `${brandName} Phones`,
    description: `Browse ${brandName} smartphones. Latest models with warranty and competitive prices.`,
    keywords: `${brandName} phones, ${brandName} smartphones, buy ${brandName}, ${brandName} mobile phones`,
    openGraph: {
      title: `${brandName} Phones`,
      description: `Browse ${brandName} smartphones. Latest models with warranty.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brandName} Phones`,
      description: `Browse ${brandName} smartphones. Latest models with warranty.`,
    },
  };
}

export default async function BrandPage({ params }) {
  const { brand } = await params;
  const brandLower = brand?.toLowerCase();
  
  let phones = [];
  let error = null;

  try {
    const phonesResponse = await getPhoneModelsByBrandServer(brandLower);
    phones = phonesResponse?.data || [];
  } catch (err) {
    console.error('Error fetching brand phones:', err);
    error = err;
  }

  return (
    <BrandPhonesClient 
      initialPhones={phones} 
      brand={brandLower}
                  isLoading={false}
      error={error} 
    />
  );
}
