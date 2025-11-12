"use client";
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Wrench, Smartphone, Settings } from 'lucide-react';

const Breadcrumb = ({ items, className = "" }) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-700 mx-2" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center text-gray-800 hover:text-secondary transition-colors"
              >
                {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center text-gray-800">
                {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                <span className="font-medium">{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

