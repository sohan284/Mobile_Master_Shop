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

export default function AccessoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch all accessories (no category grouping)
  const { data: itemsResponse, isLoading, error } = useApiGet(
    ['accessoriesAll'],
    () => apiFetcher.get('/api/accessories/items/')
  );
  
  // Fallback items if API fails
  const fallbackItems = [
    {
      id: 101,
      name: "Clear Phone Case",
      description: "Shock-absorbent transparent TPU case",
      price: "$15",
      originalPrice: "$19",
      image: "/hood.png",
      rating: 4.5,
      reviews: 128,
      inStock: true,
      category: "Cases & Protection"
    },
    {
      id: 102,
      name: "Tempered Glass",
      description: "9H hardness, edge-to-edge protection",
      price: "$12",
      originalPrice: "$15",
      image: "/screen.png",
      rating: 4.6,
      reviews: 93,
      inStock: true,
      category: "Screen Protectors"
    },
    {
      id: 103,
      name: "Fast Charger 20W",
      description: "PD fast charging USB-C adapter",
      price: "$18",
      originalPrice: "$22",
      image: "/charger two port.png",
      rating: 4.7,
      reviews: 210,
      inStock: true,
      category: "Charging & Power"
    },
    {
      id: 104,
      name: "USB-C Cable",
      description: "1m braided cable, durable and fast",
      price: "$10",
      originalPrice: "$12",
      image: "/c cable.png",
      rating: 4.4,
      reviews: 76,
      inStock: true,
      category: "Cables & Adapters"
    },
    {
      id: 105,
      name: "Power Bank 10,000mAh",
      description: "Slim, lightweight with dual output",
      price: "$30",
      originalPrice: "$35",
      image: "/battery.png",
      rating: 4.6,
      reviews: 164,
      inStock: true,
      category: "Charging & Power"
    },
    {
      id: 106,
      name: "Bluetooth Headphones",
      description: "Over-ear, noise isolation, 20h battery",
      price: "$35",
      originalPrice: "$49",
      image: "/camera.png",
      rating: 4.3,
      reviews: 58,
      inStock: true,
      category: "Audio & Camera"
    },
  ];
  
  // Use API data or fallback, and randomize order
  const allItems = (itemsResponse?.data || fallbackItems).slice().sort(() => Math.random() - 0.5);
  
  // Filter items based on search term
  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden bg-primary text-secondary">

        <div className="container mx-auto px-4 py-8">
          
          {/* Hero Section */}
          {/* <HeroSection
            title="Browse"
            subtitle="Accessories"
            description="Explore our premium collection of mobile accessories. Find cases, chargers, cables, audio gear and more."
            image="/Accessories.png"
            imageAlt="Phone Accessories"
            badgeText="Premium Accessories"
            backButtonText="← Back to Home"
            showBackButton={true}
            backButtonHref="/"
          /> */}

          {/* Search Section */}
       <div className="flex justify-end">
       <SearchSection
            // title="Find Accessories"
            // description="Search for accessories or browse the full collection below."
            placeholder="Search accessories..."
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
          />
       </div>
          
          {/* Accessories Grid */}
          <GridSection
            title=""
            description=""
            items={filteredItems}
            isLoading={isLoading}
            loadingCount={8}
            onItemClick={(item) => {
              const categorySlug = (item.category || 'accessories').toLowerCase().replace(/\s+/g, '-');
              const route = `/accessories/${categorySlug}/${item.id}`;
              return route;
            }}
            onItemClickHandler={(item) => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('selectedAccessory', JSON.stringify(item));
              }
            }}
            gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            notFoundTitle="No Accessories Found"
            notFoundDescription={`No accessories found matching "${searchTerm}". Try a different search term.`}
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm('')}
            primaryAction={{
              text: "Clear Search",
              href: "#",
              onClick: () => setSearchTerm('')
            }}
            secondaryAction={{
              text: "View All Accessories",
              href: "/accessories",
              onClick: () => setSearchTerm('')
            }}
            renderItem={(item) => (
              <div className="group relative bg-white/10 backdrop-blur-sm border border-accent/20 rounded-lg p-4 hover:border-secondary/50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex flex-col h-full">
                  {/* Product Image */}
                  <div className="flex justify-center mb-3">
                    <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Image
                        src={item.image || '/Accessories.png'}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Name */}
                  <h3 className="text-sm font-semibold text-accent mb-2 group-hover:text-secondary transition-colors text-center line-clamp-2">
                    {item.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs text-accent/80 mb-3 line-clamp-2 flex-grow text-center">
                    {item.description}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-center justify-center mb-3">
                    <div className="text-lg font-bold text-secondary">
                      {item.price}
                    </div>
                    {item.originalPrice && item.originalPrice !== item.price && (
                      <div className="text-sm text-accent/60 line-through ml-2">
                        {item.originalPrice}
                      </div>
                    )}
                  </div>
                  
                  {/* Stock + Rating */}
                  <div className="flex items-center justify-center gap-3 text-xs text-accent/80">
                    <span className={`px-2 py-1 rounded-full ${item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <span>⭐ {item.rating || '4.5'}</span>
                  </div>
                </div>
              </div>
            )}
          />
          
          {/* Error State */}
          {error && (
            <MotionFade delay={0.15}>
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  Failed to load accessories. Using fallback data.
                </div>
              </div>
            </MotionFade>
          )}

          {/* Features Section */}
          <FeaturesSection
            title="Why Choose Our Accessories?"
            description="Premium accessories designed to enhance and protect your mobile devices with guaranteed quality."
            features={[
              { title: "Premium Quality", description: "High-quality materials and construction for durability", icon: "🛡️" },
              { title: "Great Value", description: "Competitive prices without compromising on quality", icon: "💰" },
              { title: "Fast Shipping", description: "Quick delivery to your doorstep worldwide", icon: "🚚" },
              { title: "Warranty", description: "30-day warranty on all accessories", icon: "✅" }
            ]}
          />

         
        </div>
      </div>
    </PageTransition>
  );
}
