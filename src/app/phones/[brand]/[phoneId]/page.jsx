import React from 'react';
import { getPhoneModelByIdServer } from '@/lib/api-server';
import { getTranslations } from 'next-intl/server';
import PhoneDetailClient from './PhoneDetailClient';

// SEO Metadata
export async function generateMetadata({ params }) {
  const { brand, phoneId } = await params;
  let phone = null;
  
  try {
    const response = await getPhoneModelByIdServer(phoneId);
    phone = response?.data;
  } catch (error) {
    console.error('Error fetching phone for metadata:', error);
  }
  
  const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);
  const title = phone?.name || `${brandName} Phone Details`;
  const description = phone?.description 
    ? phone.description.replace(/<[^>]*>/g, '').substring(0, 160)
    : `Buy ${phone?.name || brandName} phone. ${phone?.memory || ''}GB storage, ${phone?.ram || ''}GB RAM. Best price with warranty.`;
  
  return {
    title,
    description,
    keywords: `${phone?.name || brandName}, ${brandName} phone, smartphone, ${phone?.memory || ''}GB, ${phone?.ram || ''}GB RAM, buy phone`,
    openGraph: {
      title,
      description,
      type: 'website',
      images: phone?.icon ? [phone.icon] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: phone?.icon ? [phone.icon] : [],
    },
  };
}

export default async function PhoneIndividualPage({ params }) {
  const { brand, phoneId } = await params;
  
  let phone = null;
  let error = null;

  try {
    const response = await getPhoneModelByIdServer(phoneId);
    phone = response?.data;
  } catch (err) {
    console.error('Error fetching phone:', err);
    error = err;
  }

  return (
    <PhoneDetailClient 
      initialPhone={phone}
      phoneId={phoneId}
      brand={brand}
      isLoading={false}
      error={error}
    />
  );
}