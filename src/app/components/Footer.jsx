'use client';

import FooterColumn from "./footer/FooterColumn";
import SocialLinks from "./footer/SocialLinks";
import Copyright from "./footer/Copyright";
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');

    const repairLinks = [
        { href: "/repair/apple", text: t('apple') },
        { href: "/repair/samsung", text: t('samsung') },
        { href: "/repair/xiaomi", text: t('xiaomi') },
        { href: "/repair/huawei", text: t('huawei') },
    ];

    const servicesLinks = [
        { href: "/accessories", text: t('accessories') },
        { href: "/phones", text: t('smartphones') },
    ];

    const storesLinks = [
        { href: "/contact", text: t('store') },
    ];

    const usefulLinks = [
        { href: "/terms-and-conditions", text: t('termsAndConditions') },
        { href: "/privacy-policy", text: t('privacyPolicy') },
        { href: "/contact", text: t('contactUs') },
    ];

    return (
        <footer className="bg-primary text-secondary py-10 px-6 md:px-20 relative overflow-hidden">
            <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                <FooterColumn title={t('repair')} links={repairLinks} />
                <FooterColumn title={t('services')} links={servicesLinks} />
                <FooterColumn title={t('ourStores')} links={storesLinks} />
                <FooterColumn title={t('usefulLinks')} links={usefulLinks} />
            </div>
            <SocialLinks />
            <Copyright />
        </footer>
    );
}
