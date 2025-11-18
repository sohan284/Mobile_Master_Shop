'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import PageTransition from '@/components/animations/PageTransition';
import { useApiGet, useApiPatch } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  DollarSign,
  CreditCard,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import ApiErrorMessage from '@/components/ui/ApiErrorMessage';

export default function AccessoryOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  const queryClient = useQueryClient();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const tDetail = useTranslations('dashboard.orders.detailCommon');
  const tPage = useTranslations('dashboard.orders.accessoryDetail');
  const tOrdersCommon = useTranslations('dashboard.orders.common');
  const tGlobal = useTranslations('dashboard.common');

  // Fetch order details
  const { data: orderData, isLoading, error, refetch } = useApiGet(
    ['accessoryOrder', orderId],
    () => apiFetcher.get(`/api/accessories/orders/${orderId}/`)
  );

  const order = orderData?.data || orderData;

  // Mutation for updating order status
  const updateStatusMutation = useApiPatch({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessoryOrder', orderId] });
      setUpdatingStatus(false);
      toast.success(tOrdersCommon('statusUpdated'));
    },
    onError: (error) => {
      setUpdatingStatus(false);
      toast.error(
        error.response?.data?.message || tOrdersCommon('statusUpdateFailed')
      );
    }
  });

  const handleStatusChange = async (newStatus) => {
    if (!order) return;
    const currentStatus = (order.status || '').toLowerCase();
    if (currentStatus === newStatus.toLowerCase()) return;

    setUpdatingStatus(true);
    updateStatusMutation.mutate({
      url: `/api/accessories/orders/${orderId}/`,
      data: { status: newStatus }
    });
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (['confirmed', 'completed', 'delivered'].includes(s)) return 'bg-green-100 text-green-800';
    if (['pending', 'processing'].includes(s)) return 'bg-yellow-100 text-yellow-800';
    if (['cancelled', 'canceled', 'refunded'].includes(s)) return 'bg-red-100 text-red-800';
    if (s === 'shipped') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const translateStatus = (value) => {
    if (!value) {
      return tDetail('notAvailable');
    }
    const normalized = value.toLowerCase();
    try {
      return tGlobal(normalized);
    } catch {
      return value;
    }
  };

  const statusValues = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ];

  const statusOptions = statusValues.map((value) => ({
    value,
    label: translateStatus(value),
  }));

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </PageTransition>
    );
  }

  if (error || !order) {
    return (
      <PageTransition>
        <div className="min-h-[60vh]">
          <ApiErrorMessage
            error={error || { message: tDetail('orderNotFound') }}
            title={tDetail('errorTitle')}
            onRetry={() => refetch()}
            retryLabel={tDetail('retry')}
            showReload={false}
            showGoBack={true}
          />
          <div className="flex justify-center mt-4">
            <Button onClick={() => router.back()} className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {tDetail('goBack')}
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()} className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {tDetail('back')}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {tDetail('orderHeading', {
                  number: order.order_number || `#${order.id}`,
                })}
              </h1>
              <p className="text-sm text-gray-600">{tPage('subtitle')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                {tDetail('orderInformation')}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{tDetail('orderNumber')}</p>
                  <p className="font-medium">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{tDetail('orderDate')}</p>
                  <p className="font-medium">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : tDetail('notAvailable')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">{tDetail('orderStatus')}</p>
                  <Select
                    value={order.status?.toLowerCase() || 'pending'}
                    onValueChange={handleStatusChange}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger className={`w-full mt-1 ${getStatusBadge(order.status)}`}>
                      <SelectValue>
                        {updatingStatus
                          ? tOrdersCommon('updating')
                          : order.status_display || translateStatus(order.status)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm text-gray-600">{tDetail('paymentStatus')}</p>
                  <Badge className={`mt-1 ${getStatusBadge(order.payment_status)}`}>
                    {order.payment_status_display ||
                      translateStatus(order.payment_status)}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-gray-600">{tDetail('quantity')}</p>
                  <p className="font-medium">{order.quantity || 1}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">{tDetail('lastUpdated')}</p>
                  <p className="font-medium text-sm">
                    {order.updated_at
                      ? new Date(order.updated_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : tDetail('notAvailable')}
                  </p>
                </div>
              </div>

              {/* Status History */}
              {(order.confirmed_at || order.shipped_at || order.delivered_at) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {tDetail('statusHistory')}
                  </p>
                  <div className="space-y-2">
                    {order.confirmed_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-24 text-gray-600">
                          {tDetail('statusConfirmed')}:
                        </span>
                        <span className="font-medium">
                          {new Date(order.confirmed_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {order.shipped_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-24 text-gray-600">
                          {tDetail('statusShipped')}:
                        </span>
                        <span className="font-medium">
                          {new Date(order.shipped_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {order.delivered_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-24 text-gray-600">
                          {tDetail('statusDelivered')}:
                        </span>
                        <span className="font-medium">
                          {new Date(order.delivered_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {tDetail('productInformation')}
              </h2>
              <div className="flex gap-4">
                {order.product_image && (
                  <Image
                    src={order.product_image}
                    alt={order.product_title || 'Product'}
                    width={120}
                    height={120}
                    className="rounded-lg object-contain bg-gray-50 p-2"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {order.product_title || tDetail('notAvailable')}
                  </h3>
                  {order.product_subtitle && (
                    <p className="text-gray-600 mt-1">{order.product_subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                {tDetail('customerInformation')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{tDetail('name')}</p>
                  <p className="font-medium">
                    {order.customer_name || tDetail('notAvailable')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{tDetail('phone')}</p>
                  <p className="font-medium">
                    {order.customer_phone || tDetail('notAvailable')}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">{tDetail('email')}</p>
                  <p className="font-medium">
                    {order.customer_email || tDetail('notAvailable')}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">{tDetail('address')}</p>
                  <p className="font-medium">
                    {order.shipping_address || tDetail('notAvailable')}
                  </p>
                </div>
                
              </div>
            </div>

            
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {tDetail('paymentSummary')}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tDetail('unitPrice')}</span>
                  <span className="font-medium">
                    €{parseFloat(order.unit_price || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tDetail('subtotal')}</span>
                  <span className="font-medium">
                    €{parseFloat(order.subtotal || 0).toFixed(2)}
                  </span>
                </div>

                {parseFloat(order.website_discount_amount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      {tDetail('discountWithPercentage', {
                        percentage: order.website_discount_percentage || 0,
                      })}
                    </span>
                    <span>
                      -€{parseFloat(order.website_discount_amount).toFixed(2)}
                    </span>
                  </div>
                )}

                {parseFloat(order.shipping_cost || 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{tDetail('shipping')}</span>
                    <span>€{parseFloat(order.shipping_cost).toFixed(2)}</span>
                  </div>
                )}

                {parseFloat(order.total_discount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{tDetail('totalDiscount')}</span>
                    <span>-€{parseFloat(order.total_discount).toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">
                    {tDetail('totalAmount')}
                  </span>
                  <span className="font-bold text-lg text-gray-900">
                    €{parseFloat(order.total_amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {/* {order.stripe_payment_intent_id && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </h2>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">Stripe</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Intent ID</p>
                    <p className="font-mono text-xs bg-gray-50 p-2 rounded break-all">
                      {order.stripe_payment_intent_id}
                    </p>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
