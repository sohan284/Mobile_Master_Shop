"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean); // e.g. ['products', 'laptops']

    // Don't show breadcrumbs at all on the homepage
    if (pathSegments.length === 0) return null;

    const crumbs = pathSegments.map((segment, i) => {
        const href = "/" + pathSegments.slice(0, i + 1).join("/");
        const label = decodeURIComponent(segment)
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
        return { href, label };
    });

    return (
        <nav aria-label="Breadcrumb" className="text-sm text-gray-600 my-4">
            <ol className="flex flex-wrap items-center space-x-1">
                {/* Home link always shown */}
                <li>
                    <Link href="/" className="hover:underline text-gray-700">
                        🏠 Home
                    </Link>
                </li>

                {/* Show route segments only if not on home */}
                {crumbs.map((crumb, i) => (
                    <li key={crumb.href} className="flex items-center space-x-1">
                        <span className="text-gray-700">/</span>
                        {i === crumbs.length - 1 ? (
                            <span className="text-gray-800">{crumb.label}</span>
                        ) : (
                            <Link href={crumb.href} className="hover:underline text-gray-800">
                                {crumb.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
