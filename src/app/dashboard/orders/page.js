'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/animations/PageTransition';
import { useTranslations } from 'next-intl';

export default function OrdersPage() {
  const t = useTranslations('dashboard.orders');
  const router = useRouter();

  useEffect(() => {
    // Redirect to repair orders by default
    router.replace('/dashboard/orders/repairs');
  }, [router]);

  return (
    <PageTransition>
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">{t('redirecting')}</p>
      </div>
    </PageTransition>
  );
}

