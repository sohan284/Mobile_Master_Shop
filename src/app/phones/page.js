import React from "react";
import { getNewPhoneBrandsServer } from "@/lib/api-server";
import { getTranslations } from 'next-intl/server';
import PhonesClient from "./PhonesClient";

// SEO Metadata
export async function generateMetadata() {
  const t = await getTranslations('metadata');
  
  return {
    title: t('phonesTitle') || 'Buy New Phones - MLKPHONE',
    description: t('phonesDescription') || 'Browse our collection of new smartphones from top brands. Latest models with warranty and competitive prices.',
    keywords: t('phonesKeywords') || 'new phones, smartphones, buy phones, latest phones, phone deals, mobile phones',
    openGraph: {
      title: t('phonesTitle') || 'Buy New Phones - MLKPHONE',
      description: t('phonesDescription') || 'Browse our collection of new smartphones from top brands.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('phonesTitle') || 'Buy New Phones - MLKPHONE',
      description: t('phonesDescription') || 'Browse our collection of new smartphones from top brands.',
    },
  };
}

export default async function PhonesPage() {
  let brands = [];
  let error = null;

  try {
    const brandsResponse = await getNewPhoneBrandsServer();
    brands = brandsResponse?.data || [];
  } catch (err) {
    console.error('Error fetching brands:', err);
    error = err;
  }

  return <PhonesClient initialBrands={brands} isLoading={false} error={error} />;
}
