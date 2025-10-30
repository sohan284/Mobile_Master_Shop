"use client"
import React, { useState, useEffect, useMemo } from "react";
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
  const { data: accessoriesResponse, isLoading, error, refetch } = useApiGet(
    ['accessories'],
    () => apiFetcher.get('/api/accessories/products/')
  );
  const accessories = useMemo(() => accessoriesResponse?.data || [], [accessoriesResponse?.data]);

  
  // Fallback items if API fails (memoized to prevent unnecessary re-renders)
  const fallbackItems = useMemo(() => [
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
  ], []);
  
  // Use API data or fallback, and randomize order (with stable sorting to prevent remount issues)
  const [randomizedItems, setRandomizedItems] = useState([]);
  
  useEffect(() => {
    // Only randomize once when data is loaded
    if (accessories || fallbackItems) {
      const items = (accessories || fallbackItems);
      // Use a stable random seed based on data length to prevent re-randomization
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      setRandomizedItems(shuffled);
    }
  }, [accessories, fallbackItems]);
  
  const allItems = randomizedItems.length > 0 ? randomizedItems : (accessories || fallbackItems);
  
  // Filter items based on search term
  const filteredItems = allItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.subtitle || "").toLowerCase().includes(searchTerm.toLowerCase())
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
              const route = `/accessories/${item.slug || 'accessories'}/${item.id}`;
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
              <Link href={`/accessories/${item.id}`}>
                <div className="group bg-white/10 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-accent/20 hover:border-secondary/50 h-full overflow-hidden">
                  <div className=" p-8 text-center h-full flex flex-col">
                    <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-6 group-hover:from-secondary/5 group-hover:to-primary/10 transition-all duration-500 relative overflow-hidden">
                      <Image
                        src={item.picture || '/Accessories.png'}
                        alt={item.title}
                        width={360}
                        height={360}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 relative z-10"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <h3 className="font-bold text-lg text-accent group-hover:text-secondary transition-colors duration-300 mb-3">
                        {item.title}
                      </h3>
                      <div className="space-y-2">
                        {item.subtitle && (
                          <p className="text-accent/80 text-sm">{item.subtitle}</p>
                        )}
                        <div className="space-y-1">
                          <p className="text-lg text-accent/80 flex items-center justify-center gap-2">
                            {item.discount_percentage && parseFloat(item.discount_percentage) > 0 && (
                              <span className="text-xs text-green-500">
                                {parseFloat(item.discount_percentage).toFixed(1)}% off
                              </span>
                            )}
                            <span className='font-bold text-secondary'>${parseFloat(item.final_price).toLocaleString()}</span>
                            {item.discounted_amount && item.discounted_amount !== item.main_amount && (
                              <span className="text-sm text-accent/60 line-through">
                                ${parseFloat(item.main_amount).toLocaleString()}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-center gap-3 text-xs text-accent/80">
                        <span className={`px-2 py-1 rounded-full ${item.is_in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.is_in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
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
