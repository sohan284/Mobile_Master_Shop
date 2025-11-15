import React from 'react';
import { getTranslations } from 'next-intl/server';
import ContactClient from './ContactClient';

// SEO Metadata
export async function generateMetadata() {
  const t = await getTranslations('metadata');
  
  return {
    title: t('contactTitle') || 'Contact Us - MLKPHONE',
    description: t('contactDescription') || 'Get in touch with MLKPHONE. Contact us for phone repairs, product inquiries, or customer support. We are here to help!',
    keywords: t('contactKeywords') || 'contact, customer support, phone repair contact, MLKPHONE contact, customer service',
    openGraph: {
      title: t('contactTitle') || 'Contact Us - MLKPHONE',
      description: t('contactDescription') || 'Get in touch with MLKPHONE for phone repairs and product inquiries.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('contactTitle') || 'Contact Us - MLKPHONE',
      description: t('contactDescription') || 'Get in touch with MLKPHONE for phone repairs and product inquiries.',
    },
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
