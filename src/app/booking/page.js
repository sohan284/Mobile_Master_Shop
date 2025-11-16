'use client';
import React, { useEffect, useState } from 'react';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import { CustomButton } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { decryptBkp } from '@/lib/utils';
import { apiFetcher } from '@/lib/api';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Calendar } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ clientSecret, amount, currency, bookingPayment }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // Handle Klarna redirect return
    useEffect(() => {
        if (!stripe || typeof window === 'undefined') return;

        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
        const paymentIntentId = urlParams.get('payment_intent');

        // If we have payment intent info from URL (Klarna redirect return)
        if (paymentIntentClientSecret && paymentIntentId) {
            const confirmPaymentAfterRedirect = async () => {
                try {
                    const { paymentIntent, error: retrieveError } = await stripe.retrievePaymentIntent(paymentIntentClientSecret);
                    
                    if (retrieveError) {
                        console.error('Error retrieving payment intent:', retrieveError);
                        return;
                    }

                    // If payment succeeded, confirm with backend
                    if (paymentIntent && paymentIntent.status === 'succeeded') {
                        const orderId = bookingPayment?.orderId;
                        if (!orderId) {
                            console.error('Order ID not found');
                            return;
                        }

                        let confirmPaymentEndpoint;
                        if (bookingPayment?.type === 'repair') {
                            confirmPaymentEndpoint = `/api/repair/orders/${orderId}/confirm_payment/`;
                        } else if (bookingPayment?.type === 'phone') {
                            confirmPaymentEndpoint = `/api/brandnew/orders/${orderId}/confirm_payment/`;
                        } else if (bookingPayment?.type === 'accessory' || bookingPayment?.type === 'Accessories') {
                            confirmPaymentEndpoint = `/api/accessories/orders/${orderId}/confirm_payment/`;
                        } else {
                            console.error(`Unknown booking type: ${bookingPayment?.type}`);
                            return;
                        }

                        await apiFetcher.post(confirmPaymentEndpoint, {
                            payment_intent_id: paymentIntent.id
                        });

                        toast.success('Payment confirmed successfully!', {
                            duration: 3000,
                            position: 'top-right',
                        });

                        // Clear booking data
                        sessionStorage.removeItem('bkp');
                        localStorage.removeItem('bkp');
                        localStorage.removeItem('bookingPayment');
                        sessionStorage.removeItem('bookingPayment');

                        // Determine which tab to navigate to
                        let tabParam = 'all';
                        if (bookingPayment?.type === 'repair') {
                            tabParam = 'repair';
                        } else if (bookingPayment?.type === 'phone') {
                            tabParam = 'phone';
                        } else if (bookingPayment?.type === 'accessory' || bookingPayment?.type === 'Accessories') {
                            tabParam = 'accessory';
                        }

                        // Clean URL and redirect
                        window.history.replaceState({}, '', window.location.pathname);
                        setTimeout(() => {
                            router.push(`/orders?tab=${tabParam}`);
                        }, 1500);
                    } else if (paymentIntent && paymentIntent.status === 'processing') {
                        // Payment is still processing
                        setMessage('Payment is being processed. Please wait...');
                        toast.info('Your payment is being processed. You will be notified once it\'s confirmed.', {
                            duration: 5000,
                            position: 'top-right',
                        });
                    }
                } catch (error) {
                    console.error('Error confirming payment after redirect:', error);
                    toast.error(
                        error?.response?.data?.message || 
                        error?.message || 
                        'Payment confirmation failed. Please contact support.',
                        {
                            duration: 5000,
                            position: 'top-right',
                        }
                    );
                }
            };

            confirmPaymentAfterRedirect();
        }
    }, [stripe, bookingPayment, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setSubmitting(true);
        setMessage('');

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Stay on page
                return_url: typeof window !== 'undefined' ? window.location.href : undefined,
            },
            redirect: 'if_required'
        });

        if (error) {
            setMessage(error.message || 'Payment failed.');
            setSubmitting(false);
            return;
        }

        // Handle Klarna and other payment methods that may require additional confirmation
        // Klarna payments might have status 'processing' or 'requires_action' initially
        if (paymentIntent && (paymentIntent.status === 'processing' || paymentIntent.status === 'requires_action')) {
            // For Klarna, the payment might be processing asynchronously
            // Show a message and wait for webhook confirmation or check status
            setMessage('Payment is being processed. Please wait...');
            
            // Optionally poll for payment status or wait for webhook
            // For now, we'll show a message and let the user know
            toast.info('Your payment is being processed. You will be notified once it\'s confirmed.', {
                duration: 5000,
                position: 'top-right',
            });
            
            // For Klarna, sometimes we need to redirect back after confirmation
            // The redirect: 'if_required' handles this automatically
            setSubmitting(false);
            return;
        }

        // Payment successful - confirm payment with backend API
        if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                // Determine API endpoint based on booking type
                const orderId = bookingPayment?.orderId;
                let confirmPaymentEndpoint;

                if (!orderId) {
                    throw new Error('Order ID not found');
                }

                if (bookingPayment?.type === 'repair') {
                    confirmPaymentEndpoint = `/api/repair/orders/${orderId}/confirm_payment/`;
                } else if (bookingPayment?.type === 'phone') {
                    confirmPaymentEndpoint = `/api/brandnew/orders/${orderId}/confirm_payment/`;
                } else if (bookingPayment?.type === 'accessory' || bookingPayment?.type === 'Accessories') {
                    confirmPaymentEndpoint = `/api/accessories/orders/${orderId}/confirm_payment/`;
                } else {
                    throw new Error(`Unknown booking type: ${bookingPayment?.type}`);
                }

                // Call payment confirmation API
                await apiFetcher.post(confirmPaymentEndpoint, {
                    payment_intent_id: paymentIntent.id
                });

                toast.success('Payment confirmed successfully!', {
                    duration: 3000,
                    position: 'top-right',
                });
                
                // Clear booking data
                sessionStorage.removeItem('bkp');
                localStorage.removeItem('bkp');
                localStorage.removeItem('bookingPayment');
                sessionStorage.removeItem('bookingPayment');

                // Determine which tab to navigate to based on order type
                let tabParam = 'all';
                if (bookingPayment?.type === 'repair') {
                    tabParam = 'repair';
                } else if (bookingPayment?.type === 'phone') {
                    tabParam = 'phone';
                } else if (bookingPayment?.type === 'accessory' || bookingPayment?.type === 'Accessories') {
                    tabParam = 'accessory';
                }

                // Small delay to show the toast before redirecting
                setTimeout(() => {
                    router.push(`/orders?tab=${tabParam}`);
                }, 1500);
                // Don't set submitting to false here - we're redirecting
                return;
            } catch (error) {
                console.error('Payment confirmation API error:', error);
                toast.error(
                    error?.response?.data?.message || 
                    error?.message || 
                    'Payment succeeded but confirmation failed. Please contact support.',
                    {
                        duration: 5000,
                        position: 'top-right',
                    }
                );
                setSubmitting(false);
                return;
            }
        } else {
            setMessage('Payment processing...');
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement 
                options={{ 
                    layout: 'tabs',
                    fields: {
                        billingDetails: {
                            email: 'auto',
                            phone: 'auto',
                            address: {
                                country: 'auto',
                                line1: 'auto',
                                city: 'auto',
                                postalCode: 'auto',
                                state: 'auto',
                            },
                        },
                    },
                }} 
            />
            {message && <div className="text-sm text-gray-600">{message}</div>}
            <CustomButton disabled={!stripe || submitting} type="submit" className="w-full bg-secondary text-primary hover:bg-secondary/90 py-3">
                {submitting ? 'Processing...' : `Pay ${currency} ${amount.toFixed(2)}`}
            </CustomButton>
        </form>
    );
}

export default function BookingPage() {
    const t = useTranslations('booking');
    const [bookingPayment, setBookingPayment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            // Check for Klarna redirect return (Stripe may include payment_intent in URL)
            const urlParams = new URLSearchParams(window.location.search);
            const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
            const paymentIntentId = urlParams.get('payment_intent');
            
            // Prefer encrypted 'bkp'
            const enc = sessionStorage.getItem('bkp') || localStorage.getItem('bkp');
            if (enc) {
                const parsed = decryptBkp(enc);
                if (parsed) {
                    setBookingPayment(parsed);
                    // Use client secret from URL if available (from Klarna redirect)
                    setClientSecret(paymentIntentClientSecret || parsed.client_secret || null);
                }
            } else {
                // Backward compat
                const stored = localStorage.getItem('bookingPayment') || sessionStorage.getItem('bookingPayment');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setBookingPayment(parsed);
                    // Use client secret from URL if available (from Klarna redirect)
                    setClientSecret(paymentIntentClientSecret || parsed.client_secret || null);
                }
            }
            
            // If we have payment intent info from URL (Klarna redirect return)
            // The CheckoutForm component will handle the payment confirmation
        } catch {}
        setIsLoading(false);
    }, []);

    const amount = bookingPayment?.amount ?? 0;
    const currency = bookingPayment?.currency || 'EUR';
    const tRepair = useTranslations('repair');

    // Format schedule date/time for display
    const formatScheduleDisplay = (scheduleString) => {
        if (!scheduleString) return null;
        
        try {
            // Schedule format is "YYYY-MM-DD HH:MM"
            const [datePart, timePart] = scheduleString.split(' ');
            if (!datePart || !timePart) return null;
            
            // Format date from YYYY-MM-DD to DD-MM-YYYY
            const [year, month, day] = datePart.split('-');
            const formattedDate = `${day}-${month}-${year}`;
            
            // Format time from HH:MM (24h) to HH:MM AM/PM (12h)
            const [hours, minutes] = timePart.split(':');
            const hour24 = parseInt(hours, 10);
            const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
            const ampm = hour24 >= 12 ? 'PM' : 'AM';
            const formattedTime = `${hour12.toString().padStart(2, '0')}:${minutes}${ampm}`;
            
            return { date: formattedDate, time: formattedTime, full: `${formattedDate} at ${formattedTime}` };
        } catch (e) {
            console.error('Error formatting schedule:', e);
            return null;
        }
    };

    const scheduleDisplay = bookingPayment?.schedule ? formatScheduleDisplay(bookingPayment.schedule) : null;

    if (isLoading) {
        return (
            <PageTransition>
                <div className="min-h-screen relative overflow-hidden bg-primary">
                    <div className="container mx-auto px-4 py-8">
                        <div className="bg-gradient-to-br from-gray-100/40 to-gray-300/40 backdrop-blur-sm rounded-xl shadow-lg border border-gray-600/20 p-8 mb-8">
                            <Skeleton className="h-8 w-64 mb-6 bg-gray-200" />
                            <Skeleton className="h-6 w-40 mb-4 bg-gray-200" />
                            <Skeleton className="h-10 w-48 bg-gray-200" />
                        </div>
                    </div>
                </div>
            </PageTransition>
        );
    }

    if (!bookingPayment) {
        return (
            <PageTransition>
                <div className="min-h-screen relative overflow-hidden bg-primary">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center bg-gradient-to-br from-gray-100/40 to-gray-300/40 backdrop-blur-sm rounded-xl shadow-lg border border-gray-600/20 p-8">
                            <h2 className="text-2xl font-bold text-secondary mb-4">{t('noBookingDetails')}</h2>
                            <p className="text-gray-600 mb-6">{t('startFromFlow')}</p>
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
                    <MotionFade delay={0.1} immediate={true}>
                        <div className="bg-gradient-to-br from-gray-100/40 to-gray-300/40 backdrop-blur-sm rounded-xl shadow-lg border border-gray-600/20 p-8 mb-8">
                            <h2 className="text-2xl font-bold text-secondary mb-6">{t('title')}</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-lg border p-4">
                                        <h3 className="text-lg font-semibold text-secondary mb-3">{t('details')}</h3>
                                        <div className="text-gray-600 text-sm space-y-2">
                                            <div><span className="font-medium text-secondary">{t('type')}:</span> {bookingPayment.type}</div>
                                            {bookingPayment.display?.phone_model && (
                                                <div><span className="font-medium text-secondary">{t('model')}:</span> {bookingPayment.display.phone_model}</div>
                                            )}
                                            {bookingPayment.display?.brand && (
                                                <div><span className="font-medium text-secondary">{t('brand')}:</span> {bookingPayment.display.brand}</div>
                                            )}
                                            {/* Schedule - Only show for repair type bookings */}
                                            {bookingPayment.type === 'repair' && scheduleDisplay && (
                                                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                                            <Calendar className="w-4 h-4 text-yellow-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                                                {tRepair('selectedSchedule')}
                                                            </p>
                                                            <p className="text-sm font-semibold text-secondary">
                                                                {scheduleDisplay.full}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {Array.isArray(bookingPayment.items) && bookingPayment.items.length > 0 && (
                                        <div className="bg-white rounded-lg border p-4">
                                            <h3 className="text-lg font-semibold text-secondary mb-3">{t('items')}</h3>
                                            <div className="space-y-2">
                                                {bookingPayment.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                                                        <div className="text-secondary">
                                                            <div className="font-medium">{item.problem_name || item.name || `Item ${idx + 1}`}</div>
                                                            {item.part_type && (
                                                                <div className="text-xs text-gray-600">Part Type: {item.part_type}</div>
                                                            )}
                                                            {item.quantity && item.price && (
                                                                <div className="text-xs text-gray-600">{currency} {parseFloat(item.price).toFixed(2)} × {parseInt(item.quantity)}</div>
                                                            )}
                                                        </div>
                                                        <div className="text-secondary font-semibold">
                                                            {(() => {
                                                                const unit = parseFloat(item.price || item.final_price || 0);
                                                                const qty = parseInt(item.quantity || 1);
                                                                const line = item.final_price ? parseFloat(item.final_price) : unit * qty;
                                                                return `${currency} ${line.toFixed(2)}`;
                                                            })()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-lg border border-gray-300 p-6 sticky top-8">
                                        <h3 className="text-lg font-semibold text-secondary mb-4">{t('orderSummary')}</h3>
                                        <div className="space-y-3 mb-6 text-gray-600">
                                            <div className="flex justify-between">
                                                <span>{t('subtotal')}</span>
                                                <span className="text-secondary">{(bookingPayment.summary?.subtotal ?? bookingPayment.amount ?? 0).toFixed(2)}</span>
                                            </div>
                                            {bookingPayment.summary?.itemDiscount > 0 && (
                                                <div className="flex justify-between text-secondary">
                                                    <span>{t('itemDiscount')}</span>
                                                    <span>-{bookingPayment.summary.itemDiscount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            {bookingPayment.summary?.websiteDiscount > 0 && (
                                                <div className="flex justify-between text-secondary">
                                                    <span>{t('websiteDiscount')}</span>
                                                    <span>-{bookingPayment.summary.websiteDiscount.toFixed(2)}</span>
                                                </div>
                                            )}
                                           
                                                <div className="flex justify-between text-secondary">
                                                    <span>{t('vat')}</span>
                                                    <span>20%</span>
                                                </div>
                                          
                                            <div className="border-t border-gray-300 pt-3">
                                                <div className="flex justify-between text-lg font-bold text-secondary">
                                                    <span>{t('total')}</span>
                                                    <span>{currency} {amount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {clientSecret && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
                                            <Elements 
                                                stripe={stripePromise} 
                                                options={{ 
                                                    clientSecret,
                                                    appearance: { 
                                                        theme: 'flat',
                                                        variables: {
                                                            colorPrimary: '#000',
                                                            colorBackground: '#fff',
                                                            colorText: '#000',
                                                            colorDanger: '#df1b41',
                                                            fontFamily: 'system-ui, sans-serif',
                                                            spacingUnit: '4px',
                                                            borderRadius: '8px',
                                                        }
                                                    },
                                                    locale: 'en',
                                                }}
                                            >
                                                <CheckoutForm 
                                                    clientSecret={clientSecret} 
                                                    amount={amount} 
                                                    currency={currency}
                                                    bookingPayment={bookingPayment}
                                                />
                                            </Elements>
                                        ) : (
                                            <CustomButton disabled className="w-full bg-secondary text-primary/60 py-3 opacity-60">Loading Payment</CustomButton>
                                        )}
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


