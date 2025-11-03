'use client';
import React, { useEffect, useMemo, useState } from 'react';
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
import { Calendar, Clock } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ clientSecret, amount, currency, bookingPayment }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

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

                // Small delay to show the toast before redirecting
                setTimeout(() => {
                    router.push('/orders');
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
            <PaymentElement options={{ layout: 'tabs' }} />
            {message && <div className="text-sm text-accent/80">{message}</div>}
            <CustomButton disabled={!stripe || submitting} type="submit" className="w-full bg-secondary text-primary hover:bg-secondary/90 py-3">
                {submitting ? 'Processing…' : `Pay ${currency} ${amount.toFixed(2)}`}
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
            // Prefer encrypted 'bkp'
            const enc = sessionStorage.getItem('bkp') || localStorage.getItem('bkp');
            if (enc) {
                const parsed = decryptBkp(enc);
                if (parsed) {
                    setBookingPayment(parsed);
                    setClientSecret(parsed.client_secret || null);
                }
            } else {
                // Backward compat
                const stored = localStorage.getItem('bookingPayment') || sessionStorage.getItem('bookingPayment');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setBookingPayment(parsed);
                    setClientSecret(parsed.client_secret || null);
                }
            }
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
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 p-8 mb-8">
                            <Skeleton className="h-8 w-64 mb-6 bg-white/10" />
                            <Skeleton className="h-6 w-40 mb-4 bg-white/10" />
                            <Skeleton className="h-10 w-48 bg-white/10" />
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
                        <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 p-8">
                            <h2 className="text-2xl font-bold text-secondary mb-4">{t('noBookingDetails')}</h2>
                            <p className="text-accent/80 mb-6">{t('startFromFlow')}</p>
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
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 p-8 mb-8">
                            <h2 className="text-2xl font-bold text-secondary mb-6">{t('title')}</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-accent mb-3">{t('details')}</h3>
                                        <div className="text-accent/80 text-sm space-y-2">
                                            <div><span className="font-medium text-accent">{t('type')}:</span> {bookingPayment.type}</div>
                                            {bookingPayment.display?.phone_model && (
                                                <div><span className="font-medium text-accent">{t('model')}:</span> {bookingPayment.display.phone_model}</div>
                                            )}
                                            {bookingPayment.display?.brand && (
                                                <div><span className="font-medium text-accent">{t('brand')}:</span> {bookingPayment.display.brand}</div>
                                            )}
                                            {/* Schedule - Only show for repair type bookings */}
                                            {bookingPayment.type === 'repair' && scheduleDisplay && (
                                                <div className="mt-4 p-3 bg-secondary/10 backdrop-blur-sm rounded-lg border border-secondary/20">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                                            <Calendar className="w-4 h-4 text-secondary" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs text-accent/60 uppercase tracking-wide mb-1">
                                                                {tRepair('selectedSchedule')}
                                                            </p>
                                                            <p className="text-sm font-semibold text-accent">
                                                                {scheduleDisplay.full}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {Array.isArray(bookingPayment.items) && bookingPayment.items.length > 0 && (
                                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-accent mb-3">{t('items')}</h3>
                                            <div className="space-y-2">
                                                {bookingPayment.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded">
                                                        <div className="text-accent">
                                                            <div className="font-medium">{item.problem_name || item.name || `Item ${idx + 1}`}</div>
                                                            {item.part_type && (
                                                                <div className="text-xs text-accent/70">Part Type: {item.part_type}</div>
                                                            )}
                                                            {item.quantity && item.price && (
                                                                <div className="text-xs text-accent/70">{currency} {parseFloat(item.price).toFixed(2)} × {parseInt(item.quantity)}</div>
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
                                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-accent/20 sticky top-8">
                                        <h3 className="text-lg font-semibold text-accent mb-4">{t('orderSummary')}</h3>
                                        <div className="space-y-3 mb-6 text-accent">
                                            <div className="flex justify-between">
                                                <span>{t('subtotal')}</span>
                                                <span>{(bookingPayment.summary?.subtotal ?? bookingPayment.amount ?? 0).toFixed(2)}</span>
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
                                            {bookingPayment.summary?.shippingCost > 0 && (
                                                <div className="flex justify-between text-secondary">
                                                    <span>{t('shippingCost')}</span>
                                                    <span>{bookingPayment.summary.shippingCost.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="border-t border-accent/20 pt-3">
                                                <div className="flex justify-between text-lg font-bold text-secondary">
                                                    <span>{t('total')}</span>
                                                    <span>{currency} {amount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {clientSecret && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
                                            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
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


