"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, memo } from "react";

function MotionFadeComponent({
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
    return () => {
      containerRef.current = null;
    };
  }, []);

  // For sections that appear immediately (e.g., hero)
  if (immediate) {
    if (!mounted) {
      return (
        <div
          ref={containerRef}
          className={className}
          style={{ opacity: 1, transform: "translateY(0)" }}
        >
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

export default memo(MotionFadeComponent);
