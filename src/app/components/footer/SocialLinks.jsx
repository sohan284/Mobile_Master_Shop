'use client';

import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function SocialLinks() {
    const t = useTranslations('footer');
    
    return (
        <div className="flex flex-col items-center py-6 sm:py-8 relative z-10">
            <h3 className="text-secondary text-base sm:text-lg font-semibold mb-4 sm:mb-6  transition-colors duration-300">{t('followUs')}</h3>
            <div className="flex space-x-5 sm:space-x-6">
                <Link 
                    href="#" 
                    aria-label="Instagram" 
                    className="hover:text-secondary transition-all duration-300 hover:scale-125 hover:rotate-12 group touch-manipulation p-2"
                >
                    <Instagram className="w-5 h-5 sm:w-6 sm:h-6 group-hover:drop-shadow-lg" />
                </Link>
                <Link 
                    href="#" 
                    aria-label="LinkedIn" 
                    className=" transition-all duration-300 hover:scale-125 hover:rotate-12 group touch-manipulation p-2"
                >
                    <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 group-hover:drop-shadow-lg" />
                </Link>
                <Link 
                    href="#" 
                    aria-label="Facebook" 
                    className=" transition-all duration-300 hover:scale-125 hover:rotate-12 group touch-manipulation p-2"
                >
                    <Facebook className="w-5 h-5 sm:w-6 sm:h-6 group-hover:drop-shadow-lg" />
                </Link>
            </div>
        </div>
    );
}
