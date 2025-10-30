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
      <div className="min-h-screen relative overflow-hidden p-10 md:p-20">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0_0_0/0.03)_1px,transparent_0)] bg-[length:24px_24px] pointer-events-none"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">

          {/* Search Section with gradient header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  Premium Accessories
                </h1>
                <p className="text-lg text-white">
                  Discover high-quality accessories for your devices
                </p>
              </div>
              <div className="md:w-96">
                <SearchSection
                  placeholder="Search accessories..."
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
            onItemClick={(item) => {
              const route = `/accessories/${item.slug || 'accessories'}/${item.id}`;
              return route;
            }}
            onItemClickHandler={(item) => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('selectedAccessory', JSON.stringify(item));
              }
            }}
            gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
              <Link href={`/accessories/${item.id}`} className="group h-full block">
                <div className="relative rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-slate-300 h-full overflow-hidden transform hover:-translate-y-2">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none"></div>

                  {/* Discount badge */}
                  {item.discount_percentage && parseFloat(item.discount_percentage) > 0 && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-gradient-to-r from-red-500 to-pink text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {parseFloat(item.discount_percentage).toFixed(0)}% OFF
                      </div>
                    </div>
                  )}

                  {/* Stock badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-md ${item.is_in_stock
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                      }`}>
                      {item.is_in_stock ? '✓ In Stock' : '✕ Out of Stock'}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Image container with premium styling */}
                    <div className="relative mb-6  rounded-xl p-8 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Image
                        src={item.picture || '/Accessories.png'}
                        alt={item.title}
                        width={300}
                        height={300}
                        className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg text-white group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
                        {item.title}
                      </h3>

                      {item.subtitle && (
                        <p className="text-white text-sm line-clamp-2 min-h-[2.5rem]">
                          {item.subtitle}
                        </p>
                      )}

                      {/* Pricing section */}
                      <div className="pt-4 border-t border-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">
                              ${parseFloat(item.final_price).toLocaleString()}
                            </span>
                            {item.discounted_amount && item.discounted_amount !== item.main_amount && (
                              <span className="text-sm text-slate-500 line-through">
                                ${parseFloat(item.main_amount).toLocaleString()}
                              </span>
                            )}
                          </div>
                          {item.discount_percentage && parseFloat(item.discount_percentage) > 0 && (
                            <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                              Save ${(parseFloat(item.main_amount) - parseFloat(item.final_price)).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Call to action */}
                      <button className="cursor-pointer w-full mt-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transform group-hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-xl">
                        View Details
                      </button>
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
                <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-lg border border-red-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Failed to load accessories. Using fallback data.
                </div>
              </div>
            </MotionFade>
          )}

          {/* Features Section with modern cards */}
          <div className="mt-20">
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
      </div>
    </PageTransition>
  );
}