'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import HeroSection from '@/components/common/HeroSection';
import SearchSection from '@/components/common/SearchSection';
import GridSection from '@/components/common/GridSection';
import FeaturesSection from '@/components/common/FeaturesSection';
import { CustomButton } from '@/components/ui/button';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import NotFound from '@/components/ui/NotFound';
import ReviewsSection from '@/components/common/ReviewsSection';
import { useTranslations } from 'next-intl';

export default function RepairModelClient({ 
  initialServices = [],
  initialPhoneInfo = null,
  initialBrandModels = [],
  phoneId = null,
  brand = '',
  isLoading: initialLoading = false,
  error: initialError = null
}) {
  const t = useTranslations('repair');
  const [selectedServices, setSelectedServices] = useState([]);
  const [servicePartTypes, setServicePartTypes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneInfo, setPhoneInfo] = useState(initialPhoneInfo);

  // Fetch reviews for this repair service/phone model
  const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews } = useApiGet(
    ['repair-reviews', phoneId],
    () => apiFetcher.get(`/api/repair/review/?phone_model=${phoneId}`),
    { enabled: !!phoneId }
  );
  
  // Filter reviews by phone_model_id
  const reviews = useMemo(() => {
    const allReviews = reviewsData?.data || reviewsData?.results || [];
    return allReviews.filter(review => 
      String(review.phone_model_id) === String(phoneId)
    );
  }, [reviewsData, phoneId]);

  const repairServices = initialServices || [];

  // Get phone info from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPhone = sessionStorage.getItem('selectedPhone');
      if (storedPhone) {
        try {
          const parsedPhone = JSON.parse(storedPhone);
          setPhoneInfo(parsedPhone);
          return;
        } catch (e) {
          console.error('Error parsing stored phone data:', e);
        }
      }
    }
    
    if (initialPhoneInfo) {
      setPhoneInfo(initialPhoneInfo);
    } else {
      // Fallback - create basic phone info from URL params
      setPhoneInfo({
        name: `${brand.charAt(0).toUpperCase() + brand.slice(1)} Phone`,
        image: `/${brand.charAt(0).toUpperCase() + brand.slice(1)}.png`,
        brand: brand.charAt(0).toUpperCase() + brand.slice(1),
        brandLogo: `/${brand.charAt(0).toUpperCase() + brand.slice(1)}.png`
      });
    }
  }, [brand, phoneId, initialPhoneInfo]);

  // Memoize hero image
  const heroImage = useMemo(() => {
    return phoneInfo?.image || phoneInfo?.phone_image || phoneInfo?.model_image || phoneInfo?.logo || `/${brand.charAt(0).toUpperCase() + brand.slice(1)}.png`;
  }, [phoneInfo, brand]);

  // Filter services based on search term
  const filteredServices = repairServices.filter(service =>
    service.problem_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.problem_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Transform services for GridSection
  const serviceItems = filteredServices.map(service => ({
    id: service.problem_id,
    name: service.problem_name,
    description: service.problem_description,
    icon: service.icon,
    price: service.price,
    isSelected: selectedServices.includes(service.problem_id),
    isDisabled: !selectedServices.includes(service.problem_id) && selectedServices.length >= 3,
    hasOriginal: service?.original?.base_price ? true : false,
    hasDuplicate: service?.duplicate?.base_price ? true : false,
    partType: servicePartTypes[service.problem_id] || 'original',
    original_price: service?.original?.base_price,
    original_discount_price: service?.original?.final_price,
    duplicate_price: service?.duplicate?.base_price,
    duplicate_discount_price: service?.duplicate?.final_price,
  }));

  const handleServiceSelect = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        const newSelected = prev.filter(id => id !== serviceId);
        setServicePartTypes(prevTypes => {
          const newTypes = { ...prevTypes };
          delete newTypes[serviceId];
          return newTypes;
        });
        return newSelected;
      } else {
        if (prev.length < 3) {
          const service = repairServices.find(s => s.problem_id === serviceId);
          let initialPartType = 'original';
          const originalPrice = service?.original?.base_price || service?.original?.final_price;
          const duplicatePrice = service?.duplicate?.base_price || service?.duplicate?.final_price;
          
          const isOriginalNA = !originalPrice || 
                               originalPrice === 'N/A' || 
                               originalPrice === 'n/a' || 
                               originalPrice === null || 
                               originalPrice === undefined ||
                               String(originalPrice).trim() === '';
          
          if (isOriginalNA && duplicatePrice && duplicatePrice !== 'N/A' && duplicatePrice !== 'n/a') {
            initialPartType = 'duplicate';
          } else if (!isOriginalNA) {
            initialPartType = 'original';
          } else if (duplicatePrice && duplicatePrice !== 'N/A' && duplicatePrice !== 'n/a') {
            initialPartType = 'duplicate';
          }
          
          setServicePartTypes(prevTypes => ({
            ...prevTypes,
            [serviceId]: initialPartType
          }));
          
          return [...prev, serviceId];
        }
        return prev;
      }
    });
  };

  const handlePartTypeSelect = (serviceId, partType) => {
    setServicePartTypes(prev => ({
      ...prev,
      [serviceId]: partType
    }));
  };

  const handleContinueToBreakdown = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));
      sessionStorage.setItem('servicePartTypes', JSON.stringify(servicePartTypes));
    }
    window.location.href = `/repair/${brand}/${phoneId}/breakdown`;
  };

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden bg-primary">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <HeroSection
            subtitle={t('chooseYourRepairService')}
            description={t('selectRepairServicesDescription', { phoneName: phoneInfo?.name || brand.charAt(0).toUpperCase() + brand.slice(1) })}
            image={heroImage}
            imageAlt={phoneInfo?.name || `${brand.charAt(0).toUpperCase() + brand.slice(1)} Phone`}
            badgeText={t('step3SelectServices')}
            showBackButton={true}
            backButtonText={t('backToModels')}
            backButtonHref={`/repair/${brand}`}
            layout="image-left"
          />
          
          <div className='mt-20'>
            {/* Search Section */}
            <SearchSection
              title={t('findYourRepairService')}
              description={t('searchRepairServicesDescription')}
              placeholder={t('searchRepairServices')}
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Warning Message */}
          {!initialLoading && repairServices.length > 0 && selectedServices.length >= 3 && (
            <MotionFade delay={0.2} immediate={true}>
              <div className="mb-6 p-4 bg-secondary/20 border-l-4 border-secondary rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-secondary text-xl">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-accent">
                      <strong>{t('maximumLimitReached')}</strong> {t('maxLimitReachedDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </MotionFade>
          )}

          {/* Services Grid */}
          <GridSection
            title=""
            description=""
            items={serviceItems}
            isLoading={initialLoading}
            loadingCount={6}
            onItemClick={(service) => {
              handleServiceSelect(service.id);
              return '#';
            }}
            gridCols="grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
            notFoundTitle={t('noServicesFound')}
            notFoundDescription={searchTerm 
              ? t('noServicesMatching', { searchTerm })
              : t('noServicesAvailableDesc')
            }
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm('')}
            primaryAction={searchTerm ? {
              text: t('clearSearch'),
              href: "#",
              onClick: () => setSearchTerm('')
            } : {
              text: t('chooseDifferentModel'),
              href: `/repair/${brand}`
            }}
            secondaryAction={searchTerm ? {
              text: t('browseAllServices'),
              href: "#",
              onClick: () => setSearchTerm('')
            } : {
              text: t('browseAllBrands'),
              href: "/repair"
            }}
            renderItem={(service) => (
              <div 
                onClick={() => handleServiceSelect(service.id)}
                className={`p-4 rounded-lg shadow transition-all duration-300 border-2 cursor-pointer flex flex-col ${
                  service.isSelected 
                    ? 'border-secondary shadow-secondary bg-secondary/10 h-48' 
                    : service.isDisabled
                    ? 'bg-white/5 border-accent/20 cursor-not-allowed opacity-60'
                    : 'bg-white/10 backdrop-blur-sm border-accent/20 hover:border-secondary/50 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className="text-xl mr-2">{service.icon}</div>
                  <h3 className={`font-semibold text-sm ${
                    service.isSelected ? 'text-secondary' : 'text-accent'
                  }`}>
                    {service.name}
                  </h3>   
                  {service.isSelected && (
                    <div className="ml-auto">
                      <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-primary text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className={`mb-3 text-xs ${
                  service.isSelected ? 'text-secondary' : service.isDisabled ? 'text-accent/40' : 'text-accent/80'
                }`}>
                  {service.description}
                </p>
                
                {/* Part Type Selection - Only show when service is selected */}
                {service.isSelected && (
                  <div className="mb-3 p-2 bg-white/5 backdrop-blur-sm rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePartTypeSelect(service.id, 'original');
                        }}
                        disabled={!service.hasOriginal}
                        className={`px-3 py-2 text-xs cursor-pointer rounded-md transition-colors ${
                          service.partType === 'original'
                            ? 'bg-secondary text-primary'
                            : service.hasOriginal
                            ? 'bg-white/10 backdrop-blur-sm border border-accent/30 text-accent hover:bg-white/20'
                            : 'bg-white/5 text-accent/40 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-center">
                          {service?.original_price && service?.original_discount_price && service.original_price !== service.original_discount_price && (
                            <div className="text-xs line-through opacity-75 mb-1">
                              {service.original_price}
                            </div>
                          )}
                          <div className="text-sm font-bold">
                            {service?.original_discount_price || service?.original_price || 'N/A'}
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePartTypeSelect(service.id, 'duplicate');
                        }}
                        disabled={!service.hasDuplicate}
                        className={`px-3 py-2 text-xs cursor-pointer rounded-md transition-colors ${
                          service.partType === 'duplicate'
                            ? 'bg-secondary text-primary'
                            : service.hasDuplicate
                            ? 'bg-white/10 backdrop-blur-sm border border-accent/30 text-accent hover:bg-white/20'
                            : 'bg-white/5 text-accent/40 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-center">
                          {service?.duplicate_price && service?.duplicate_discount_price && service.duplicate_price !== service.duplicate_discount_price && (
                            <div className="text-xs line-through opacity-75 mb-1">
                              {service.duplicate_price}
                            </div>
                          )}
                          <div className="text-sm font-bold">
                            {service?.duplicate_discount_price || service?.duplicate_price || 'N/A'}
                          </div>
                        </div>
                      </button>
                      <div className="text-xs text-accent/80 mt-1 text-center">
                        {t('original')}
                      </div>
                      <div className="text-xs text-accent/80 mt-1 text-center">
                        {t('compatible')}
                      </div>
                    </div>
                  </div>
                )}
                
                {service.price && (
                  <div className="text-right">
                    <span className="text-sm font-bold text-secondary">{service.price}</span>
                  </div>
                )}
              </div>
            )}
          />

          {/* Continue Button */}
          {!initialLoading && repairServices.length > 0 && selectedServices.length > 0 && (
            <MotionFade delay={0.3} immediate={true}>
              <div className="text-center mb-8">
                <CustomButton 
                  onClick={handleContinueToBreakdown}
                  className='bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-4 font-bold shadow hover:shadow-lg transition-all duration-300'
                >
                  {t('continueWithSelected', { count: selectedServices.length, plural: selectedServices.length > 1 ? 's' : '' })}
                </CustomButton>
              </div>
            </MotionFade>
          )}

          {/* Features Section */}
          <FeaturesSection
            title={t('whyChooseOurRepairServicesQuestion')}
            description={t('professionalRepairServicesGuaranteed')}
            features={[
              { title: t('expertTechniciansRepair'), description: t('certifiedProfessionalsYears'), icon: "🔧" },
              { title: t('qualityParts'), description: t('useOnlyGenuineParts'), icon: "🛡️" },
              { title: t('fastServiceRepair'), description: t('mostRepairsWithin24Hours'), icon: "⚡" },
              { title: t('warranty'), description: t('ninetyDayWarranty'), icon: "✅" }
            ]}
          />

          {/* Reviews Section */}
          <ReviewsSection
            productId={phoneId}
            type="repair"
            reviews={reviews}
            isLoading={reviewsLoading}
            refetchReviews={refetchReviews}
            showReviewForm={false}
          />
        </div>
      </div>
    </PageTransition>
  );
}

