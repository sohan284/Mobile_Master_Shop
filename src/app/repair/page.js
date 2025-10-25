"use client"
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/animations/PageTransition";
import MotionFade from "@/components/animations/MotionFade";
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
      <div className="min-h-screen relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Hero Section */}
          <div className="relative mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Visual */}
              <MotionFade delay={0.06}>
                <div className="relative">
                  <div className="relative z-10">
                    <img src="/1.png" alt="Phone Repair" className="w-full max-w-md mx-auto drop-shadow hover:scale-105 transition-transform duration-500" />
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute top-10 -left-4 w-20 h-20 bg-secondary/30 rounded-full blur animate-bounce"></div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary/30 rounded-full blur animate-bounce" style={{animationDelay: '1s'}}></div>
                  <div className="absolute top-1/4 -right-8 w-12 h-12 bg-secondary/25 rounded-full blur animate-bounce" style={{animationDelay: '2s'}}></div>
                  <div className="absolute -top-8 right-1/4 w-8 h-8 bg-primary/25 rounded-full blur animate-bounce" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-1/4 -left-8 w-10 h-10 bg-secondary/20 rounded-full blur animate-bounce" style={{animationDelay: '1.5s'}}></div>
                  
                  {/* Additional floating particles */}
                  <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-secondary/40 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
                  <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-primary/40 rounded-full animate-ping" style={{animationDelay: '1.3s'}}></div>
                  <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-secondary/50 rounded-full animate-ping" style={{animationDelay: '2.3s'}}></div>
                  <div className="absolute bottom-2/3 left-1/3 w-1 h-1 bg-primary/50 rounded-full animate-ping" style={{animationDelay: '3.3s'}}></div>
                </div>
              </MotionFade>

              {/* Right Content */}
              <div className="space-y-8">
                <MotionFade delay={0.02}>
                  <div className="inline-flex items-center gap-2 bg-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                    Professional Repair Services
                  </div>
                </MotionFade>

                <MotionFade delay={0.03}>
                  <h1 className="font-extrabold text-5xl lg:text-7xl text-primary leading-tight">
                    Choose Your <span className="text-secondary relative">
                      Brand
                      <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary/30" viewBox="0 0 200 12" fill="none">
                        <path d="M2 6C2 6 50 2 100 6C150 10 198 6 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </h1>
                </MotionFade>

                <MotionFade delay={0.04}>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    Select your phone brand to get started with <span className="font-bold text-secondary">professional repair services</span> and expert support.
                  </p>
                </MotionFade>

              </div>
            </div>
          </div>

          {/* Search Section */}
          <MotionFade delay={0.1}>
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Find Your Phone Brand</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Search for your phone brand or browse our supported manufacturers below.</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search brand..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-4 pl-12 pr-4 text-gray-700 bg-white border-2 border-gray-200 rounded-md focus:outline-none focus:border-secondary transition-all duration-300 shadow hover:shadow-lg"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </MotionFade>
          
          {/* Loading State - Skeleton Loader */}
          {isLoading && (
            <MotionFade delay={0.15}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white p-6 rounded-md shadow hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col items-center justify-center">
                      <Skeleton className="w-16 h-16 rounded mb-4" />
                      <Skeleton className="w-20 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </MotionFade>
          )}
          
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
          
          {/* Brands Grid */}
          {!isLoading && filteredBrands.length > 0 && (
            <MotionFade delay={0.2}>
              <div className="mb-16">
            
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {filteredBrands.map((brand, index) => (
                    <MotionFade key={brand.id} delay={0.25 + index * 0.1}>
                      <Link href={brand.route || `/repair/${brand.name.toLowerCase()}`}>
                        <div className="group relative bg-white h-full p-6 rounded-md shadow hover:shadow-lg transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center border border-gray-100 hover:border-secondary/50 hover:-translate-y-2 overflow-hidden">
                          {/* Animated border effect */}
                          <div className="absolute inset-0 rounded-md border-2 border-transparent group-hover:border-secondary/20 transition-all duration-300"></div>
                          
                          {/* Background gradient on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                          
                          {/* Content */}
                          <div className="relative z-10">
                            <div className="flex justify-center mb-4">
                              <Image
                                src={brand.logo || `/Apple.png`}
                                alt={brand.name}
                                width={64}
                                height={64}
                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <h3 className="font-semibold text-primary group-hover:text-secondary transition-colors duration-300">
                              {brand.name}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    </MotionFade>
                  ))}
                </div>
              </div>
            </MotionFade>
          )}
          
          {/* No Results */}
          {!isLoading && filteredBrands.length === 0 && (
            <MotionFade delay={0.15}>
                <NotFound
                  title="No Brands Found"
                  description={`No brands found matching ${searchTerm}`}
                  showSearch={true}
                  searchTerm={searchTerm}
                  onClearSearch={() => setSearchTerm('')}
                />
            </MotionFade>
          )}

          {/* Features Section */}
          <MotionFade delay={0.3}>
            <div className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-primary mb-4">Why Choose Our Repair Services?</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">Professional repair services with guaranteed quality and customer satisfaction.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-md flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h4 className="font-bold text-primary mb-2">Fast Service</h4>
                  <p className="text-sm text-gray-600">Quick turnaround times with same-day service available</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-md flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h4 className="font-bold text-primary mb-2">12 Month Warranty</h4>
                  <p className="text-sm text-gray-600">Full coverage for peace of mind on all repairs</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-md flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <h4 className="font-bold text-primary mb-2">Expert Technicians</h4>
                  <p className="text-sm text-gray-600">Certified professionals with years of experience</p>
                </div>
              </div>
            </div>
          </MotionFade>

          {/* CTA Section */}
          <MotionFade delay={0.4}>
            <div className="relative">
              <div className="bg-gradient-to-r from-primary to-primary/90 rounded-md p-12 shadow relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-32 h-32 bg-secondary rounded-full blur-2xl"></div>
                  <div className="absolute bottom-4 right-4 w-24 h-24 bg-white rounded-full blur-xl"></div>
                </div>
                
                <div className="relative z-10 text-center">
                  <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Your Device Fixed?</h3>
                  <p className="text-white/90 mb-8 text-lg">Choose your brand above to get started with professional repair services!</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-4 font-bold shadow hover:shadow-lg transition-all duration-300 cursor-pointer rounded-md">
                      Get Instant Quote
                    </button>
                  </div>
                  
                  <div className="mt-8 flex justify-center items-center gap-8 text-white/80 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      Free Diagnosis
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      Same Day Service
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      12 Month Warranty
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MotionFade>
        </div>
      </div>
    </PageTransition>
  );
}
