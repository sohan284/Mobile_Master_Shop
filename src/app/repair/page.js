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
import { useTranslations } from 'next-intl';

// Memoized static sections to prevent re-render
const MemoHeroSection = memo(HeroSection);
const MemoFeaturesSection = memo(FeaturesSection);

export default function RepairPage() {
  const t = useTranslations('repair');
  const [searchTerm, setSearchTerm] = useState("");

  const { data: brandsResponse, isLoading, error } = useApiGet(
    ["brands"],
    () => apiFetcher.get("/api/repair/brands/")
  );

  const fallbackBrands = [
    { id: 1, name: "Apple", logo: "/Apple.png", route: "/repair/apple" },
    { id: 2, name: "Samsung", logo: "/Samsung.png", route: "/repair/samsung" },
    { id: 3, name: "Huawei", logo: "/Huawei.png", route: "/repair/huawei" },
    { id: 4, name: "Xiaomi", logo: "/Xiaomi.png", route: "/repair/xiaomi" },
    { id: 5, name: "Oppo", logo: "/Oppo.png", route: "/repair/oppo" },
    { id: 6, name: "Honor", logo: "/Honor.png", route: "/repair/honor" },
  ];

  const phoneBrands = brandsResponse?.data || fallbackBrands;

  const filteredBrands = phoneBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Page transition for route changes */}
      <PageTransition>
        <div className="relative overflow-hidden bg-primary text-secondary">
          <div className="container mx-auto px-4 py-8">

            {/* Hero Section */}
            <MemoHeroSection
              title={t('chooseYour')}
              subtitle={t('brand')}
              description={t('selectBrandDescription')}
              image="/1.png"
              imageAlt={t('phoneRepair')}
              badgeText={t('professionalRepairServices')}
              backButtonText={t('backToHome')}
              showBackButton={true}
              backButtonHref="/"
            />

          </div>
        </div>
      </PageTransition>

      {/* Search section */}
      <div className="container mx-auto px-4 mt-14">
        <SearchSection
          title={t('findYourPhoneBrand')}
          description={t('searchBrandDescription')}
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
          onItemClick={(brand) => brand.route || `/repair/${brand.name.toLowerCase()}`}
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

      {/* Features Section (moved below search + grid) */}
      <div className="container mx-auto px-4 py-8">
        <MemoFeaturesSection
          title={t('whyChooseOurRepairServices')}
          description={t('professionalRepairServicesDescription')}
          features={[
            { title: t('fastService'), description: t('quickTurnaroundSameDay'), icon: "⚡" },
            { title: t('twelveMonthWarranty'), description: t('fullCoveragePeaceOfMind'), icon: "🛡️" },
            { title: t('expertTechniciansRepair'), description: t('certifiedProfessionalsYears'), icon: "🔧" },
            { title: t('freeDiagnosis'), description: t('deviceAssessmentBeforeRepair'), icon: "🔍" },
          ]}
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
    </>
  );
}
