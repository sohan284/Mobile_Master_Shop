"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/animations/PageTransition";
import MotionFade from "@/components/animations/MotionFade";
import SearchSection from "@/components/common/SearchSection";
import GridSection from "@/components/common/GridSection";
import FeaturesSection from "@/components/common/FeaturesSection";
import { useApiGet } from "@/hooks/useApi";
import { apiFetcher } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export default function AccessoriesPage() {
  const t = useTranslations('accessories');
  const [searchTerm, setSearchTerm] = useState("");

  const { data: accessoriesResponse, isLoading, error } = useApiGet(
    ["accessories"],
    () => apiFetcher.get("/api/accessories/products/")
  );

  const accessories = useMemo(
    () => accessoriesResponse?.data || [],
    [accessoriesResponse?.data]
  );

  const fallbackItems = useMemo(
    () => [
      {
        id: 101,
        title: "Clear Phone Case",
        subtitle: "Shock-absorbent transparent TPU case",
        final_price: 15,
        main_amount: 19,
        picture: "/hood.png",
        in_stock: true,
      },
      {
        id: 102,
        title: "Tempered Glass",
        subtitle: "9H hardness, edge-to-edge protection",
        final_price: 12,
        main_amount: 15,
        picture: "/screen.png",
        in_stock: true,
      },
      {
        id: 103,
        title: "Fast Charger 20W",
        subtitle: "PD fast charging USB-C adapter",
        final_price: 18,
        main_amount: 22,
        picture: "/charger two port.png",
        in_stock: true,
      },
      {
        id: 104,
        title: "USB-C Cable",
        subtitle: "1m braided cable, durable and fast",
        final_price: 10,
        main_amount: 12,
        picture: "/c cable.png",
        in_stock: true,
      },
      {
        id: 105,
        title: "Power Bank 10,000mAh",
        subtitle: "Slim, lightweight with dual output",
        final_price: 30,
        main_amount: 35,
        picture: "/battery.png",
        in_stock: true,
      },
      {
        id: 106,
        title: "Bluetooth Headphones",
        subtitle: "Over-ear, noise isolation, 20h battery",
        final_price: 35,
        main_amount: 49,
        picture: "/camera.png",
        in_stock: true,
      },
    ],
    []
  );

  const [randomizedItems, setRandomizedItems] = useState([]);
  useEffect(() => {
    const items = accessories.length ? accessories : fallbackItems;
    setRandomizedItems([...items].sort(() => Math.random() - 0.5));
  }, [accessories, fallbackItems]);

  const allItems =
    randomizedItems.length > 0 ? randomizedItems : accessories || fallbackItems;

  const filteredItems = allItems.filter((item) =>
    (item.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden bg-primary md:p-20">
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                  {t('premiumAccessories')}
                </h1>
                <p className="text-lg text-gray-600">
                  {t('discoverHighQuality')}
                </p>
              </div>
              <div className="md:w-96">
                <SearchSection
                  placeholder={t('searchAccessories')}
                  searchTerm={searchTerm}
                  onSearchChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Accessories Grid */}
          <GridSection
            title=""
            description=""
            items={filteredItems}
            isLoading={isLoading}
            loadingCount={8}
            onItemClick={(item) =>
              `/accessories/${item.slug || "accessories"}/${item.id}`
            }
            onItemClickHandler={(item) => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem(
                  "selectedAccessory",
                  JSON.stringify(item)
                );
              }
            }}
            gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
            notFoundTitle={t('noAccessoriesFound')}
            notFoundDescription={t('noAccessoriesMatching', { searchTerm })}
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm("")}
            primaryAction={{
              text: t('clearSearch'),
              href: "#",
              onClick: () => setSearchTerm(""),
            }}
            secondaryAction={{
              text: t('viewAllAccessories'),
              href: "/accessories",
              onClick: () => setSearchTerm(""),
            }}
            renderItem={(item) => (
              <Link href={`/accessories/${item.id}`} className="group block h-full">
                <div className="group bg-gradient-to-br from-gray-100/40 to-gray-300/40 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-600/20 hover:border-secondary/50 h-full overflow-hidden">
                  <div className="p-6 text-center h-full flex flex-col">
                    {/* Image container with hover effect */}
                    <div className="mb-6 bg-white rounded-xl border p-6 group-hover:from-gray-400/20 group-hover:to-gray-600/20 transition-all duration-500 relative overflow-hidden">
                      <Image
                        src={item.picture || '/Accessories.png'}
                        alt={item.title}
                        width={160}
                        height={160}
                        className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-300 relative z-10"
                      />
                    </div>

                    {/* Title, description, price */}
                    <div className="flex-grow flex flex-col justify-between">
                      <h3 className="font-bold text-lg text-secondary group-hover:text-secondary transition-colors duration-300 mb-3">
                        {item.title}
                      </h3>

                      <div className="space-y-2">
                        {item.subtitle && (
                          <p className="text-gray-600 text-sm">{item.subtitle}</p>
                        )}
                        <div className="space-y-1">
                          <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
                            {item.discount_percentage && parseFloat(item.discount_percentage) > 0 && (
                              <span className="text-xs text-green-600">
                                {parseFloat(item.discount_percentage).toFixed(1)}% off
                              </span>
                            )}
                            <span className="font-bold text-secondary">
                              ${parseFloat(item.final_price || 0).toLocaleString()}
                            </span>
                            {item.main_amount && item.main_amount !== item.final_price && (
                              <span className="text-sm text-gray-400 line-through">
                                ${parseFloat(item.main_amount || 0).toLocaleString()}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

          />

          {/* Error */}
          {error && (
            <MotionFade delay={0.15}>
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-lg border border-red-200">
                  {t('failedToLoadAccessories')}
                </div>
              </div>
            </MotionFade>
          )}

          {/* Features */}
          <div className="mt-20">
            <FeaturesSection
              title={t('whyChooseOurAccessories')}
              description={t('premiumAccessoriesDescription')}
              features={[
                {
                  title: t('premiumQuality'),
                  description: t('builtForDurability'),
                  icon: "🛡️",
                },
                {
                  title: t('greatValue'),
                  description: t('bestQualityAffordable'),
                  icon: "💰",
                },
                {
                  title: t('fastShipping'),
                  description: t('deliveredQuickly'),
                  icon: "🚚",
                },
                {
                  title: t('warranty'),
                  description: t('thirtyDayReplacement'),
                  icon: "✅",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
