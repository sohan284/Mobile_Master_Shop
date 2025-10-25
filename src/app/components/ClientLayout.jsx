'use client';

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import BackgroundAnimations from "@/components/animations/BackgroundAnimations";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard") || pathname.includes("/login") || pathname.includes("/signup");

  return (
    <>
      {/* Global Background Animations for all pages */}
      <BackgroundAnimations />
      
      {!isDashboard && <Header />}
      <main className="relative z-10">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}