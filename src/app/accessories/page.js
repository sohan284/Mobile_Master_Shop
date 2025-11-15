import React from "react";
import { getAccessoriesServer } from "@/lib/api-server";
import { getTranslations } from 'next-intl/server';
import AccessoriesClient from "./AccessoriesClient";

// SEO Metadata
export async function generateMetadata() {
  const t = await getTranslations('metadata');
  
  return {
    title: t('accessoriesTitle') || 'Phone Accessories - MLKPHONE',
    description: t('accessoriesDescription') || 'Premium phone accessories including cases, chargers, cables, and more. High quality products with competitive prices.',
    keywords: t('accessoriesKeywords') || 'phone accessories, phone cases, chargers, cables, phone accessories store',
    openGraph: {
      title: t('accessoriesTitle') || 'Phone Accessories - MLKPHONE',
      description: t('accessoriesDescription') || 'Premium phone accessories including cases, chargers, cables, and more.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('accessoriesTitle') || 'Phone Accessories - MLKPHONE',
      description: t('accessoriesDescription') || 'Premium phone accessories including cases, chargers, cables, and more.',
    },
  };
}

export default async function AccessoriesPage() {
  let accessories = [];
  let error = null;

  try {
    const accessoriesResponse = await getAccessoriesServer();
    accessories = accessoriesResponse?.data || [];
  } catch (err) {
    console.error('Error fetching accessories:', err);
    error = err;
  }

  return <AccessoriesClient initialAccessories={accessories} isLoading={false} error={error} />;
}
