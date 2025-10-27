'use client';
import React, { use, useEffect, useState } from 'react'
import Image from 'next/image';
import MotionFade from '@/components/animations/MotionFade';
import PageTransition from '@/components/animations/PageTransition';
import Link from 'next/link';
import HeroSection from '@/components/common/HeroSection';
import SearchSection from '@/components/common/SearchSection';
import GridSection from '@/components/common/GridSection';
import FeaturesSection from '@/components/common/FeaturesSection';
import CTASection from '@/components/common/CTASection';
import { useApiGet } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetcher } from '@/lib/api';





export default function BrandPage({ params }) {
  const brand = use(params).brand?.toLowerCase();
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [storage, setStorage] = useState('all');
  const [ram, setRam] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [discount, setDiscount] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch phones data from API
  const { data: phonesData, isLoading: phonesLoading, error: phonesError } = useApiGet(
    ['brand-phones', brand],
    () => apiFetcher.get(`/api/brandnew/models/?brand=${brand}`)
  );
  const brandPhones = phonesData?.data || [];

  useEffect(() => {
    let phones = [...brandPhones];
    
    // Apply search filter
    if (searchQuery && typeof searchQuery === 'string') {
      phones = phones.filter(phone =>
        phone.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phone.brand_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price range filter
    phones = phones.filter(phone => {
      const price = parseFloat(phone.final_price || phone.main_amount || 0);
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Apply storage filter
    if (storage !== 'all') {
      phones = phones.filter(phone => phone.memory === storage);
    }

    // Apply RAM filter
    if (ram !== 'all') {
      phones = phones.filter(phone => phone.ram === ram);
    }

    // Apply availability filter
    if (availability !== 'all') {
      if (availability === 'in_stock') {
        phones = phones.filter(phone => phone.is_in_stock === true);
      } else if (availability === 'out_of_stock') {
        phones = phones.filter(phone => phone.is_in_stock === false);
      }
    }

    // Apply discount filter
    if (discount !== 'all') {
      if (discount === 'with_discount') {
        phones = phones.filter(phone => parseFloat(phone.discount_percentage || 0) > 0);
      } else if (discount === 'no_discount') {
        phones = phones.filter(phone => parseFloat(phone.discount_percentage || 0) === 0);
      }
    }

    // Apply sorting
    phones.sort((a, b) => {
      const priceA = parseFloat(a.final_price || a.main_amount || 0);
      const priceB = parseFloat(b.final_price || b.main_amount || 0);
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

    setFilteredPhones(phones);
  }, [brandPhones, searchQuery, sortOrder, priceRange.min, priceRange.max, storage, ram, availability, discount]);

  if (phonesLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8 my-12">
              {/* Filter Sidebar Skeleton */}
              <div className="lg:w-1/4 min-w-[280px]">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-accent/20">
                  <Skeleton className="h-6 w-20 mb-6 bg-white/10" />
                  <div className="space-y-6">
                    <Skeleton className="h-16 w-full bg-white/10" />
                    <Skeleton className="h-16 w-full bg-white/10" />
                    <Skeleton className="h-16 w-full bg-white/10" />
                  </div>
                </div>
              </div>
              
              {/* Grid Skeleton */}
              <div className="lg:w-3/4">
                <div className="max-h-[80vh] overflow-y-auto pr-2 py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                      <Skeleton key={item} className="h-80 w-full bg-white/10" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Show error state
  if (phonesError) {
    return (
      <PageTransition>
        <div className="min-h-screen relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-accent">Error Loading Phones</h2>
                <p className="text-accent/80">Sorry, we couldn't load the phones for this brand.</p>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Show no phones found
  if (brandPhones.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-accent">No Phones Found</h2>
                <p className="text-accent/80">Sorry, we couldn't find any phones for the brand "{brand}".</p>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden bg-primary">
        <div className="container mx-auto px-4 py-8">
  
          {/* Search Section */}
        

          {/* Filter and Grid Section */}
          <div className="flex flex-col lg:flex-row gap-8 my-10">
            {/* Filter Sidebar - Sticky */}
            <MotionFade delay={0.2} immediate={true}>
              <div className="lg:w-1/4 min-w-[280px] lg:sticky lg:top-24 lg:h-[calc(90vh-8rem)]">
                <div className=" rounded-xl p-6  border-accent/20 h-full overflow-y-auto scrollbar-hide">
                  <h3 className="text-xl font-bold text-secondary mb-6">Filters</h3>

              {/* Price Sort */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-accent mb-3">Sort by Price</label>
                <select
                      className="w-full p-3 border border-accent/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/5 text-accent"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>

              {/* Price Range Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-accent mb-3">Price Range</label>
                <input
                  type="range"
                  min="0"
                      max="100000"
                      step="1000"
                  value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="w-full accent-secondary"
                    />
                    <div className="flex justify-between text-accent/80 text-sm mt-2">
                      <span>${priceRange.min.toLocaleString()}</span>
                      <span>${priceRange.max.toLocaleString()}</span>
                </div>
              </div>

                  {/* Storage Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-accent mb-3">Storage</label>
                    <select
                      className="w-full p-3 border border-accent/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/5 text-accent"
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                    >
                      <option value="all">All Storage</option>
                      <option value="64">64GB</option>
                      <option value="128">128GB</option>
                      <option value="256">256GB</option>
                      <option value="512">512GB</option>
                      <option value="1024">1TB</option>
                    </select>
                  </div>

                  {/* RAM Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-accent mb-3">RAM</label>
                    <select
                      className="w-full p-3 border border-accent/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/5 text-accent"
                      value={ram}
                      onChange={(e) => setRam(e.target.value)}
                    >
                      <option value="all">All RAM</option>
                      <option value="4">4GB</option>
                      <option value="6">6GB</option>
                      <option value="8">8GB</option>
                      <option value="12">12GB</option>
                      <option value="16">16GB</option>
                      <option value="18">18GB</option>
                    </select>
                  </div>

                  {/* Availability Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-accent mb-3">Availability</label>
                    <select
                      className="w-full p-3 border border-accent/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/5 text-accent"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                    >
                      <option value="all">All Phones</option>
                      <option value="in_stock">In Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>

                  {/* Discount Filter */}


                  {/* Clear Filters Button */}
                  <div className="mb-6">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSortOrder('asc');
                        setPriceRange({ min: 0, max: 100000 });
                        setStorage('all');
                        setRam('all');
                        setAvailability('all');
                        setDiscount('all');
                      }}
                      className="w-full p-3 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors duration-200 font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            </MotionFade>

            {/* Phones Grid - Scrollable */}
            <div className="lg:w-3/4">
            <div className='flex justify-end'>
            <SearchSection
      className=''
            placeholder="Search by model ..."
            searchTerm={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
          />
            </div>
              
              <div className="max-h-[80vh] overflow-y-auto pr-2 " style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* Internet Explorer 10+ */
              }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none; /* Safari and Chrome */
                  }
                `}</style>
                <GridSection
                  items={filteredPhones}
                  isLoading={false}
                  gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  renderItem={(phone, index) => (
                    <Link href={`/phones/${brand}/${phone.id}`} key={phone.id}>
                      <MotionFade delay={0.3 + index * 0.1} immediate={true}>
                        <div className="group bg-white/10 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-accent/20 hover:border-secondary/50 h-full overflow-hidden">
                          <div className="p-6 text-center h-full flex flex-col">
                            <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-6 group-hover:from-secondary/5 group-hover:to-primary/10 transition-all duration-500 relative overflow-hidden">
                        <Image
                                src={phone.icon || '/SAMSUNG_GalaxyS23Ultra.png'}
                                alt={phone.name}
                          width={160}
                          height={160}
                          className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-300 relative z-10"
                        />
                      </div>

                      <div className="flex-grow flex flex-col justify-between">
                              <h3 className="font-bold text-lg text-accent group-hover:text-secondary transition-colors duration-300 mb-3">
                                {phone.name}
                        </h3>

                              <div className="space-y-2">
                                <p className="text-accent/80 text-sm">{phone.memory}GB - {phone.ram}GB RAM</p>
                                <div className="space-y-1">
                                  {phone.discounted_amount && phone.discounted_amount !== phone.main_amount && (
                                    <p className="text-sm text-accent/60 line-through">
                                      ${parseFloat(phone.main_amount).toLocaleString()}
                                    </p>
                                  )}
                          <p className="text-lg text-accent/80">
                                    from <span className='font-bold text-secondary'>${parseFloat(phone.final_price).toLocaleString()}</span>
                                  </p>
                                  {phone.discount_percentage && parseFloat(phone.discount_percentage) > 0 && (
                                    <p className="text-xs text-secondary">
                                      {parseFloat(phone.discount_percentage).toFixed(1)}% off
                                    </p>
                                  )}
                                </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </MotionFade>
              </Link>
                  )}
                />
              </div>
            </div>
          </div>


          {/* CTA Section */}
      
        </div>
      </div>
    </PageTransition>
  )
}
