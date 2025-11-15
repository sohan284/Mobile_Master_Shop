import React from 'react';
import { getTranslations } from 'next-intl/server';
import PrivacyClient from './PrivacyClient';

// SEO Metadata
export async function generateMetadata() {
  const t = await getTranslations('metadata');
  
  return {
    title: t('privacyTitle') || 'Privacy Policy - MLKPHONE',
    description: t('privacyDescription') || 'Read our privacy policy to understand how we collect, use, and protect your personal information. GDPR compliant privacy practices.',
    keywords: t('privacyKeywords') || 'privacy policy, data protection, GDPR, personal information, privacy rights',
    openGraph: {
      title: t('privacyTitle') || 'Privacy Policy - MLKPHONE',
      description: t('privacyDescription') || 'Read our privacy policy to understand how we protect your data.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('privacyTitle') || 'Privacy Policy - MLKPHONE',
      description: t('privacyDescription') || 'Read our privacy policy to understand how we protect your data.',
    },
  };
}

export default function PrivacyPolicyPage() {
  return <PrivacyClient />;
}
