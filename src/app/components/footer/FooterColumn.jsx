import Link from "next/link";

export default function FooterColumn({ title, links }) {
    return (
        <div className="group mb-6 sm:mb-0">
            <h3 className="text-secondary text-base sm:text-lg font-semibold mb-4 sm:mb-5  transition-colors duration-300">
                {title}
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
                {links.map((link, index) => (
                    <li key={index}>
                        <Link 
                            href={link.href} 
                            className="text-secondary/80  transition-all duration-300 hover:translate-x-1 inline-block text-xs sm:text-sm touch-manipulation py-1"
                        >
                            {link.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
