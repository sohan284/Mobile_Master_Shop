'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import HeroSection from '@/components/common/HeroSection';
import { CustomButton } from '@/components/ui/button';
import { apiFetcher } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';

export default function PriceBreakdownPage({ params }) {
    const { brand, phoneId } = params;
    const router = useRouter();
    const { isAuthenticated } = useAuth();
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

    const handleProceedToBooking = () => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            setShowAuthModal(true);
            return;
        }
        
        // Store price data for booking page
        if (typeof window !== 'undefined' && priceData) {
            sessionStorage.setItem('priceBreakdown', JSON.stringify(priceData));
        }
        // Navigate to booking page (you can create this later)
        router.push(`/repair/${brand}/${phoneId}/booking`);
    };

    const handleAuthSuccess = (user) => {
        setShowAuthModal(false);
        // Store price data for booking page
        if (typeof window !== 'undefined' && priceData) {
            sessionStorage.setItem('priceBreakdown', JSON.stringify(priceData));
        }
        // Navigate to booking page
        router.push(`/repair/${brand}/${phoneId}/booking`);
    };

    if (isLoading) {
        return (
            <PageTransition>
                <div className="min-h-screen relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="text-center">
                            <Skeleton className="h-8 w-64 mx-auto mb-4" />
                            <Skeleton className="h-4 w-96 mx-auto mb-8" />
                            <Skeleton className="h-64 w-full mb-8" />
                        </div>
                    </div>
                </div>
            </PageTransition>
        );
    }

    if (error && !priceData) {
        return (
            <PageTransition>
                <div className="min-h-screen relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 py-8">
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
            <div className="min-h-screen relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    
                    {/* Hero Section */}
                    <HeroSection
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
                    />

                    {/* Warning for fallback pricing */}
                    {error && priceData && (
                        <MotionFade delay={0.1} immediate={true}>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <div className="text-yellow-600 text-xl mr-3">⚠️</div>
                                    <div>
                                        <h3 className="font-semibold text-yellow-800">Estimated Pricing</h3>
                                        <p className="text-yellow-700 text-sm">{error}</p>
                                    </div>
                                </div>
                            </div>
                        </MotionFade>
                    )}

                    {/* Price Breakdown */}
                    {priceData && (
                        <MotionFade delay={0.2} immediate={true}>
                            <div className="bg-white/10  rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Repair Cost Breakdown</h2>
                                
                                {/* Device Info */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                                            <span className="text-2xl">📱</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-800">{priceData.phone_model}</h3>
                                            <p className="text-gray-600">{priceData.brand}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Services */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Services</h3>
                                    <div className="space-y-3">
                                        {priceData.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-gray-800">{item.problem_name}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Part Type: <span className="font-medium capitalize">{item.part_type}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-primary">
                                                        {parseFloat(item.final_price).toFixed(2)}
                                                    </div>
                                                    {parseFloat(item.discount) > 0 && (
                                                        <div className="text-sm text-green-600">
                                                            -{parseFloat(item.discount).toFixed(2)} discount
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="border-t border-gray-200 pt-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-medium">{parseFloat(priceData.subtotal).toFixed(2)}</span>
                                        </div>
                                        
                                        {parseFloat(priceData.item_discount) > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Item Discount:</span>
                                                <span>-{parseFloat(priceData.item_discount).toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Price after item discount:</span>
                                            <span className="font-medium">{parseFloat(priceData.price_after_item_discount).toFixed(2)}</span>
                                        </div>
                                        
                                        {parseFloat(priceData.website_discount) > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Website Discount ({priceData.website_discount_percentage}%):</span>
                                                <span>-{parseFloat(priceData.website_discount).toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Total Amount:</span>
                                                <span className="text-primary">{parseFloat(priceData.total_amount).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        
                                        {parseFloat(priceData.total_discount) > 0 && (
                                            <div className="text-center text-green-600 font-medium">
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
                                className="bg-gray-500 text-white hover:bg-gray-600 px-8 py-3"
                            >
                                ← Back to Services
                            </CustomButton>
                            
                            <CustomButton 
                                onClick={handleProceedToBooking}
                                className="bg-primary text-white hover:bg-primary/90 px-8 py-3"
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
                redirectPath={`/repair/${brand}/${phoneId}/booking`}
            />
        </PageTransition>
    );
}
