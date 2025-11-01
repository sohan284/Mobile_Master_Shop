"use client";
import { useEffect } from "react";

// Patch removeChild to be safe during navigation
// This prevents the "removeChild" error when Framer Motion tries to remove nodes
// that Next.js has already unmounted during navigation
let isPatched = false;

export default function SafeDOMPatch() {
  useEffect(() => {
    if (typeof window === 'undefined' || isPatched) {
      return;
    }

    const originalRemoveChild = Node.prototype.removeChild;

    Node.prototype.removeChild = function(child) {
      try {
        // Check if child is actually a child of this node
        if (child && child.parentNode === this) {
          return originalRemoveChild.call(this, child);
        }
        // If not a child, return the child without error (safe fail)
        // This happens during fast navigation when Next.js unmounts before Framer Motion completes
        return child;
      } catch (error) {
        // If error occurs, check if it's a removeChild/NotFoundError
        if (error.message?.includes('removeChild') || 
            error.name === 'NotFoundError' ||
            error.message?.includes('not a child')) {
          // Silently handle the error during navigation
          return child;
        }
        throw error;
      }
    };

    isPatched = true;
  }, []);

  return null;
}

