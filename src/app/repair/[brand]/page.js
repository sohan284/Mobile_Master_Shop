"use client"
import React, { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import HeroSection from '@/components/common/HeroSection';
import SearchSection from '@/components/common/SearchSection';
import GridSection from '@/components/common/GridSection';
import FeaturesSection from '@/components/common/FeaturesSection';
import CTASection from '@/components/common/CTASection';
import { apiFetcher } from '@/lib/api';
import { useApiGet } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/button';
import NotFound from '@/components/ui/NotFound';


export default function BrandRepairPage({ params }) {
    const { brand } = use(params);
    const [searchTerm, setSearchTerm] = useState('');
    const [brandInfo, setBrandInfo] = useState(null);
    
    const { data: phoneModelsResponse, isLoading, error } = useApiGet(
        ['phoneModels', brand],
        () => apiFetcher.get(`/api/repair/models/?brand=${brand}`)
      );
      const { data: brandInfoResponse, isLoading: brandInfoLoading, error: brandInfoError, refetch: refetchBrandInfo } = useApiGet(
        ['brandInfo', brand],
        () => apiFetcher.get('/api/repair/brands/')
      );
      
    // Get brand info from sessionStorage first, then API, then fallback
    React.useEffect(() => {
        // Try to get brand data from sessionStorage first
        if (typeof window !== 'undefined') {
            const storedBrand = sessionStorage.getItem('selectedBrand');
            if (storedBrand) {
                try {
                    const parsedBrand = JSON.parse(storedBrand);
                    setBrandInfo(parsedBrand);
                    return;
                } catch (e) {
                    console.error('Error parsing stored brand data:', e);
                }
            }
        }
        
        // Fallback to API data
        if (brandInfoResponse?.data) {
            const apiBrand = brandInfoResponse.data.find(b => b.name.toLowerCase() === brand.toLowerCase());
            if (apiBrand) {
                setBrandInfo(apiBrand);
                return;
            }
        }
        
        // Final fallback - create basic brand info from URL param
        setBrandInfo({
            name: brand.charAt(0).toUpperCase() + brand.slice(1),
            logo: `/${brand.charAt(0).toUpperCase() + brand.slice(1)}.png`,
            fullName: brand.charAt(0).toUpperCase() + brand.slice(1),
            description: `Professional repair services for ${brand.charAt(0).toUpperCase() + brand.slice(1)} devices`,
            features: [
                { title: 'Expert Technicians', description: 'Certified professionals with years of experience' },
                { title: 'Quality Parts', description: 'We use only genuine parts and components' },
                { title: 'Warranty', description: '90-day warranty on all repairs' },
                { title: 'Fast Service', description: 'Most repairs completed within 24 hours' }
            ]
        });
    }, [brand, brandInfoResponse]);
    
    // Clean up sessionStorage after component mounts
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('selectedBrand');
        }
    }, []);
 
    // Filter phone models by brand
    const brandPhones = phoneModelsResponse || [];
    // Filter phones based on search term
    const filteredPhones = brandPhones.filter(phone =>
        phone.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <PageTransition>
        <div className="min-h-screen relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-8">
                
                {/* Hero Section */}
                <HeroSection
                    title="Choose Your"
                    subtitle={`${brandInfo?.name} Model`}
                    description={`Select your ${brandInfo?.name} model to get started with professional repair services and expert support.`}
                    image={brandInfo?.logo || '/Apple.png'}
                    imageAlt={`${brandInfo?.name} Repair`}
                    badgeText={`${brandInfo?.name} Repair Services`}
                    showBackButton={true}
                    backButtonText="← Back to Brands"
                    backButtonHref="/repair"
                />
                
                {/* Search Section */}
                <SearchSection
                    title={`Find Your ${brandInfo?.name} Model`}
                    description={`Search for your ${brandInfo?.name} model or browse our supported devices below.`}
                    placeholder={`Search ${brandInfo?.name} models...`}
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                />

                        {/* Phone Models Grid */}
                <GridSection
                    title=""
                    description=""
                    items={filteredPhones}
                    isLoading={isLoading}
                    loadingCount={6}
                    onItemClick={(phone) => {
                        const route = `/repair/${brand}/${phone.id}`;
                        return route;
                    }}
                    onItemClickHandler={(phone) => {
                        // Store the actual phone data from filteredPhones in sessionStorage when clicked
                        if (typeof window !== 'undefined') {
                            const phoneData = {
                                ...phone,  // This contains the actual phone data from the API
                                brand: brandInfo?.name,
                                brandLogo: brandInfo?.logo
                            };
                            console.log('Phone clicked, storing data:', phoneData);
                            sessionStorage.setItem('selectedPhone', JSON.stringify(phoneData));
                        }
                    }}
                    gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
                    notFoundTitle={searchTerm ? "No Models Found" : `No ${brandInfo?.name} Models Available`}
                    notFoundDescription={searchTerm 
                        ? `No ${brandInfo?.name} models found matching "${searchTerm}". Try a different search term.`
                        : `We don't have any ${brandInfo?.name} models available at the moment. Please check back later or browse other brands.`
                    }
                                searchTerm={searchTerm}
                                onClearSearch={() => setSearchTerm('')}
                    primaryAction={searchTerm ? {
                        text: "Clear Search",
                        href: "#",
                        onClick: () => setSearchTerm('')
                    } : {
                        text: "Browse All Brands",
                        href: "/repair"
                    }}
                    secondaryAction={searchTerm ? {
                        text: "Browse All Brands",
                        href: "/repair"
                    } : {
                        text: "Contact Support",
                        href: "/contact"
                    }}
                />

                
                {/* Features Section */}
                <FeaturesSection
                    title={`Why Choose Our ${brandInfo?.name} Repair Services?`}
                    description={`Professional repair services with guaranteed quality and customer satisfaction for ${brandInfo?.name} devices.`}
                    features={brandInfo?.features?.map(feature => ({
                        title: feature.title,
                        description: feature.description,
                        icon: "🔧"
                    }))}
                />

                {/* CTA Section */}
                <CTASection
                    title={`Ready to Get Your ${brandInfo?.name} Device Fixed?`}
                    description="Choose your model above to get started with professional repair services!"
                    primaryAction={{
                        text: "Browse All Brands",
                        href: "/repair"
                    }}
                    features={["Free Diagnosis", "Same Day Service", "12 Month Warranty"]}
                />
            </div>
        </div>
        </PageTransition>
    );
}
