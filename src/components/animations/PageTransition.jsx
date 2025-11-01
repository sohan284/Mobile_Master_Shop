"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState, memo } from "react";

function PageTransitionComponent({ children }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [displayPathname, setDisplayPathname] = useState(pathname);

  useEffect(() => {
    setIsMounted(true);

    // Update display pathname when pathname changes
    if (pathname !== displayPathname) {
      setDisplayPathname(pathname);
    }
  }, [pathname, displayPathname]);

  // Prevent hydration flicker
  if (!isMounted) {
    return <div>{children}</div>;
  }

  return (
    <AnimatePresence 
      mode="wait" 
      initial={false}
    >
      <motion.div
        key={displayPathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(PageTransitionComponent);
