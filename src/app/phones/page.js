"use client";
import React, { useState, memo } from "react";
import PageTransition from "@/components/animations/PageTransition";
import MotionFade from "@/components/animations/MotionFade";
import HeroSection from "@/components/common/HeroSection";
import SearchSection from "@/components/common/SearchSection";
import GridSection from "@/components/common/GridSection";
import FeaturesSection from "@/components/common/FeaturesSection";
import { useApiGet } from "@/hooks/useApi";
import { apiFetcher } from "@/lib/api";
import phone from "../../../public/banner.png";
import { useTranslations } from 'next-intl';

// ✅ Memoize static sections to prevent re-rendering
const MemoHeroSection = memo(HeroSection);
const MemoFeaturesSection = memo(FeaturesSection);

export default function PhonesPage() {
  const t = useTranslations('phones');
  const [searchTerm, setSearchTerm] = useState("");

  const { data: brandsResponse, isLoading, error } = useApiGet(
    ["new-phone-brands"],
    () => apiFetcher.get("/api/brandnew/brands/")
  );

  const fallbackBrands = [
    { id: 1, name: "Apple", icon: "/Apple.png", route: "/phones/apple" },
    { id: 2, name: "Samsung", icon: "/Samsung.png", route: "/phones/samsung" },
    { id: 3, name: "Google", icon: "/google.png", route: "/phones/google" },
    { id: 4, name: "OnePlus", icon: "/oneplus.png", route: "/phones/oneplus" },
    { id: 5, name: "Xiaomi", icon: "/Xiaomi.png", route: "/phones/xiaomi" },
    { id: 6, name: "Huawei", icon: "/Huawei.png", route: "/phones/huawei" },
    { id: 7, name: "Honor", icon: "/Honor.png", route: "/phones/honor" },
    { id: 8, name: "Realme", icon: "/realme.png", route: "/phones/realme" },
    { id: 9, name: "Oppo", icon: "/Oppo.png", route: "/phones/oppo" },
    { id: 10, name: "Motorola", icon: "/motorola.png", route: "/phones/motorola" },
    { id: 11, name: "Sony", icon: "/sony.png", route: "/phones/sony" },
  ];

  const phoneBrands = brandsResponse?.data || fallbackBrands;

  const filteredBrands = phoneBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* ✅ PageTransition handles route changes only */}
      <PageTransition>
        <div className="relative overflow-hidden bg-primary text-secondary">
          <div className="container mx-auto px-4 py-8">

            {/* ✅ Memoized HeroSection */}
            <MemoHeroSection
              title={t('chooseYour')}
              subtitle={t('phoneBrand')}
              description={t('selectPhoneBrandDescription')}
              image={phone}
              imageAlt={t('newPhones')}
              badgeText={t('latestPhoneCollection')}
              backButtonText={t('backToHome')}
              showBackButton={true}
              backButtonHref="/"
            />

          </div>
        </div>
      </PageTransition>

      {/* ✅ Search Section moved outside PageTransition to prevent flicker */}
      <div className="container mx-auto px-4">
        <SearchSection
          title={t('findYourPhoneBrand')}
          description={t('searchPhoneBrandDescription')}
          placeholder={t('searchBrand')}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Brands Grid */}
      <div className="container mx-auto px-4 py-8">
        <GridSection
          title=""
          description=""
          items={filteredBrands}
          isLoading={isLoading}
          loadingCount={6}
          onItemClick={(brand) =>
            brand.route || `/phones/${brand.name.toLowerCase()}`
          }
          onItemClickHandler={(brand) => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("selectedBrand", JSON.stringify(brand));
            }
          }}
          gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
          notFoundTitle={t('noBrandsFound')}
          notFoundDescription={t('noBrandsMatching', { searchTerm })}
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm("")}
          primaryAction={{
            text: t('clearSearch'),
            href: "#",
            onClick: () => setSearchTerm(""),
          }}
          secondaryAction={{
            text: t('viewAllBrands'),
            href: "#",
            onClick: () => setSearchTerm(""),
          }}
        />
      </div>

      {/* Error State */}
      {error && (
        <MotionFade delay={0.15}>
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              {t('failedToLoadBrands')}
            </div>
          </div>
        </MotionFade>
      )}

      {/* ✅ Memoized FeaturesSection moved below search & grid */}
      <div className="container mx-auto px-4 py-8">
        <MemoFeaturesSection
          title={t('whyChooseOurNewPhones')}
          description={t('premiumQualityWithWarranty')}
          features={[
            {
              title: t('qualityAssurance'),
              description: t('thoroughlyTested'),
              icon: "🔧",
            },
            {
              title: t('twentyFourMonthWarranty'),
              description: t('fullCoverageNewDevices'),
              icon: "🛡️",
            },
            {
              title: t('bestPricesPhones'),
              description: t('competitivePricingModels'),
              icon: "💰",
            },
            {
              title: t('latestTechnology'),
              description: t('latestFeaturesTechnology'),
              icon: "⚡",
            },
          ]}
        />
      </div>
    </>
  );
}
