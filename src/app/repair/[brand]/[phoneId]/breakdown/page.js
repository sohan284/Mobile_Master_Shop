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
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Home, Wrench, Smartphone, Settings, Calendar, Clock, User, Mail, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SafeImage from '@/components/ui/SafeImage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function PriceBreakdownPage({ params }) {
    const t = useTranslations('repair');
    const { brand, phoneId } = use(params);
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [phoneInfo, setPhoneInfo] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);
    const [servicePartTypes, setServicePartTypes] = useState({});
    const [priceData, setPriceData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [scheduleError, setScheduleError] = useState('');
    const [showCustomerForm, setShowCustomerForm] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        username: '',
        email: '',
        phone: ''
    });
    const [customerFormError, setCustomerFormError] = useState('');

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
                
                // Get detailed error message from API response
                const errorMessage = err?.response?.data?.message || 
                                  err?.response?.data?.detail || 
                                  err?.message || 
                                  'Failed to calculate price. Please try again.';
                
                // Check error status and provide appropriate message
                if (err.response?.status === 401) {
                    setError(errorMessage || 'Authentication required. Please log in to calculate prices.');
                } else if (err.response?.status === 403) {
                    setError(errorMessage || 'Access denied. You do not have permission to calculate prices.');
                } else if (err.response?.status === 400) {
                    setError(errorMessage || 'Invalid request. Please check your selections.');
                } else if (err.response?.status >= 500) {
                    setError(errorMessage || 'Server error. Please try again later.');
                } else {
                    setError(errorMessage);
                }
                
                // Log full error for debugging
                console.error('Full error details:', {
                    status: err?.response?.status,
                    data: err?.response?.data,
                    message: errorMessage
                });
                
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

    // Format date from YYYY-MM-DD to DD-MM-YYYY
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    // Format time from HH:MM (24h) to HH:MM AM/PM (12h)
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour24 = parseInt(hours, 10);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const ampm = hour24 >= 12 ? 'PM' : 'AM';
        return `${hour12.toString().padStart(2, '0')}:${minutes}${ampm}`;
    };

    // Format schedule for API: "DD-MM-YYYY, HH:MM AM/PM"
    const formatScheduleForAPI = (date, time) => {
        if (!date || !time) return '';
        return `${formatDate(date)}, ${formatTime(time)}`;
    };

    // Validate schedule time against business hours
    const validateScheduleTime = (date, time) => {
        if (!date || !time) return '';

        // Parse date string (YYYY-MM-DD) to get day of week in local timezone
        const [year, month, day] = date.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, day); // month is 0-indexed
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const [hours, minutes] = time.split(':');
        const selectedHour = parseInt(hours, 10);
        const selectedMinute = parseInt(minutes, 10);
        const selectedTimeInMinutes = selectedHour * 60 + selectedMinute;

        // Business hours in minutes (since midnight)
        // Monday: 14:00-19:00 (840-1140 minutes)
        // Tuesday-Saturday: 10:00-13:00 (600-780 minutes) OR 14:00-19:00 (840-1140 minutes)
        // Sunday: 10:00-13:00 (600-780 minutes)

        let isValid = false;

        if (dayOfWeek === 1) { // Monday
            // Monday: 2-7 pm (14:00-19:00)
            isValid = selectedTimeInMinutes >= 840 && selectedTimeInMinutes < 1140;
        } else if (dayOfWeek >= 2 && dayOfWeek <= 6) { // Tuesday to Saturday
            // Tuesday to Saturday: 10 am-1 pm (10:00-13:00) OR 2-7 pm (14:00-19:00)
            isValid = (selectedTimeInMinutes >= 600 && selectedTimeInMinutes < 780) ||
                     (selectedTimeInMinutes >= 840 && selectedTimeInMinutes < 1140);
        } else if (dayOfWeek === 0) { // Sunday
            // Sunday: 10 am-1 pm (10:00-13:00)
            isValid = selectedTimeInMinutes >= 600 && selectedTimeInMinutes < 780;
        }

        if (!isValid) {
            let hoursMessage = '';
            if (dayOfWeek === 1) {
                hoursMessage = t('mondayHours');
            } else if (dayOfWeek >= 2 && dayOfWeek <= 6) {
                hoursMessage = t('tuesdayToSaturdayHours');
            } else if (dayOfWeek === 0) {
                hoursMessage = t('sundayHours');
            }
            return `${t('timeNotAvailable')} ${hoursMessage}`;
        }

        return '';
    };

    const handleBackToServices = () => {
        router.back();
    };

    const validateCustomerForm = () => {
        if (!customerInfo.username.trim()) {
            setCustomerFormError('Username is required');
            return false;
        }
        if (!customerInfo.email.trim()) {
            setCustomerFormError('Email is required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerInfo.email)) {
            setCustomerFormError('Please enter a valid email address');
            return false;
        }
        if (!customerInfo.phone.trim()) {
            setCustomerFormError('Phone number is required');
            return false;
        }
        setCustomerFormError('');
        return true;
    };

    const handleProceedToBooking = async () => {
        // Validate schedule selection
        if (!scheduleDate || !scheduleTime) {
            setScheduleError(t('scheduleRequired'));
            return;
        }
        
        // Validate time against business hours
        const timeValidationError = validateScheduleTime(scheduleDate, scheduleTime);
        if (timeValidationError) {
            setScheduleError(timeValidationError);
            return;
        }
        
        setScheduleError('');

        // Check if user is logged in, if not show customer form
        if (!isAuthenticated()) {
            setShowCustomerForm(true);
            return;
        }

        await createOrder();
    };

    const createOrder = async () => {
        try {
            // Combine date and time into format: YYYY-MM-DD HH:MM
            // scheduleDate is in YYYY-MM-DD format, scheduleTime is in HH:MM format
            const scheduledDateTime = scheduleDate && scheduleTime 
                ? `${scheduleDate} ${scheduleTime}` 
                : null;

            // Get customer info from user or form
            const customerName = user?.name || user?.username || customerInfo.username || 'Customer';
            const customerEmail = user?.email || customerInfo.email || '';
            const customerPhone = user?.phone || customerInfo.phone || '01788175088';

            // Build order body for backend
            const orderBody = {
                phone_model_id: parseInt(phoneId),
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                items: selectedServices.map((serviceId) => ({
                    problem_id: serviceId,
                    part_type: servicePartTypes[serviceId] || 'original'
                })),
                schedule: scheduledDateTime,
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
                    schedule: scheduledDateTime,
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
                                <h2 className="text-xl font-semibold text-red-800 mb-2">{t('error')}</h2>
                                <p className="text-red-600 mb-4">{error}</p>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                                    <p className="text-yellow-800 text-sm">
                                        <strong>{t('note')}:</strong> {t('noteCanStillProceed')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <CustomButton 
                                    onClick={handleBackToServices}
                                    className="bg-gray-500 text-white hover:bg-gray-600"
                                >
                                    {t('backToServices')}
                                </CustomButton>
                                <CustomButton 
                                    onClick={handleProceedToBooking}
                                    className="bg-primary text-white hover:bg-primary/90"
                                >
                                    {t('proceedToBooking')}
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
                <div className="container mx-auto px-4 py-4">
                    {/* Warning for fallback pricing */}
                    {error && priceData && (
                        <MotionFade delay={0.1} immediate={true}>
                            <div className="bg-secondary/20 border border-secondary rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="text-secondary text-lg">⚠️</div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-accent">{t('estimatedPricing')}</h3>
                                        <p className="text-accent/80 text-xs">{error}</p>
                                    </div>
                                </div>
                            </div>
                        </MotionFade>
                    )}

                    {/* Price Breakdown */}
                    {priceData && (
                        <MotionFade delay={0.2} immediate={true}>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 p-5 mb-4">
                                {/* Breadcrumb Navigation */}
                                <Breadcrumb
                                    items={[
                                        { label: t('home'), href: '/', icon: Home },
                                        { label: t('repair'), href: '/repair', icon: Wrench },
                                        { label: brand.charAt(0).toUpperCase() + brand.slice(1), href: `/repair/${brand}`, icon: Smartphone },
                                        { label: phoneInfo?.name || t('phoneModel'), href: `/repair/${brand}/${phoneId}`, icon: Smartphone },
                                        { label: t('breakdown'), icon: Settings }
                                    ]}
                                    className="mb-3"
                                />
                                <h2 className="text-xl font-bold text-secondary mb-4">{t('repairCostBreakdown')}</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    {/* Left Column - Device & Services */}
                                    <div className="md:col-span-2 space-y-4">
                                {/* Device Info */}
                                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    {phoneInfo?.image ? (
                                                        <SafeImage
                                                            src={phoneInfo.image}
                                                            alt={phoneInfo?.name || priceData.phone_model}
                                                            width={40}
                                                            height={40}
                                                            className="w-full h-full object-contain p-1"
                                                            fallbackSrc={`/${brand.charAt(0).toUpperCase() + brand.slice(1)}.png`}
                                                        />
                                                    ) : (
                                                        <span className="text-xl">📱</span>
                                                    )}
                                        </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-base text-accent truncate">{priceData.phone_model}</h3>
                                                    <p className="text-xs text-accent/80">{priceData.brand}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Services */}
                                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
                                            <h3 className="text-sm font-semibold text-accent mb-2">{t('selectedServices')}</h3>
                                            <div className="space-y-2">
                                        {priceData.items.map((item, index) => (
                                                    <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-sm text-accent truncate">{item.problem_name}</h4>
                                                            <p className="text-xs text-accent/80">
                                                                {t('partType')}: <span className="font-medium capitalize">{item.part_type}</span>
                                                            </p>
                                                            {parseFloat(item.discount) > 0 && (
                                                                <p className="text-xs text-secondary/80 mt-0.5">
                                                                    -€{parseFloat(item.discount).toFixed(2)} discount
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right ml-2">
                                                            <div className="text-base font-bold text-secondary">
                                                                €{parseFloat(item.final_price).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Schedule Selection */}
                                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
                                            <h3 className="text-sm font-semibold text-accent mb-3 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-secondary" />
                                                {t('selectSchedule')}
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {/* Schedule Date */}
                                                <div>
                                                    <Label 
                                                        htmlFor="scheduleDate" 
                                                        className="text-accent text-xs font-medium mb-1 block"
                                                    >
                                                        {t('scheduleDate')} *
                                                    </Label>
                                                    <div className="relative group">
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                                            <Calendar className="w-4 h-4 text-accent/60 group-focus-within:text-secondary transition-colors duration-200" />
                                                        </div>
                                                        <Input
                                                            id="scheduleDate"
                                                            type="date"
                                                            value={scheduleDate}
                                                            onChange={(e) => {
                                                                const newDate = e.target.value;
                                                                setScheduleDate(newDate);
                                                                // Validate time if time is already selected
                                                                if (scheduleTime) {
                                                                    const error = validateScheduleTime(newDate, scheduleTime);
                                                                    setScheduleError(error);
                                                                } else {
                                                                    setScheduleError('');
                                                                }
                                                                setTimeout(() => {
                                                                    e.target.blur();
                                                                }, 100);
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const input = e.target;
                                                                if (input.showPicker) {
                                                                    try {
                                                                        input.showPicker();
                                                                    } catch (err) {
                                                                        input.focus();
                                                                    }
                                                                }
                                                            }}
                                                            min={new Date().toISOString().split('T')[0]}
                                                            className="w-full bg-white/10 backdrop-blur-sm border-2 border-accent/30 text-accent placeholder:text-accent/50 focus:border-secondary focus:ring-secondary/50 focus:ring-2 h-10 text-xs cursor-pointer transition-all duration-200 hover:bg-white/15 hover:border-accent/50 pl-10 pr-3 py-2 rounded-lg"
                                                            required
                                                        />
                                                        {scheduleDate && (
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                <span className="text-xs text-secondary/80 font-medium">
                                                                    {formatDate(scheduleDate)}
                                                                </span>
                                                </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Schedule Time */}
                                                <div>
                                                    <Label 
                                                        htmlFor="scheduleTime" 
                                                        className="text-accent text-xs font-medium mb-1 block"
                                                    >
                                                        {t('scheduleTime')} *
                                                    </Label>
                                                    <div className="relative group">
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                                            <Clock className="w-4 h-4 text-accent/60 group-focus-within:text-secondary transition-colors duration-200" />
                                                        </div>
                                                        <Input
                                                            id="scheduleTime"
                                                            type="time"
                                                            value={scheduleTime}
                                                            onChange={(e) => {
                                                                const newTime = e.target.value;
                                                                setScheduleTime(newTime);
                                                                // Validate time if date is already selected
                                                                if (scheduleDate) {
                                                                    const error = validateScheduleTime(scheduleDate, newTime);
                                                                    setScheduleError(error);
                                                                } else {
                                                                    setScheduleError('');
                                                                }
                                                                setTimeout(() => {
                                                                    e.target.blur();
                                                                }, 100);
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const input = e.target;
                                                                if (input.showPicker) {
                                                                    try {
                                                                        input.showPicker();
                                                                    } catch (err) {
                                                                        input.focus();
                                                                    }
                                                                }
                                                            }}
                                                            className="w-full bg-white/10 backdrop-blur-sm border-2 border-accent/30 text-accent placeholder:text-accent/50 focus:border-secondary focus:ring-secondary/50 focus:ring-2 h-10 text-xs cursor-pointer transition-all duration-200 hover:bg-white/15 hover:border-accent/50 pl-10 pr-3 py-2 rounded-lg"
                                                            required
                                                        />
                                                        {scheduleTime && (
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                <span className="text-xs text-secondary/80 font-medium">
                                                                    {formatTime(scheduleTime)}
                                                                </span>
                                                        </div>
                                                    )}
                                                    </div>
                                                </div>
                                            </div>
                                            {scheduleError && (
                                                <div className="mt-2 p-2 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-lg">
                                                    <p className="text-red-400 text-xs font-medium flex items-center gap-2">
                                                        <span>⚠️</span>
                                                        {scheduleError}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                </div>

                                    {/* Right Column - Price Summary */}
                                  <div  className="md:col-span-1">
                                  <div>
                                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-accent/20 sticky top-4">
                                            <h3 className="text-sm font-semibold text-accent mb-3">{t('priceSummary')}</h3>
                                            <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-accent/80">{t('subtotalBreakdown')}:</span>
                                            <span className="font-medium text-accent">€{parseFloat(priceData.subtotal).toFixed(2)}</span>
                                        </div>
                                        
                                        {parseFloat(priceData.item_discount) > 0 && (
                                            <div className="flex justify-between text-secondary">
                                                <span>{t('itemDiscountBreakdown')}:</span>
                                                <span>-€{parseFloat(priceData.item_discount).toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        {parseFloat(priceData.website_discount) > 0 && (
                                            <div className="flex justify-between text-secondary">
                                                <span>{t('websiteDiscountBreakdown')} ({priceData.website_discount_percentage}%):</span>
                                                <span>-€{parseFloat(priceData.website_discount).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {parseFloat(priceData.website_discount_amount) > 0 && (
                                            <div className="flex justify-between text-secondary">
                                                <span>{t('websiteDiscountBreakdown')}:</span>
                                                <span>-€{parseFloat(priceData.website_discount_amount).toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                                <div className="border-t border-accent/20 pt-2 mt-2">
                                                    <div className="flex justify-between text-base font-bold">
                                                <span className="text-accent">{t('totalBreakdown')}:</span>
                                                <span className="text-secondary">€{parseFloat(priceData.total_amount).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        
                                        {parseFloat(priceData.total_discount) > 0 && (
                                                    <div className="text-center text-secondary font-medium text-xs pt-1">
                                                You saved €{parseFloat(priceData.total_discount).toFixed(2)}!
                                            </div>
                                        )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
                            <CustomButton 
                                onClick={handleBackToServices}
                                className="bg-accent/20 text-accent hover:bg-accent/30 px-6 py-2 text-sm"
                            >
                                {t('backToServices')}
                            </CustomButton>
                            
                            <CustomButton 
                                onClick={handleProceedToBooking}
                                disabled={!scheduleDate || !scheduleTime || !!scheduleError}
                                className="bg-secondary text-primary hover:bg-secondary/90 px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary"
                            >
                                {t('proceedToBooking')}
                            </CustomButton>
                        </div>
                                  </div>
                                </div>
                            </div>
                        </MotionFade>
                    )}

                    
                </div>
            </div>

            {/* Customer Information Form Dialog */}
            <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
                <DialogContent className="bg-primary border-accent/20 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-secondary">Customer Information</DialogTitle>
                        <DialogDescription className="text-accent/80">
                            Please provide your contact information to proceed with the order.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        {/* Username */}
                        <div>
                            <Label htmlFor="customer-username" className="text-accent text-sm font-medium mb-2 block">
                                <User className="w-4 h-4 inline mr-2" />
                                Username *
                            </Label>
                            <Input
                                id="customer-username"
                                type="text"
                                value={customerInfo.username}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, username: e.target.value })}
                                className="w-full bg-white/10 backdrop-blur-sm border-2 border-accent/30 text-accent placeholder:text-accent/50 focus:border-secondary focus:ring-secondary/50 focus:ring-2 h-10 text-sm"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="customer-email" className="text-accent text-sm font-medium mb-2 block">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email *
                            </Label>
                            <Input
                                id="customer-email"
                                type="email"
                                value={customerInfo.email}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                className="w-full bg-white/10 backdrop-blur-sm border-2 border-accent/30 text-accent placeholder:text-accent/50 focus:border-secondary focus:ring-secondary/50 focus:ring-2 h-10 text-sm"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <Label htmlFor="customer-phone" className="text-accent text-sm font-medium mb-2 block">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Phone *
                            </Label>
                            <Input
                                id="customer-phone"
                                type="tel"
                                value={customerInfo.phone}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                className="w-full bg-white/10 backdrop-blur-sm border-2 border-accent/30 text-accent placeholder:text-accent/50 focus:border-secondary focus:ring-secondary/50 focus:ring-2 h-10 text-sm"
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>

                        {customerFormError && (
                            <div className="p-2 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-lg">
                                <p className="text-red-400 text-xs font-medium">{customerFormError}</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <CustomButton
                                onClick={async () => {
                                    if (validateCustomerForm()) {
                                        setShowCustomerForm(false);
                                        await createOrder();
                                    }
                                }}
                                className="bg-secondary text-primary hover:bg-secondary/90 flex-1"
                            >
                                Continue to Checkout
                            </CustomButton>
                            <CustomButton
                                onClick={() => {
                                    setShowCustomerForm(false);
                                    setCustomerFormError('');
                                }}
                                className="bg-white/10 text-accent hover:bg-white/20 flex-1"
                            >
                                Cancel
                            </CustomButton>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </PageTransition>
    );
}
