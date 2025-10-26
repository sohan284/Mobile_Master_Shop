"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  User,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import logo from "@/assets/mlkLogo.png";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, logout, isAuthenticated } = useAuth();

  // ✅ Scroll hide/show header (keep as before)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDifference = Math.abs(currentScrollY - lastScrollY);

          if (scrollDifference > 5) {
            if (currentScrollY < 10) {
              setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
              setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
              setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`bg-[#0a1525] text-secondary w-full pt-4 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sticky top-0 overflow-hidden ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-3 md:space-y-4 items-center lg:justify-center relative z-10">
        
        {/* ✅ Mobile Header: Hamburger + Logo + User */}
        <div className="md:hidden flex justify-between items-center w-full">
          <button className="text-white focus:outline-none">
            <Menu size={28} />
          </button>

          <Link href="/" className="group relative">
             <div className="flex items-center gap-2">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span className="text-xl font-semibold tracking-wide">MLKPHONE</span>
          </div>
          </Link>

          {isAuthenticated() ? (
            <button
              onClick={logout}
              className="text-white focus:outline-none hover:text-gray-300"
              title="Logout"
            >
              <LogOut size={22} />
            </button>
          ) : (
            <Link
              href="/login"
              className="text-white focus:outline-none hover:text-gray-300"
            >
              <User size={22} />
            </Link>
          )}
        </div>

        {/* ✅ Desktop Header (md and up) */}
        <div className="hidden md:flex flex-col w-full items-center space-y-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-center">
            <Link href="/" className="group relative">
              <div className="flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span className="text-4xl font-semibold tracking-wide">MLKPHONE</span>
          </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center space-x-8 lg:space-x-12 xl:space-x-20 text-base xl:text-lg">
            <Link href="/repair" className="hover:underline hover:text-white transition">
              Repair
            </Link>
            <Link href="/phones" className="hover:underline hover:text-white transition">
              Phones
            </Link>
            <Link href="/accessories" className="hover:underline hover:text-white transition">
              Accessories
            </Link>
            <Link href="#" className="hover:underline hover:text-white transition">
              Contact
            </Link>

            {/* User */}
            <div className="flex items-center space-x-3">
              {isAuthenticated() ? (
                <>
                  <Link href="/dashboard" className="hover:text-gray-300 flex items-center space-x-2">
                    <User size={24} />
                    <span className="text-sm truncate max-w-[100px]">{user?.name}</span>
                  </Link>
                  <button onClick={logout} className="hover:text-gray-300" title="Logout">
                    <LogOut size={24} />
                  </button>
                </>
              ) : (
                <Link href="/login" className="hover:text-gray-300">
                  <User size={24} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
