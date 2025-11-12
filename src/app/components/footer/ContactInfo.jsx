'use client';

import { Phone, Mail, Clock } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function ContactInfo() {
    const t = useTranslations('footer');

    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Phone */}
            <div className="flex items-center gap-3 group">
                <div className="flex-shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-secondary  transition-colors duration-300" />
                </div>
                <a 
                    href="tel:+330646085380" 
                    className="text-secondary/80 text-xs sm:text-sm  transition-colors duration-300 touch-manipulation"
                >
                    {t('phoneNumber')}
                </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 group">
                <div className="flex-shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-secondary transition-colors duration-300" />
                </div>
                <a 
                    href="mailto:mlkphone.88000@gmail.com" 
                    className="text-secondary/80 text-xs sm:text-sm  transition-colors duration-300 break-all touch-manipulation"
                >
                    {t('emailAddress')}
                </a>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-secondary  transition-colors duration-300" />
                </div>
                <div className="flex-1">
                    <p className="text-secondary/80 text-xs sm:text-sm leading-relaxed  transition-colors duration-300">
                        <span className="font-semibold">{t('businessHours')}:</span>
                        <br />
                        <span className="text-secondary/70">{t('mondayHours')}</span>
                        <br />
                        <span className="text-secondary/70">{t('tuesdayToSaturdayHours')}</span>
                        <br />
                        <span className="text-secondary/70">{t('sundayHours')}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

