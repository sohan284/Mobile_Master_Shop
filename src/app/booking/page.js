'use client';
import React, { useEffect, useMemo, useState } from 'react';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import { CustomButton } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { apiFetcher } from '@/lib/api';
import { decryptBkp } from '@/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ clientSecret, orderId, amount, currency, paymentIntentId }) {
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

        const confirmedIntentId = paymentIntent?.id || paymentIntentId;
        try {
            if (orderId && confirmedIntentId) {
                await apiFetcher.post(`/api/repair/orders/${orderId}/confirm_payment/`, {
                    payment_intent_id: confirmedIntentId
                });
                setMessage('Payment confirmed successfully.');
                sessionStorage.removeItem('bkp');
                router.push('/orders');
            } else {
                setMessage('Missing order ID or payment intent ID.');
            }
        } catch (err) {
            setMessage('Payment confirmed with Stripe, but backend confirmation failed.');
        }

        setSubmitting(false);
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
    const orderId = bookingPayment?.orderId;
    const paymentIntentId = bookingPayment?.payment_intent_id;

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
                            <h2 className="text-2xl font-bold text-secondary mb-4">No booking details found</h2>
                            <p className="text-accent/80 mb-6">Please start from a product or repair flow again.</p>
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
                            <h2 className="text-2xl font-bold text-secondary mb-6">Booking & Payment</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-accent mb-3">Details</h3>
                                        <div className="text-accent/80 text-sm">
                                            <div><span className="font-medium text-accent">Type:</span> {bookingPayment.type}</div>
                                            {bookingPayment.display?.phone_model && (
                                                <div><span className="font-medium text-accent">Model:</span> {bookingPayment.display.phone_model}</div>
                                            )}
                                            {bookingPayment.display?.brand && (
                                                <div><span className="font-medium text-accent">Brand:</span> {bookingPayment.display.brand}</div>
                                            )}
                                        </div>
                                    </div>

                                    {Array.isArray(bookingPayment.items) && bookingPayment.items.length > 0 && (
                                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-accent mb-3">Items</h3>
                                            <div className="space-y-2">
                                                {bookingPayment.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded">
                                                        <div className="text-accent">
                                                            <div className="font-medium">{item.problem_name || item.name || `Item ${idx + 1}`}</div>
                                                            {item.part_type && (
                                                                <div className="text-xs text-accent/70">Part Type: {item.part_type}</div>
                                                            )}
                                                        </div>
                                                        <div className="text-secondary font-semibold">
                                                            {(parseFloat(item.final_price || item.price || 0)).toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="lg:col-span-1">
                                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-accent/20 sticky top-8">
                                        <h3 className="text-lg font-semibold text-accent mb-4">Order Summary</h3>
                                        <div className="space-y-3 mb-6 text-accent">
                                            <div className="flex justify-between">
                                                <span>Subtotal</span>
                                                <span>{(bookingPayment.summary?.subtotal ?? bookingPayment.amount ?? 0).toFixed(2)}</span>
                                            </div>
                                            {bookingPayment.summary?.itemDiscount > 0 && (
                                                <div className="flex justify-between text-secondary">
                                                    <span>Item Discount</span>
                                                    <span>-{bookingPayment.summary.itemDiscount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            {bookingPayment.summary?.websiteDiscount > 0 && (
                                                <div className="flex justify-between text-secondary">
                                                    <span>Website Discount</span>
                                                    <span>-{bookingPayment.summary.websiteDiscount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="border-t border-accent/20 pt-3">
                                                <div className="flex justify-between text-lg font-bold text-secondary">
                                                    <span>Total</span>
                                                    <span>{currency} {amount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {clientSecret && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
                                            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                                                <CheckoutForm clientSecret={clientSecret} orderId={orderId} amount={amount} currency={currency} paymentIntentId={paymentIntentId} />
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


