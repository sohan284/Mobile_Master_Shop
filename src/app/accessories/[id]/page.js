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

export default function AccessoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [sessionItem, setSessionItem] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem('selectedAccessory');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && String(parsed.id) === String(id)) {
            setSessionItem(parsed);
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

  return (
    <PageTransition>
      <div className="min-h-screen bg-primary text-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-accent hover:text-secondary transition-colors"
            >
              ← Back
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
                        ${parseFloat(accessory.final_price).toLocaleString()}
                      </span>
                      {accessory.discounted_amount && accessory.discounted_amount !== accessory.main_amount && (
                        <span className="text-sm text-accent/60 line-through">
                          ${parseFloat(accessory.main_amount).toLocaleString()}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <span className={`px-2 py-1 rounded-full ${accessory.is_in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {accessory.is_in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {typeof accessory.stock_quantity === 'number' && (
                      <span className="text-accent/80">Qty: {accessory.stock_quantity}</span>
                    )}
                  </div>

                 

                  {accessory.description && (
                    <div
                      className="mt-4 text-accent/90 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: accessory.description }}
                    />
                  )}

                  <div className="mt-6 flex gap-3">
                    
                    <CustomButton className="bg-secondary text-primary hover:bg-secondary/90 px-8 py-3">
                       Proceed to Checkout
                    </CustomButton>
                   
                  </div>
                </div>
              </div>
          )}

          {!isLoading && !accessory && (
            <div className="text-center text-accent/80 py-24">
              Could not load this accessory.
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}


