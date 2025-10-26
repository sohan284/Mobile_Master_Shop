"use client";
import React from "react";
import { motion } from "framer-motion";
import { CustomButton } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import hero from "../../../public/banner.png";
import repair from "../../../public/repair.png";
import accessories from "../../../public/Accessories.png";

export default function Banner() {
  return (
    <div className="relative dark-blue-vignette text-white pb-20 pt-8 overflow-hidden">
      <div className="container mx-auto px-4 z-10 relative">
        {/* Text Section */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold tracking-wider"
          >
            REPAIR. SELL. BUY.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-gray-300"
          >
            Experience Premium at MLKPHONE
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex justify-center gap-4"
          >
            <Link href="/phones">
              <CustomButton className="bg-secondary text-primary hover:bg-secondary/90">
                Shop Now
              </CustomButton>
            </Link>
            <Link href="/repair">
              <CustomButton
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary hover:text-primary"
              >
                Book a Repair
              </CustomButton>
            </Link>
          </motion.div>
        </div>

        {/* Fixed Row Layout with Screen Protection */}
        <div className="mt-20 flex justify-center items-end gap-8 sm:gap-12 md:gap-20 px-4 md:px-10 flex-nowrap max-w-full overflow-hidden">
          {/* Repair */}
          <Link href="/repair">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="w-24 sm:w-28 md:w-36 h-24 sm:h-28 md:h-36 rounded-xl shadow-lg text-xs md:text-2xl flex flex-col items-center justify-center border border-gray-500/40 hover:scale-105 transition-transform bg-transparent flex-shrink-0"
            >
              <Image
                src={repair}
                alt="repair logo"
                width={60}
                height={60}
                className="object-contain"
              />
              <h2 className="mt-2 font-semibold text-white">Repair</h2>
            </motion.div>
          </Link>

          {/* Main Hero Image */}
          <Link href="/phones">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
              className="w-[200px] sm:w-[260px] md:w-[320px] flex justify-center flex-shrink-0"
            >
              <Image
                src={hero}
                alt="iPhone 14 Pro Max"
                width={320}
                height={320}
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
          </Link>

          {/* Accessories */}
          <Link href="/accessories">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="w-24 sm:w-28 md:w-36 h-24 sm:h-28 md:h-36 rounded-xl shadow-lg text-xs md:text-2xl flex flex-col items-center justify-center border border-gray-500/40 hover:scale-105 transition-transform bg-transparent flex-shrink-0"
            >
              <Image
                src={accessories}
                alt="Accessories logo"
                width={60}
                height={60}
                className="object-contain"
              />
              <h2 className="mt-2 font-semibold text-white">Accessories</h2>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
