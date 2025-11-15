import React from 'react';
import { getTranslations } from 'next-intl/server';
import TermsClient from './TermsClient';

// SEO Metadata
export async function generateMetadata() {
  const t = await getTranslations('metadata');
  
  return {
    title: t('termsTitle') || 'Terms and Conditions - MLKPHONE',
    description: t('termsDescription') || 'Read our terms and conditions. Understand the rules and regulations for using our services, purchasing products, and repair services.',
    keywords: t('termsKeywords') || 'terms and conditions, legal, user agreement, service terms',
    openGraph: {
      title: t('termsTitle') || 'Terms and Conditions - MLKPHONE',
      description: t('termsDescription') || 'Read our terms and conditions for using our services.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('termsTitle') || 'Terms and Conditions - MLKPHONE',
      description: t('termsDescription') || 'Read our terms and conditions for using our services.',
    },
  };
}

export default function TermsAndConditionsPage() {
  return <TermsClient />;
}
