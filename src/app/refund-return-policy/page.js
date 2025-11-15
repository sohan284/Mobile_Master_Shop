import React from 'react';
import { getTranslations } from 'next-intl/server';
import RefundClient from './RefundClient';

// SEO Metadata
export async function generateMetadata() {
  const t = await getTranslations('metadata');
  
  return {
    title: t('refundTitle') || 'Refund and Return Policy - MLKPHONE',
    description: t('refundDescription') || 'Learn about our refund and return policy. 30-day return window, easy returns, and full refunds for eligible products.',
    keywords: t('refundKeywords') || 'refund policy, return policy, money back guarantee, product returns',
    openGraph: {
      title: t('refundTitle') || 'Refund and Return Policy - MLKPHONE',
      description: t('refundDescription') || 'Learn about our refund and return policy.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('refundTitle') || 'Refund and Return Policy - MLKPHONE',
      description: t('refundDescription') || 'Learn about our refund and return policy.',
    },
  };
}

export default function RefundReturnPolicyPage() {
  return <RefundClient />;
}
