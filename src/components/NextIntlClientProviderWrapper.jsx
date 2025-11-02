'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useState, useEffect } from 'react';

// Import default English messages statically to ensure they're available immediately
import frMessages from '../../messages/fr.json';

// Default fallback messages - use English as the fallback
const defaultMessages = frMessages;

export default function NextIntlClientProviderWrapper({ children }) {
  const [locale, setLocale] = useState('fr');
  const [messages, setMessages] = useState(defaultMessages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get locale from localStorage, cookie, or default to 'en'
    let storedLocale = 'fr';
    
    if (typeof window !== 'undefined') {
      storedLocale = localStorage.getItem('locale') || 
        document.cookie.split(';').find(c => c.trim().startsWith('NEXT_LOCALE='))?.split('=')[1] || 
        'fr';
      
      // Ensure valid locale
      if (!['fr', 'en'].includes(storedLocale)) {
        storedLocale = 'fr';
      }
    }
    
    setLocale(storedLocale);

    // Load messages - use a synchronous import if possible, otherwise async
    const loadMessages = async () => {
      try {
        const mod = await import(`../../messages/${storedLocale}.json`);
        setMessages(mod.default);
        setIsLoading(false);
      } catch {
        // Fallback to English
        try {
          const mod = await import(`../../messages/fr.json`);
          setMessages(mod.default);
          setIsLoading(false);
        } catch {
          // Ultimate fallback - empty messages
          setMessages(defaultMessages);
          setIsLoading(false);
        }
      }
    };

    loadMessages();
  }, []);

  // Update locale when localStorage changes (from language switcher)
  useEffect(() => {
    const handleStorageChange = () => {
      const newLocale = localStorage.getItem('locale');
      if (newLocale && ['fr', 'en'].includes(newLocale) && newLocale !== locale) {
        import(`../../messages/${newLocale}.json`)
          .then((mod) => {
            setMessages(mod.default);
            setLocale(newLocale);
          })
          .catch(() => {
            // Fallback to English
            import(`../../messages/fr.json`)
              .then((mod) => {
                setMessages(mod.default);
                setLocale('fr');
              });
          });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      // Also listen for custom locale change event
      window.addEventListener('localeChanged', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('localeChanged', handleStorageChange);
      };
    }
  }, [locale]);

  // Always provide the context, even during loading
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

