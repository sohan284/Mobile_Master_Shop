"use client";
import React, { useState } from 'react';
import PageTransition from '@/components/animations/PageTransition';
import HeroSection from '@/components/common/HeroSection';
import SearchSection from '@/components/common/SearchSection';
import GridSection from '@/components/common/GridSection';
import FeaturesSection from '@/components/common/FeaturesSection';
import CTASection from '@/components/common/CTASection';
import phone from "../../../public/banner.png";
export default function PhonesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Brand data (logos should be in public/brands/)
  const brands = [
    { id: 1, name: "Apple", logo: "/Apple.png" },
    { id: 2, name: "Samsung", logo: "/Samsung.png" },
    { id: 3, name: "Google", logo: "/google.png" },
    { id: 4, name: "OnePlus", logo: "/oneplus.png" },
    { id: 5, name: "Xiaomi", logo: "/Xiaomi.png" },
    { id: 6, name: "Huawei", logo: "/Huawei.png" },
    { id: 7, name: "Honor", logo: "/Honor.png" },
    { id: 8, name: "Realme", logo: "/realme.png" },
    { id: 9, name: "Oppo", logo: "/Oppo.png" },
    { id: 10, name: "Motorola", logo: "/motorola.png" },
    { id: 11, name: "Sony", logo: "/sony.png" },
  ];

  // Filter brands based on search term
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden bg-primary">
        <div className="container mx-auto px-4 py-8">
          
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
            isLoading={false}
            loadingCount={6}
            onItemClick={(brand) => {
              return `/phones/${brand.name.toLowerCase()}`;
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

          {/* CTA Section */}
          {/* <CTASection
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
