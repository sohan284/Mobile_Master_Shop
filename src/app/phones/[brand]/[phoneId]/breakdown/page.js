'use client';
import React, { useEffect, useState, use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import { CustomButton } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { encryptBkp } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Smartphone, Settings, User, Mail, Phone } from 'lucide-react';
import { apiFetcher } from '@/lib/api';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SafeImage from '@/components/ui/SafeImage';

export default function PhoneBreakdownPage({ params }) {
  const t = useTranslations('phones');
  const { brand, phoneId } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [phone, setPhone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
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
    const raw = sessionStorage.getItem('selectedPhone');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && String(parsed.id) === String(phoneId)) {
          setPhone(parsed);
          // Get color name from selectedColor object or string
          const colorName = typeof parsed.color === 'string' 
            ? parsed.color 
            : parsed.selectedColor?.name || parsed.color?.name || parsed.selectedColor || null;
          setSelectedColor(colorName);
          setQuantity(parsed.quantity || 1);
          setDeliveryAddress(parsed.deliveryAddress || parsed.address || '');
        }
      } catch {}
    }
    setIsLoading(false);
  }, [phoneId]);

  // Get stock management array
  const stockManagement = useMemo(() => {
    return phone?.stock_management || [];
  }, [phone?.stock_management]);

  // Find selected stock item based on color name
  const selectedStock = useMemo(() => {
    if (!stockManagement.length || !selectedColor) return null;
    const colorName = typeof selectedColor === 'string' ? selectedColor : selectedColor.name;
    return stockManagement.find((entry) => entry.color_name === colorName) || stockManagement[0];
  }, [stockManagement, selectedColor]);

  // Helper function to get the correct image source
  const getImageSrc = (imageSrc, fallback = '/SAMSUNG_GalaxyS23Ultra.png') => {
    if (!imageSrc) return fallback;
    if (imageSrc.startsWith('http')) return imageSrc;
    return imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
  };

  // Get the phone image from stock_management or fallback
  const phoneImageSrc = useMemo(() => {
    if (selectedStock?.icon_color_based) {
      return getImageSrc(selectedStock.icon_color_based);
    }
    if (phone?.icon) {
      return getImageSrc(phone.icon);
    }
    if (stockManagement[0]?.icon_color_based) {
      return getImageSrc(stockManagement[0].icon_color_based);
    }
    return getImageSrc(phone?.picture);
  }, [selectedStock, phone?.icon, phone?.picture, stockManagement]);

  // Get color name to display
  const displayColorName = useMemo(() => {
    if (selectedStock?.color_name) {
      return selectedStock.color_name;
    }
    if (typeof selectedColor === 'string') {
      return selectedColor;
    }
    if (selectedColor?.name) {
      return selectedColor.name;
    }
    return null;
  }, [selectedStock, selectedColor]);

  // Calculate price from API
  useEffect(() => {
    const calc = async () => {
      if (!phone?.id) return;
      setIsLoading(true);
      setError('');
      try {
        const stockManagementId = selectedStock?.id || null;

        const body = {
          phone_model_id: parseInt(phoneId),
          quantity: quantity,
          color_id: selectedStock?.color_id || null,
          stock_management_id: stockManagementId,
        };
        const res = await apiFetcher.post('/api/brandnew/orders/calculate_price/', body);
        const data = res?.data || res;
        setPriceData(data);
      } catch (e) {
        console.error('Price calculation error:', e);
        // Show detailed error message
        const errorMessage = e?.response?.data?.message || 
                            e?.response?.data?.detail || 
                            e?.message || 
                            t('failedToCalculatePrice');
        setError(errorMessage);
        // Log full error for debugging
        console.error('Full error details:', {
          status: e?.response?.status,
          data: e?.response?.data,
          message: errorMessage
        });
      } finally {
        setIsLoading(false);
      }
    };
    calc();
  }, [phoneId, phone?.id, quantity, selectedStock, t]);

  // Use API response directly - don't calculate from frontend
  const unitPrice = priceData?.unit_price ? parseFloat(priceData.unit_price) : parseFloat(phone?.final_price || '0');
  const subtotal = priceData?.subtotal ? parseFloat(priceData.subtotal) : 0;
  const discountPercentage = priceData?.discount_percentage ? parseFloat(priceData.discount_percentage) : 0;
  const discountAmount = priceData?.discount_amount ? parseFloat(priceData.discount_amount) : 0;
  const totalDiscount = priceData?.total_discount ? parseFloat(priceData.total_discount) : 0;
  const   vat = priceData?.vat ? parseFloat(priceData.vat) : 0;
  const totalAmount = priceData?.total_amount ? parseFloat(priceData.total_amount) : 0;

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
      const stockManagementId = selectedStock?.id || null;
      const body = {
        phone_model_id: parseInt(phoneId),
        quantity: quantity,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        color_id: selectedStock?.color_id || null,
        address: deliveryAddress || '',
        shipping_address: phone?.shipping_address || deliveryAddress || 'a',
        city: phone?.city || 'a',
        postal_code: phone?.postal_code || 'aa',
        country: phone?.country || 'a',
        notes: phone?.notes || '',
        stock_management_id: stockManagementId,
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
          vat
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

  if (!phone) {
    return (
      <PageTransition>
        <div className="min-h-screen relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 py-8 text-center text-gray-600">
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
            <div className="bg-gradient-to-br from-gray-100/40 text-gray-700 to-gray-300/40 backdrop-blur-sm rounded-xl shadow-lg border border-gray-600/20 p-5 mb-4">
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
                  <div className="bg-white rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <SafeImage
                          src={phoneImageSrc}
                          alt={phone.name || phone.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-secondary truncate">{phone.name || phone.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-600">
                          <span>{phone.brand_name || brand}</span>
                          {displayColorName && (
                            <>
                              <span>•</span>
                              <span>{t('color')}: {displayColorName}</span>
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

                  <div className="bg-white rounded-lg border p-3">
                    <h3 className="text-sm font-semibold text-secondary mb-2">{t('selectedItems')}</h3>
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-secondary">{phone.name || phone.title}</h4>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-600">
                          <span>{t('unitPrice')}: <span className="font-medium">€{unitPrice.toFixed(2)}</span></span>
                          <span>•</span>
                          <span>{t('quantity')}: <span className="font-medium">{quantity}</span></span>
                          {displayColorName && (
                            <>
                              <span>•</span>
                              <span>{t('color')}: <span className="font-medium">{displayColorName}</span></span>
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
                  <div className="bg-white rounded-lg border p-3">
                    <Label 
                      htmlFor="deliveryAddress" 
                      className="text-secondary text-sm font-semibold mb-2 block"
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
                      className={`w-full bg-white border-2 ${
                        deliveryAddressError 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-gray-300 focus:border-secondary'
                      } text-secondary placeholder:text-gray-400 focus:ring-secondary/50 focus:ring-2 h-10 text-sm transition-all duration-200 hover:border-gray-400 px-3 py-2 rounded-lg`}
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
                  <div className="bg-white rounded-lg border border-gray-300 p-3 sticky top-4">
                    <h3 className="text-sm font-semibold text-secondary mb-3">{t('priceSummary')}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('subtotal')}:</span>
                        <span className="font-medium text-secondary">€{subtotal.toFixed(2)}</span>
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
                          <span className="text-gray-600">{t('vat') || 'VAT'}:</span>
                          <span className="font-medium text-secondary">20%</span>
                        </div>
                 
                      
                      <div className="border-t border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between text-base font-bold">
                          <span className="text-secondary">{t('totalAmount')}:</span>
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
                  <div className="flex flex-wrap flex-col sm:flex-row gap-3 justify-center mt-10">
              <CustomButton onClick={handleBack} className="bg-gray-200 text-secondary hover:bg-gray-300 px-6 py-2 text-sm">
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

      {/* Customer Information Form Dialog */}
      <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
        <DialogContent className="bg-primary border-gray-300 text-secondary max-w-md">
          <DialogHeader>
            <DialogTitle className="text-secondary">Customer Information</DialogTitle>
            <DialogDescription className="text-gray-600">
              Please provide your contact information to proceed with the order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Username */}
            <div>
              <Label htmlFor="customer-username" className="text-gray-600 text-sm font-medium mb-2 block">
                <User className="w-4 h-4 inline mr-2" />
                Username *
              </Label>
              <Input
                id="customer-username"
                type="text"
                value={customerInfo.username}
                onChange={(e) => setCustomerInfo({ ...customerInfo, username: e.target.value })}
                className="w-full bg-white border-2 border-gray-300 text-secondary placeholder:text-gray-400 focus:border-secondary focus:ring-secondary/50 focus:ring-2 h-10 text-sm"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="customer-email" className="text-gray-600 text-sm font-medium mb-2 block">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </Label>
              <Input
                id="customer-email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="w-full bg-white border-2 border-gray-300 text-secondary placeholder:text-gray-400 focus:border-secondary focus:ring-secondary/50 focus:ring-2 h-10 text-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="customer-phone" className="text-gray-600 text-sm font-medium mb-2 block">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone *
              </Label>
              <Input
                id="customer-phone"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="w-full bg-white border-2 border-gray-300 text-secondary placeholder:text-gray-400 focus:border-secondary focus:ring-secondary/50 focus:ring-2 h-10 text-sm"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {customerFormError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-xs font-medium">{customerFormError}</p>
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
                className="bg-gray-200 text-secondary hover:bg-gray-300 flex-1"
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

