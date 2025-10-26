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
      <div className="container mx-auto p-4 z-10 relative">
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
    {/* Background Shade */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Desktop Layout (md and up) */}
        <div className="hidden md:flex mt-16 md:mt-24 justify-center items-end gap-6 md:gap-16 lg:gap-20 px-4 md:px-10 max-w-7xl mx-auto relative z-10">
          {/* Repair */}
          <Link href="/repair">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="w-52 lg:w-60 h-52 lg:h-60 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col items-center justify-center border border-gray-700/50 hover:scale-105 hover:border-gray-600/60 transition-all duration-300 bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-sm cursor-pointer group"
            >
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={repair}
                  alt="repair logo"
                  width={80}
                  height={80}
                  className="object-contain w-16 md:w-16 lg:w-20"
                />
              </div>
              <h2 className="mt-3 md:mt-4 font-semibold text-white text-xl lg:text-2xl">Réparer</h2>
            </motion.div>
          </Link>

          {/* Main Hero Image */}
          <Link href="/phones">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, delay: 0.5 }}
              className="w-[300px] lg:w-[380px] flex justify-center cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={hero}
                alt="iPhone 14 Pro Max"
                width={380}
                height={380}
                className="object-contain drop-shadow-[0_35px_55px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </Link>

          {/* Accessories */}
          <Link href="/accessories">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="w-52 lg:w-60 h-52 lg:h-60 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col items-center justify-center border border-gray-700/50 hover:scale-105 hover:border-gray-600/60 transition-all duration-300 bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-sm cursor-pointer group"
            >
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={accessories}
                  alt="Accessories logo"
                  width={80}
                  height={80}
                  className="object-contain w-16 md:w-16 lg:w-20"
                />
              </div>
              <h2 className="mt-3 md:mt-4 font-semibold text-white text-xl lg:text-2xl">Accessoires</h2>
            </motion.div>
          </Link>
        </div>

        {/* Mobile/Tablet Layout (below md) */}
        <div className="md:hidden flex flex-col items-center gap-8 px-4 mt-12 relative z-10">
          {/* Main Hero Image */}
          <Link href="/phones" className="w-full flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, delay: 0.3 }}
              className="w-[240px] sm:w-[280px] cursor-pointer active:scale-95 transition-transform duration-300"
            >
              <Image
                src={hero}
                alt="iPhone 14 Pro Max"
                width={320}
                height={320}
                className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </Link>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-md">
            {/* Repair */}
            <Link href="/repair">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-full aspect-square rounded-2xl shadow-xl flex flex-col items-center justify-center border border-gray-700/50 active:scale-95 transition-all duration-300 bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-sm"
              >
                <Image
                  src={repair}
                  alt="repair logo"
                  width={60}
                  height={60}
                  className="object-contain w-12 sm:w-16"
                />
                <h2 className="mt-2 sm:mt-3 font-semibold text-white text-base sm:text-lg">Réparer</h2>
              </motion.div>
            </Link>

            {/* Accessories */}
            <Link href="/accessories">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="w-full aspect-square rounded-2xl shadow-xl flex flex-col items-center justify-center border border-gray-700/50 active:scale-95 transition-all duration-300 bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-sm"
              >
                <Image
                  src={accessories}
                  alt="Accessories logo"
                  width={60}
                  height={60}
                  className="object-contain w-12 sm:w-16"
                />
                <h2 className="mt-2 sm:mt-3 font-semibold text-white text-base sm:text-lg">Accessoires</h2>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
