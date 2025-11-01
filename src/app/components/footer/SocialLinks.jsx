import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function SocialLinks() {
    return (
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
    );
}
