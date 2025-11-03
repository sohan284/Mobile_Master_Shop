'use client';

import React from 'react';
import NotFound from '@/components/ui/NotFound';
import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <NotFound
          title="Page not found"
          description="The page you're looking for doesn't exist or may have moved."
          primaryAction={
            <Link
              href="/"
              className="inline-block bg-secondary text-primary px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Go to Home
            </Link>
          }
          secondaryAction={
            <Link href="/contact" className="text-primary hover:text-primary/90 underline">
              Contact support
            </Link>
          }
          icon={null}
        />
      </div>
    </div>
  );
}


