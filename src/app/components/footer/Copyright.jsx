'use client';

import { useTranslations } from 'next-intl';

export default function Copyright() {
    const t = useTranslations('footer');
    const currentYear = new Date().getFullYear();
    
    return (
        <div className="py-4 sm:py-6 text-center text-xs sm:text-sm text-secondary/70 relative z-10 px-4">
            {t('copyright', { year: currentYear })}
        </div>
    );
}
