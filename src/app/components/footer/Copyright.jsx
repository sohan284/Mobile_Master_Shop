'use client';

import { useTranslations } from 'next-intl';

export default function Copyright() {
    const t = useTranslations('footer');
    const currentYear = new Date().getFullYear();
    
    return (
        <div className="mt-10 pt-6 text-center text-sm text-gray-500 relative z-10 hover:text-white transition-colors duration-300">
            {t('copyright', { year: currentYear })}
        </div>
    );
}
