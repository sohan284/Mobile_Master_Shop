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
import { Home, ShoppingCart, Settings, User, Mail, Phone } from 'lucide-react';
import { apiFetcher } from '@/lib/api';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function AccessoryBreakdownPage({ params }) {
  const t = useTranslations('accessories');
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [accessory, setAccessory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryAddressError, setDeliveryAddressError] = useState('');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [customerFormError, setCustomerFormError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = sessionStorage.getItem('selectedAccessory');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && String(parsed.id) === String(id)) {
          setAccessory(parsed);
          setDeliveryAddress(parsed.deliveryAddress || parsed.address || '');
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
    // Validate delivery address
    if (!deliveryAddress.trim()) {
      setDeliveryAddressError('Delivery address is required');
      return;
    }
    setDeliveryAddressError('');

    // Check if user is logged in, if not show customer form
    if (!isAuthenticated()) {
      setShowCustomerForm(true);
      return;
    }

    await createOrder();
  };

  const createOrder = async () => {
    try {
      // Get customer info from user or form
      const customerName = user?.name || user?.username || customerInfo.username || 'Customer';
      const customerEmail = user?.email || customerInfo.email || '';
      const customerPhone = user?.phone || customerInfo.phone || '01788175088';

      const body = {
        product_id: parseInt(id),
        quantity: quantity,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        address: deliveryAddress || '',
        shipping_address: accessory?.shipping_address || deliveryAddress || 'a',
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
        <div className="container mx-auto px-4 py-16">
          <MotionFade delay={0.1} immediate={true}>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 p-5 mb-4">
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/', icon: Home },
                  { label: 'Accessories', href: '/accessories', icon: ShoppingCart },
                  { label: accessory.title || 'Accessory', href: `/accessories/${id}`, icon: ShoppingCart },
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
                        <Image src={accessory.picture || '/Accessories.png'} alt={accessory.title} width={40} height={40} className="rounded" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-accent truncate">{accessory.title}</h3>
                        <p className="text-xs text-accent/80">{t('quantity')}: {quantity}</p>
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
                        <h4 className="font-medium text-sm text-accent">{accessory.title}</h4>
                        <div className="flex gap-3 mt-1 text-xs text-accent/80">
                          <span>{t('unitPrice')}: <span className="font-medium">€{unitPrice.toFixed(2)}</span></span>
                          <span>•</span>
                          <span>{t('quantity')}: <span className="font-medium">{quantity}</span></span>
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
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value);
                        if (deliveryAddressError && e.target.value.trim()) {
                          setDeliveryAddressError('');
                        }
                      }}
                      placeholder={t('enterDeliveryAddress') || 'Enter your delivery address'}
                      className={`w-full bg-white/10 backdrop-blur-sm border-2 ${
                        deliveryAddressError 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-accent/30 focus:border-secondary'
                      } text-accent placeholder:text-accent/50 focus:ring-secondary/50 focus:ring-2 h-10 text-sm transition-all duration-200 hover:bg-white/15 hover:border-accent/50 px-3 py-2 rounded-lg`}
                      required
                    />
                    {deliveryAddressError && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <span>⚠️</span>
                        {deliveryAddressError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column - Price Summary */}
                <div className="md:col-span-1">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-accent/20 sticky top-4">
                    <h3 className="text-sm font-semibold text-accent mb-3">{t('priceSummary') || 'Price Summary'}</h3>
                    <div className="space-y-2 text-sm">
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
                      {totalDiscount > 0 && itemDiscount === 0 && (
                        <div className="flex justify-between text-secondary">
                          <span>{t('itemDiscount')}:</span>
                          <span>-€{totalDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      
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
                  <MotionFade delay={0.2} immediate={true}>
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
          </MotionFade>
                </div>
              </div>
            </div>
          </MotionFade>

        
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
                  // Validate delivery address before proceeding
                  if (!deliveryAddress.trim()) {
                    setDeliveryAddressError('Delivery address is required');
                    setShowCustomerForm(false);
                    return;
                  }
                  
                  if (validateCustomerForm()) {
                    setShowCustomerForm(false);
                    setDeliveryAddressError('');
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


