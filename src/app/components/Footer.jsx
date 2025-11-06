'use client';

import FooterColumn from "./footer/FooterColumn";
import SocialLinks from "./footer/SocialLinks";
import Copyright from "./footer/Copyright";
import ShopInfo from "./footer/ShopInfo";
import ContactInfo from "./footer/ContactInfo";
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

    const usefulLinks = [
        { href: "/terms-and-conditions", text: t('termsAndConditions') },
        { href: "/privacy-policy", text: t('privacyPolicy') },
        { href: "/contact", text: t('contactUs') },
    ];

    return (
        <footer className="bg-primary text-secondary relative overflow-hidden">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-4 sm:py-6 md:py-8 lg:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-3 md:gap-3 lg:gap-4 relative z-10">
                    {/* First Column - Logo and Address */}
                    <div className="sm:col-span-2 lg:col-span-3 mb-4 sm:mb-0">
                        <ShopInfo />
                    </div>

                    {/* Middle 3 Columns - Navigation Links */}
                    {/* Repair and Services in one row on mobile */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                            <div>
                                <FooterColumn title={t('repair')} links={repairLinks} />
                            </div>
                            <div>
                                <FooterColumn title={t('services')} links={servicesLinks} />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                        <FooterColumn title={t('usefulLinks')} links={usefulLinks} />
                    </div>
                    
                    {/* Last Column - Contact Info */}
                    <div className="sm:col-span-2 lg:col-span-3 mt-4 sm:mt-0">
                        <ContactInfo />
                    </div>
                </div>
            </div>

            {/* Social Links and Copyright */}
            <div className="border-t border-secondary/20 mt-1 sm:mt-2">
                <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
                    {/* <SocialLinks /> */}
                    <Copyright />
                </div>
            </div>
        </footer>
    );
}
