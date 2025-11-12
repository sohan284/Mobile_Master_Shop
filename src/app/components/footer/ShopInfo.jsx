'use client';

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useTranslations } from 'next-intl';
import logo from "@/assets/logoMlk.png";

export default function ShopInfo() {
    const t = useTranslations('footer');

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-block group">
                <Image 
                    src={logo} 
                    alt="MLKPHONE" 
                    width={120} 
                    height={120} 
                    className="h-auto w-auto max-w-[120px] sm:max-w-[140px] lg:max-w-[150px] group-hover:opacity-90 transition-opacity duration-300"
                    priority
                />
            </Link>

            {/* Address */}
            <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-secondary transition-colors duration-300" />
                </div>
                <div className="flex-1">
                    <p className="text-secondary/90 text-xs sm:text-sm leading-relaxed  transition-colors duration-300">
                        <span className="font-semibold">{t('address')}</span><br />
                        <span className="text-secondary/70">{t('addressLine1')}</span><br />
                        <span className="text-secondary/70">{t('addressLine2')}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

