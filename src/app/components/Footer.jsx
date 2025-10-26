import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary text-secondary py-10 px-6 md:px-20 relative overflow-hidden">
            {/* Top grid with 4 sections */}
            <div className="container  mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
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
            <div className="container  mx-auto mt-10 flex flex-col items-center relative z-10">
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
