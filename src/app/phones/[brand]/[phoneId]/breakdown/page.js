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
import { Home, Smartphone, Settings } from 'lucide-react';
import { apiFetcher } from '@/lib/api';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PhoneBreakdownPage({ params }) {
  const t = useTranslations('phones');
  const { brand, phoneId } = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [phone, setPhone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = sessionStorage.getItem('selectedPhone');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && String(parsed.id) === String(phoneId)) {
          setPhone(parsed);
          setSelectedColor(parsed.selectedColor || parsed.color || null);
          setQuantity(parsed.quantity || 1);
          setDeliveryAddress(parsed.deliveryAddress || parsed.address || '');
        }
      } catch {}
    }
    setIsLoading(false);
  }, [phoneId]);
console.log(selectedColor);

  // Calculate price from API
  useEffect(() => {
    const calc = async () => {
      if (!phone?.id) return;
      setIsLoading(true);
      setError('');
      try {
        const body = {
          phone_model_id: parseInt(phoneId),
          quantity: quantity,
          color_id: selectedColor?.id || null,
        };
        const res = await apiFetcher.post('/api/brandnew/orders/calculate_price/', body);
        const data = res?.data || res;
        setPriceData(data);
      } catch (e) {
        setError(t('failedToCalculatePrice'));
        console.error('Price calculation error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    calc();
  }, [phoneId, phone?.id, quantity, selectedColor, t]);

  // Use API response directly - don't calculate from frontend
  const unitPrice = priceData?.unit_price ? parseFloat(priceData.unit_price) : parseFloat(phone?.final_price || '0');
  const subtotal = priceData?.subtotal ? parseFloat(priceData.subtotal) : 0;
  const discountPercentage = priceData?.discount_percentage ? parseFloat(priceData.discount_percentage) : 0;
  const discountAmount = priceData?.discount_amount ? parseFloat(priceData.discount_amount) : 0;
  const totalDiscount = priceData?.total_discount ? parseFloat(priceData.total_discount) : 0;
  const shippingCost = priceData?.shipping_cost ? parseFloat(priceData.shipping_cost) : 0;
  const totalAmount = priceData?.total_amount ? parseFloat(priceData.total_amount) : 0;

  const handleBack = () => router.back();

  const handleProceedToBooking = async () => {
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }

    try {
      const body = {
        phone_model_id: parseInt(phoneId),
        quantity: quantity,
        customer_name: user?.name || user?.username || 'Customer',
        customer_email: user?.email || '',
        customer_phone: user?.phone || '01788175088',
        color_id: selectedColor?.id || null,
        address: deliveryAddress || '',
        shipping_address: phone?.shipping_address || deliveryAddress || 'a',
        city: phone?.city || 'a',
        postal_code: phone?.postal_code || 'aa',
        country: phone?.country || 'a',
        notes: phone?.notes || ''
      };

      const res = await apiFetcher.post('/api/brandnew/orders/', body);
      const order = res?.data || res;

      const payload = {
        type: 'phone',
        amount: totalAmount,
        currency: 'EUR',
        context: { brand, phoneId },
        items: [
          {
            name: phone?.name || phone?.title,
            quantity,
            price: unitPrice,
          }
        ],
        orderId: order?.order?.id,
        payment_intent_id: order?.payment?.payment_intent_id || order?.payment_intent || null,
        client_secret: order?.payment?.client_secret || order?.payment_intent_client_secret || null,
        summary: {
          subtotal,
          discountPercentage,
          discountAmount,
          totalDiscount,
          shippingCost
        },
        display: {
          phone_model: phone?.name || phone?.title,
          brand: phone?.brand_name || brand
        }
      };
      const enc = encryptBkp(payload);
      if (enc) sessionStorage.setItem('bkp', enc);
      router.push('/booking');
    } catch (e) {
      setError(t('failedToCreateOrder'));
      console.error('Order creation error:', e);
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

  if (!phone) {
    return (
      <PageTransition>
        <div className="min-h-screen relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 py-8 text-center text-accent/80">
            {t('phoneNotFoundError')}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden bg-primary">
        <div className="container mx-auto px-4 py-4">
          <MotionFade delay={0.1} immediate={true}>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 p-5 mb-4">
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/', icon: Home },
                  { label: 'Phones', href: '/phones', icon: Smartphone },
                  { label: brand.charAt(0).toUpperCase() + brand.slice(1), href: `/phones/${brand}`, icon: Smartphone },
                  { label: phone.name || t('phoneNotFound'), href: `/phones/${brand}/${phoneId}`, icon: Smartphone },
                  { label: 'Breakdown', icon: Settings }
                ]}
                className="mb-3"
              />

              <h2 className="text-xl font-bold text-secondary mb-4">{t('orderBreakdown')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Left Column - Product Info & Selected Items */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        {(() => {
                          const imageSrc = phone.icon || phone.picture || `/SAMSUNG_GalaxyS23Ultra.png`;
                          const getImageSrc = (src) => {
                            if (!src) return '/SAMSUNG_GalaxyS23Ultra.png';
                            if (src.startsWith('http')) return src;
                            return src.startsWith('/') ? src : `/${src}`;
                          };
                          return (
                            <Image 
                              src={getImageSrc(imageSrc)} 
                              alt={phone.name || phone.title} 
                              width={40} 
                              height={40} 
                              className="rounded"
                            />
                          );
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-accent truncate">{phone.name || phone.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-accent/80">
                          <span>{phone.brand_name || brand}</span>
                          {selectedColor && (
                            <>
                              <span>•</span>
                              <span>{t('color')}: {typeof selectedColor === 'string' ? selectedColor : selectedColor.name}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{t('quantity')}: {quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 text-red-400 text-sm">{error}</div>
                  )}

                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-accent mb-2">{t('selectedItems')}</h3>
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-accent">{phone.name || phone.title}</h4>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-accent/80">
                          <span>{t('unitPrice')}: <span className="font-medium">€{unitPrice.toFixed(2)}</span></span>
                          <span>•</span>
                          <span>{t('quantity')}: <span className="font-medium">{quantity}</span></span>
                          {selectedColor && (
                            <>
                              <span>•</span>
                              <span>{t('color')}: <span className="font-medium">{typeof selectedColor === 'string' ? selectedColor : selectedColor.name}</span></span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-secondary">€{subtotal.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
                    <Label 
                      htmlFor="deliveryAddress" 
                      className="text-accent text-sm font-semibold mb-2 block"
                    >
                      {t('deliveryAddress') || 'Delivery Address'} *
                    </Label>
                    <Input
                      id="deliveryAddress"
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder={t('enterDeliveryAddress') || 'Enter your delivery address'}
                      className="w-full bg-white/10 backdrop-blur-sm border-2 border-accent/30 text-accent placeholder:text-accent/50 focus:border-secondary focus:ring-secondary/50 focus:ring-2 h-10 text-sm transition-all duration-200 hover:bg-white/15 hover:border-accent/50 px-3 py-2 rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Right Column - Price Summary */}
                <div className="md:col-span-1">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-accent/20 sticky top-4">
                    <h3 className="text-sm font-semibold text-accent mb-3">{t('priceSummary')}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-accent/80">{t('subtotal')}:</span>
                        <span className="font-medium text-accent">€{subtotal.toFixed(2)}</span>
                      </div>
                      
                      {discountPercentage > 0 && (
                        <div className="flex justify-between text-secondary">
                          <span>{t('discount')} ({discountPercentage.toFixed(2)}%):</span>
                          <span>-€{totalDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-secondary">
                          <span>{t('discount')}:</span>
                          <span>-€{discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      {totalDiscount > 0 && discountAmount === 0 && discountPercentage === 0 && (
                        <div className="flex justify-between text-secondary">
                          <span>{t('discount')}:</span>
                          <span>-€{totalDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-accent/80">{t('shippingCost')}:</span>
                        <span className="font-medium text-accent">€{shippingCost.toFixed(2)}</span>
                      </div>
                      
                      <div className="border-t border-accent/20 pt-2 mt-2">
                        <div className="flex justify-between text-base font-bold">
                          <span className="text-accent">{t('totalAmount')}:</span>
                          <span className="text-secondary">€{totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {totalDiscount > 0 && (
                        <div className="text-center text-secondary font-medium text-xs pt-1">
                          {t('youSaved', { amount: totalDiscount.toFixed(2) })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <CustomButton onClick={handleBack} className="bg-accent/20 text-accent hover:bg-accent/30 px-6 py-2 text-sm">
                {t('backToProduct')}
              </CustomButton>
              <CustomButton 
                onClick={handleProceedToBooking} 
                disabled={!deliveryAddress.trim()}
                className="bg-secondary text-primary hover:bg-secondary/90 px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary"
              >
                {t('proceedToBooking')}
              </CustomButton>
            </div>
                </div>
              </div>
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

