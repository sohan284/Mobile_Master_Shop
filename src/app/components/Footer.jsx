import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary text-secondary py-10 px-6 md:px-20 relative overflow-hidden">
            {/* Footer Background Animations */}
            <div className="absolute inset-0 z-0">
                {/* Animated gradient background with diagonal flow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary"></div>
                
                {/* Floating energy waves */}
                <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-secondary/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-secondary/12 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-secondary/6 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2.5s'}}></div>
                <div className="absolute bottom-1/3 right-1/3 w-22 h-22 bg-secondary/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.8s'}}></div>
                
                {/* Animated diagonal stripes */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent animate-pulse" style={{animationDelay: '1s', transform: 'rotate(15deg)'}}></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/15 to-transparent animate-pulse" style={{animationDelay: '2s', transform: 'rotate(-15deg)'}}></div>
                
                {/* Floating light streaks */}
                <div className="absolute top-1/2 left-1/6 w-2 h-12 bg-gradient-to-b from-secondary/25 to-transparent animate-pulse" style={{animationDelay: '0.3s', transform: 'rotate(30deg)'}}></div>
                <div className="absolute top-1/2 right-1/6 w-2 h-10 bg-gradient-to-b from-secondary/20 to-transparent animate-pulse" style={{animationDelay: '1.8s', transform: 'rotate(-30deg)'}}></div>
            
                {/* Animated circuit pattern */}
                <div className="absolute inset-0 opacity-6">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: 'linear-gradient(45deg, rgba(243, 203, 165, 0.1) 1px, transparent 1px), linear-gradient(-45deg, rgba(243, 203, 165, 0.1) 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}></div>
                </div>
                
                {/* Floating energy dots */}
                <div className="absolute top-1/6 left-1/6 w-1 h-1 bg-secondary/40 rounded-full animate-ping" style={{animationDelay: '1.2s'}}></div>
                <div className="absolute top-1/6 right-1/6 w-1 h-1 bg-secondary/35 rounded-full animate-ping" style={{animationDelay: '2.2s'}}></div>
                <div className="absolute bottom-1/6 left-1/6 w-1 h-1 bg-secondary/30 rounded-full animate-ping" style={{animationDelay: '0.8s'}}></div>
                <div className="absolute bottom-1/6 right-1/6 w-1 h-1 bg-secondary/25 rounded-full animate-ping" style={{animationDelay: '1.8s'}}></div>
            </div>
            {/* Top grid with 4 sections */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                {/* Repair Section */}
                <div className="group">
                    <h3 className="text-secondary text-lg font-semibold mb-4 group-hover:text-white transition-colors duration-300">Repair</h3>
                    <ul className="space-y-2">
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">APPLE</Link></li>
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">SAMSUNG</Link></li>
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">XIAOMI</Link></li>
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">HUAWEI</Link></li>
                    </ul>
                </div>

                {/* Services Section */}
                <div className="group">
                    <h3 className="text-secondary text-lg font-semibold mb-4 group-hover:text-white transition-colors duration-300">Services</h3>
                    <ul className="space-y-2">
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">Accessories</Link></li>
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">Refurbished smartphones</Link></li>
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">Loan if immobilized</Link></li>
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">Recovery & recycling</Link></li>
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">Data backup & transfer</Link></li>
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">Repair for Orange customers</Link></li>
                    </ul>
                </div>

                {/* Our Stores Section */}
                <div className="group">
                    <h3 className="text-secondary text-lg font-semibold mb-4 group-hover:text-white transition-colors duration-300">Our Stores</h3>
                    <ul className="space-y-2">
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">Repair Paris</Link></li>
                        {/* <li><Link href="#" className="hover:text-white transition">Repair Marseille</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Lyon Repair</Link></li> */}
                    </ul>
                </div>

                {/* Useful Links Section */}
                <div className="group">
                    <h3 className="text-secondary text-lg font-semibold mb-4 group-hover:text-white transition-colors duration-300">Useful Links</h3>
                    <ul className="space-y-2">
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">Terms and Conditions</Link></li>
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">Legal notices</Link></li>
                        <li><Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">Cookies</Link></li>
                    </ul>
                </div>
            </div>

            {/* Social icons */}
            <div className="max-w-7xl mx-auto mt-10 flex flex-col items-center relative z-10">
                <h3 className="text-secondary text-lg font-semibold mb-4 hover:text-white transition-colors duration-300">Follow Us</h3>
                <div className="flex space-x-6">
                    <Link href="#" aria-label="Instagram" className="hover:text-white transition-all duration-300 hover:scale-125 hover:rotate-12 group">
                        <Instagram className="w-6 h-6 group-hover:drop-shadow-lg" />
                    </Link>
                    <Link href="#" aria-label="LinkedIn" className="hover:text-white transition-all duration-300 hover:scale-125 hover:rotate-12 group">
                        <Linkedin className="w-6 h-6 group-hover:drop-shadow-lg" />
                    </Link>
                    <Link href="#" aria-label="Facebook" className="hover:text-white transition-all duration-300 hover:scale-125 hover:rotate-12 group">
                        <Facebook className="w-6 h-6 group-hover:drop-shadow-lg" />
                    </Link>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="mt-10 pt-6 text-center text-sm text-gray-500 relative z-10 hover:text-white transition-colors duration-300">
                © {new Date().getFullYear()} MLK. All rights reserved.
            </div>
        </footer>
    );
}
