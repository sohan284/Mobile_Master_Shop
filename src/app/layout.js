import { Roboto, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';
import ClientLayout from "./components/ClientLayout";
import Script from "next/script";
import QueryProvider from "../../providers/QueryProvider";
import SafeDOMPatch from "@/components/SafeDOMPatch";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata = {
  // You can add title/description if needed
  verification: {
    google: "1Np9pV4J01wsJbl-xNC00R74DY6io1LaT5hmniVruQk",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${roboto.variable} ${nunito.variable} antialiased`}
      >
        {/* Google Translate Initialization Script */}
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'fr',
                includedLanguages: 'fr,en', // English and French
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <QueryProvider>
          <AuthProvider>
            <SafeDOMPatch />
            <ClientLayout>
            <div id="google_translate_element" style={{ position: "absolute", top: "-9999px", left: "-9999px" }}></div>
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
                  duration: 5000,
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
      </body>
    </html>
  );
}
