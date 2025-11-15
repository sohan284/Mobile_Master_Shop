import { Roboto, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';
import ClientLayout from "./components/ClientLayout";
import QueryProvider from "../../providers/QueryProvider";
import SafeDOMPatch from "@/components/SafeDOMPatch";
import NextIntlClientProviderWrapper from "@/components/NextIntlClientProviderWrapper";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mlkphone.com'),
  title: {
    default: 'MLKPHONE',
    template: '%s | MLKPHONE',
  },
  description: 'Expert mobile phone repair services, refurbished phones, and premium accessories.',
  verification: {
    google: "1Np9pV4J01wsJbl-xNC00R74DY6io1LaT5hmniVruQk",
  },
};

export default function RootLayout({ children, params }) {
  return (
    <html lang="fr">
      <body
        suppressHydrationWarning
        className={`${roboto.variable} ${nunito.variable} antialiased`}
      >
        <NextIntlClientProviderWrapper>
          <QueryProvider>
            <AuthProvider>
              <SafeDOMPatch />
              <ClientLayout>
                {children}
              </ClientLayout>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#10B981',
                    color: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  style: {
                    background: '#EF4444',
                    color: '#fff',
                  },
                },
                loading: {
                  style: {
                    background: '#6B7E8D',
                    color: '#fff',
                  },
                },
              }}
            />
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProviderWrapper>
      </body>
    </html>
  );
}
