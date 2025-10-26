'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User, LogIn, Facebook, Instagram, Linkedin, LogOut } from 'lucide-react';
import Image from 'next/image';
import logo from "@/assets/mlkLogo.png";
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { user, logout, isAuthenticated } = useAuth();

    const toggleSidebar = () => setIsOpen(!isOpen);

    // Scroll hide/show header
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

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <header
            className={`dark-blue-vignette text-secondary py-4 md:py-6 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sticky top-0 overflow-hidden ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-3 md:space-y-4 items-center lg:justify-center relative z-10">

                {/* Mobile: Hamburger - Logo - User */}
                <div className="lg:hidden flex justify-between items-center w-full">
                    <button onClick={toggleSidebar} className="text-white focus:outline-none">
                        <Menu size={28} className="sm:w-8 sm:h-8" />
                    </button>

                    <div>
                        <Image
                            className="rounded-full hover:scale-110 transition-transform duration-300 hover:rotate-12 group-hover:shadow-lg"
                            src={logo}
                            alt="Logo"
                            width={40}
                            height={40}
                        />
                    </div>

                    {isAuthenticated() ? (
                        <div className="flex items-center space-x-2">
                            <span className="text-white text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{user?.name}</span>
                            <button
                                onClick={logout}
                                className="text-white focus:outline-none hover:text-gray-300"
                                title="Logout"
                            >
                                <LogOut size={22} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="text-white focus:outline-none hover:text-gray-300">
                            <User size={22} className="sm:w-6 sm:h-6" />
                        </Link>
                    )}
                </div>

                {/* Desktop Center Logo */}
                <div className="hidden lg:block text-2xl font-bold text-center">
                    <Link href="/" className="group relative">
                        <Image
                            className="rounded-full hover:scale-110 transition-transform duration-300 hover:rotate-12 group-hover:shadow-lg"
                            src={logo}
                            alt="Logo"
                            width={40}
                            height={40}
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center w-full justify-center">
                    <div className="flex items-center xl:space-x-24 lg:space-x-12 md:space-x-8 text-base xl:text-lg">
                        <Link href="/repair" className="hover:underline hover:text-white transition-all duration-300 hover:scale-105">Repair</Link>
                        <Link href="/phones" className="hover:underline hover:text-white transition-all duration-300 hover:scale-105">Phones</Link>
                        <Link href="/accessories" className="hover:underline hover:text-white transition-all duration-300 hover:scale-105">Accessories</Link>
                        <Link href="#" className="hover:underline hover:text-white transition-all duration-300 hover:scale-105">Contact</Link>

                        {/* User Section */}
                        <div className="flex items-center lg:space-x-2 xl:space-x-3 lg:ml-2 xl:ml-4">
                            {isAuthenticated() ? (
                                <>
                                    <Link href="/dashboard" className="hover:text-gray-300 flex items-center lg:space-x-1 xl:space-x-2" title="Dashboard">
                                        <User size={24} />
                                        <span className="text-sm xl:text-base truncate max-w-[100px]">{user?.name}</span>
                                    </Link>
                                    <button onClick={logout} className="hover:text-gray-300" title="Logout">
                                        <LogOut size={24} />
                                    </button>
                                </>
                            ) : (
                                <Link href="/login" className="hover:text-gray-300" title="Login">
                                    <User size={24} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Mobile Sidebar — Push Effect from the RIGHT */}
            <div
                className={`lg:hidden fixed top-0 right-0 h-full w-4/5 max-w-sm bg-[#6B7E8D] text-white p-6 transform transition-transform duration-300 ease-in-out z-[999] ${
                    isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full overflow-y-auto">
                    <div className="flex items-center justify-end mb-6">
                        <button onClick={toggleSidebar}>
                            <X size={30} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search the site..."
                                className="w-full pl-10 pr-3 py-2 text-black bg-white rounded-2xl focus:outline-none focus:ring-0"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex flex-col space-y-4 p-6 border-4 border-[#0d416e] border-x-0 text-xl text-[#85a4bf] font-bold">
                        <Link href="/repair" onClick={toggleSidebar} className="hover:underline hover:text-white transition">Repair</Link>
                        <Link href="/phones" onClick={toggleSidebar} className="hover:underline hover:text-white transition">Phones</Link>
                        <Link href="/accessories" onClick={toggleSidebar} className="hover:underline hover:text-white transition">Accessories</Link>
                        <Link href="#" onClick={toggleSidebar} className="hover:underline hover:text-white transition">Contact</Link>
                    </nav>

                    {/* User Section */}
                    {isAuthenticated() ? (
                        <div className="p-6 text-[#85a4bf] font-bold text-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <User size={30} className="inline mr-2" />
                                    <span className="font-bold truncate max-w-[150px]">{user?.name}</span>
                                </div>
                                <button onClick={logout} className="text-[#85a4bf] hover:text-white transition">
                                    <LogOut size={30} />
                                </button>
                            </div>
                            <Link href="/dashboard" className="block mt-2 text-lg hover:text-white transition" onClick={toggleSidebar}>
                                Dashboard
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="p-6 text-[#85a4bf] font-bold text-xl hover:text-white transition"
                            onClick={toggleSidebar}
                        >
                            <LogIn size={30} className="inline mr-2" />
                            <span className="font-bold">Login</span>
                        </Link>
                    )}

                    {/* Socials */}
                    <div className="mt-auto pt-12 pb-6">
                        <div className="flex space-x-6 justify-center">
                            <Link href="#" aria-label="Instagram" className="hover:text-white transition">
                                <Instagram className="w-6 h-6" />
                            </Link>
                            <Link href="#" aria-label="LinkedIn" className="hover:text-white transition">
                                <Linkedin className="w-6 h-6" />
                            </Link>
                            <Link href="#" aria-label="Facebook" className="hover:text-white transition">
                                <Facebook className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slight dim / push overlay effect */}
            <div
                className={`fixed inset-0 z-[998] bg-black transition-opacity duration-300 ${
                    isOpen ? 'opacity-30' : 'opacity-0 pointer-events-none'
                }`}
                onClick={toggleSidebar}
            ></div>
        </header>
    );
}
