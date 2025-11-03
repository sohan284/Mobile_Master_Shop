"use client"
import React, { use, useState, useMemo } from 'react';
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
import { useTranslations } from 'next-intl';


export default function BrandRepairPage({ params }) {
    const t = useTranslations('repair');
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

    // Why Choose Us features (from repair page)
    const whyChooseUsFeatures = useMemo(() => [
        {
            title: t('expertTechniciansFeature'),
            description: t('certifiedProfessionals'),
            icon: "🔧"
        },
        {
            title: t('quickTurnaround'),
            description: t('mostRepairs24Hours'),
            icon: "⏱️"
        },
        {
            title: t('warrantyGuarantee'),
            description: t('qualityGuarantee'),
            icon: "🛡️"
        },
        {
            title: t('premiumQuality'),
            description: t('genuineParts'),
            icon: "🏆"
        }
    ], [t]);


    return (
        <PageTransition>
            <div className="min-h-screen relative overflow-hidden bg-primary">
                <div className="container mx-auto px-4 py-8 ">

                    {/* Hero Section */}
                    <HeroSection
                        subtitle={t('chooseYourModel', { brand: brandInfo?.name })}
                        description={t('selectModelDescription', { brand: brandInfo?.name })}
                        image={brandInfo?.logo || '/Apple.png'}
                        imageAlt={`${brandInfo?.name} Repair`}
                        badgeText={t('brandRepairServices', { brand: brandInfo?.name })}
                        showBackButton={true}
                        backButtonText={t('backToBrands')}
                        backButtonHref="/repair"
                    />

                    {/* Search Section */}
                    <div className='mt-20'>
                        <SearchSection
                            title={t('findYourModel', { brand: brandInfo?.name })}
                            description={t('searchModelDescription', { brand: brandInfo?.name })}
                            placeholder={t('searchModels', { brand: brandInfo?.name })}
                            searchTerm={searchTerm}
                            onSearchChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

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
                        notFoundTitle={searchTerm ? t('noModelsFound') : t('noBrandModelsAvailable', { brand: brandInfo?.name })}
                        notFoundDescription={searchTerm
                            ? t('noModelsMatching', { brand: brandInfo?.name, searchTerm })
                            : t('noBrandModelsAvailableDesc', { brand: brandInfo?.name })
                        }
                        searchTerm={searchTerm}
                        onClearSearch={() => setSearchTerm('')}
                        primaryAction={searchTerm ? {
                            text: t('clearSearch'),
                            href: "#",
                            onClick: () => setSearchTerm('')
                        } : {
                            text: t('browseAllBrands'),
                            href: "/repair"
                        }}
                        secondaryAction={searchTerm ? {
                            text: t('browseAllBrands'),
                            href: "/repair"
                        } : {
                            text: t('contactSupport'),
                            href: "/contact"
                        }}
                    />

               <div className='mt-20'>

                     {/* Why Choose Us Section - From Repair Page */}
                     <FeaturesSection
                        title={t('whyChooseOurBrandRepairServices', { brand: brandInfo?.name })}
                        description={t('professionalRepairServicesBrandDesc', { brand: brandInfo?.name })}
                        features={whyChooseUsFeatures}
                    />
               </div>

                </div>
            </div>
        </PageTransition>
    );
}
