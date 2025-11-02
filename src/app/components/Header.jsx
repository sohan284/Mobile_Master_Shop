"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  User,
  LogOut,
  ChevronDown,
  Package,
  UserCircle,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logoMlk.png";
import { useAuth } from "@/contexts/AuthContext";
import CartIcon from "@/components/accessories/CartIcon";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations('header');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const mobileProfileDropdownRef = useRef(null);
  const desktopProfileDropdownRef = useRef(null);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileRef = mobileProfileDropdownRef.current;
      const desktopRef = desktopProfileDropdownRef.current;

      if (isProfileDropdownOpen) {
        const clickedOutsideMobile = !mobileRef || !mobileRef.contains(event.target);
        const clickedOutsideDesktop = !desktopRef || !desktopRef.contains(event.target);

        if (clickedOutsideMobile && clickedOutsideDesktop) {
          setIsProfileDropdownOpen(false);
        }
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    await logout();
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const name = user.name || user.username || user.email || 'User';
    return name.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.name || user.username || user.email || 'User';
  };

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
    <>
      <header
        className={`bg-primary text-secondary w-full pt-4 pb-1 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sticky top-0  ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
      >
        <div className="container  mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-3 md:space-y-4 items-center lg:justify-center relative z-10">

          {/* ✅ Mobile Header: Hamburger + Logo + User */}
          <div className="md:hidden flex justify-between items-center w-full mobile-menu-container">
            <button
              className="text-white focus:outline-none hover:text-gray-300 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <Menu size={28} />
            </button>

            <Link href="/" className="group relative">
              <div className="flex items-center gap-2">
                <Image className="cursor-pointer" src={logo} alt="MLKPHONE" width={100} height={100} loading="eager" style={{ height: 'auto' }} />
              </div>
            </Link>

            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              {/* <CartIcon /> */}
              {isAuthenticated() ? (
                <div className="relative" ref={mobileProfileDropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 text-white focus:outline-none hover:text-gray-300 transition-colors"
                    aria-label="Profile menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-semibold text-sm">
                      {getUserInitials()}
                    </div>
                    <span className="text-sm hidden sm:block truncate max-w-[80px]">{getUserDisplayName()}</span>
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-primary rounded-lg shadow-lg py-1 z-50 border border-white/30 animate-in fade-in-0 zoom-in-95 duration-200 origin-top-right transform transition-all">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
                      >
                        <UserCircle size={16} className="mr-2" />
                        {t('profile')}
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
                      >
                        <Package size={16} className="mr-2" />
                        {t('orders')}
                      </Link>
                      {isAdmin() && (
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
                        >
                          <LayoutDashboard size={16} className="mr-2" />
                          {t('dashboard')}
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition-colors text-left"
                      >
                        <LogOut size={16} className="mr-2" />
                        {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-white focus:outline-none hover:text-gray-300"
                >
                  <User size={22} />
                </Link>
              )}
            </div>
          </div>

          {/* ✅ Desktop Header (md and up) */}
          <div className="hidden md:flex flex-col w-full items-center space-y-4">
            {/* Logo */}
            <div className="text-2xl font-bold text-center">
              <Link href="/">
                <Image className="cursor-pointer" src={logo} alt="MLKPHONE" width={100} height={100} loading="eager" style={{ height: 'auto' }} />
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-8 lg:space-x-12 xl:space-x-20 text-base xl:text-lg">
              <Link href="/repair" className="hover:underline hover:text-white transition">
                {t('repair')}
              </Link>
              <Link href="/phones" className="hover:underline hover:text-white transition">
                {t('phones')}
              </Link>
              <Link href="/accessories" className="hover:underline hover:text-white transition">
                {t('accessories')}
              </Link>
              <Link href="/contact" className="hover:underline hover:text-white transition">
                {t('contact')}
              </Link>
           
              {/* Cart and User */}
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                {/* <CartIcon /> */}
                {isAuthenticated() ? (
                  <div className="relative" ref={desktopProfileDropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center cursor-pointer space-x-2 text-white hover:text-gray-300 transition-colors focus:outline-none"
                      aria-label="Profile menu"
                    >
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-semibold">
                        {getUserInitials()}
                      </div>
                      <span className="text-sm truncate max-w-[120px]">{getUserDisplayName()}</span>
                      <ChevronDown size={16} className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-primary rounded-lg shadow-lg py-1 z-50 border border-white/30 animate-in fade-in-0 zoom-in-95 duration-200 origin-top-right transform transition-all">
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
                        >
                          <UserCircle size={16} className="mr-2" />
                          {t('profile')}
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
                        >
                          <Package size={16} className="mr-2" />
                          {t('orders')}
                        </Link>
                        {isAdmin() && (
                          <Link
                            href="/dashboard"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
                          >
                            <LayoutDashboard size={16} className="mr-2" />
                            {t('dashboard')}
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition-colors text-left"
                        >
                          <LogOut size={16} className="mr-2" />
                          {t('logout')}
                        </button>
                      </div>
                    )}
                  </div>
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 w-full h-screen bg-black/50 z-40 mobile-menu-container">
          <div className="bg-primary border-t border-secondary/20 shadow-lg animate-in slide-in-from-top-2 duration-300">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-6">
                {/* Navigation Links */}
                <div className="flex flex-col space-y-4">
                  <Link
                    href="/repair"
                    className="text-white hover:text-gray-300 transition-colors py-3 text-lg font-medium border-b border-secondary/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('repair')}
                  </Link>
                  <Link
                    href="/phones"
                    className="text-white hover:text-gray-300 transition-colors py-3 text-lg font-medium border-b border-secondary/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('phones')}
                  </Link>
                  <Link
                    href="/accessories"
                    className="text-white hover:text-gray-300 transition-colors py-3 text-lg font-medium border-b border-secondary/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('accessories')}
                  </Link>
                  <Link
                    href="/contact"
                    className="text-white hover:text-gray-300 transition-colors py-3 text-lg font-medium border-b border-secondary/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('contact')}
                  </Link>
                 
                </div>


              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
