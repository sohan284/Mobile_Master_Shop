'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User, LogIn, Facebook, Instagram, Linkedin, LogOut } from 'lucide-react';
import Image from 'next/image';
import logo from "@/assets/mlkLogo.png";
import { useAuth } from '@/contexts/AuthContext';
export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [mobileSearch, setMobileSearch] = useState(false);
    const [isVisible, setIsVisible] = useState(true);   
    const [lastScrollY, setLastScrollY] = useState(0);
    const { user, logout, isAuthenticated } = useAuth();

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
        <header className={`bg-primary shadow text-secondary py-6 sticky top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative overflow-hidden ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
            {/* Header Background Animations */}
            <div className="absolute inset-0 -z-10">
                {/* Animated gradient background with wave effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary"></div>
                
                {/* Floating orbs with glow effect */}
                <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-secondary/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-secondary/15 rounded-full blur-lg animate-pulse" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-secondary/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2.5s'}}></div>
                <div className="absolute bottom-1/3 right-1/3 w-14 h-14 bg-secondary/12 rounded-full blur-lg animate-pulse" style={{animationDelay: '0.8s'}}></div>
                
                {/* Animated flowing lines */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-secondary/30 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-secondary/25 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
                
                {/* Floating light beams */}
                <div className="absolute top-1/2 left-1/6 w-1 h-8 bg-gradient-to-b from-secondary/40 to-transparent animate-pulse" style={{animationDelay: '0.3s', transform: 'rotate(15deg)'}}></div>
                <div className="absolute top-1/2 right-1/6 w-1 h-6 bg-gradient-to-b from-secondary/35 to-transparent animate-pulse" style={{animationDelay: '1.8s', transform: 'rotate(-20deg)'}}></div>
          
                {/* Subtle mesh pattern */}
                <div className="absolute inset-0 opacity-8">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: 'linear-gradient(90deg, rgba(243, 203, 165, 0.1) 1px, transparent 1px), linear-gradient(rgba(243, 203, 165, 0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}></div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 flex items-center justify-between lg:justify-center relative z-10">

                {/* Mobile: Hamburger - Logo - User */}
                <div className="lg:hidden flex justify-between items-center w-full">
                    <button onClick={toggleSidebar} className="text-white focus:outline-none">
                        <Menu size={30} />
                    </button>

                    <div className="text-xl font-bold">LOGO</div>

                    {isAuthenticated() ? (
                        <div className="flex items-center space-x-2">
                            <span className="text-white text-sm">{user?.name}</span>
                            <button 
                                onClick={logout}
                                className="text-white focus:outline-none hover:text-gray-300"
                                title="Logout"
                            >
                                <LogOut size={24} />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="text-white focus:outline-none hover:text-gray-300">
                            <User size={24} />
                        </Link>
                    )}
                </div>

                {/* Desktop */}
                <div className="hidden lg:flex items-center w-full justify-between">
                    {/* Left Nav */}
                    <div className="flex space-x-4 text-lg">
                        <Link href="/repair" className="hover:underline hover:text-white transition-all duration-300 hover:scale-105 relative group">
                            <span className="relative z-10">Repair</span>
                            <div className="absolute inset-0 bg-secondary/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        </Link>
                        <Link href="/phones" className="hover:underline hover:text-white transition-all duration-300 hover:scale-105 relative group">
                            <span className="relative z-10">Phones</span>
                            <div className="absolute inset-0 bg-secondary/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        </Link>
                        <Link href="/accessories" className="hover:underline hover:text-white transition-all duration-300 hover:scale-105 relative group">
                            <span className="relative z-10">Accessories</span>
                            <div className="absolute inset-0 bg-secondary/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        </Link>
                    </div>

                    {/* Center Logo */}
                    <div className="text-2xl font-bold text-center">
                        <Link href="/" className="group relative">
                            <Image className='rounded-full hover:scale-110 transition-transform duration-300 hover:rotate-12 group-hover:shadow-lg' src={logo} alt="Logo" width={40} height={40} />
                            {/* Pulsing ring around logo */}
                            {/* <div className="absolute inset-0 rounded-full border-2 border-secondary/30 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                        </Link>
                    </div>

                    {/* Right Nav */}
                    <div className="flex items-center space-x-4 text-lg">
                        <Link href="#" className="hover:underline hover:text-white transition-all duration-300 hover:scale-105 relative group">
                            <span className="relative z-10">Our Services</span>
                            <div className="absolute inset-0 bg-secondary/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        </Link>
                        <Link href="#" className="hover:underline hover:text-white transition-all duration-300 hover:scale-105 relative group">
                            <span className="relative z-10">Blog</span>
                            <div className="absolute inset-0 bg-secondary/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        </Link>
                        <Link href="#" className="hover:underline hover:text-white transition-all duration-300 hover:scale-105 relative group">
                            <span className="relative z-10">About</span>
                            <div className="absolute inset-0 bg-secondary/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        </Link>
                        <div className="flex items-center space-x-3 ml-4">
                            <button className="hover:text-gray-300" title="Search">
                                <Search size={25} />
                            </button>
                            {isAuthenticated() ? (
                                <div className="flex items-center space-x-3">
                                    <Link 
                                        href="/dashboard" 
                                        className="hover:text-gray-300 flex items-center space-x-2"
                                        title="Dashboard"
                                    >
                                        <User size={25} />
                                        <span className="text-sm">{user?.name}</span>
                                    </Link>
                                    <button 
                                        onClick={logout}
                                        className="hover:text-gray-300"
                                        title="Logout"
                                    >
                                        <LogOut size={25} />
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="hover:text-gray-300" title="Login">
                                    <User size={25} />
                                </Link>
                            )}
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
                        {isAuthenticated() ? (
                            <div className='p-6 text-[#85a4bf] font-bold text-xl'>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <User size={30} className="inline mr-2" />
                                        <span className="font-bold">{user?.name}</span>
                                    </div>
                                    <button 
                                        onClick={logout}
                                        className="text-[#85a4bf] hover:text-white transition"
                                    >
                                        <LogOut size={30} />
                                    </button>
                                </div>
                                <Link 
                                    href="/dashboard" 
                                    className="block mt-2 text-lg hover:text-white transition"
                                    onClick={toggleSidebar}
                                >
                                    Dashboard
                                </Link>
                            </div>
                        ) : (
                            <Link href="/login" className='p-6 text-[#85a4bf] font-bold text-xl hover:text-white transition' onClick={toggleSidebar}>
                                <LogIn size={30} className="inline mr-2" />
                                <span className="font-bold">Login</span>
                            </Link>
                        )}
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
