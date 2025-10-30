'use client';
import React, { useEffect, useState } from 'react';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomButton } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetcher } from '@/lib/api';
import Link from 'next/link';

export default function OrdersPage() {
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            if (!isAuthenticated()) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await apiFetcher.get('/api/repair/orders/');
                const list = res?.data || res || [];
                setOrders(Array.isArray(list) ? list : (list.results || []));
            } catch (e) {
                setError('Failed to load orders');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [isAuthenticated]);

    if (!isAuthenticated()) {
        return (
            <PageTransition>
                <div className="min-h-screen relative overflow-hidden bg-primary">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 p-8">
                            <h2 className="text-2xl font-bold text-secondary mb-4">Please log in to view your orders</h2>
                            <Link href="/login">
                                <CustomButton className="bg-secondary text-primary hover:bg-secondary/90 px-8 py-3">Go to Login</CustomButton>
                            </Link>
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
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 p-6">
                            <h2 className="text-2xl font-bold text-secondary mb-6">My Orders</h2>

                            {isLoading ? (
                                <div className="space-y-3">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="p-4 bg-white/5 rounded-lg border border-accent/10">
                                            <Skeleton className="h-5 w-40 mb-2 bg-white/10" />
                                            <Skeleton className="h-4 w-64 bg-white/10" />
                                        </div>
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="text-accent">{error}</div>
                            ) : orders.length === 0 ? (
                                <div className="text-accent/80">No orders found.</div>
                            ) : (
                                <div className="space-y-3">
                                    {orders.map((order) => (
                                        <div key={order.id} className="p-4 bg-white/5 rounded-lg border border-accent/10 flex items-center justify-between">
                                            <div>
                                                <div className="text-accent font-semibold">Order #{order.id}</div>
                                                <div className="text-accent/80 text-sm">
                                                    {(order.amount || order.total_amount || 0)} {order.currency || 'EUR'} · {order.status || 'pending'}
                                                </div>
                                            </div>
                                            <div className="text-xs text-accent/60">
                                                {order.created_at ? new Date(order.created_at).toLocaleString() : ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </MotionFade>
                </div>
            </div>
        </PageTransition>
    );
}


