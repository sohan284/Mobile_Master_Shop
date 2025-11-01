import Link from "next/link";

export default function FooterColumn({ title, links }) {
    return (
        <div className="group">
            <h3 className="text-secondary text-lg font-semibold mb-4 group-hover:text-white transition-colors duration-300">{title}</h3>
            <ul className="space-y-2">
                {links.map((link, index) => (
                    <li key={index}>
                        <Link href={link.href} className="hover:text-white transition-all duration-300 hover:translate-x-1 hover:scale-105 block">
                            {link.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
