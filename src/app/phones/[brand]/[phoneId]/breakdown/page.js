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

export default function PhoneBreakdownPage({ params }) {
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
        setError('Failed to calculate price');
        console.error('Price calculation error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    calc();
  }, [phoneId, phone?.id, quantity, selectedColor]);

  const unitPrice = parseFloat(phone?.final_price || '0');
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
        phone_model_id: parseInt(phoneId),
        quantity: quantity,
        customer_name: user?.name || user?.username || 'Customer',
        customer_email: user?.email || '',
        customer_phone: user?.phone || '01788175088',
        color_id: selectedColor?.id || null,
        shipping_address: phone?.shipping_address || 'a',
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
          itemDiscount,
          priceAfterItemDiscount,
          websiteDiscount,
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
      setError('Failed to create phone order. Please try again.');
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
            Phone not found.
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
                  { label: 'Phones', href: '/phones', icon: Smartphone },
                  { label: brand.charAt(0).toUpperCase() + brand.slice(1), href: `/phones/${brand}`, icon: Smartphone },
                  { label: phone.name || 'Phone', href: `/phones/${brand}/${phoneId}`, icon: Smartphone },
                  { label: 'Breakdown', icon: Settings }
                ]}
                className="mb-6"
              />

              <h2 className="text-2xl font-bold text-secondary mb-6">Order Breakdown</h2>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mr-4">
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
                          width={48} 
                          height={48} 
                          className="rounded"
                        />
                      );
                    })()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-accent">{phone.name || phone.title}</h3>
                    <p className="text-accent/80">{phone.brand_name || brand}</p>
                    {selectedColor && (
                      <p className="text-accent/80">Color: {typeof selectedColor === 'string' ? selectedColor : selectedColor.name}</p>
                    )}
                    <p className="text-accent/80">Quantity: {quantity}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">{error}</div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-accent mb-4">Selected Items</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm rounded-lg">
                    <div>
                      <h4 className="font-medium text-accent">{phone.name || phone.title}</h4>
                      <p className="text-sm text-accent/80">Unit Price: <span className="font-medium">{unitPrice.toFixed(2)}</span></p>
                      <p className="text-sm text-accent/80">Quantity: <span className="font-medium">{quantity}</span></p>
                      {selectedColor && (
                        <p className="text-sm text-accent/80">Color: <span className="font-medium">{typeof selectedColor === 'string' ? selectedColor : selectedColor.name}</span></p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-secondary">{(unitPrice * quantity).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-accent/20 pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-accent/80">Subtotal:</span>
                    <span className="font-medium text-accent">{subtotal.toFixed(2)}</span>
                  </div>
                  {itemDiscount > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Item Discount:</span>
                      <span>-{itemDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-accent/80">Price after item discount:</span>
                    <span className="font-medium text-accent">{priceAfterItemDiscount.toFixed(2)}</span>
                  </div>
                  {websiteDiscount > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Website Discount:</span>
                      <span>-{websiteDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {shippingCost > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Shipping Cost:</span>
                      <span>{shippingCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-accent/20 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-accent">Total Amount:</span>
                      <span className="text-secondary">{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="text-center text-secondary font-medium">
                      You saved {totalDiscount.toFixed(2)}!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </MotionFade>

          <MotionFade delay={0.2} immediate={true}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CustomButton onClick={handleBack} className="bg-accent/20 text-accent hover:bg-accent/30 px-8 py-3">
                ← Back to Product
              </CustomButton>
              <CustomButton onClick={handleProceedToBooking} className="bg-secondary text-primary hover:bg-secondary/90 px-8 py-3">
                Proceed to Booking →
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

