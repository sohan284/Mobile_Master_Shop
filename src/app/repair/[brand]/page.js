import React from 'react';
import { getRepairModelsByBrandServer, getBrandsServer } from '@/lib/api-server';
import { getTranslations } from 'next-intl/server';
import BrandRepairClient from './BrandRepairClient';

// SEO Metadata
export async function generateMetadata({ params }) {
  const { brand } = await params;
  const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);
  
  return {
    title: `${brandName} Phone Repair`,
    description: `Professional ${brandName} phone repair services. Expert technicians, quality parts, and fast turnaround.`,
    keywords: `${brandName} repair, ${brandName} phone repair, ${brandName} smartphone repair, mobile repair ${brandName}`,
    openGraph: {
      title: `${brandName} Phone Repair`,
      description: `Professional ${brandName} phone repair services. Expert technicians and quality parts.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brandName} Phone Repair`,
      description: `Professional ${brandName} phone repair services. Expert technicians and quality parts.`,
    },
  };
}

export default async function BrandRepairPage({ params }) {
  const { brand } = await params;
  const brandLower = brand?.toLowerCase();
  
  let models = [];
  let brandInfo = null;
  let error = null;

  try {
    const [modelsResponse, brandsResponse] = await Promise.all([
      getRepairModelsByBrandServer(brandLower),
      getBrandsServer()
    ]);
    
    models = modelsResponse || [];
    // Find brand info from brands list
    if (brandsResponse) {
      brandInfo = brandsResponse.data.find(b => 
        b.name.toLowerCase() === brandLower || 
        b.slug?.toLowerCase() === brandLower
      );
    }
  } catch (err) {
    console.error('Error fetching repair data:', err);
    error = err;
  }

  return (
    <BrandRepairClient 
      initialModels={models} 
      brand={brandLower}
      initialBrandInfo={brandInfo}
      isLoading={false} 
      error={error} 
    />
  );
}
