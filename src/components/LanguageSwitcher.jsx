'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [currentLocale, setCurrentLocale] = useState(locale || 'fr');

  const languages = [
      { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  useEffect(() => {
    // Sync with localStorage on mount
    const storedLocale = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
    if (storedLocale && languages.find(l => l.code === storedLocale)) {
      setCurrentLocale(storedLocale);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const changeLanguage = (newLocale) => {
    setIsOpen(false);
    setCurrentLocale(newLocale);
    
    // Store locale preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // 1 year
      
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new Event('localeChanged'));
      
      // Small delay before reload to ensure state is saved
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200 text-white"
        aria-label={t('selectLanguage')}
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">
        {currentLanguage.label}
        </span>
        <span className="text-sm font-medium sm:hidden">
          {currentLanguage.code.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors duration-150 ${
                currentLocale === lang.code ? 'bg-secondary/20 text-secondary' : 'text-white'
              }`}
            >
              {/* <span className="text-xl">{lang.flag}</span> */}
              <span className="font-medium">{lang.label}</span>
              {currentLocale === lang.code && (
                <span className="ml-auto text-secondary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

