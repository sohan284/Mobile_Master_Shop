'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User, LogIn, Facebook, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';
import logo from "@/assets/mlkLogo.png"
export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [mobileSearch, setMobileSearch] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        setMobileSearch(false); // Reset search when sidebar toggles
    };

    // Scroll detection logic with throttling for smoother performance
    useEffect(() => {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const scrollDifference = Math.abs(currentScrollY - lastScrollY);
                    
                    // Only trigger if scroll difference is significant (reduces jitter)
                    if (scrollDifference > 5) {
                        // Show header when at top
                        if (currentScrollY < 10) {
                            setIsVisible(true);
                        }
                        // Hide header when scrolling down, show when scrolling up
                        else if (currentScrollY > lastScrollY && currentScrollY > 80) {
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
        <header className={`bg-primary shadow text-secondary py-6 sticky top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
            <div className="max-w-5xl mx-auto px-4 flex items-center justify-between lg:justify-center relative">

                {/* Mobile: Hamburger - Logo - User */}
                <div className="lg:hidden flex justify-between items-center w-full">
                    <button onClick={toggleSidebar} className="text-white focus:outline-none">
                        <Menu size={30} />
                    </button>

                    <div className="text-xl font-bold">LOGO</div>

                    <button className="text-white focus:outline-none">
                        <User size={24} />
                    </button>
                </div>

                {/* Desktop */}
                <div className="hidden lg:flex items-center w-full justify-between">
                    {/* Left Nav */}
                    <div className="flex space-x-4 text-lg">
                        <Link href="/repair" className="hover:underline">Repair</Link>
                        <Link href="/phones" className="hover:underline">Phones</Link>
                        <Link href="/accessories" className="hover:underline">Accessories</Link>
                    </div>

                    {/* Center Logo */}
                    <div className="text-2xl font-bold text-center">
                        <Link href="/">
                            <Image className='rounded-full' src={logo} alt="Logo" width={40} height={40} />
                        </Link>
                    </div>

                    {/* Right Nav */}
                    <div className="flex items-center space-x-4 text-lg">
                        <Link href="#" className="hover:underline">Our Services</Link>
                        <Link href="#" className="hover:underline">Blog</Link>
                        <Link href="#" className="hover:underline">About</Link>
                        <div className="flex items-center space-x-3 ml-4">
                            <button className="hover:text-gray-300" title="Search">
                                <Search size={25} />
                            </button>
                            <button className="hover:text-gray-300" title="User">
                                <User size={25} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleSidebar}>
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-[#6B7E8D] text-white p-6 z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center mb-6">
                            <button onClick={toggleSidebar}>
                                <X size={30} />
                            </button>
                        </div>

                        {/* Mobile Search */}
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

                        {/* Mobile Nav */}
                        <nav className="flex flex-col space-y-4 p-6 border-4 border-[#0d416e] border-x-0 text-xl text-[#85a4bf] font-bold">
                            <Link href="#" onClick={toggleSidebar} className="hover:underline">Repair</Link>
                            <Link href="#" onClick={toggleSidebar} className="hover:underline">Refurbished</Link>
                            <Link href="#" onClick={toggleSidebar} className="hover:underline">Accessories</Link>
                            <Link href="#" onClick={toggleSidebar} className="hover:underline">Our Services</Link>
                            <Link href="#" onClick={toggleSidebar} className="hover:underline">Blog</Link>
                            <Link href="#" onClick={toggleSidebar} className="hover:underline">About</Link>
                        </nav>
                        <div className='p-6 text-[#85a4bf] font-bold text-xl'>
                            <LogIn size={30} className="inline mr-2" />
                            <span className="font-bold">Login</span>
                        </div>
                        {/* Social icons */}
                        <div className="max-w-7xl mx-auto flex flex-col mt-72 p-6">
                            <div className="flex space-x-6">
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
            )}
        </header>
    );
}
