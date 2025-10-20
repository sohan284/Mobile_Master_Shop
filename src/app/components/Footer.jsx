import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0f4c81] text-gray-300 py-10 px-6 md:px-20">
            {/* Top grid with 4 sections */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* Repair Section */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-4">Repair</h3>
                    <ul className="space-y-2">
                        <li><Link href="#" className="hover:text-white transition">APPLE</Link></li>
                        <li><Link href="#" className="hover:text-white transition">SAMSUNG</Link></li>
                        <li><Link href="#" className="hover:text-white transition">XIAOMI</Link></li>
                        <li><Link href="#" className="hover:text-white transition">HUAWEI</Link></li>
                    </ul>
                </div>

                {/* Services Section */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-4">Services</h3>
                    <ul className="space-y-2">
                        <li><Link href="#" className="hover:text-white transition">Accessories</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Refurbished smartphones</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Loan if immobilized</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Recovery & recycling</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Data backup & transfer</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Repair for Orange customers</Link></li>
                    </ul>
                </div>

                {/* Our Stores Section */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-4">Our Stores</h3>
                    <ul className="space-y-2">
                        <li><Link href="#" className="hover:text-white transition">Repair Paris</Link></li>
                        {/* <li><Link href="#" className="hover:text-white transition">Repair Marseille</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Lyon Repair</Link></li> */}
                    </ul>
                </div>

                {/* Useful Links Section */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-4">Useful Links</h3>
                    <ul className="space-y-2">
                        <li><Link href="#" className="hover:text-white transition">Terms and Conditions</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Legal notices</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Cookies</Link></li>
                    </ul>
                </div>
            </div>

            {/* Social icons */}
            <div className="max-w-7xl mx-auto mt-10 flex flex-col items-center">
                <h3 className="text-white text-lg font-semibold mb-4">Follow Us</h3>
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

            {/* Copyright Section */}
            <div className="mt-10 pt-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Repair Company. All rights reserved.
            </div>
        </footer>
    );
}
