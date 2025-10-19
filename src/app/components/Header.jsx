'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User } from 'lucide-react';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [mobileSearch, setMobileSearch] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        setMobileSearch(false); // Reset search when sidebar toggles
    };

    return (
        <header className="bg-[#0f4c81] text-white py-4 fixed w-full z-50">
            <div className="max-w-5xl mx-auto px-4 flex items-center justify-between lg:justify-center relative">

                {/* Mobile: Hamburger - Logo - User */}
                <div className="lg:hidden flex justify-between items-center w-full">
                    <button onClick={toggleSidebar} className="text-white focus:outline-none">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="text-xl font-bold">LOGO</div>

                    <button className="text-white focus:outline-none">
                        <User size={24} />
                    </button>
                </div>

                {/* Desktop */}
                <div className="hidden lg:flex items-center w-full justify-between">
                    {/* Left Nav */}
                    <div className="flex space-x-4">
                        <Link href="#" className="hover:underline">Home</Link>
                        <Link href="#" className="hover:underline">About</Link>
                        <Link href="#" className="hover:underline">Services</Link>
                    </div>

                    {/* Center Logo */}
                    <div className="text-2xl font-bold text-center">LOGO</div>

                    {/* Right Nav */}
                    <div className="flex items-center space-x-4">
                        <Link href="#" className="hover:underline">Portfolio</Link>
                        <Link href="#" className="hover:underline">Blog</Link>
                        <Link href="#" className="hover:underline">Contact</Link>
                        <button className="hover:text-gray-300" title="Search">
                            <Search size={20} />
                        </button>
                        <button className="hover:text-gray-300" title="User">
                            <User size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleSidebar}>
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-[#0f4c81] text-white p-6 z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Menu</h2>
                            <button onClick={toggleSidebar}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Search Icon or Input */}
                        <div className="mb-4">
                            {mobileSearch ? (
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full px-3 py-2 text-black rounded"
                                    autoFocus
                                />
                            ) : (
                                <button
                                    className="flex items-center space-x-2 hover:underline"
                                    onClick={() => setMobileSearch(true)}
                                >
                                    <Search size={20} />
                                    <span>Search</span>
                                </button>
                            )}
                        </div>

                        <nav className="flex flex-col space-y-4">
                            <Link href="#" onClick={toggleSidebar} className="hover:underline">Home</Link>
                            <Link href="#" onClick={toggleSidebar} className="hover:underline">About</Link>
                            <Link href="#" onClick={toggleSidebar} className="hover:underline">Services</Link>
                            <Link href="#" onClick={toggleSidebar} className="hover:underline">Portfolio</Link>
                            <Link href="#" onClick={toggleSidebar} className="hover:underline">Blog</Link>
                            <Link href="#" onClick={toggleSidebar} className="hover:underline">Contact</Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
