'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

export default function NextIntlProviderWrapper({ children, messages }) {
  const locale = useLocale();
  const [clientMessages, setClientMessages] = useState(messages);

  useEffect(() => {
    // Load messages dynamically if needed
    if (!clientMessages) {
      import(`../../messages/${locale}.json`)
        .then((mod) => setClientMessages(mod.default))
        .catch(() => {
          // Fallback to English if locale messages don't exist
          import(`../../messages/en.json`)
            .then((mod) => setClientMessages(mod.default));
        });
    }
  }, [locale, clientMessages]);

  if (!clientMessages) {
    return <>{children}</>; // Fallback while loading
  }

  return (
    <NextIntlClientProvider locale={locale} messages={clientMessages}>
      {children}
    </NextIntlClientProvider>
  );
}

