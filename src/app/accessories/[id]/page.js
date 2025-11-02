"use client"
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PageTransition from "@/components/animations/PageTransition";
import MotionFade from "@/components/animations/MotionFade";
import { useApiGet } from "@/hooks/useApi";
import { apiFetcher } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomButton } from "@/components/ui/button";
import ReviewsSection from '@/components/common/ReviewsSection';
import { useTranslations } from 'next-intl';

export default function AccessoryDetailsPage() {
  const t = useTranslations('accessories');
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  // Helper function to get initial quantity from sessionStorage
  const getInitialQuantity = () => {
    if (typeof window === 'undefined' || !id) return 1;
    try {
      const raw = sessionStorage.getItem('selectedAccessory');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && String(parsed.id) === String(id) && parsed.quantity && parsed.quantity > 0) {
          return parsed.quantity;
        }
      }
    } catch {}
    return 1;
  };

  const [sessionItem, setSessionItem] = useState(null);
  const [quantity, setQuantity] = useState(() => getInitialQuantity());
  
  // Fetch reviews
  const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews } = useApiGet(
    ['accessory-reviews', id],
    () => apiFetcher.get(`/api/accessories/review/?product_id=${id}`),
    { enabled: !!id }
  );
  
  // Filter reviews by product_id
  const reviews = useMemo(() => {
    const allReviews = reviewsData?.data || reviewsData?.results || [];
    return allReviews.filter(review => 
      String(review.product) === String(id)
    );
  }, [reviewsData, id]);
  console.log(reviews);

  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      const raw = sessionStorage.getItem('selectedAccessory');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && String(parsed.id) === String(id)) {
            setSessionItem(parsed);
            if (parsed.quantity && parsed.quantity > 0) {
              setQuantity(parsed.quantity);
            }
          }
        } catch {}
      }
    }
  }, [id]);

  const { data: apiResponse, isLoading } = useApiGet(
    ['accessory', id],
    () => apiFetcher.get(`/api/accessories/products/${id}/`),
    { enabled: !sessionItem && !!id }
  );

  const accessory = useMemo(() => {
    return sessionItem || apiResponse?.data || null;
  }, [sessionItem, apiResponse?.data]);

  const maxQty = typeof accessory?.stock_quantity === 'number' && accessory.stock_quantity > 0
    ? accessory.stock_quantity
    : 99;

  const inc = () => setQuantity((q) => Math.min(maxQty, q + 1));
  const dec = () => setQuantity((q) => Math.max(1, q - 1));

  useEffect(() => {
    if (!accessory) return;
    try {
      const payload = { ...(accessory || {}), quantity };
      sessionStorage.setItem('selectedAccessory', JSON.stringify(payload));
    } catch {}
  }, [quantity, accessory]);


  return (
    <PageTransition>
      <div className="min-h-screen bg-primary text-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-accent hover:text-secondary transition-colors cursor-pointer"
            >
              {t('back')}
            </button>
          </div>

          {isLoading && !accessory && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Skeleton className="w-full h-80" />
              </div>
              <div className="space-y-4">
                <Skeleton className="w-64 h-8" />
                <Skeleton className="w-96 h-4" />
                <Skeleton className="w-80 h-4" />
                <Skeleton className="w-40 h-10" />
              </div>
            </div>
          )}

          {accessory && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 overflow-hidden">
                  <div className="p-8">
                    <div className="bg-white/5 rounded-xl p-6">
                      <Image
                        src={accessory.picture || '/Accessories.png'}
                        alt={accessory.title}
                        width={560}
                        height={560}
                        className="w-full h-96 object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-secondary">
                    {accessory.title}
                  </h1>
                  {accessory.subtitle && (
                    <p className="text-accent/80">{accessory.subtitle}</p>
                  )}

                  <div className="mt-2">
                    <p className="text-lg text-accent/80 flex items-center gap-3">
                      {accessory.discount_percentage && parseFloat(accessory.discount_percentage) > 0 && (
                        <span className="text-xs text-green-500">
                          {parseFloat(accessory.discount_percentage).toFixed(1)}% off
                        </span>
                      )}
                      <span className="text-3xl font-extrabold text-secondary">
                        €{parseFloat(accessory.final_price).toLocaleString()}
                      </span>
                      {accessory.discounted_amount && accessory.discounted_amount !== accessory.main_amount && (
                        <span className="text-sm text-accent/60 line-through">
                          €{parseFloat(accessory.main_amount).toLocaleString()}
                        </span>
                      )}
                    </p>
                    <div className="text-accent/80 text-sm mt-1">
                        {t('total')}: <span className="font-semibold text-secondary">€{(parseFloat(accessory.final_price || 0) * quantity).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <span className={`px-2 py-1 rounded-full ${accessory.is_in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {accessory.is_in_stock ? t('inStock') : t('outOfStock')}
                    </span>
                    {typeof accessory.stock_quantity === 'number' && (
                      <span className="text-accent/80">{t('qty')}: {accessory.stock_quantity}</span>
                    )}
                  </div>

                 

                  {accessory.description && (
                    <div
                      className="mt-4 text-accent/90 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: accessory.description }}
                    />
                  )}

                  <div className="mt-6 flex flex-col gap-3">
                    <div className="inline-flex items-center gap-3">
                      <button
                        aria-label="Decrease quantity"
                        onClick={dec}
                        className="w-10 h-10 cursor-pointer rounded-full bg-white/10 hover:bg-white/15 text-secondary text-lg"
                      >
                        −
                      </button>
                      <div className="min-w-12 text-center text-secondary font-semibold">
                        {quantity}
                      </div>
                      <button
                        aria-label="Increase quantity"
                        onClick={inc}
                        className="w-10 h-10 cursor-pointer rounded-full bg-white/10 hover:bg-white/15 text-secondary text-lg"
                      >
                        +
                      </button>
                    </div>

                    <CustomButton
                      onClick={() => router.push(`/accessories/${id}/breakdown`)}
                      className="bg-secondary text-primary hover:bg-secondary/90 px-8 py-3"
                    >
                      {t('proceedToCheckout')}
                    </CustomButton>
                  </div>
                </div>
              </div>
          )}

          {!isLoading && !accessory && (
            <div className="text-center text-accent/80 py-24">
              {t('couldNotLoad')}
            </div>
          )}

          {/* Reviews Section */}
          {accessory && (
            <ReviewsSection
              productId={id}
              type="accessory"
              reviews={reviews}
              isLoading={reviewsLoading}
              refetchReviews={refetchReviews}
              showReviewForm={false}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}


