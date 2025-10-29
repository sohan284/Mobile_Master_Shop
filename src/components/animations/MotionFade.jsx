"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function MotionFade({
  as: Component = "div",
  children,
  className,
  delay = 0,
  y = 8,
  immediate = false,
}) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    
    // Cleanup function to handle component unmounting
    return () => {
      // Ensure any pending animations are cleaned up
      if (containerRef.current) {
        containerRef.current = null;
      }
    };
  }, []);

  // For immediate content (like hero sections), use animate instead of whileInView
  if (immediate) {
    // During SSR and initial hydration, show content without animation
    if (!mounted) {
      return (
        <div ref={containerRef} className={className} style={{ opacity: 1, transform: 'translateY(0)' }}>
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={containerRef}
        className={className}
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut", delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.2, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}


