'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import PageTransition from '@/components/animations/PageTransition';
import { useApiGet, useApiPatch } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import { ArrowLeft, Calendar, User, Phone, Mail, MapPin, Package, DollarSign, CreditCard, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const { data: orderData, isLoading, error, refetch } = useApiGet(
    ['accessoryOrder', orderId],
    () => apiFetcher.get(`/api/accessories/admin/orders/${orderId}/`)
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
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'confirmed' || statusLower === 'completed' || statusLower === 'delivered') {
      return 'bg-green-100 text-green-800';
    } else if (statusLower === 'pending' || statusLower === 'processing') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (statusLower === 'cancelled' || statusLower === 'canceled' || statusLower === 'refunded') {
      return 'bg-red-100 text-red-800';
    } else if (statusLower === 'shipped') {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
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
            <p className="text-red-600">Error loading order: {error?.message || 'Order not found'}</p>
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
                  <p className="font-medium">{order.order_number || `#${order.id}`}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Select
                    value={order.status?.toLowerCase() || 'pending'}
                    onValueChange={handleStatusChange}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger className={`w-full mt-1 ${getStatusBadge(order.status)}`}>
                      <SelectValue>
                        {updatingStatus ? 'Updating...' : statusOptions.find(opt => opt.value === order.status?.toLowerCase())?.label || order.status}
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
                {order.quantity && (
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-medium">{order.quantity}</p>
                  </div>
                )}
              </div>
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
                    className="rounded-lg object-contain"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{order.product_title || 'N/A'}</h3>
                  {order.brand_name && (
                    <p className="text-gray-600">Brand: {order.brand_name}</p>
                  )}
                  {order.product_description && (
                    <p className="text-gray-600 mt-2">{order.product_description}</p>
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
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </p>
                  <p className="font-medium">{order.customer_name || 'N/A'}</p>
                </div>
                {order.customer_phone && (
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </p>
                    <p className="font-medium">{order.customer_phone}</p>
                  </div>
                )}
                {order.customer_email && (
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="font-medium">{order.customer_email}</p>
                  </div>
                )}
                {order.shipping_address && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </p>
                    <p className="font-medium">{order.shipping_address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">{order.notes}</p>
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
                {order.price && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price</span>
                    <span className="font-medium">
                      {parseFloat(order.price).toFixed(2)} {order.currency || 'EUR'}
                    </span>
                  </div>
                )}
                {order.discount_amount && parseFloat(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{parseFloat(order.discount_amount).toFixed(2)} {order.currency || 'EUR'}</span>
                  </div>
                )}
                {order.quantity && order.quantity > 1 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-medium">{order.quantity}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg">
                    {order.total_amount ? `${parseFloat(order.total_amount).toFixed(2)} ${order.currency || 'EUR'}` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

