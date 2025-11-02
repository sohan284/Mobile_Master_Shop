'use client';
import React from 'react';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import { CustomButton } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { UserCircle, Mail, User, Shield } from 'lucide-react';

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth();
    const t = useTranslations('profile');

    if (!isAuthenticated()) {
        return (
            <PageTransition>
                <div className="min-h-screen relative overflow-hidden bg-primary">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 p-8">
                            <h2 className="text-2xl font-bold text-secondary mb-4">{t('pleaseLogin')}</h2>
                            <Link href="/login">
                                <CustomButton className="bg-secondary text-primary hover:bg-secondary/90 px-8 py-3">{t('goToLogin')}</CustomButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </PageTransition>
        );
    }

    const getUserInitials = () => {
        if (!user) return 'U';
        const name = user.name || user.username || user.email || 'User';
        return name.charAt(0).toUpperCase();
    };

    const getUserDisplayName = () => {
        if (!user) return 'User';
        return user.name || user.username || user.email || 'User';
    };

    return (
        <PageTransition>
            <div className="min-h-[calc(100vh-64px)] relative overflow-hidden bg-primary mt-10">
                <div className="container mx-auto px-4 py-8">
                    <MotionFade delay={0.1} immediate={true}>
                        <div className=" backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 p-6 max-w-2xl mx-auto">
                            <h2 className="text-2xl font-bold text-secondary mb-6">{t('myProfile')}</h2>

                            <div className="space-y-6">
                                {/* Profile Avatar */}
                                <div className="flex flex-col items-center space-y-4 pb-6 border-b border-accent/20">
                                    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-3xl">
                                        {getUserInitials()}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold text-secondary">{getUserDisplayName()}</h3>
                                        <p className="text-accent/80 capitalize">{user?.role || 'user'}</p>
                                    </div>
                                </div>

                                {/* Profile Information */}
                                <div className="space-y-4">
                                

                                    <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg border border-accent/10">
                                        <Mail className="text-accent mt-1" size={20} />
                                        <div className="flex-1">
                                            <p className="text-accent/60 text-sm mb-1">{t('email')}</p>
                                            <p className="text-accent font-medium">{user?.email || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {user?.name && (
                                        <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg border border-accent/10">
                                            <UserCircle className="text-accent mt-1" size={20} />
                                            <div className="flex-1">
                                                <p className="text-accent/60 text-sm mb-1">{t('fullName')}</p>
                                                <p className="text-accent font-medium">{user.name}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg border border-accent/10">
                                        <Shield className="text-accent mt-1" size={20} />
                                        <div className="flex-1">
                                            <p className="text-accent/60 text-sm mb-1">{t('role')}</p>
                                            <p className="text-accent font-medium capitalize">{user?.role || 'user'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-4 border-t border-accent/20 flex flex-col sm:flex-row gap-4">
                                    <Link href="/orders" className="flex-1">
                                        <CustomButton className="w-full bg-secondary text-primary hover:bg-secondary/90">
                                            {t('viewOrders')}
                                        </CustomButton>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </MotionFade>
                </div>
            </div>
        </PageTransition>
    );
}

