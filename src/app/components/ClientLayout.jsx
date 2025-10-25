'use client';

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard") || pathname.includes("/login") || pathname.includes("/signup");

  return (
    <>
      {!isDashboard && <Header />}
      <main className="">
        {!isDashboard && <Breadcrumbs />}
        {children}
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}