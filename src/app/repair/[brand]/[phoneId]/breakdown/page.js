'use client';
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import HeroSection from '@/components/common/HeroSection';
import { CustomButton } from '@/components/ui/button';
import { apiFetcher } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { encryptBkp } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Home, Wrench, Smartphone, Settings } from 'lucide-react';

export default function PriceBreakdownPage({ params }) {
    const { brand, phoneId } = use(params);
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [phoneInfo, setPhoneInfo] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);
    const [servicePartTypes, setServicePartTypes] = useState({});
    const [priceData, setPriceData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Get phone info and selected services from sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedPhone = sessionStorage.getItem('selectedPhone');
            const storedServices = sessionStorage.getItem('selectedServices');
            
            if (storedPhone) {
                try {
                    const parsedPhone = JSON.parse(storedPhone);
                    setPhoneInfo(parsedPhone);
                } catch (e) {
                    console.error('Error parsing stored phone data:', e);
                }
            }
            
            if (storedServices) {
                try {
                    const parsedServices = JSON.parse(storedServices);
                    setSelectedServices(parsedServices);
                } catch (e) {
                    console.error('Error parsing stored services:', e);
                }
            }
            
            const storedPartTypes = sessionStorage.getItem('servicePartTypes');
            if (storedPartTypes) {
                try {
                    const parsedPartTypes = JSON.parse(storedPartTypes);
                    setServicePartTypes(parsedPartTypes);
                } catch (e) {
                    console.error('Error parsing stored part types:', e);
                }
            }
        }
    }, []);

    // Calculate price breakdown
    useEffect(() => {
        const calculatePrice = async () => {
            if (!selectedServices.length || !phoneId) return;

            setIsLoading(true);
            setError(null);
            try {
                const requestBody = {
                    phone_model_id: parseInt(phoneId),
                    items: selectedServices.map(serviceId => ({
                        problem_id: serviceId,
                        part_type: servicePartTypes[serviceId] || "original"
                    }))
                };

                console.log('Calculating price with:', requestBody);
                
                // Try with authentication first
                let response;
                try {
                    response = await apiFetcher.post('/api/repair/repair-prices/calculate_price/', requestBody);
                } catch (authError) {
                    console.log('Auth error, trying without authentication...', authError);
                    
                    // If auth fails, try without authentication
                    const { apiClient } = await import('@/lib/api');
                    const directResponse = await apiClient.post('/api/repair/repair-prices/calculate_price/', requestBody, {
                        headers: {
                            'Content-Type': 'application/json',
                            // Remove Authorization header for this request
                        }
                    });
                    response = directResponse.data;
                }
                
                if (response.success) {
                    setPriceData(response.data);
                    console.log('Price calculation successful:', response.data);
                } else {
                    setError('Failed to calculate price: ' + (response.message || 'Unknown error'));
                }
            } catch (err) {
                console.error('Error calculating price:', err);
                
                // Check if it's an authentication error
                if (err.response?.status === 401) {
                    setError('Authentication required. Please log in to calculate prices.');
                } else if (err.response?.status === 403) {
                    setError('Access denied. You do not have permission to calculate prices.');
                } else if (err.response?.status >= 500) {
                    setError('Server error. Please try again later.');
                } else {
                    setError('Failed to calculate price. Please try again.');
                }
                
                // Set fallback pricing data for demonstration
                const fallbackData = {
                    phone_model: phoneInfo?.name || `${brand.charAt(0).toUpperCase() + brand.slice(1)} Phone`,
                    brand: phoneInfo?.brand || brand.charAt(0).toUpperCase() + brand.slice(1),
                    subtotal: (selectedServices.length * 100).toString(),
                    item_discount: "0.00",
                    price_after_item_discount: (selectedServices.length * 100).toString(),
                    website_discount_percentage: "0.00",
                    website_discount_amount: "0.00",
                    website_discount: "0.00",
                    total_amount: (selectedServices.length * 100).toString(),
                    total_discount: "0.00",
                    items: selectedServices.map((serviceId, index) => ({
                        problem_id: serviceId,
                        problem_name: `Service ${index + 1}`,
                        part_type: "original",
                        base_price: "100.00",
                        discount: "0.00",
                        final_price: "100.00",
                        warranty_days: 0
                    }))
                };
                
                console.log('Using fallback pricing data:', fallbackData);
                setPriceData(fallbackData);
                setError('Using estimated pricing. Final pricing will be confirmed during booking.');
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedServices.length > 0) {
            calculatePrice();
        }
    }, [selectedServices, servicePartTypes, phoneId, brand, phoneInfo?.brand, phoneInfo?.name]);

    const handleBackToServices = () => {
        router.back();
    };

    const handleProceedToBooking = async () => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            setShowAuthModal(true);
            return;
        }
        try {
            // Build order body for backend
            const orderBody = {
                phone_model_id: parseInt(phoneId),
                customer_name: user?.name || user?.username || 'Customer',
                customer_email: user?.email || '',
                customer_phone: user?.phone || '01788175088',
                items: selectedServices.map((serviceId) => ({
                    problem_id: serviceId,
                    part_type: servicePartTypes[serviceId] || 'original'
                })),
                notes: ''
            };

            const response = await apiFetcher.post('/api/repair/orders/', orderBody);
            const order = response?.data || response;

            // Store shared booking payload (encrypted) under 'bkp'
            if (typeof window !== 'undefined' && priceData) {
                const bookingPayload = {
                    type: 'repair',
                    amount: parseFloat(priceData.total_amount || '0'),
                    currency: 'EUR',
                    context: { brand, phoneId },
                    items: priceData.items || [],
                    orderId: order?.order?.id,
                    payment_intent_id: order?.payment?.payment_intent_id || order?.payment_intent || null,
                    client_secret: order?.payment?.client_secret || order?.payment_intent_client_secret || null,
                    summary: {
                        subtotal: parseFloat(priceData.subtotal || '0'),
                        itemDiscount: parseFloat(priceData.item_discount || '0'),
                        priceAfterItemDiscount: parseFloat(priceData.price_after_item_discount || '0'),
                        websiteDiscount: parseFloat(priceData.website_discount || '0'),
                        totalDiscount: parseFloat(priceData.total_discount || '0')
                    },
                    display: {
                        phone_model: priceData.phone_model,
                        brand: priceData.brand
                    }
                };
                const enc = encryptBkp(bookingPayload);
                if (enc) sessionStorage.setItem('bkp', enc);
            }

            // Navigate to shared booking page (Stripe confirmation happens there)
            router.push(`/booking`);
        } catch (e) {
            console.error('Order creation failed:', e);
            setError('Failed to create order. Please try again.');
        }
    };

    const handleAuthSuccess = async (user) => {
        setShowAuthModal(false);
        await handleProceedToBooking();
    };

    if (isLoading) {
        return (
            <PageTransition>
                <div className="min-h-screen relative overflow-hidden bg-primary">
                    <div className="container mx-auto px-4 py-8">
                        
                        {/* Hero Section Skeleton */}
                        {/* <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-12">
                 
                            <div className="flex-shrink-0">
                                <Skeleton className="w-[240px] sm:w-[280px] md:w-[320px] lg:w-[380px] h-[240px] sm:h-[280px] md:h-[320px] lg:h-[380px] rounded-2xl bg-white/10" />
                            </div>
                            
                            <div className="flex-1 text-center lg:text-left">
                                <Skeleton className="h-12 w-48 mx-auto lg:mx-0 mb-4 bg-white/10" />
                                <Skeleton className="h-16 w-64 mx-auto lg:mx-0 mb-6 bg-white/10" />
                                <Skeleton className="h-6 w-96 mx-auto lg:mx-0 mb-8 bg-white/10" />
                                <Skeleton className="h-12 w-40 mx-auto lg:mx-0 bg-white/10" />
                            </div>
                        </div> */}  

                        {/* Price Breakdown Card Skeleton */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 p-8 mb-8">
                            <Skeleton className="h-8 w-64 mb-6 bg-white/10" />
                            
                            {/* Device Info Skeleton */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <Skeleton className="w-12 h-12 rounded-lg bg-white/10" />
                                    <div className="ml-4 flex-1">
                                        <Skeleton className="h-6 w-48 mb-2 bg-white/10" />
                                        <Skeleton className="h-4 w-32 bg-white/10" />
                                    </div>
                                </div>
                            </div>

                            {/* Selected Services Skeleton */}
                            <div className="mb-6">
                                <Skeleton className="h-6 w-40 mb-4 bg-white/10" />
                                <div className="space-y-3">
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm rounded-lg">
                                            <div className="flex-1">
                                                <Skeleton className="h-5 w-32 mb-2 bg-white/10" />
                                                <Skeleton className="h-4 w-24 bg-white/10" />
                                            </div>
                                            <div className="text-right">
                                                <Skeleton className="h-6 w-16 bg-white/10" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Summary Skeleton */}
                            <div className="border-t border-accent/20 pt-6">
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div key={item} className="flex justify-between">
                                            <Skeleton className="h-4 w-32 bg-white/10" />
                                            <Skeleton className="h-4 w-16 bg-white/10" />
                                        </div>
                                    ))}
                                    <div className="border-t border-accent/20 pt-3">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-6 w-40 bg-white/10" />
                                            <Skeleton className="h-6 w-20 bg-white/10" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Skeleton className="h-12 w-40 bg-white/10" />
                            <Skeleton className="h-12 w-48 bg-white/10" />
                        </div>
                    </div>
                </div>
            </PageTransition>
        );
    }

    if (error && !priceData) {
        return (
            <PageTransition>
                <div className="min-h-screen relative overflow-hidden bg-primary">
                    <div className="container  mx-auto px-4 py-8">
                        <div className="text-center">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                                <div className="text-red-600 text-xl mb-2">⚠️</div>
                                <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
                                <p className="text-red-600 mb-4">{error}</p>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                                    <p className="text-yellow-800 text-sm">
                                        <strong>Note:</strong> You can still proceed with your repair request. 
                                        Our team will provide you with accurate pricing during the booking process.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <CustomButton 
                                    onClick={handleBackToServices}
                                    className="bg-gray-500 text-white hover:bg-gray-600"
                                >
                                    ← Back to Services
                                </CustomButton>
                                <CustomButton 
                                    onClick={handleProceedToBooking}
                                    className="bg-primary text-white hover:bg-primary/90"
                                >
                                    Proceed to Booking →
                                </CustomButton>
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
                    
                    {/* Hero Section */}
                    {/* <HeroSection
                        title="Price"
                        subtitle="Breakdown"
                        description={`Review your repair costs for ${phoneInfo?.name || brand.charAt(0).toUpperCase() + brand.slice(1)}`}
                        image={phoneInfo?.image || phoneInfo?.phone_image || phoneInfo?.model_image || phoneInfo?.logo || `/${brand.charAt(0).toUpperCase() + brand.slice(1)}.png`}
                        imageAlt={phoneInfo?.name || `${brand.charAt(0).toUpperCase() + brand.slice(1)} Phone`}
                        badgeText="Step 4: Review Pricing"
                        showBackButton={true}
                        backButtonText="← Back to Services"
                        backButtonHref={`/repair/${brand}/${phoneId}`}
                        layout="image-left"
                    /> */}

                    {/* Warning for fallback pricing */}
                    {error && priceData && (
                        <MotionFade delay={0.1} immediate={true}>
                            <div className="bg-secondary/20 border border-secondary rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <div className="text-secondary text-xl mr-3">⚠️</div>
                                    <div>
                                        <h3 className="font-semibold text-accent">Estimated Pricing</h3>
                                        <p className="text-accent/80 text-sm">{error}</p>
                                    </div>
                                </div>
                            </div>
                        </MotionFade>
                    )}

                    {/* Price Breakdown */}
                    {priceData && (
                        <MotionFade delay={0.2} immediate={true}>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 p-8 mb-8">
                                {/* Breadcrumb Navigation */}
                                <Breadcrumb
                                    items={[
                                        { label: 'Home', href: '/', icon: Home },
                                        { label: 'Repair', href: '/repair', icon: Wrench },
                                        { label: brand.charAt(0).toUpperCase() + brand.slice(1), href: `/repair/${brand}`, icon: Smartphone },
                                        { label: phoneInfo?.name || 'Phone Model', href: `/repair/${brand}/${phoneId}`, icon: Smartphone },
                                        { label: 'Breakdown', icon: Settings }
                                    ]}
                                    className="mb-6"
                                />
                                <h2 className="text-2xl font-bold text-secondary mb-6">Repair Cost Breakdown</h2>
                                
                                {/* Device Info */}
                                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mr-4">
                                            <span className="text-2xl">📱</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-accent">{priceData.phone_model}</h3>
                                            <p className="text-accent/80">{priceData.brand}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Services */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-accent mb-4">Selected Services</h3>
                                    <div className="space-y-3">
                                        {priceData.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-accent">{item.problem_name}</h4>
                                                    <p className="text-sm text-accent/80">
                                                        Part Type: <span className="font-medium capitalize">{item.part_type}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-secondary">
                                                        {parseFloat(item.final_price).toFixed(2)}
                                                    </div>
                                                    {parseFloat(item.discount) > 0 && (
                                                        <div className="text-sm text-secondary/80">
                                                            -{parseFloat(item.discount).toFixed(2)} discount
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="border-t border-accent/20 pt-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-accent/80">Subtotal:</span>
                                            <span className="font-medium text-accent">{parseFloat(priceData.subtotal).toFixed(2)}</span>
                                        </div>
                                        
                                        {parseFloat(priceData.item_discount) > 0 && (
                                            <div className="flex justify-between text-secondary">
                                                <span>Item Discount:</span>
                                                <span>-{parseFloat(priceData.item_discount).toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between">
                                            <span className="text-accent/80">Price after item discount:</span>
                                            <span className="font-medium text-accent">{parseFloat(priceData.price_after_item_discount).toFixed(2)}</span>
                                        </div>
                                        
                                        {parseFloat(priceData.website_discount) > 0 && (
                                            <div className="flex justify-between text-secondary">
                                                <span>Website Discount ({priceData.website_discount_percentage}%):</span>
                                                <span>-{parseFloat(priceData.website_discount).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {parseFloat(priceData.website_discount_amount) > 0 && (
                                            <div className="flex justify-between text-secondary">
                                                <span>Website Discount Amount:</span>
                                                <span>-{parseFloat(priceData.website_discount_amount).toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        <div className="border-t border-accent/20 pt-3">
                                            <div className="flex justify-between text-lg font-bold">
                                                <span className="text-accent">Total Amount:</span>
                                                <span className="text-secondary">{parseFloat(priceData.total_amount).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        
                                        {parseFloat(priceData.total_discount) > 0 && (
                                            <div className="text-center text-secondary font-medium">
                                                You saved {parseFloat(priceData.total_discount).toFixed(2)}!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </MotionFade>
                    )}

                    {/* Action Buttons */}
                    <MotionFade delay={0.4} immediate={true}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <CustomButton 
                                onClick={handleBackToServices}
                                className="bg-accent/20 text-accent hover:bg-accent/30 px-8 py-3"
                            >
                                ← Back to Services
                            </CustomButton>
                            
                            <CustomButton 
                                onClick={handleProceedToBooking}
                                className="bg-secondary text-primary hover:bg-secondary/90 px-8 py-3"
                            >
                                Proceed to Booking →
                            </CustomButton>
                        </div>
                    </MotionFade>
                </div>
            </div>
            
            {/* Authentication Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={handleAuthSuccess}
                redirectPath={`/booking`}
            />
        </PageTransition>
    );
}
