'use client';   
import React, { useState, useMemo, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import HeroSection from '@/components/common/HeroSection';
import SearchSection from '@/components/common/SearchSection';
import GridSection from '@/components/common/GridSection';
import FeaturesSection from '@/components/common/FeaturesSection';
import CTASection from '@/components/common/CTASection';
import { CustomButton } from '@/components/ui/button';
import { apiFetcher } from '@/lib/api';
import { useApiGet } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';
import NotFound from '@/components/ui/NotFound';

export default function PhoneModelPage({ params }) {
    const { brand, phoneId } = use(params);
    const [selectedServices, setSelectedServices] = useState([]);
    const [servicePartTypes, setServicePartTypes] = useState({}); // Store part type for each service
    const [searchTerm, setSearchTerm] = useState('');
    const [phoneInfo, setPhoneInfo] = useState(null);

    console.log("phoneInfo?.image", phoneInfo?.image);
    
      // Fetch services for this model
  const { data: servicesResponse, isLoading: servicesLoading, error: servicesError, refetch: refetchServices } = useApiGet(
    ['services', phoneId],
    () => apiFetcher.get(`/api/repair/repair-prices/?phone_model=${phoneId}`)
  );
  const repairServices = servicesResponse?.data || [];
 
    // Filter services based on search term
    const filteredServices = repairServices.filter(service =>
        service.problem_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.problem_description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Get phone info from sessionStorage
    React.useEffect(() => {
        // Try to get phone data from sessionStorage first
        if (typeof window !== 'undefined') {
            const storedPhone = sessionStorage.getItem('selectedPhone');
            if (storedPhone) {
                try {
                    const parsedPhone = JSON.parse(storedPhone);
                    console.log('Phone data retrieved from sessionStorage:', parsedPhone);
                    setPhoneInfo(parsedPhone);
                    return;
                } catch (e) {
                    console.error('Error parsing stored phone data:', e);
                }
            }
        }
        
        // Fallback - create basic phone info from URL params
        const fallbackPhoneInfo = {
            name: `${brand.charAt(0).toUpperCase() + brand.slice(1)} Phone`,
            image: `/${brand.charAt(0).toUpperCase() + brand.slice(1)}.png`,
            brand: brand.charAt(0).toUpperCase() + brand.slice(1),
            brandLogo: `/${brand.charAt(0).toUpperCase() + brand.slice(1)}.png`
        };
        console.log('Using fallback phone info:', fallbackPhoneInfo);
        setPhoneInfo(fallbackPhoneInfo);
    }, [brand, phoneId]);
    

    
    // Memoize hero image to prevent re-rendering
    const heroImage = useMemo(() => {
        return phoneInfo?.image || phoneInfo?.phone_image || phoneInfo?.model_image || phoneInfo?.logo || `/${brand.charAt(0).toUpperCase() + brand.slice(1)}.png`;
    }, [phoneInfo, brand]);

    // Transform services for GridSection
    const serviceItems = filteredServices.map(service => ({
        id: service.problem_id,
        name: service.problem_name,
        description: service.problem_description,
        icon: service.icon,
        price: service.price,
        isSelected: selectedServices.includes(service.problem_id),
        isDisabled: !selectedServices.includes(service.problem_id) && selectedServices.length >= 3,
        hasOriginal: service?.original?.base_price ? true : false, // Only true if original price exists
        hasDuplicate: service?.duplicate?.base_price ? true : false, // Only true if duplicate price exists
        partType: servicePartTypes[service.problem_id] || 'original', // Default to original
        original_price: service?.original?.base_price, // Original part price
        original_discount_price: service?.original?.final_price, // Original discount price
        duplicate_price: service?.duplicate?.base_price, // Compatible part price
        duplicate_discount_price: service?.duplicate?.final_price, // Compatible discount price
    }));



    const handleServiceSelect = (serviceId) => {
        setSelectedServices(prev => {
            if (prev.includes(serviceId)) {
                // If already selected, remove it
                const newSelected = prev.filter(id => id !== serviceId);
                // Also remove part type selection
                setServicePartTypes(prevTypes => {
                    const newTypes = { ...prevTypes };
                    delete newTypes[serviceId];
                    return newTypes;
                });
                return newSelected;
            } else {
                // If not selected and we have less than 3, add it
                if (prev.length < 3) {
                    return [...prev, serviceId];
                }
                // If already 3 selected, don't add more
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
        // Store selected services and part types in sessionStorage
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));
            sessionStorage.setItem('servicePartTypes', JSON.stringify(servicePartTypes));
        }
        // Navigate to breakdown page
        window.location.href = `/repair/${brand}/${phoneId}/breakdown`;
    };

    return (
        <PageTransition>
            <div className="min-h-screen relative overflow-hidden bg-primary">
                <div className="container mx-auto px-4 py-8">
                    
                    {/* Hero Section */}
                    {React.useMemo(() => (
                        <HeroSection
                            title="Choose Your"
                            subtitle="Repair Service"
                            description={`Select the repair services you need for your ${phoneInfo?.name || brand.charAt(0).toUpperCase() + brand.slice(1)} device. You can choose up to 3 services.`}
                            image={heroImage}
                            imageAlt={phoneInfo?.name || `${brand.charAt(0).toUpperCase() + brand.slice(1)} Phone`}
                            badgeText="Step 3: Select Services"
                            showBackButton={true}
                            backButtonText="← Back to Models"
                            backButtonHref={`/repair/${brand}`}
                            layout="image-left"
                        />
                    ), [phoneInfo?.name, heroImage, brand])}
                    
                    {/* Search Section */}
                    <SearchSection
                        title="Find Your Repair Service"
                        description="Search for specific repair services or browse all available options below."
                        placeholder="Search repair services..."
                        searchTerm={searchTerm}
                        onSearchChange={(e) => setSearchTerm(e.target.value)}
                    />

                        {/* Warning Message */}
                        {!servicesLoading && repairServices.length > 0 && selectedServices.length >= 3 && (
                        <MotionFade delay={0.2} immediate={true}>
                            <div className="mb-6 p-4 bg-secondary/20 border-l-4 border-secondary rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <span className="text-secondary text-xl">⚠️</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-accent">
                                            <strong>Maximum limit reached:</strong> You can select up to 3 services. 
                                            Deselect a service to choose a different one.
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
                        isLoading={servicesLoading}
                        loadingCount={6}
                        onItemClick={(service) => {
                            handleServiceSelect(service.id);
                            return '#'; // Prevent navigation, just handle selection
                        }}
                        gridCols="grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
                        notFoundTitle="No Services Found"
                        notFoundDescription={searchTerm 
                            ? `No repair services found matching "${searchTerm}". Try a different search term.`
                            : "We don't have any repair services available for this phone model at the moment. Please check back later or contact us for assistance."
                        }
                        searchTerm={searchTerm}
                        onClearSearch={() => setSearchTerm('')}
                        primaryAction={searchTerm ? {
                            text: "Clear Search",
                            href: "#",
                            onClick: () => setSearchTerm('')
                        } : {
                            text: "Choose Different Model",
                            href: `/repair/${brand}`
                        }}
                        secondaryAction={searchTerm ? {
                            text: "Browse All Services",
                            href: "#",
                            onClick: () => setSearchTerm('')
                        } : {
                            text: "Browse All Brands",
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
                                                        Original
                                                    </div>
                                            <div className="text-xs text-accent/80 mt-1 text-center">
                                                        Compatible
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
                        {!servicesLoading && repairServices.length > 0 && selectedServices.length > 0 && (
                        <MotionFade delay={0.3} immediate={true}>
                            <div className="text-center mb-8">
                                <CustomButton 
                                    onClick={handleContinueToBreakdown}
                                    className='bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-4 font-bold shadow hover:shadow-lg transition-all duration-300'
                                >
                                Continue with {selectedServices.length} selected service{selectedServices.length > 1 ? 's' : ''}
                                </CustomButton>
                            </div>
                        </MotionFade>
                    )}
                    {/* Features Section */}
                    <FeaturesSection
                        title="Why Choose Our Repair Services?"
                        description="Professional repair services with guaranteed quality and customer satisfaction."
                        features={[
                            { title: "Expert Technicians", description: "Certified professionals with years of experience", icon: "🔧" },
                            { title: "Quality Parts", description: "We use only genuine parts and components", icon: "🛡️" },
                            { title: "Fast Service", description: "Most repairs completed within 24 hours", icon: "⚡" },
                            { title: "Warranty", description: "90-day warranty on all repairs", icon: "✅" }
                        ]}
                    />

                

                 
            </div>
         </div>
        </PageTransition>
    );
}


