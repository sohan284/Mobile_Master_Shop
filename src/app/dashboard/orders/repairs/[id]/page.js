'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import PageTransition from '@/components/animations/PageTransition';
import { useApiGet, useApiPatch } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import { ArrowLeft, Calendar, User, Phone, Mail, MapPin, Package, DollarSign, CreditCard, FileText, Wrench, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import ApiErrorMessage from '@/components/ui/ApiErrorMessage';

export default function RepairOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  const queryClient = useQueryClient();
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch order details
  const { data: orderData, isLoading, error, refetch } = useApiGet(
    ['repairOrder', orderId],
    () => apiFetcher.get(`/api/repair/orders/${orderId}/`)
  );

  const order = orderData?.data || orderData;

  // Mutation for updating order status
  const updateStatusMutation = useApiPatch({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairOrder', orderId] });
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
      url: `/api/repair/orders/${orderId}/`,
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
    { value: 'completed', label: 'Completed' },
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
        <div className="min-h-[60vh]">
          <ApiErrorMessage
            error={error || { message: 'Order not found' }}
            title="Error Loading Order"
            onRetry={() => refetch()}
            retryLabel="Retry"
            showReload={false}
            showGoBack={true}
          />
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
              <p className="text-sm text-gray-600">Repair Order Details</p>
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
                  <p className="text-sm text-gray-600">Order Date</p>
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
                  <p className="text-sm text-gray-600">Order Status</p>
                  <Select
                    value={order.status?.toLowerCase() || 'pending'}
                    onValueChange={handleStatusChange}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger className={`w-full mt-1 ${getStatusBadge(order.status)}`}>
                      <SelectValue>
                        {updatingStatus ? 'Updating...' : order.status_display || order.status}
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
                {order.schedule && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Scheduled Date/Time
                    </p>
                    <p className="font-medium">{order.schedule}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium text-sm">
                    {order.updated_at ? new Date(order.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Status Timestamps */}
              {(order.confirmed_at || order.completed_at) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Status History</p>
                  <div className="space-y-2">
                    {order.confirmed_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-24 text-gray-600">Confirmed:</span>
                        <span className="font-medium">{new Date(order.confirmed_at).toLocaleString()}</span>
                      </div>
                    )}
                    {order.completed_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-24 text-gray-600">Completed:</span>
                        <span className="font-medium">{new Date(order.completed_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Device Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Device Information
              </h2>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Device Model</p>
                  <p className="font-semibold text-lg">{order.phone_model_name || 'N/A'}</p>
                </div>
                {order.brand_name && (
                  <div>
                    <p className="text-sm text-gray-600">Brand</p>
                    <p className="font-medium">{order.brand_name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Repair Services */}
            {order.order_items && Array.isArray(order.order_items) && order.order_items.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Repair Services
                </h2>
                <div className="space-y-4">
                  {order.order_items.map((item, index) => (
                    <div key={item.id || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.problem_name || 'Service'}</h3>
                          {item.part_type && (
                            <p className="text-sm text-gray-600 mt-1">
                              Part Type: <span className="font-medium capitalize">{item.part_type}</span>
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">€{parseFloat(item.final_price || 0).toFixed(2)}</p>
                          {parseFloat(item.discount_amount || 0) > 0 && (
                            <p className="text-xs text-green-600 line-through">€{parseFloat(item.base_price || 0).toFixed(2)}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Base Price</p>
                          <p className="font-medium">€{parseFloat(item.base_price || 0).toFixed(2)}</p>
                        </div>
                        {parseFloat(item.item_discount || 0) > 0 && (
                          <div>
                            <p className="text-gray-600">Item Discount</p>
                            <p className="font-medium text-green-600">-€{parseFloat(item.item_discount || 0).toFixed(2)}</p>
                          </div>
                        )}
                        {parseFloat(item.discount_percentage || 0) > 0 && (
                          <div>
                            <p className="text-gray-600">Discount</p>
                            <p className="font-medium text-green-600">{item.discount_percentage}% (-€{parseFloat(item.discount_amount || 0).toFixed(2)})</p>
                          </div>
                        )}
                        {item.warranty_days > 0 && (
                          <div className="col-span-2">
                            <p className="text-gray-600 flex items-center gap-1">
                              <Shield className="h-4 w-4" />
                              Warranty
                            </p>
                            <p className="font-medium">{item.warranty_days} days</p>
                            {item.warranty_expires_at && (
                              <p className="text-xs text-gray-500">
                                Expires: {new Date(item.warranty_expires_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {item.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">Notes: {item.notes}</p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-3">
                        Added: {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="font-medium">{order.customer_email}</p>
                  </div>
                )}
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
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    €{parseFloat(order.subtotal || 0).toFixed(2)}
                  </span>
                </div>

                {parseFloat(order.item_discount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Item Discount</span>
                    <span className="font-medium">
                      -€{parseFloat(order.item_discount).toFixed(2)}
                    </span>
                  </div>
                )}

                {parseFloat(order.website_discount_amount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Website Discount ({order.website_discount_percentage}%)</span>
                    <span className="font-medium">
                      -€{parseFloat(order.website_discount_amount).toFixed(2)}
                    </span>
                  </div>
                )}

                {parseFloat(order.total_discount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Discount</span>
                    <span className="font-medium">
                      -€{parseFloat(order.total_discount).toFixed(2)}
                    </span>
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

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Services</span>
                  <Badge variant="secondary">
                    {order.order_items?.length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Order Status</span>
                  <Badge className={getStatusBadge(order.status)}>
                    {order.status_display || order.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Status</span>
                  <Badge className={getStatusBadge(order.payment_status)}>
                    {order.payment_status_display || order.payment_status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}