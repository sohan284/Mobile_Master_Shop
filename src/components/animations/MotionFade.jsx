"use client";
import { motion } from "framer-motion";

export default function MotionFade({
  as: Component = "div",
  children,
  className,
  delay = 0,
  y = 8,
}) {
  return (
    <motion.div
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


