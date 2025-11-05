'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
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

export default function AccessoryOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  const queryClient = useQueryClient();
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch order details
  const { data: orderData, isLoading, error } = useApiGet(
    ['accessoryOrder', orderId],
    () => apiFetcher.get(`/api/accessories/orders/${orderId}/`)
  );

  const order = orderData?.data || orderData;

  // Mutation for updating order status
  const updateStatusMutation = useApiPatch({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessoryOrder', orderId] });
      setUpdatingStatus(false);
      toast.success('Order status updated successfully');
    },
    onError: (error) => {
      setUpdatingStatus(false);
      toast.error(error.response?.data?.message || 'Failed to update order status');
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

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

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
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600">
              Error loading order: {error?.message || 'Order not found'}
            </p>
            <Button onClick={() => router.back()} className="mt-4 cursor-pointer text-accent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
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
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order {order.order_number || `#${order.id}`}
              </h1>
              <p className="text-sm text-gray-600">Accessory Order Details</p>
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
                Order Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-medium">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <Select
                    value={order.status?.toLowerCase() || 'pending'}
                    onValueChange={handleStatusChange}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger className={`w-full mt-1 ${getStatusBadge(order.status)}`}>
                      <SelectValue>
                        {updatingStatus
                          ? 'Updating...'
                          : order.status_display || order.status}
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
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <Badge className={`mt-1 ${getStatusBadge(order.payment_status)}`}>
                    {order.payment_status_display || order.payment_status || 'Unknown'}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-medium">{order.quantity || 1}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium text-sm">
                    {order.updated_at
                      ? new Date(order.updated_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Status History */}
              {(order.confirmed_at || order.shipped_at || order.delivered_at) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Status History</p>
                  <div className="space-y-2">
                    {order.confirmed_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-24 text-gray-600">Confirmed:</span>
                        <span className="font-medium">
                          {new Date(order.confirmed_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {order.shipped_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-24 text-gray-600">Shipped:</span>
                        <span className="font-medium">
                          {new Date(order.shipped_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {order.delivered_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-24 text-gray-600">Delivered:</span>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
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
                    {order.product_title || 'N/A'}
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
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{order.customer_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{order.customer_phone || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{order.customer_email || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{order.shipping_address || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 col-span-2 mt-3">
                  {order.city && (
                    <div>
                      <p className="text-sm text-gray-600">City</p>
                      <p className="font-medium">{order.city}</p>
                    </div>
                  )}
                  {order.postal_code && (
                    <div>
                      <p className="text-sm text-gray-600">Postal Code</p>
                      <p className="font-medium">{order.postal_code}</p>
                    </div>
                  )}
                  {order.country && (
                    <div>
                      <p className="text-sm text-gray-600">Country</p>
                      <p className="font-medium">{order.country}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {(order.notes || order.admin_notes) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </h2>
                {order.notes && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">Customer Notes:</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{order.notes}</p>
                  </div>
                )}
                {order.admin_notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Admin Notes:</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{order.admin_notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit Price</span>
                  <span className="font-medium">€{parseFloat(order.unit_price || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">€{parseFloat(order.subtotal || 0).toFixed(2)}</span>
                </div>

                {parseFloat(order.website_discount_amount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({order.website_discount_percentage}%)</span>
                    <span>-€{parseFloat(order.website_discount_amount).toFixed(2)}</span>
                  </div>
                )}

                {parseFloat(order.shipping_cost || 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>€{parseFloat(order.shipping_cost).toFixed(2)}</span>
                  </div>
                )}

                {parseFloat(order.total_discount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Discount</span>
                    <span>-€{parseFloat(order.total_discount).toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="font-bold text-lg text-gray-900">
                    €{parseFloat(order.total_amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {order.stripe_payment_intent_id && (
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
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
