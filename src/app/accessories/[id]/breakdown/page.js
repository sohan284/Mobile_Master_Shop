'use client';
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import { CustomButton } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { encryptBkp } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import { Home, ShoppingCart, Settings } from 'lucide-react';
import { apiFetcher } from '@/lib/api';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function AccessoryBreakdownPage({ params }) {
  const t = useTranslations('accessories');
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [accessory, setAccessory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = sessionStorage.getItem('selectedAccessory');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && String(parsed.id) === String(id)) {
          setAccessory(parsed);
        }
      } catch {}
    }
    setIsLoading(false);
  }, [id]);

  // Calculate price from API
  useEffect(() => {
    const calc = async () => {
      if (!accessory?.id) return;
      setIsLoading(true);
      setError('');
      try {
        const body = {
          product_id: parseInt(id),
          quantity: accessory?.quantity || 1,
        };
        const res = await apiFetcher.post('/api/accessories/orders/calculate_price/', body);
        const data = res?.data || res;
        setPriceData(data);
      } catch (e) {
        setError(t('failedToCalculatePrice'));
      } finally {
        setIsLoading(false);
      }
    };
    calc();
  }, [id, accessory?.quantity, accessory?.id, t]);

  const quantity = accessory?.quantity || 1;
  const unitPrice = parseFloat(accessory?.final_price || '0');
  // Prefer server response if available
  const subtotal = priceData?.subtotal ? parseFloat(priceData.subtotal) : unitPrice * quantity;
  const itemDiscount = priceData?.item_discount ? parseFloat(priceData.item_discount) : 0;
  const priceAfterItemDiscount = priceData?.price_after_item_discount ? parseFloat(priceData.price_after_item_discount) : subtotal;
  const websiteDiscount = priceData?.website_discount ? parseFloat(priceData.website_discount) : 0;
  const totalAmount = priceData?.total_amount ? parseFloat(priceData.total_amount) : priceAfterItemDiscount - websiteDiscount;
  const totalDiscount = priceData?.total_discount ? parseFloat(priceData.total_discount) : (itemDiscount + websiteDiscount);
  const shippingCost = priceData?.shipping_cost ? parseFloat(priceData.shipping_cost) : 0;
  const handleBack = () => router.back();

  const handleProceedToBooking = async () => {
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }

    try {
      const body = {
        product_id: parseInt(id),
        quantity: quantity,
        customer_name: user?.name || user?.username || 'Customer',
        customer_email: user?.email || '',
        customer_phone: user?.phone || '01788175088',
        shipping_address: accessory?.shipping_address || 'a',
        city: accessory?.city || 'a',
        postal_code: accessory?.postal_code || 'aa',
        country: accessory?.country || 'a',
        notes: accessory?.notes || 'a'
      };

      const res = await apiFetcher.post('/api/accessories/orders/', body);
      const order = res?.data || res;

      const payload = {
        type: 'accessory',
        amount: totalAmount,
        currency: 'EUR',
        context: { accessoryId: id },
        items: [
          {
            name: accessory?.title,
            quantity,
            price: unitPrice,
          }
        ],
        orderId: order?.order?.id,
        payment_intent_id: order?.payment?.payment_intent_id || order?.payment_intent || null,
        client_secret: order?.payment?.client_secret || order?.payment_intent_client_secret || null,
        summary: {
          subtotal,
          itemDiscount,
          priceAfterItemDiscount,
          websiteDiscount,
          totalDiscount,
          shippingCost
        },
        display: {
          phone_model: accessory?.title,
          brand: accessory?.brand || 'Accessory'
        }
      };
      const enc = encryptBkp(payload);
      if (enc) sessionStorage.setItem('bkp', enc);
      router.push('/booking');
    } catch (e) {
      setError(t('failedToCreateOrder'));
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    handleProceedToBooking();
  };

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

  if (!accessory) {
    return (
      <PageTransition>
        <div className="min-h-screen relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 py-8 text-center text-accent/80">
            {t('accessoryNotFound')}
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
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/', icon: Home },
                  { label: 'Accessories', href: '/accessories', icon: ShoppingCart },
                    { label: accessory.title || 'Accessory', href: `/accessories/${id}`, icon: ShoppingCart },
                    { label: 'Breakdown', icon: Settings }
                  ]}
                className="mb-6"
              />

              <h2 className="text-2xl font-bold text-secondary mb-6">{t('orderBreakdown')}</h2>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mr-4">
                    {/* <span className="text-2xl">🛒</span>
                     */}
                     <Image src={accessory.picture || '/Accessories.png'} alt={accessory.title} width={48} height={48} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-accent">{accessory.title}</h3>
                    <p className="text-accent/80">{t('quantity')}: {quantity}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">{error}</div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-accent mb-4">{t('selectedItems')}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm rounded-lg">
                    <div>
                      <h4 className="font-medium text-accent">{accessory.title}</h4>
                      <p className="text-sm text-accent/80">{t('unitPrice')}: <span className="font-medium">€{unitPrice.toFixed(2)}</span></p>
                      <p className="text-sm text-accent/80">{t('quantity')}: <span className="font-medium">{quantity}</span></p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-secondary">€{(unitPrice * quantity).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-accent/20 pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-accent/80">{t('subtotal')}:</span>
                    <span className="font-medium text-accent">€{subtotal.toFixed(2)}</span>
                  </div>
                  {itemDiscount > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>{t('itemDiscount')}:</span>
                      <span>-€{itemDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-accent/80">{t('priceAfterItemDiscount')}:</span>
                    <span className="font-medium text-accent">€{priceAfterItemDiscount.toFixed(2)}</span>
                  </div>
                  {websiteDiscount > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>{t('websiteDiscount')}:</span>
                      <span>-€{websiteDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {shippingCost > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>{t('shippingCost')}:</span>
                      <span>€{shippingCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-accent/20 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-accent">{t('totalAmount')}:</span>
                      <span className="text-secondary">€{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="text-center text-secondary font-medium">
                      {t('youSaved', { amount: totalDiscount.toFixed(2) })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </MotionFade>

          <MotionFade delay={0.2} immediate={true}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CustomButton onClick={handleBack} className="bg-accent/20 text-accent hover:bg-accent/30 px-8 py-3">
                {t('backToProduct')}
              </CustomButton>
              <CustomButton onClick={handleProceedToBooking} className="bg-secondary text-primary hover:bg-secondary/90 px-8 py-3">
                {t('proceedToBooking')}
              </CustomButton>
            </div>
          </MotionFade>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        redirectPath={`/booking`}
      />
    </PageTransition>
  );
}


