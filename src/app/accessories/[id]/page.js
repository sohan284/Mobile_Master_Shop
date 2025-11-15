import React from 'react';
import { getAccessoryByIdServer } from '@/lib/api-server';
import { getTranslations } from 'next-intl/server';
import AccessoryDetailClient from './AccessoryDetailClient';

// SEO Metadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  let accessory = null;
  
  try {
    const response = await getAccessoryByIdServer(id);
    accessory = response?.data;
  } catch (error) {
    console.error('Error fetching accessory for metadata:', error);
  }
  
  const title = accessory?.title || 'Accessory Details';
  const description = accessory?.subtitle || accessory?.description || 'View accessory details and specifications.';
  
  return {
    title,
    description,
    keywords: `${title}, phone accessory, mobile accessory, ${accessory?.category || 'accessory'}`,
    openGraph: {
      title,
      description,
      type: 'website',
      images: accessory?.picture ? [accessory.picture] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: accessory?.picture ? [accessory.picture] : [],
    },
  };
}

export default async function AccessoryDetailsPage({ params }) {
  const { id } = await params;
  
  let accessory = null;
  let error = null;

  try {
    const response = await getAccessoryByIdServer(id);
    accessory = response?.data;
  } catch (err) {
    console.error('Error fetching accessory:', err);
    error = err;
  }

  return (
    <AccessoryDetailClient 
      initialAccessory={accessory}
      accessoryId={id}
      isLoading={false}
      error={error}
    />
  );
}


