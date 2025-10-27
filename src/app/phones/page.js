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
import phone from "../../../public/banner.png";

export default function PhonesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch brands from API using direct useApiGet
  const { data: brandsResponse, isLoading, error } = useApiGet(
    ['new-phone-brands'],
    () => apiFetcher.get('/api/brandnew/brands/')
  );
  
  // Fallback brands if API fails
  const fallbackBrands = [
    {
      id: 1,
      name: "Apple",
      icon: "/Apple.png",
      route: "/phones/apple",
    },
    {
      id: 2,
      name: "Samsung",
      icon: "/Samsung.png",
      route: "/phones/samsung",
    },
    {
      id: 3,
      name: "Google",
      icon: "/google.png",
      route: "/phones/google",
    },
    {
      id: 4,
      name: "OnePlus",
      icon: "/oneplus.png",
      route: "/phones/oneplus",
    },
    {
      id: 5,
      name: "Xiaomi",
      icon: "/Xiaomi.png",
      route: "/phones/xiaomi",
    },
    {
      id: 6,
      name: "Huawei",
      icon: "/Huawei.png",
      route: "/phones/huawei",
    },
    {
      id: 7,
      name: "Honor",
      icon: "/Honor.png",
      route: "/phones/honor",
    },
    {
      id: 8,
      name: "Realme",
      icon: "/realme.png",
      route: "/phones/realme",
    },
    {
      id: 9,
      name: "Oppo",
      icon: "/Oppo.png",
      route: "/phones/oppo",
    },
    {
      id: 10,
      name: "Motorola",
      icon: "/motorola.png",
      route: "/phones/motorola",
    },
    {
      id: 11,
      name: "Sony",
      icon: "/sony.png",
      route: "/phones/sony",
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
            subtitle="Phone Brand"
            description="Select your phone brand to browse our collection of new smartphones with the best prices and warranty."
            image={phone}
            imageAlt="New Phones"
            badgeText="Latest Phone Collection"
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
              const route = brand.route || `/phones/${brand.name.toLowerCase()}`;
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
            title="Why Choose Our New Phones?"
            description="Premium quality phones with comprehensive warranty and support."
            features={[
              { title: "Quality Assurance", description: "All phones are thoroughly tested and certified to work like new", icon: "🔧" },
              { title: "24 Month Warranty", description: "Full coverage for peace of mind on all new devices", icon: "🛡️" },
              { title: "Best Prices", description: "Competitive pricing on all new phone models", icon: "💰" },
              { title: "Latest Technology", description: "Get the latest features and technology", icon: "⚡" }
            ]}
          />

          {/* CTA Section
          <CTASection
            title="Ready to Get Your New Phone?"
            description="Browse our complete collection of new smartphones with the best prices and warranty!"
            primaryAction={{
              text: "See All Phones",
              href: "/phones"
            }}
            features={["Free Diagnosis", "Same Day Service", "24 Month Warranty"]}
          /> */}
        </div>
      </div>
    </PageTransition>
  );
}
