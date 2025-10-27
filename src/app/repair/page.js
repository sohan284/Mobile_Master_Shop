"use client"
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/animations/PageTransition";
import MotionFade from "@/components/animations/MotionFade";
import HeroSection from "@/components/common/HeroSection";
import SearchSection from "@/components/common/SearchSection";
import GridSection from "@/components/common/GridSection";
import FeaturesSection from "@/components/common/FeaturesSection";
import CTASection from "@/components/common/CTASection";
import { useApiGet } from "@/hooks/useApi";
import { apiFetcher } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "@/components/ui/NotFound";

export default function RepairPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch brands from API using direct useApiGet
  const { data: brandsResponse, isLoading, error } = useApiGet(
    ['brands'],
    () => apiFetcher.get('/api/repair/brands/')
  );
  
  // Fallback brands if API fails
  const fallbackBrands = [
    {
      id: 1,
      name: "Apple",
      logo: "/Apple.png",
      route: "/repair/apple",
    },
    {
      id: 2,
      name: "Samsung",
      logo: "/Samsung.png",
      route: "/repair/samsung",
    },
    {
      id: 3,
      name: "Huawei",
      logo: "/Huawei.png",
      route: "/repair/huawei",
    },
    {
      id: 4,
      name: "Xiaomi",
      logo: "/Xiaomi.png",
      route: "/repair/xiaomi",
    },
    {
      id: 5,
      name: "Oppo",
      logo: "/Oppo.png",
      route: "/repair/oppo",
    },
    {
      id: 6,
      name: "Honor",
      logo: "/Honor.png",
      route: "/repair/honor",
    },
  ];
  
  // Use API data or fallback
  const phoneBrands = brandsResponse?.data || fallbackBrands;
  
  // Filter brands based on search term
  const filteredBrands = phoneBrands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden bg-primary text-secondary">

        <div className="container  mx-auto px-4 py-8">
          
          {/* Hero Section */}
          <HeroSection
            title="Choose Your"
            subtitle="Brand"
            description="Select your phone brand to get started with professional repair services and expert support."
            image="/1.png"
            imageAlt="Phone Repair"
            badgeText="Professional Repair Services"
            backButtonText="← Back to Home"
            showBackButton={true}
            backButtonHref="/"
          />

          {/* Search Section */}
          <SearchSection
            title="Find Your Phone Brand"
            description="Search for your phone brand or browse our supported manufacturers below."
            placeholder="Search brand..."
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Brands Grid */}
          <GridSection
            title=""
            description=""
            items={filteredBrands}
            isLoading={isLoading}
            loadingCount={6}
            onItemClick={(brand) => {
              const route = brand.route || `/repair/${brand.name.toLowerCase()}`;
              return route;
            }}
            onItemClickHandler={(brand) => {
              // Store brand data in sessionStorage when clicked
              if (typeof window !== 'undefined') {
                console.log('Brand clicked, storing data:', brand);
                sessionStorage.setItem('selectedBrand', JSON.stringify(brand));
              }
            }}
            gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
            notFoundTitle="No Brands Found"
            notFoundDescription={`No brands found matching "${searchTerm}". Try a different search term.`}
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm('')}
            primaryAction={{
              text: "Clear Search",
              href: "#",
              onClick: () => setSearchTerm('')
            }}
            secondaryAction={{
              text: "View All Brands",
              href: "#",
              onClick: () => setSearchTerm('')
            }}
          />
          
          {/* Error State */}
          {error && (
            <MotionFade delay={0.15}>
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  Failed to load brands. Using fallback data.
                </div>
              </div>
            </MotionFade>
          )}

          {/* Features Section */}
          <FeaturesSection
            title="Why Choose Our Repair Services?"
            description="Professional repair services with guaranteed quality and customer satisfaction."
            features={[
              { title: "Fast Service", description: "Quick  times with same-day service available", icon: "⚡" },
              { title: "12 Month Warranty", description: "Full coverage for peace of mind on all repairs", icon: "🛡️" },
              { title: "Expert Technicians", description: "Certified professionals with years of experience", icon: "🔧" },
              { title: "Free Diagnosis", description: " Device assessment before any repair work", icon: "🔍" }
            ]}
          />

          {/* CTA Section
          <CTASection
            title="Ready to Get Your Device Fixed?"
            description="Choose your brand above to get started with professional repair services!"
            primaryAction={{
              text: "Get Instant Quote",
              href: "/repair"
            }}
            features={["Free Diagnosis", "Same Day Service", "12 Month Warranty"]}
          /> */}
        </div>
      </div>
    </PageTransition>
  );
}
